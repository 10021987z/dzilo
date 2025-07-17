import React, { useState } from 'react';
import { 
  User, Building2, Mail, Phone, Tag, MapPin, Globe, 
  Briefcase, DollarSign, Calendar, Save, X, Plus, Trash2, 
  Check, AlertCircle, ChevronRight, ChevronLeft, FileText
} from 'lucide-react';

interface NewProspectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prospectData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const NewProspectForm: React.FC<NewProspectFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    contactName: initialData?.contactName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    position: initialData?.position || '',
    industry: initialData?.industry || '',
    source: initialData?.source || 'Manual',
    status: initialData?.status || 'new',
    temperature: initialData?.temperature || 'cold',
    estimatedValue: initialData?.estimatedValue || '',
    probability: initialData?.probability || 20,
    nextAction: initialData?.nextAction || '',
    nextActionDate: initialData?.nextActionDate || '',
    assignedTo: initialData?.assignedTo || 'Sophie Martin',
    notes: initialData?.notes || '',
    tags: initialData?.tags || [''],
    website: initialData?.website || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    country: initialData?.country || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const industries = [
    'Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce de détail', 
    'Fabrication', 'Services professionnels', 'Médias', 'Immobilier', 
    'Transport', 'Énergie', 'Télécommunications', 'Hôtellerie', 'Autre'
  ];

  const sources = [
    'Site Web', 'LinkedIn', 'Référence', 'Salon professionnel', 'Publicité', 
    'Email', 'Appel à froid', 'Partenaire', 'Autre'
  ];

  const assignees = [
    'Sophie Martin', 'Thomas Dubois', 'Marie Rousseau', 'Pierre Martin'
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.company) newErrors.company = 'Le nom de l\'entreprise est requis';
      if (!formData.contactName) newErrors.contactName = 'Le nom du contact est requis';
      if (!formData.email) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    }
    
    if (step === 2) {
      if (!formData.industry) newErrors.industry = 'Le secteur d\'activité est requis';
      if (!formData.source) newErrors.source = 'La source est requise';
      if (!formData.status) newErrors.status = 'Le statut est requis';
    }
    
    if (step === 3) {
      if (formData.estimatedValue && isNaN(Number(formData.estimatedValue))) {
        newErrors.estimatedValue = 'La valeur estimée doit être un nombre';
      }
      if (!formData.nextAction) newErrors.nextAction = 'La prochaine action est requise';
      if (!formData.nextActionDate) newErrors.nextActionDate = 'La date de la prochaine action est requise';
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

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tags: newTags.length ? newTags : ['']
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
      
      // Prepare prospect data
      const prospectData = {
        ...formData,
        id: initialData?.id || Date.now(),
        estimatedValue: Number(formData.estimatedValue) || 0,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        createdDate: initialData?.createdDate || new Date().toISOString().split('T')[0],
        lastContact: initialData?.lastContact || '',
        interactions: initialData?.interactions || []
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(prospectData);
          setShowSuccessMessage(false);
          onClose();
          if (!isEditing) resetForm();
        }, 1500);
      }, 1000);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      contactName: '',
      email: '',
      phone: '',
      position: '',
      industry: '',
      source: 'Manual',
      status: 'new',
      temperature: 'cold',
      estimatedValue: '',
      probability: 20,
      nextAction: '',
      nextActionDate: '',
      assignedTo: 'Sophie Martin',
      notes: '',
      tags: [''],
      website: '',
      address: '',
      city: '',
      country: ''
    });
    setCurrentStep(1);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier le Prospect' : 'Nouveau Prospect'}</h1>
                <p className="text-white/80">{isEditing ? 'Mettre à jour les informations du prospect' : 'Ajouter un nouveau prospect à votre pipeline'}</p>
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
                { step: 1, title: 'Informations de Base', icon: Building2 },
                { step: 2, title: 'Qualification', icon: Tag },
                { step: 3, title: 'Suivi & Assignation', icon: Calendar },
                { step: 4, title: 'Finalisation', icon: Check }
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.step 
                        ? 'bg-white text-blue-600' 
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
                {isEditing ? 'Prospect Mis à Jour !' : 'Prospect Créé avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les informations du prospect ont été mises à jour.' 
                  : 'Le nouveau prospect a été ajouté à votre pipeline.'}
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
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

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Informations de Base
                  </h2>

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
                          className={`w-full pl-10 pr-4 py-2 border ${errors.company ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                          className={`w-full pl-10 pr-4 py-2 border ${errors.contactName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                          className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Poste / Fonction
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Directeur Commercial"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Site Web
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="www.exemple.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-600" />
                      Adresse (Optionnel)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Numéro et nom de rue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ville"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Pays
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Pays"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Qualification */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-blue-600" />
                    Qualification
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Secteur d'Activité <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.industry ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="">Sélectionner un secteur</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Source <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.source ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="">Sélectionner une source</option>
                        {sources.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                      {errors.source && (
                        <p className="mt-1 text-sm text-red-500">{errors.source}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Statut <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.status ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="new">Nouveau</option>
                        <option value="contacted">Contacté</option>
                        <option value="qualified">Qualifié</option>
                        <option value="proposal">Proposition</option>
                        <option value="negotiation">Négociation</option>
                        <option value="won">Gagné</option>
                        <option value="lost">Perdu</option>
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Température
                      </label>
                      <select
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="cold">Froid</option>
                        <option value="warm">Tiède</option>
                        <option value="hot">Chaud</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Valeur Estimée (€)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="estimatedValue"
                          value={formData.estimatedValue}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.estimatedValue ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Ex: 10000"
                        />
                      </div>
                      {errors.estimatedValue && (
                        <p className="mt-1 text-sm text-red-500">{errors.estimatedValue}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Probabilité (%)
                      </label>
                      <input
                        type="range"
                        name="probability"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.probability}
                        onChange={handleChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span className="font-medium text-blue-600">{formData.probability}%</span>
                        <span>100%</span>
                      </div>
                    </div>
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
                            onChange={(e) => handleTagChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Important, Priorité, PME"
                          />
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTag}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un tag
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Follow-up & Assignment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Suivi & Assignation
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prochaine Action <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nextAction"
                        value={formData.nextAction}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.nextAction ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ex: Appeler pour présenter l'offre"
                      />
                      {errors.nextAction && (
                        <p className="mt-1 text-sm text-red-500">{errors.nextAction}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de la Prochaine Action <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="nextActionDate"
                          value={formData.nextActionDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.nextActionDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.nextActionDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.nextActionDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Assigné à
                      </label>
                      <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {assignees.map((assignee) => (
                          <option key={assignee} value={assignee}>{assignee}</option>
                        ))}
                      </select>
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Notes additionnelles sur ce prospect..."
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
                        <h3 className="font-medium text-green-900">Prêt à {isEditing ? 'mettre à jour' : 'ajouter'} le prospect</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Vérifiez les informations ci-dessous avant de finaliser.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                        Informations de Base
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Entreprise:</span>
                          <span className="text-slate-900 font-medium">{formData.company}</span>
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
                        <div className="flex justify-between">
                          <span className="text-slate-600">Poste:</span>
                          <span className="text-slate-900">{formData.position || 'Non spécifié'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-purple-600" />
                        Qualification
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Secteur:</span>
                          <span className="text-slate-900">{formData.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Source:</span>
                          <span className="text-slate-900">{formData.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Statut:</span>
                          <span className="text-slate-900">{
                            formData.status === 'new' ? 'Nouveau' :
                            formData.status === 'contacted' ? 'Contacté' :
                            formData.status === 'qualified' ? 'Qualifié' :
                            formData.status === 'proposal' ? 'Proposition' :
                            formData.status === 'negotiation' ? 'Négociation' :
                            formData.status === 'won' ? 'Gagné' : 'Perdu'
                          }</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Température:</span>
                          <span className="text-slate-900">{
                            formData.temperature === 'hot' ? 'Chaud' :
                            formData.temperature === 'warm' ? 'Tiède' : 'Froid'
                          }</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Valeur estimée:</span>
                          <span className="text-slate-900 font-medium">
                            {formData.estimatedValue ? `€${Number(formData.estimatedValue).toLocaleString()}` : 'Non spécifiée'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Probabilité:</span>
                          <span className="text-slate-900">{formData.probability}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-green-600" />
                        Suivi & Assignation
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Prochaine action:</span>
                          <span className="text-slate-900">{formData.nextAction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date:</span>
                          <span className="text-slate-900">{formData.nextActionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Assigné à:</span>
                          <span className="text-slate-900">{formData.assignedTo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-orange-600" />
                        Informations Additionnelles
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-600">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.tags.filter(t => t.trim() !== '').length > 0 ? (
                              formData.tags.filter(t => t.trim() !== '').map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500">Aucun tag</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-slate-600">Notes:</span>
                          <p className="text-slate-900 mt-1">{formData.notes || 'Aucune note'}</p>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
                  {isEditing ? 'Mettre à Jour' : 'Créer le Prospect'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProspectForm;