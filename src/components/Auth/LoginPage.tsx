import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, Briefcase } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // In a real app, you would use React Router's useNavigate hook
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any email with password "password123"
      if (password === 'password123') {
        setSuccessMessage('Connexion réussie !');
        
        // Simulate redirect after successful login
        setTimeout(() => {
          // In a real app, you would use:
          // navigate('/dashboard');
          window.location.href = '/';
        }, 1000);
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    // In a real app with React Router, you would use:
    // navigate('/register');
    window.location.href = '/register';
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
        
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Connexion</h2>
            <p className="text-blue-100">Accédez à votre espace personnel</p>
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Mot de passe
                  </label>
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Se souvenir de moi</span>
                </label>
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
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">ou</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={navigateToRegister}
                  className="w-full bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center font-medium"
                >
                  Vous n'avez pas de compte ? Créer un compte
                </button>
              </div>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <Lock className="w-4 h-4 mr-1" />
                Connexion sécurisée
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

export default LoginPage;