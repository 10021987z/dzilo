import React, { useState, useEffect } from 'react';
import { 
  Award, Star, Target, Calendar, User, Building2, Save, X, 
  Check, ChevronLeft, ChevronRight, Plus, Minus, ArrowUp, 
  ArrowDown, CheckCircle, AlertCircle
} from 'lucide-react';

interface NewPerformanceReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reviewData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'development' | 'behavioral' | 'project';
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'achieved' | 'exceeded' | 'missed';
  progress: number;
  weight: number;
  score?: number;
}

interface Competency {
  id: string;
  name: string;
  category: 'technical' | 'leadership' | 'communication' | 'problem-solving' | 'teamwork';
  currentLevel: number;
  targetLevel: number;
  score: number;
  comments?: string;
}

const NewPerformanceReviewForm: React.FC<NewPerformanceReviewFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id: 0,
    employeeId: 0,
    employeeName: '',
    department: '',
    position: '',
    reviewPeriod: '',
    reviewDate: new Date().toISOString().split('T')[0],
    status: 'in-progress',
    overallScore: 0,
    reviewerName: 'Jean Dupont',
    nextReviewDate: '',
    goals: [] as Goal[],
    competencies: [] as Competency[],
    feedback: {
      strengths: [''],
      improvements: [''],
      managerComments: '',
      employeeComments: ''
    }
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Sample employees for dropdown
  const employees = [
    { id: 1, name: 'Sophie Martin', department: 'Technique', position: 'Développeur Full Stack Senior' },
    { id: 2, name: 'Thomas Dubois', department: 'Design', position: 'Designer UX/UI' },
    { id: 3, name: 'Marie Rousseau', department: 'Commercial', position: 'Responsable Commercial' }
  ];
  
  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure arrays are initialized properly
        goals: initialData.goals || [],
        competencies: initialData.competencies || [],
        feedback: {
          strengths: initialData.feedback?.strengths || [''],
          improvements: initialData.feedback?.improvements || [''],
          managerComments: initialData.feedback?.managerComments || '',
          employeeComments: initialData.feedback?.employeeComments || ''
        }
      });
    } else {
      // Initialize with empty arrays for new review
      setFormData(prev => ({
        ...prev,
        goals: [],
        competencies: []
      }));
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = parseInt(e.target.value);
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        department: selectedEmployee.department,
        position: selectedEmployee.position
      }));
    }
  };
  
  // Goal management
  const addGoal = () => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      title: '',
      description: '',
      category: 'performance',
      targetDate: '',
      status: 'not-started',
      progress: 0,
      weight: 10
    };
    
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };
  
  const updateGoal = (id: string, field: keyof Goal, value: any) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    }));
  };
  
  const removeGoal = (id: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };
  
  // Competency management
  const addCompetency = () => {
    const newCompetency: Competency = {
      id: `comp_${Date.now()}`,
      name: '',
      category: 'technical',
      currentLevel: 3,
      targetLevel: 4,
      score: 3,
      comments: ''
    };
    
    setFormData(prev => ({
      ...prev,
      competencies: [...prev.competencies, newCompetency]
    }));
  };
  
  const updateCompetency = (id: string, field: keyof Competency, value: any) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.map(comp => 
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    }));
  };
  
  const removeCompetency = (id: string) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.filter(comp => comp.id !== id)
    }));
  };
  
  // Feedback management
  const handleStrengthChange = (index: number, value: string) => {
    const newStrengths = [...formData.feedback.strengths];
    newStrengths[index] = value;
    
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        strengths: newStrengths
      }
    }));
  };
  
  const addStrength = () => {
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        strengths: [...prev.feedback.strengths, '']
      }
    }));
  };
  
  const removeStrength = (index: number) => {
    const newStrengths = formData.feedback.strengths.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        strengths: newStrengths.length ? newStrengths : ['']
      }
    }));
  };
  
  const handleImprovementChange = (index: number, value: string) => {
    const newImprovements = [...formData.feedback.improvements];
    newImprovements[index] = value;
    
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        improvements: newImprovements
      }
    }));
  };
  
  const addImprovement = () => {
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        improvements: [...prev.feedback.improvements, '']
      }
    }));
  };
  
  const removeImprovement = (index: number) => {
    const newImprovements = formData.feedback.improvements.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        improvements: newImprovements.length ? newImprovements : ['']
      }
    }));
  };
  
  // Calculate overall score
  const calculateOverallScore = () => {
    // Calculate weighted average of goal scores
    const goalScores = formData.goals
      .filter(goal => goal.score !== undefined)
      .map(goal => ({
        score: goal.score || 0,
        weight: goal.weight
      }));
    
    const competencyScores = formData.competencies.map(comp => comp.score);
    
    let overallScore = 0;
    let totalWeight = 0;
    
    // Add goal scores (weighted)
    goalScores.forEach(goal => {
      overallScore += goal.score * goal.weight;
      totalWeight += goal.weight;
    });
    
    // Add competency scores (equal weight)
    if (competencyScores.length > 0) {
      const competencyAvg = competencyScores.reduce((sum, score) => sum + score, 0) / competencyScores.length;
      // Competencies are 40% of total score, goals are 60%
      if (totalWeight > 0) {
        overallScore = (overallScore / totalWeight) * 0.6 + competencyAvg * 0.4;
      } else {
        overallScore = competencyAvg;
      }
    } else if (totalWeight > 0) {
      overallScore = overallScore / totalWeight;
    }
    
    return Math.round(overallScore * 10) / 10; // Round to 1 decimal place
  };
  
  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.employeeId) newErrors.employeeId = 'Veuillez sélectionner un employé';
      if (!formData.reviewPeriod) newErrors.reviewPeriod = 'La période d\'évaluation est requise';
      if (!formData.reviewDate) newErrors.reviewDate = 'La date d\'évaluation est requise';
    }
    
    if (step === 2) {
      // Validate goals
      formData.goals.forEach((goal, index) => {
        if (!goal.title) newErrors[`goals[${index}].title`] = 'Le titre de l\'objectif est requis';
        if (!goal.targetDate) newErrors[`goals[${index}].targetDate`] = 'La date cible est requise';
      });
    }
    
    if (step === 3) {
      // Validate competencies
      formData.competencies.forEach((comp, index) => {
        if (!comp.name) newErrors[`competencies[${index}].name`] = 'Le nom de la compétence est requis';
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    // Calculate overall score
    const overallScore = calculateOverallScore();
    
    // Update status based on completion
    const status = 'completed';
    
    const finalData = {
      ...formData,
      overallScore,
      status,
      id: isEditing ? formData.id : Date.now()
    };
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Reset form after success
      setTimeout(() => {
        onSave(finalData);
        setShowSuccessMessage(false);
        onClose();
      }, 1500);
    }, 1000);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-purple-100 text-purple-800';
      case 'behavioral': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      case 'technical': return 'bg-indigo-100 text-indigo-800';
      case 'leadership': return 'bg-red-100 text-red-800';
      case 'communication': return 'bg-yellow-100 text-yellow-800';
      case 'problem-solving': return 'bg-pink-100 text-pink-800';
      case 'teamwork': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
      case 'exceeded': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-yellow-100 text-yellow-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'achieved': return 'Atteint';
      case 'exceeded': return 'Dépassé';
      case 'in-progress': return 'En cours';
      case 'not-started': return 'Non commencé';
      case 'missed': return 'Non atteint';
      default: return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier l\'Évaluation' : 'Nouvelle Évaluation de Performance'}</h1>
                <p className="text-white/80">Évaluez les performances et définissez les objectifs</p>
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
                { step: 1, title: 'Informations de Base', icon: User },
                { step: 2, title: 'Objectifs', icon: Target },
                { step: 3, title: 'Compétences', icon: Star },
                { step: 4, title: 'Feedback & Finalisation', icon: Check }
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
                {isEditing ? 'Évaluation Mise à Jour !' : 'Évaluation Créée avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les modifications ont été enregistrées.' 
                  : 'La nouvelle évaluation a été créée et est prête à être utilisée.'}
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
              </h2>
              <p className="text-slate-600">Nous enregistrons l'évaluation</p>
            </div>
          ) : (
            <>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Informations de Base
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Employé <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="employeeId"
                        value={formData.employeeId || ''}
                        onChange={handleEmployeeChange}
                        disabled={isEditing}
                        className={`w-full px-3 py-2 border ${errors.employeeId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isEditing ? 'bg-slate-100' : ''}`}
                      >
                        <option value="">Sélectionner un employé</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </option>
                        ))}
                      </select>
                      {errors.employeeId && (
                        <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Évaluateur
                      </label>
                      <input
                        type="text"
                        name="reviewerName"
                        value={formData.reviewerName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nom de l'évaluateur"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Période d'Évaluation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="reviewPeriod"
                        value={formData.reviewPeriod}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.reviewPeriod ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        placeholder="Ex: S1 2024 ou Janvier-Juin 2024"
                      />
                      {errors.reviewPeriod && (
                        <p className="mt-1 text-sm text-red-500">{errors.reviewPeriod}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date d'Évaluation <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="reviewDate"
                          value={formData.reviewDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.reviewDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.reviewDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.reviewDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prochaine Évaluation
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="nextReviewDate"
                          value={formData.nextReviewDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.employeeId > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-medium text-purple-900 mb-3">Informations de l'Employé</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-700">Nom:</span>
                          <p className="font-medium text-purple-900">{formData.employeeName}</p>
                        </div>
                        <div>
                          <span className="text-purple-700">Poste:</span>
                          <p className="font-medium text-purple-900">{formData.position}</p>
                        </div>
                        <div>
                          <span className="text-purple-700">Département:</span>
                          <p className="font-medium text-purple-900">{formData.department}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Goals */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-600" />
                      Objectifs
                    </h2>
                    <button
                      onClick={addGoal}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un Objectif
                    </button>
                  </div>

                  {formData.goals.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                      <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">Aucun objectif défini</p>
                      <button
                        onClick={addGoal}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Ajouter le premier objectif
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.goals.map((goal, index) => (
                        <div key={goal.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-slate-900">Objectif #{index + 1}</h3>
                            <button
                              onClick={() => removeGoal(goal.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Titre <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={goal.title}
                                onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors[`goals[${index}].title`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                placeholder="Ex: Améliorer les performances de l'application"
                              />
                              {errors[`goals[${index}].title`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`goals[${index}].title`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Catégorie
                              </label>
                              <select
                                value={goal.category}
                                onChange={(e) => updateGoal(goal.id, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="performance">Performance</option>
                                <option value="development">Développement</option>
                                <option value="behavioral">Comportemental</option>
                                <option value="project">Projet</option>
                              </select>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={goal.description}
                              onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Description détaillée de l'objectif..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date Cible <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={goal.targetDate}
                                onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors[`goals[${index}].targetDate`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                              />
                              {errors[`goals[${index}].targetDate`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`goals[${index}].targetDate`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Poids (%)
                              </label>
                              <input
                                type="number"
                                value={goal.weight}
                                onChange={(e) => updateGoal(goal.id, 'weight', parseInt(e.target.value))}
                                min="5"
                                max="100"
                                step="5"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Statut
                              </label>
                              <select
                                value={goal.status}
                                onChange={(e) => updateGoal(goal.id, 'status', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="not-started">Non commencé</option>
                                <option value="in-progress">En cours</option>
                                <option value="achieved">Atteint</option>
                                <option value="exceeded">Dépassé</option>
                                <option value="missed">Non atteint</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Progression
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  value={goal.progress}
                                  onChange={(e) => updateGoal(goal.id, 'progress', parseInt(e.target.value))}
                                  min="0"
                                  max="100"
                                  step="5"
                                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="ml-2 text-sm font-medium text-slate-700 w-12 text-right">
                                  {goal.progress}%
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Score (1-5)
                              </label>
                              <div className="flex items-center">
                                <div className="flex-1 flex items-center justify-between">
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                      key={score}
                                      type="button"
                                      onClick={() => updateGoal(goal.id, 'score', score)}
                                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        goal.score === score
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                      }`}
                                    >
                                      {score}
                                    </button>
                                  ))}
                                </div>
                                <div className="ml-4 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-5 h-5 ${
                                        (goal.score || 0) >= star ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Competencies */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-purple-600" />
                      Compétences
                    </h2>
                    <button
                      onClick={addCompetency}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une Compétence
                    </button>
                  </div>

                  {formData.competencies.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                      <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">Aucune compétence définie</p>
                      <button
                        onClick={addCompetency}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Ajouter la première compétence
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.competencies.map((competency, index) => (
                        <div key={competency.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-slate-900">Compétence #{index + 1}</h3>
                            <button
                              onClick={() => removeCompetency(competency.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nom <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={competency.name}
                                onChange={(e) => updateCompetency(competency.id, 'name', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors[`competencies[${index}].name`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                placeholder="Ex: Développement Frontend"
                              />
                              {errors[`competencies[${index}].name`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`competencies[${index}].name`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Catégorie
                              </label>
                              <select
                                value={competency.category}
                                onChange={(e) => updateCompetency(competency.id, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="technical">Technique</option>
                                <option value="leadership">Leadership</option>
                                <option value="communication">Communication</option>
                                <option value="problem-solving">Résolution de problèmes</option>
                                <option value="teamwork">Travail d'équipe</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Niveau Actuel
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  value={competency.currentLevel}
                                  onChange={(e) => updateCompetency(competency.id, 'currentLevel', parseInt(e.target.value))}
                                  min="1"
                                  max="5"
                                  step="1"
                                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="ml-2 text-sm font-medium text-slate-700 w-8 text-right">
                                  {competency.currentLevel}/5
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Niveau Cible
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  value={competency.targetLevel}
                                  onChange={(e) => updateCompetency(competency.id, 'targetLevel', parseInt(e.target.value))}
                                  min="1"
                                  max="5"
                                  step="1"
                                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="ml-2 text-sm font-medium text-slate-700 w-8 text-right">
                                  {competency.targetLevel}/5
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Score (1-5)
                            </label>
                            <div className="flex items-center">
                              <div className="flex-1 flex items-center justify-between">
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <button
                                    key={score}
                                    type="button"
                                    onClick={() => updateCompetency(competency.id, 'score', score)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      competency.score === score
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                  >
                                    {score}
                                  </button>
                                ))}
                              </div>
                              <div className="ml-4 flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                      competency.score >= star ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Commentaires
                            </label>
                            <textarea
                              value={competency.comments || ''}
                              onChange={(e) => updateCompetency(competency.id, 'comments', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Commentaires sur cette compétence..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Feedback & Finalization */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                    Feedback & Finalisation
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Points Forts</h3>
                      <div className="space-y-2">
                        {formData.feedback.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={strength}
                              onChange={(e) => handleStrengthChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Ex: Leadership technique"
                            />
                            <button
                              type="button"
                              onClick={() => removeStrength(index)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addStrength}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter un point fort
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Axes d'Amélioration</h3>
                      <div className="space-y-2">
                        {formData.feedback.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={improvement}
                              onChange={(e) => handleImprovementChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Ex: Gestion du temps"
                            />
                            <button
                              type="button"
                              onClick={() => removeImprovement(index)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addImprovement}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter un axe d'amélioration
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commentaires du Manager
                    </label>
                    <textarea
                      name="feedback.managerComments"
                      value={formData.feedback.managerComments}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Commentaires généraux sur la performance..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commentaires de l'Employé
                    </label>
                    <textarea
                      name="feedback.employeeComments"
                      value={formData.feedback.employeeComments}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Commentaires de l'employé sur l'évaluation..."
                    />
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="font-medium text-purple-900 mb-3">Score Global</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-purple-700 mr-3">
                          {calculateOverallScore()}/5
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                calculateOverallScore() >= star ? 'text-yellow-400 fill-current' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-purple-700">
                        <p>Basé sur {formData.goals.length} objectifs et {formData.competencies.length} compétences</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Vérification Finale</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Veuillez vérifier que toutes les informations sont correctes avant de finaliser l'évaluation.
                          Une fois soumise, elle sera enregistrée dans le système.
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
                  {isEditing ? 'Mettre à Jour' : 'Finaliser l\'Évaluation'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPerformanceReviewForm;