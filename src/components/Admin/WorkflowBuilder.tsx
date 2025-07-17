import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { 
  Workflow, ArrowRight, Plus, Edit, Trash2, Eye, Check, X, Save, 
  AlertTriangle, Play, Pause, Copy, Settings, FileText, Users, 
  Calendar, Mail, Phone, CheckCircle, Clock, MoreHorizontal, 
  ArrowUpRight, Zap, Database, Layers, Archive, ChevronRight, ChevronLeft
} from 'lucide-react';

interface WorkflowBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflowData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'task' | 'condition' | 'delay' | 'integration' | 'document';
  config: any;
  position: { x: number; y: number };
  nextSteps: string[];
}

interface WorkflowTrigger {
  id: string;
  type: 'manual' | 'scheduled' | 'event' | 'form' | 'api';
  config: any;
}

interface DraggableStepProps {
  step: WorkflowStep;
  onEdit: (step: WorkflowStep) => void;
  onDelete: (id: string) => void;
  onConnect: (fromId: string, toId: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DraggableStep: React.FC<DraggableStepProps> = ({ 
  step, 
  onEdit, 
  onDelete, 
  onConnect, 
  onPositionChange,
  isSelected,
  onSelect
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'WORKFLOW_STEP',
    item: { id: step.id, type: step.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'WORKFLOW_STEP',
    drop: (item: { id: string }) => {
      if (item.id !== step.id) {
        onConnect(item.id, step.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getStepIcon = () => {
    switch (step.type) {
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'notification': return <Mail className="w-5 h-5" />;
      case 'task': return <FileText className="w-5 h-5" />;
      case 'condition': return <Workflow className="w-5 h-5" />;
      case 'delay': return <Clock className="w-5 h-5" />;
      case 'integration': return <Zap className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStepColor = () => {
    switch (step.type) {
      case 'approval': return 'bg-green-100 border-green-300 text-green-800';
      case 'notification': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'task': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'condition': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'delay': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'integration': return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      case 'document': return 'bg-teal-100 border-teal-300 text-teal-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const canvas = e.currentTarget.parentElement;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onPositionChange(step.id, { x, y });
    }
  };

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      style={{
        position: 'absolute',
        left: `${step.position.x}px`,
        top: `${step.position.y}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className={`w-64 p-3 rounded-lg shadow-md ${getStepColor()} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isOver ? 'ring-2 ring-green-500' : ''}`}
      onClick={() => onSelect(step.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1 rounded-full bg-white mr-2">
            {getStepIcon()}
          </div>
          <h3 className="font-medium">{step.name}</h3>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(step);
            }}
            className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(step.id);
            }}
            className="p-1 text-slate-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-xs">
        {step.type === 'approval' && (
          <div>
            <p>Approbateurs: {step.config.approvers?.join(', ') || 'Non défini'}</p>
            <p>Délai: {step.config.timeoutDays || 0} jours</p>
          </div>
        )}
        {step.type === 'notification' && (
          <div>
            <p>Canal: {step.config.channel || 'Email'}</p>
            <p>Destinataires: {step.config.recipients?.join(', ') || 'Non défini'}</p>
          </div>
        )}
        {step.type === 'task' && (
          <div>
            <p>Assigné à: {step.config.assignee || 'Non assigné'}</p>
            <p>Échéance: {step.config.dueDate || 'Non défini'}</p>
          </div>
        )}
        {step.type === 'condition' && (
          <div>
            <p>Condition: {step.config.condition || 'Non défini'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowData, setWorkflowData] = useState({
    id: initialData?.id || Date.now(),
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'admin',
    status: initialData?.status || 'draft',
    steps: initialData?.steps || [],
    triggers: initialData?.triggers || [
      {
        id: 'trigger1',
        type: 'manual',
        config: {
          roles: ['admin']
        }
      }
    ]
  });

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [editingTrigger, setEditingTrigger] = useState<WorkflowTrigger | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'hr', name: 'RH' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'admin', name: 'Administration' },
    { id: 'finance', name: 'Finance' },
    { id: 'other', name: 'Autre' }
  ];

  const stepTypes = [
    { id: 'approval', name: 'Approbation', icon: CheckCircle },
    { id: 'notification', name: 'Notification', icon: Mail },
    { id: 'task', name: 'Tâche', icon: FileText },
    { id: 'condition', name: 'Condition', icon: Workflow },
    { id: 'delay', name: 'Délai', icon: Clock },
    { id: 'integration', name: 'Intégration', icon: Zap },
    { id: 'document', name: 'Document', icon: FileText }
  ];

  const triggerTypes = [
    { id: 'manual', name: 'Manuel', icon: Play },
    { id: 'scheduled', name: 'Planifié', icon: Calendar },
    { id: 'event', name: 'Événement', icon: Zap },
    { id: 'form', name: 'Formulaire', icon: FileText },
    { id: 'api', name: 'API', icon: ArrowUpRight }
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!workflowData.name) newErrors.name = 'Le nom est requis';
      if (!workflowData.description) newErrors.description = 'La description est requise';
      if (!workflowData.category) newErrors.category = 'La catégorie est requise';
    }
    
    if (step === 2) {
      if (workflowData.triggers.length === 0) {
        newErrors.triggers = 'Au moins un déclencheur est requis';
      }
    }
    
    if (step === 3) {
      if (workflowData.steps.length === 0) {
        newErrors.steps = 'Au moins une étape est requise';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkflowData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTriggerChange = (triggerId: string, field: string, value: any) => {
    setWorkflowData(prev => ({
      ...prev,
      triggers: prev.triggers.map(trigger => 
        trigger.id === triggerId 
          ? { ...trigger, [field]: value }
          : trigger
      )
    }));
  };

  const handleTriggerConfigChange = (triggerId: string, field: string, value: any) => {
    setWorkflowData(prev => ({
      ...prev,
      triggers: prev.triggers.map(trigger => 
        trigger.id === triggerId 
          ? { 
              ...trigger, 
              config: {
                ...trigger.config,
                [field]: value
              }
            }
          : trigger
      )
    }));
  };

  const addTrigger = () => {
    const newTrigger: WorkflowTrigger = {
      id: `trigger${workflowData.triggers.length + 1}`,
      type: 'manual',
      config: {
        roles: ['admin']
      }
    };
    
    setWorkflowData(prev => ({
      ...prev,
      triggers: [...prev.triggers, newTrigger]
    }));
  };

  const removeTrigger = (triggerId: string) => {
    setWorkflowData(prev => ({
      ...prev,
      triggers: prev.triggers.filter(trigger => trigger.id !== triggerId)
    }));
  };

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: `step${Date.now()}`,
      name: `Nouvelle ${stepTypes.find(t => t.id === type)?.name || 'Étape'}`,
      type: type as WorkflowStep['type'],
      config: {},
      position: { x: 100, y: 100 },
      nextSteps: []
    };
    
    // Set default config based on step type
    switch (type) {
      case 'approval':
        newStep.config = {
          approvers: [],
          timeoutDays: 3
        };
        break;
      case 'notification':
        newStep.config = {
          channel: 'email',
          template: '',
          recipients: []
        };
        break;
      case 'task':
        newStep.config = {
          assignee: '',
          dueDate: '3 jours',
          description: ''
        };
        break;
      case 'condition':
        newStep.config = {
          condition: '',
          trueStep: '',
          falseStep: ''
        };
        break;
      case 'delay':
        newStep.config = {
          duration: 1,
          unit: 'days'
        };
        break;
      case 'integration':
        newStep.config = {
          service: '',
          action: '',
          parameters: {}
        };
        break;
      case 'document':
        newStep.config = {
          template: '',
          outputFormat: 'pdf'
        };
        break;
    }
    
    setWorkflowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    
    setSelectedStepId(newStep.id);
    setEditingStep(newStep);
  };

  const updateStep = (updatedStep: WorkflowStep) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === updatedStep.id ? updatedStep : step
      )
    }));
    
    setEditingStep(null);
  };

  const deleteStep = (stepId: string) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId),
      // Also remove this step from any nextSteps arrays
      steps: prev.steps.map(step => ({
        ...step,
        nextSteps: step.nextSteps.filter(id => id !== stepId)
      }))
    }));
    
    if (selectedStepId === stepId) {
      setSelectedStepId(null);
    }
    
    if (editingStep?.id === stepId) {
      setEditingStep(null);
    }
  };

  const connectSteps = (fromId: string, toId: string) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === fromId 
          ? { 
              ...step, 
              nextSteps: step.nextSteps.includes(toId) 
                ? step.nextSteps 
                : [...step.nextSteps, toId] 
            }
          : step
      )
    }));
  };

  const updateStepPosition = (stepId: string, position: { x: number; y: number }) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId 
          ? { ...step, position }
          : step
      )
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Prepare workflow data
      const finalWorkflowData = {
        ...workflowData,
        status: workflowData.status || 'draft',
        createdDate: initialData?.createdDate || new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        executionCount: initialData?.executionCount || 0,
        averageExecutionTime: initialData?.averageExecutionTime || 0,
        successRate: initialData?.successRate || 0
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(finalWorkflowData);
          setShowSuccessMessage(false);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier le Workflow' : 'Nouveau Workflow'}</h1>
                <p className="text-white/80">Créez un workflow automatisé pour votre entreprise</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 relative z-10">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Informations de Base', icon: FileText },
                { step: 2, title: 'Déclencheurs', icon: Zap },
                { step: 3, title: 'Étapes du Workflow', icon: Layers },
                { step: 4, title: 'Finalisation', icon: Check }
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.step 
                        ? 'bg-white text-purple-600' 
                        : currentStep > step.step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > step.step ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-white/80 text-center hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-white/30 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showSuccessMessage ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isEditing ? 'Workflow Mis à Jour !' : 'Workflow Créé avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les modifications ont été enregistrées.' 
                  : 'Votre nouveau workflow est maintenant disponible.'}
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
              </h2>
              <p className="text-slate-600">Nous enregistrons votre workflow</p>
            </div>
          ) : (
            <>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    Informations de Base
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom du Workflow <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={workflowData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Ex: Processus d'Onboarding"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={workflowData.category}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={workflowData.description}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Description détaillée du workflow..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Workflow className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-900">À propos des Workflows</h3>
                        <p className="text-sm text-indigo-700 mt-1">
                          Les workflows vous permettent d'automatiser des processus métier complexes. Définissez des déclencheurs, des conditions et des actions pour créer des flux de travail efficaces.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Triggers */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                      Déclencheurs
                    </h2>
                    <button
                      onClick={addTrigger}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un Déclencheur
                    </button>
                  </div>

                  {errors.triggers && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{errors.triggers}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {workflowData.triggers.map((trigger) => (
                      <div key={trigger.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                              {trigger.type === 'manual' && <Play className="w-5 h-5 text-indigo-600" />}
                              {trigger.type === 'scheduled' && <Calendar className="w-5 h-5 text-indigo-600" />}
                              {trigger.type === 'event' && <Zap className="w-5 h-5 text-indigo-600" />}
                              {trigger.type === 'form' && <FileText className="w-5 h-5 text-indigo-600" />}
                              {trigger.type === 'api' && <ArrowUpRight className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900">Déclencheur: {
                                trigger.type === 'manual' ? 'Manuel' :
                                trigger.type === 'scheduled' ? 'Planifié' :
                                trigger.type === 'event' ? 'Événement' :
                                trigger.type === 'form' ? 'Formulaire' : 'API'
                              }</h3>
                              <p className="text-sm text-slate-600">
                                {trigger.type === 'manual' && 'Démarrage manuel par un utilisateur'}
                                {trigger.type === 'scheduled' && 'Exécution planifiée à intervalles réguliers'}
                                {trigger.type === 'event' && 'Déclenché par un événement système'}
                                {trigger.type === 'form' && 'Déclenché par la soumission d\'un formulaire'}
                                {trigger.type === 'api' && 'Déclenché par un appel API'}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingTrigger(trigger)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {workflowData.triggers.length > 1 && (
                              <button
                                onClick={() => removeTrigger(trigger.id)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Type de Déclencheur
                              </label>
                              <select
                                value={trigger.type}
                                onChange={(e) => handleTriggerChange(trigger.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              >
                                {triggerTypes.map((type) => (
                                  <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                              </select>
                            </div>

                            {trigger.type === 'manual' && (
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                  Rôles Autorisés
                                </label>
                                <select
                                  value={trigger.config.roles?.[0] || ''}
                                  onChange={(e) => handleTriggerConfigChange(trigger.id, 'roles', [e.target.value])}
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                  <option value="admin">Administrateur</option>
                                  <option value="manager">Manager</option>
                                  <option value="user">Utilisateur</option>
                                  <option value="commercial">Commercial</option>
                                  <option value="hr">RH</option>
                                </select>
                              </div>
                            )}

                            {trigger.type === 'scheduled' && (
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                  Fréquence
                                </label>
                                <select
                                  value={trigger.config.schedule || 'daily'}
                                  onChange={(e) => handleTriggerConfigChange(trigger.id, 'schedule', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                  <option value="daily">Quotidienne</option>
                                  <option value="weekly">Hebdomadaire</option>
                                  <option value="monthly">Mensuelle</option>
                                </select>
                              </div>
                            )}

                            {trigger.type === 'event' && (
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                  Événement
                                </label>
                                <select
                                  value={trigger.config.event || ''}
                                  onChange={(e) => handleTriggerConfigChange(trigger.id, 'event', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                  <option value="">Sélectionner un événement</option>
                                  <option value="employee.created">Nouvel Employé</option>
                                  <option value="leave.requested">Demande de Congé</option>
                                  <option value="expense.submitted">Note de Frais Soumise</option>
                                  <option value="lead.created">Nouveau Prospect</option>
                                  <option value="opportunity.won">Opportunité Gagnée</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Conseil</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Un workflow peut avoir plusieurs déclencheurs. Par exemple, il peut être démarré manuellement ou automatiquement selon un calendrier.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Workflow Steps */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-indigo-600" />
                      Étapes du Workflow
                    </h2>
                    <div className="flex space-x-2">
                      <div className="relative group">
                        <button className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center">
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter une Étape
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                          <div className="py-1">
                            {stepTypes.map((type) => (
                              <button
                                key={type.id}
                                onClick={() => addStep(type.id)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center"
                              >
                                <type.icon className="w-4 h-4 mr-2" />
                                {type.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {errors.steps && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{errors.steps}</p>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative" style={{ height: '400px' }} ref={canvasRef}>
                    {workflowData.steps.map((step) => (
                      <DraggableStep
                        key={step.id}
                        step={step}
                        onEdit={setEditingStep}
                        onDelete={deleteStep}
                        onConnect={connectSteps}
                        onPositionChange={updateStepPosition}
                        isSelected={selectedStepId === step.id}
                        onSelect={setSelectedStepId}
                      />
                    ))}
                    
                    {/* Draw connections between steps */}
                    <svg className="absolute inset-0 pointer-events-none">
                      {workflowData.steps.map((step) => 
                        step.nextSteps.map((nextStepId) => {
                          const nextStep = workflowData.steps.find(s => s.id === nextStepId);
                          if (!nextStep) return null;
                          
                          const startX = step.position.x + 128; // Half of step width
                          const startY = step.position.y + 40;
                          const endX = nextStep.position.x;
                          const endY = nextStep.position.y + 40;
                          
                          return (
                            <g key={`${step.id}-${nextStepId}`}>
                              <path
                                d={`M${startX},${startY} C${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`}
                                stroke="#6366F1"
                                strokeWidth="2"
                                fill="none"
                                markerEnd="url(#arrowhead)"
                              />
                              <defs>
                                <marker
                                  id="arrowhead"
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="9"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <polygon points="0 0, 10 3.5, 0 7" fill="#6366F1" />
                                </marker>
                              </defs>
                            </g>
                          );
                        })
                      )}
                    </svg>
                    
                    {workflowData.steps.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500">Ajoutez des étapes à votre workflow</p>
                          <button
                            onClick={() => addStep('task')}
                            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 inline mr-1" />
                            Ajouter une Étape
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step Editor */}
                  {editingStep && (
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-slate-900">Éditer l'Étape</h3>
                        <button
                          onClick={() => setEditingStep(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nom de l'Étape
                          </label>
                          <input
                            type="text"
                            value={editingStep.name}
                            onChange={(e) => setEditingStep({...editingStep, name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Type d'Étape
                          </label>
                          <select
                            value={editingStep.type}
                            onChange={(e) => setEditingStep({...editingStep, type: e.target.value as WorkflowStep['type']})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled
                          >
                            {stepTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Dynamic config fields based on step type */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Configuration</h4>
                        
                        {editingStep.type === 'approval' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Approbateurs
                              </label>
                              <input
                                type="text"
                                value={editingStep.config.approvers?.join(', ') || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    approvers: e.target.value.split(',').map(v => v.trim())
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ex: Directeur Commercial, RH"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Délai (jours)
                              </label>
                              <input
                                type="number"
                                value={editingStep.config.timeoutDays || 0}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    timeoutDays: parseInt(e.target.value)
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                min="0"
                              />
                            </div>
                          </div>
                        )}
                        
                        {editingStep.type === 'notification' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Canal
                              </label>
                              <select
                                value={editingStep.config.channel || 'email'}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    channel: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                                <option value="push">Notification Push</option>
                                <option value="slack">Slack</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Template
                              </label>
                              <input
                                type="text"
                                value={editingStep.config.template || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    template: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ex: welcome_email"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Destinataires
                              </label>
                              <input
                                type="text"
                                value={editingStep.config.recipients?.join(', ') || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    recipients: e.target.value.split(',').map(v => v.trim())
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ex: {{employee.email}}, manager@example.com"
                              />
                            </div>
                          </div>
                        )}
                        
                        {editingStep.type === 'task' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Assigné à
                              </label>
                              <input
                                type="text"
                                value={editingStep.config.assignee || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    assignee: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ex: RH, {{employee.manager}}"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Échéance
                              </label>
                              <input
                                type="text"
                                value={editingStep.config.dueDate || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    dueDate: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ex: 3 jours, 1 semaine"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={editingStep.config.description || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    description: e.target.value
                                  }
                                })}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Description de la tâche..."
                              />
                            </div>
                          </div>
                        )}
                        
                        {editingStep.type === 'condition' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Condition
                              </label>
                              <input
                                type="text"
                                value={editingStep.config.condition || ''}
                                onChange={(e) => setEditingStep({
                                  ...editingStep, 
                                  config: {
                                    ...editingStep.config,
                                    condition: e.target.value
                                  }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ex: {{lead.score}} >= 50"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => updateStep(editingStep)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Enregistrer l'Étape
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Conseils pour la Conception</h3>
                        <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                          <li>Faites glisser les étapes pour les positionner</li>
                          <li>Faites glisser une étape sur une autre pour créer une connexion</li>
                          <li>Cliquez sur une étape pour la sélectionner et voir ses détails</li>
                          <li>Utilisez des conditions pour créer des branches dans votre workflow</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Finalization */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    Finalisation
                  </h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-900">Prêt à {isEditing ? 'mettre à jour' : 'créer'} le workflow</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Vérifiez les informations ci-dessous avant de finaliser.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                        Informations de Base
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Nom:</span>
                          <span className="text-slate-900 font-medium">{workflowData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Catégorie:</span>
                          <span className="text-slate-900">{
                            workflowData.category === 'hr' ? 'RH' :
                            workflowData.category === 'commercial' ? 'Commercial' :
                            workflowData.category === 'admin' ? 'Administration' :
                            workflowData.category === 'finance' ? 'Finance' : 'Autre'
                          }</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Description:</span>
                          <p className="text-slate-900 mt-1">{workflowData.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-indigo-600" />
                        Déclencheurs
                      </h3>
                      <div className="space-y-2 text-sm">
                        {workflowData.triggers.map((trigger, index) => (
                          <div key={index} className="flex items-center p-2 bg-white rounded border border-slate-200">
                            <div className="p-1 rounded-full bg-indigo-100 mr-2">
                              {trigger.type === 'manual' && <Play className="w-3 h-3 text-indigo-600" />}
                              {trigger.type === 'scheduled' && <Calendar className="w-3 h-3 text-indigo-600" />}
                              {trigger.type === 'event' && <Zap className="w-3 h-3 text-indigo-600" />}
                              {trigger.type === 'form' && <FileText className="w-3 h-3 text-indigo-600" />}
                              {trigger.type === 'api' && <ArrowUpRight className="w-3 h-3 text-indigo-600" />}
                            </div>
                            <span className="text-slate-900">{
                              trigger.type === 'manual' ? 'Manuel' :
                              trigger.type === 'scheduled' ? 'Planifié' :
                              trigger.type === 'event' ? 'Événement' :
                              trigger.type === 'form' ? 'Formulaire' : 'API'
                            }</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 md:col-span-2">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-indigo-600" />
                        Étapes du Workflow
                      </h3>
                      <div className="space-y-2 text-sm">
                        {workflowData.steps.length === 0 ? (
                          <p className="text-slate-500 italic">Aucune étape définie</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {workflowData.steps.map((step, index) => (
                              <div key={index} className="flex items-center p-2 bg-white rounded border border-slate-200">
                                <div className="p-1 rounded-full bg-indigo-100 mr-2">
                                  <span className="text-indigo-600 font-bold text-xs">{index + 1}</span>
                                </div>
                                <div>
                                  <span className="text-slate-900 font-medium">{step.name}</span>
                                  <div className="flex items-center text-xs text-slate-500">
                                    <span className="capitalize">{step.type}</span>
                                    {step.nextSteps.length > 0 && (
                                      <span className="ml-2">
                                        → {step.nextSteps.length} étape(s) suivante(s)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Vérification Finale</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Assurez-vous que toutes les étapes sont correctement connectées et que le workflow répond à vos besoins avant de finaliser.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Navigation */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Mettre à Jour' : 'Créer le Workflow'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;