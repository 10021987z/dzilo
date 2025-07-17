import React, { useState, useRef, useEffect } from 'react';
import { Building2, Upload, Save, X, Check, AlertCircle, Image, FileText, Briefcase, Mail, Phone, MapPin, Globe, Info } from 'lucide-react';

interface CompanySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settingsData: any) => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: 'dziljo SaaS',
    address: '123 Rue de la Tech',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    phone: '+33 1 23 45 67 89',
    email: 'contact@dziljo.com',
    website: 'www.dziljo.com',
    legalForm: 'SAS',
    registrationNumber: 'RCS Paris 123 456 789',
    vatNumber: 'FR 12 345 678 901',
    capital: '10 000 €',
    footerText: 'Dénomination Sociale : dziljo SaaS Adresse du siège : Paris – France Forme juridique : Société par actions simplifiée (SAS) N° SIRET : 123 456 789 00012 Capital Social : 10 000 € Tel : +33 1 23 45 67 89 Site web : www.dziljo.com Email: contact@dziljo.com'
  });

  const [logo, setLogo] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings');
    const savedLogo = localStorage.getItem('companyLogo');
    
    if (savedSettings) {
      try {
        setFormData(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
    
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setErrors(prev => ({
        ...prev,
        logo: 'Le fichier doit être une image (JPG, PNG, GIF)'
      }));
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        logo: 'L\'image ne doit pas dépasser 2MB'
      }));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogo(event.target.result as string);
        
        // Clear error
        if (errors.logo) {
          setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.logo;
            return newErrors;
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.companyName) newErrors.companyName = 'Le nom de l\'entreprise est requis';
    if (!formData.address) newErrors.address = 'L\'adresse est requise';
    if (!formData.city) newErrors.city = 'La ville est requise';
    if (!formData.email && !formData.email.includes('@')) newErrors.email = 'Un email valide est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Save settings to localStorage
      localStorage.setItem('companySettings', JSON.stringify(formData));
      if (logo) {
        localStorage.setItem('companyLogo', logo);
      } else {
        localStorage.removeItem('companyLogo');
      }
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          if (onSave) {
            onSave({
              ...formData,
              logo
            });
          }
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
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Paramètres de l'Entreprise</h1>
                <p className="text-white/80">Personnalisez les informations de votre entreprise</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Paramètres Enregistrés !</h2>
              <p className="text-slate-600 mb-6">
                Les informations de votre entreprise ont été mises à jour avec succès.
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Enregistrement en cours...</h2>
              <p className="text-slate-600">Nous mettons à jour vos paramètres</p>
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
                {/* Logo Upload */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2 text-blue-600" />
                    Logo de l'Entreprise
                  </h2>
                  
                  <div className="flex items-start space-x-6">
                    <div className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                      {logo ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={logo} 
                            alt="Company Logo" 
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={removeLogo}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm text-slate-500">Aucun logo</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-4">
                        Téléchargez votre logo d'entreprise. Il apparaîtra sur tous vos documents et en-têtes.
                      </p>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {logo ? 'Changer le logo' : 'Télécharger un logo'}
                      </button>
                      
                      {errors.logo && (
                        <p className="mt-2 text-sm text-red-600">{errors.logo}</p>
                      )}
                      
                      <p className="mt-3 text-xs text-slate-500">
                        Formats acceptés: JPG, PNG, GIF. Taille maximale: 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Informations de l'Entreprise
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom de l'Entreprise <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.companyName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Forme Juridique
                      </label>
                      <input
                        type="text"
                        name="legalForm"
                        value={formData.legalForm}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: SARL, SAS, SA..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Numéro d'Immatriculation
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: RCS Paris 123 456 789"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Numéro de TVA
                      </label>
                      <input
                        type="text"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: FR 12 345 678 901"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Capital Social
                      </label>
                      <input
                        type="text"
                        name="capital"
                        value={formData.capital}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 10 000 €"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Coordonnées
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Adresse <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.address ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Adresse"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ville"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Code postal"
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
                          placeholder="Téléphone"
                        />
                      </div>
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
                          placeholder="Email"
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
                          placeholder="Site web"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Text */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Texte de Pied de Page
                  </h2>
                  
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">
                        Ce texte apparaîtra en pied de page sur tous vos documents (factures, contrats, rapports, etc.).
                      </p>
                    </div>
                  </div>
                  
                  <textarea
                    name="footerText"
                    value={formData.footerText}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Texte de pied de page..."
                  />
                  
                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                    <p className="font-medium text-slate-700 mb-1">Aperçu du pied de page :</p>
                    {formData.footerText}
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
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;