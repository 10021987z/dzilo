import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, 
  AlertCircle, CheckCircle, Briefcase, Shield, 
  Chrome, Apple, Smartphone 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ModernLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { signIn, signInWithGoogle, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Redirection gérée par le hook useAuth
    } catch (error) {
      // Erreur gérée par le hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      // Erreur gérée par le hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md">
        {/* Logo et Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-6 shadow-xl">
            <Briefcase className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">DZILJO</h1>
          <p className="text-slate-600">Plateforme de Gestion PME Intégrée</p>
        </div>

        {/* Carte de Connexion */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header de la carte */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Connexion Sécurisée</h2>
                <p className="text-blue-100 text-sm">Accédez à votre espace professionnel</p>
              </div>
            </div>
          </div>

          {/* Corps de la carte */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="votre@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-slate-700">Se souvenir de moi</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Séparateur */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">ou continuer avec</span>
                </div>
              </div>
            </div>

            {/* Connexions sociales */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Chrome className="w-5 h-5 mr-3 text-red-500" />
                Continuer avec Google
              </button>
              
              <button
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Apple className="w-5 h-5 mr-3 text-slate-800" />
                Continuer avec Apple
              </button>
            </div>

            {/* Lien d'inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Footer de la carte */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <Shield className="w-4 h-4 mr-2" />
                Connexion sécurisée SSL
              </div>
              <div className="flex items-center text-slate-500">
                <Smartphone className="w-4 h-4 mr-2" />
                2FA disponible
              </div>
            </div>
          </div>
        </div>

        {/* Informations légales */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-4">
            © 2025 DZILJO SaaS. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <Link to="/terms" className="hover:text-slate-700 transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/support" className="hover:text-slate-700 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;