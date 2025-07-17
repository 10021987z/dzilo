import React, { useState } from 'react';
import { FileText, User, Building2, Calendar, DollarSign, Save, X, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface NewContractFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: any) => void;
}

const NewContractForm: React.FC<NewContractFormProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    clientEmail: '',
    contractType: 'Prestation de Services',
    value: '',
    startDate: '',
    endDate: '',
    description: '',
    terms: ['Le présent contrat est soumis au droit français.', 'Tout litige sera soumis aux tribunaux compétents.'],
    assignedTo: 'Sophie Martin'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const contractTypes = [
    'Prestation de Services',
    'Maintenance',
    'Partenariat',
    'Vente',
    'Confidentialité',
    'Emploi',
    'Autre'
  ];

  const assignees = [
    'Sophie Martin',
    'Thomas Dubois',
    'Marie Rousseau',
    'Pierre Martin'
  ];

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

  const addTerm = () => {
    setFormData(prev => ({
      ...prev,
      terms: [...prev.terms, '']
    }));
  };

  const updateTerm = (index: number, value: string) => {
    const updatedTerms = [...formData.terms];
    updatedTerms[index] = value;
    setFormData(prev => ({
      ...prev,
      terms: updatedTerms
    }));
  };

  const removeTerm = (index: number) => {
    const updatedTerms = formData.terms.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      terms: updatedTerms
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.client) newErrors.client = 'Le client est requis';
    if (!formData.clientEmail) newErrors.clientEmail = 'L\'email du client est requis';
    if (!formData.value) newErrors.value = 'La valeur est requise';
    if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    if (!formData.endDate) newErrors.endDate = 'La date de fin est requise';
    if (!formData.description) newErrors.description = 'La description est requise';
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'La date de fin doit être après la date de début';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare contract data
      const contractData = {
        ...formData,
        id: Date.now(),
        value: parseFloat(formData.value),
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        signatureStatus: 'unsigned'
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(contractData);
          setShowSuccessMessage(false);
          onClose();
        }, 1500);
      }, 1000);
    }
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
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nouveau Contrat</h1>
                <p className="text-white/80">Créez un nouveau contrat pour vos clients</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showSuccessMessage ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Contrat Créé avec Succès !</h2>
              <p className="text-slate-600 mb-6">
                Le contrat a été créé et est prêt à être envoyé pour signature.
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Création en cours...</h2>
              <p className="text-slate-600">Nous créons votre contrat</p>
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

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Informations de Base</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Titre du Contrat <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ex: Contrat de Prestation - Client XYZ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type de Contrat <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {contractTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="client"
                          value={formData.client}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.client ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Nom du client"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email du Client <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.clientEmail ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="client@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Valeur (€) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          name="value"
                          value={formData.value}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.value ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Ex: 5000"
                        />
                      </div>
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

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de Début <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.startDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de Fin <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.endDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Description détaillée du contrat..."
                  />
                </div>

                {/* Terms and Conditions */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Termes et Conditions
                    </label>
                    <button
                      type="button"
                      onClick={addTerm}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un terme
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.terms.map((term, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <textarea
                          value={term}
                          onChange={(e) => updateTerm(index, e.target.value)}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Terme ou condition..."
                        />
                        <button
                          type="button"
                          onClick={() => removeTerm(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Actions */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Créer le Contrat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewContractForm;