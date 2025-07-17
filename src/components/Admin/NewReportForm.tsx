import React, { useState } from 'react';
import { ClipboardList, Calendar, User, Building2, Save, X, Plus, Trash2, Check, AlertCircle, BarChart3, FileText, Filter, Download } from 'lucide-react';

interface NewReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportData: any) => void;
}

interface ReportSection {
  id: number;
  title: string;
  content: string;
}

const NewReportForm: React.FC<NewReportFormProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'activity',
    client: '',
    clientEmail: '',
    period: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    author: 'Sophie Martin',
    summary: '',
    conclusion: '',
    status: 'draft'
  });

  const [sections, setSections] = useState<ReportSection[]>([
    { id: 1, title: 'Introduction', content: '' }
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const reportTypes = [
    { id: 'activity', name: 'Rapport d\'Activité' },
    { id: 'project', name: 'Rapport de Projet' },
    { id: 'financial', name: 'Rapport Financier' },
    { id: 'meeting', name: 'Compte-Rendu de Réunion' },
    { id: 'client', name: 'Rapport Client' },
    { id: 'custom', name: 'Rapport Personnalisé' }
  ];

  const authors = [
    'Sophie Martin',
    'Thomas Dubois',
    'Marie Rousseau',
    'Pierre Martin'
  ];

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

  const handleSectionChange = (id: number, field: keyof ReportSection, value: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const addSection = () => {
    const newId = Math.max(0, ...sections.map(section => section.id)) + 1;
    setSections([...sections, { id: newId, title: '', content: '' }]);
  };

  const removeSection = (id: number) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.client) newErrors.client = 'Le client est requis';
    if (!formData.clientEmail) newErrors.clientEmail = 'L\'email du client est requis';
    if (!formData.period.startDate) newErrors['period.startDate'] = 'La date de début est requise';
    if (!formData.period.endDate) newErrors['period.endDate'] = 'La date de fin est requise';
    if (!formData.summary) newErrors.summary = 'Le résumé est requis';
    
    // Check if end date is after start date
    if (formData.period.startDate && formData.period.endDate) {
      const start = new Date(formData.period.startDate);
      const end = new Date(formData.period.endDate);
      if (end < start) {
        newErrors['period.endDate'] = 'La date de fin doit être après la date de début';
      }
    }
    
    // Validate sections
    let hasSectionErrors = false;
    sections.forEach((section, index) => {
      if (!section.title) {
        newErrors[`section_${index}_title`] = `Le titre de la section ${index + 1} est requis`;
        hasSectionErrors = true;
      }
      if (!section.content) {
        newErrors[`section_${index}_content`] = `Le contenu de la section ${index + 1} est requis`;
        hasSectionErrors = true;
      }
    });
    
    if (hasSectionErrors) {
      newErrors.sections = 'Veuillez remplir tous les champs des sections';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare report data
      const reportData = {
        ...formData,
        sections,
        createdDate: new Date().toISOString().split('T')[0],
        id: Date.now()
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(reportData);
          setShowSuccessMessage(false);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nouveau Rapport</h1>
                <p className="text-white/80">Créez un nouveau rapport ou compte-rendu</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Rapport Créé avec Succès !</h2>
              <p className="text-slate-600 mb-6">
                Le rapport a été créé et est prêt à être partagé.
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Création en cours...</h2>
              <p className="text-slate-600">Nous créons votre rapport</p>
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
                        Titre du Rapport <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        placeholder="Ex: Rapport d'Activité - Janvier 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type de Rapport
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {reportTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
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
                          className={`w-full pl-10 pr-4 py-2 border ${errors.client ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
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
                        className={`w-full px-3 py-2 border ${errors.clientEmail ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        placeholder="client@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de Début <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="period.startDate"
                          value={formData.period.startDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors['period.startDate'] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
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
                          name="period.endDate"
                          value={formData.period.endDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors['period.endDate'] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Auteur
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {authors.map((author) => (
                            <option key={author} value={author}>{author}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Résumé Exécutif <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${errors.summary ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="Résumé des points clés du rapport..."
                  />
                </div>

                {/* Report Sections */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Sections du Rapport</h2>
                    <button
                      type="button"
                      onClick={addSection}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Titre de la Section <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                              className={`w-full px-3 py-2 border ${errors[`section_${index}_title`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                              placeholder="Titre de la section"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            disabled={sections.length === 1}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contenu <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                            rows={4}
                            className={`w-full px-3 py-2 border ${errors[`section_${index}_content`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                            placeholder="Contenu de la section..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conclusion */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Conclusion
                  </label>
                  <textarea
                    name="conclusion"
                    value={formData.conclusion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Conclusion et recommandations..."
                  />
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Créer le Rapport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReportForm;