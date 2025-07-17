import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle, Briefcase, Shield, ArrowRight } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  
  useEffect(() => {
    // In a real app, you would get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      
      // Simulate token validation
      validateToken(tokenFromUrl);
    } else {
      setIsTokenValid(false);
      setError('Lien de réinitialisation invalide ou expiré');
    }
  }, []);
  
  const validateToken = async (token: string) => {
    // Simulate API call to validate token
    try {
      // For demo purposes, we'll just set a random expiry time
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 30);
      setTokenExpiry(expiryDate);
      
      // Randomly decide if token is valid (for demo)
      const isValid = true; // In real app, this would be determined by API
      setIsTokenValid(isValid);
      
      if (!isValid) {
        setError('Lien de réinitialisation invalide ou expiré');
      }
    } catch (err) {
      setIsTokenValid(false);
      setError('Une erreur est survenue lors de la validation du lien');
    }
  };

  const passwordStrength = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
      
      // Simulate redirect after successful reset
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!tokenExpiry) return '';
    
    const now = new Date();
    const diffMs = tokenExpiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expiré';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMins}:${diffSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4 shadow-lg">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">dziljo</h1>
          <p className="text-slate-600 mt-1">Plateforme de Gestion PME Intégrée</p>
        </div>
        
        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Réinitialisation du mot de passe</h2>
            <p className="text-blue-100">Créez un nouveau mot de passe sécurisé</p>
            
            {tokenExpiry && isTokenValid && (
              <div className="mt-4 bg-white/20 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-sm text-white">Temps restant:</span>
                <span className="text-sm font-medium text-white">{formatTimeRemaining()}</span>
              </div>
            )}
          </div>
          
          {/* Card Body */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}
            
            {!isTokenValid ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Lien invalide ou expiré</h3>
                <p className="text-slate-600 mb-6">
                  Le lien de réinitialisation que vous avez utilisé est invalide ou a expiré. Veuillez demander un nouveau lien.
                </p>
                <a
                  href="/forgot-password"
                  className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  Demander un nouveau lien
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {password && (
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
                        <li className={password.length >= 8 ? 'text-green-600' : ''}>
                          • Au moins 8 caractères
                        </li>
                        <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                          • Au moins une majuscule
                        </li>
                        <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                          • Au moins un chiffre
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">Conseils de sécurité</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Utilisez un mot de passe unique que vous n'utilisez pas sur d'autres sites. Un gestionnaire de mots de passe peut vous aider à créer et mémoriser des mots de passe forts.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Retour à la connexion
                </a>
              </p>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <Lock className="w-4 h-4 mr-1" />
                Sécurisé
              </div>
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Besoin d'aide ?
              </a>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            © 2025 dziljo SaaS. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;