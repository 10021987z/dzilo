import React, { useState } from 'react';
import { User, Mail, Phone, Building2, Shield, Save, X, Check, AlertCircle, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

interface NewUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  isAdmin?: boolean;
}

const NewUserForm: React.FC<NewUserFormProps> = ({ isOpen, onClose, onSave, isAdmin = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: isAdmin ? 'Administration' : '',
    role: isAdmin ? 'admin' : 'user',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
    status: 'active'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    'Technique',
    'Commercial',
    'Marketing',
    'Ressources Humaines',
    'Finance',
    'Administration',
    'Direction',
    'Design',
    'Support'
  ];

  const roles = [
    { id: 'admin', name: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités' },
    { id: 'manager', name: 'Manager', description: 'Accès à la gestion d\'équipe et aux rapports' },
    { id: 'user', name: 'Utilisateur', description: 'Accès standard aux fonctionnalités de base' },
    { id: 'readonly', name: 'Lecture seule', description: 'Accès en lecture seule aux données' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.position) newErrors.position = 'Le poste est requis';
    if (!formData.department) newErrors.department = 'Le département est requis';
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare user data
      const userData = {
        ...formData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(userData);
          setShowSuccessMessage(false);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    const strength = passwordStrength();
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    return 'Fort';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className={`bg-gradient-to-r ${isAdmin ? 'from-red-600 to-orange-600' : 'from-blue-600 to-indigo-600'} text-white p-6 relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${isAdmin ? 'from-red-600 to-orange-600' : 'from-blue-600 to-indigo-600'} animate-gradient-x`}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isAdmin ? 'Nouvel Administrateur' : 'Nouvel Utilisateur'}</h1>
                <p className="text-white/80">Créez un {isAdmin ? 'nouvel administrateur' : 'nouvel utilisateur'} pour la plateforme</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isAdmin ? 'Administrateur Créé avec Succès !' : 'Utilisateur Créé avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {formData.sendWelcomeEmail 
                  ? `Un email de bienvenue a été envoyé à ${formData.email}.` 
                  : `L'utilisateur a été créé sans notification par email.`}
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 border-4 border-t-${isAdmin ? 'red' : 'blue'}-600 border-${isAdmin ? 'red' : 'blue'}-200 rounded-full animate-spin mx-auto mb-6`}></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Création en cours...</h2>
              <p className="text-slate-600">Nous créons {isAdmin ? 'l\'administrateur' : 'l\'utilisateur'}</p>
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
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Informations Personnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          placeholder="Prénom"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          placeholder="Nom"
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
                          className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          placeholder="email@exemple.com"
                        />
                      </div>
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
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Informations Professionnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Poste <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.position ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                        placeholder="Ex: Développeur Full Stack"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Département <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.department ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          disabled={isAdmin}
                        >
                          <option value="">Sélectionner un département</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Rôle <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          disabled={isAdmin}
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {roles.find(r => r.id === formData.role)?.description}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Statut
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="pending">En attente</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Sécurité</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mot de passe <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="w-full bg-slate-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                                style={{ width: `${(passwordStrength() / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                              {getStrengthText()}
                            </span>
                          </div>
                          <ul className="text-xs text-slate-500 space-y-1 mt-2">
                            <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                              • Au moins 8 caractères
                            </li>
                            <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                              • Au moins une majuscule
                            </li>
                            <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                              • Au moins un chiffre
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-${isAdmin ? 'red' : 'blue'}-500 focus:border-transparent`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Options</h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendWelcomeEmail"
                      name="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-slate-700">
                      Envoyer un email de bienvenue avec les instructions de connexion
                    </label>
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
                className={`px-4 py-2 bg-${isAdmin ? 'red' : 'blue'}-600 text-white rounded-lg hover:bg-${isAdmin ? 'red' : 'blue'}-700 transition-colors flex items-center`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isAdmin ? 'Créer l\'Administrateur' : 'Créer l\'Utilisateur'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewUserForm;