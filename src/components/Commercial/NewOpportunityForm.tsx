import React, { useState } from 'react';
import { 
  Target, Building2, User, Mail, Phone, Calendar, DollarSign, 
  Briefcase, Tag, FileText, Save, X, Plus, Trash2, 
  Check, AlertCircle, ChevronRight, ChevronLeft, Percent
} from 'lucide-react';

interface NewOpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (opportunityData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const NewOpportunityForm: React.FC<NewOpportunityFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    contactName: initialData?.contactName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    stage: initialData?.stage || 'prospection',
    value: initialData?.value || '',
    probability: initialData?.probability || 20,
    expectedCloseDate: initialData?.expectedCloseDate || '',
    source: initialData?.source || 'Manual',
    assignedTo: initialData?.assignedTo || 'Sophie Martin',
    description: initialData?.description || '',
    products: initialData?.products || [''],
    competitors: initialData?.competitors || [''],
    notes: initialData?.notes || '',
    tags: initialData?.tags || ['']
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const sources = [
    'Site Web', 'LinkedIn', 'Référence', 'Salon professionnel', 'Publicité', 
    'Email', 'Appel à froid', 'Partenaire', 'Autre'
  ];

  const assignees = [
    'Sophie Martin', 'Thomas Dubois', 'Marie Rousseau', 'Pierre Martin'
  ];

  const products = [
    'CRM Enterprise', 'CRM Standard', 'Marketing Automation', 
    'Support Premium', 'Formation', 'Intégration', 'Développement sur mesure'
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.title) newErrors.title = 'Le titre est requis';
      if (!formData.company) newErrors.company = 'Le nom de l\'entreprise est requis';
      if (!formData.contactName) newErrors.contactName = 'Le nom du contact est requis';
      if (!formData.email) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    }
    
    if (step === 2) {
      if (!formData.stage) newErrors.stage = 'L\'étape est requise';
      if (!formData.value) {
        newErrors.value = 'La valeur est requise';
      } else if (isNaN(Number(formData.value))) {
        newErrors.value = 'La valeur doit être un nombre';
      }
      if (!formData.expectedCloseDate) newErrors.expectedCloseDate = 'La date de clôture prévue est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...formData[field as keyof typeof formData] as string[]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: string) => {
    const currentArray = [...formData[field as keyof typeof formData] as string[]];
    setFormData(prev => ({
      ...prev,
      [field]: [...currentArray, '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = (formData[field as keyof typeof formData] as string[]).filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray.length ? newArray : ['']
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
      
      // Prepare opportunity data
      const opportunityData = {
        ...formData,
        id: initialData?.id || Date.now(),
        value: Number(formData.value) || 0,
        products: formData.products.filter(product => product.trim() !== ''),
        competitors: formData.competitors.filter(competitor => competitor.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        createdDate: initialData?.createdDate || new Date().toISOString().split('T')[0],
        lastActivity: initialData?.lastActivity || new Date().toISOString().split('T')[0],
        activities: initialData?.activities || []
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(opportunityData);
          setShowSuccessMessage(false);
          onClose();
          if (!isEditing) resetForm();
        }, 1500);
      }, 1000);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      contactName: '',
      email: '',
      phone: '',
      stage: 'prospection',
      value: '',
      probability: 20,
      expectedCloseDate: '',
      source: 'Manual',
      assignedTo: 'Sophie Martin',
      description: '',
      products: [''],
      competitors: [''],
      notes: '',
      tags: ['']
    });
    setCurrentStep(1);
    setErrors({});
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
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier l\'Opportunité' : 'Nouvelle Opportunité'}</h1>
                <p className="text-white/80">{isEditing ? 'Mettre à jour les informations de l\'opportunité' : 'Ajouter une nouvelle opportunité de vente'}</p>
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
                { step: 1, title: 'Informations Client', icon: Building2 },
                { step: 2, title: 'Détails Opportunité', icon: Target },
                { step: 3, title: 'Produits & Concurrence', icon: Briefcase },
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
                {isEditing ? 'Opportunité Mise à Jour !' : 'Opportunité Créée avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les informations de l\'opportunité ont été mises à jour.' 
                  : 'La nouvelle opportunité a été ajoutée à votre pipeline.'}
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
              </h2>
              <p className="text-slate-600">Nous traitons votre demande</p>
            </div>
          ) : (
            <>
              {/* Errors */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-red-900">Veuillez corriger les erreurs suivantes :</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step 1: Client Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                    Informations Client
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Titre de l'Opportunité <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Ex: Projet CRM Enterprise - TechCorp"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Entreprise <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.company ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom du Contact <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.contactName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          placeholder="Nom et prénom"
                        />
                      </div>
                      {errors.contactName && (
                        <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          placeholder="email@exemple.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Source
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner une source</option>
                        {sources.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Assigné à
                      </label>
                      <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {assignees.map((assignee) => (
                          <option key={assignee} value={assignee}>{assignee}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Opportunity Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Détails de l'Opportunité
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Étape <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.stage ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="prospection">Prospection</option>
                        <option value="qualification">Qualification</option>
                        <option value="proposal">Proposition</option>
                        <option value="negotiation">Négociation</option>
                        <option value="closed-won">Gagné</option>
                        <option value="closed-lost">Perdu</option>
                      </select>
                      {errors.stage && (
                        <p className="mt-1 text-sm text-red-500">{errors.stage}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Valeur (€) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="value"
                          value={formData.value}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.value ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          placeholder="Ex: 25000"
                        />
                      </div>
                      {errors.value && (
                        <p className="mt-1 text-sm text-red-500">{errors.value}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de Clôture Prévue <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="expectedCloseDate"
                          value={formData.expectedCloseDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.expectedCloseDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.expectedCloseDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.expectedCloseDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Probabilité (%)
                      </label>
                      <div className="flex items-center space-x-3">
                        <Percent className="w-4 h-4 text-slate-400" />
                        <input
                          type="range"
                          name="probability"
                          min="0"
                          max="100"
                          step="5"
                          value={formData.probability}
                          onChange={handleChange}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="w-10 text-center font-medium text-slate-900">{formData.probability}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Description détaillée de l'opportunité..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Tags
                    </label>
                    <div className="space-y-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Ex: Priorité, Stratégique, Q2"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('tags', index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('tags')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un tag
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Products & Competition */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                    Produits & Concurrence
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Produits / Services
                    </label>
                    <div className="space-y-2">
                      {formData.products.map((product, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <select
                            value={product}
                            onChange={(e) => handleArrayChange('products', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner un produit</option>
                            {products.map((prod) => (
                              <option key={prod} value={prod}>{prod}</option>
                            ))}
                            <option value="custom">Autre (personnalisé)</option>
                          </select>
                          {product === 'custom' && (
                            <input
                              type="text"
                              placeholder="Nom du produit"
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              onChange={(e) => handleArrayChange('products', index, e.target.value)}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('products', index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('products')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un produit
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Concurrents
                    </label>
                    <div className="space-y-2">
                      {formData.competitors.map((competitor, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={competitor}
                            onChange={(e) => handleArrayChange('competitors', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Nom du concurrent"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('competitors', index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('competitors')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un concurrent
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Notes additionnelles sur cette opportunité..."
                    />
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
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-900">Prêt à {isEditing ? 'mettre à jour' : 'ajouter'} l'opportunité</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Vérifiez les informations ci-dessous avant de finaliser.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                        Informations Client
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Titre:</span>
                          <span className="text-slate-900 font-medium">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Entreprise:</span>
                          <span className="text-slate-900">{formData.company}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Contact:</span>
                          <span className="text-slate-900">{formData.contactName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="text-slate-900">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Téléphone:</span>
                          <span className="text-slate-900">{formData.phone || 'Non spécifié'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-purple-600" />
                        Détails de l'Opportunité
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Étape:</span>
                          <span className="text-slate-900">{
                            formData.stage === 'prospection' ? 'Prospection' :
                            formData.stage === 'qualification' ? 'Qualification' :
                            formData.stage === 'proposal' ? 'Proposition' :
                            formData.stage === 'negotiation' ? 'Négociation' :
                            formData.stage === 'closed-won' ? 'Gagné' : 'Perdu'
                          }</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Valeur:</span>
                          <span className="text-slate-900 font-medium">
                            {formData.value ? `€${Number(formData.value).toLocaleString()}` : 'Non spécifiée'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Probabilité:</span>
                          <span className="text-slate-900">{formData.probability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date de clôture:</span>
                          <span className="text-slate-900">{formData.expectedCloseDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Source:</span>
                          <span className="text-slate-900">{formData.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Assigné à:</span>
                          <span className="text-slate-900">{formData.assignedTo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                        Produits & Concurrence
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-slate-600 font-medium">Produits/Services:</span>
                          <div className="mt-1">
                            {formData.products.filter(p => p.trim() !== '').length > 0 ? (
                              <ul className="list-disc list-inside">
                                {formData.products.filter(p => p.trim() !== '').map((product, index) => (
                                  <li key={index} className="text-slate-900">{product}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-slate-500">Aucun produit spécifié</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium">Concurrents:</span>
                          <div className="mt-1">
                            {formData.competitors.filter(c => c.trim() !== '').length > 0 ? (
                              <ul className="list-disc list-inside">
                                {formData.competitors.filter(c => c.trim() !== '').map((competitor, index) => (
                                  <li key={index} className="text-slate-900">{competitor}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-slate-500">Aucun concurrent spécifié</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-purple-600" />
                        Informations Additionnelles
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-slate-600 font-medium">Description:</span>
                          <p className="text-slate-900 mt-1">{formData.description || 'Aucune description'}</p>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium">Notes:</span>
                          <p className="text-slate-900 mt-1">{formData.notes || 'Aucune note'}</p>
                        </div>
                        <div>
                          <span className="text-slate-600 font-medium">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.tags.filter(t => t.trim() !== '').length > 0 ? (
                              formData.tags.filter(t => t.trim() !== '').map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500">Aucun tag</span>
                            )}
                          </div>
                        </div>
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
                  {isEditing ? 'Mettre à Jour' : 'Créer l\'Opportunité'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOpportunityForm;