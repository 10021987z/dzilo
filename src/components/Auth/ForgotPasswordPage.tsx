import React, { useState } from 'react';
import { Mail, ArrowRight, Check, AlertCircle, Briefcase, ArrowLeft, Lock, Shield } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState<'request' | 'confirmation'>('request');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Veuillez entrer votre adresse email');
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
      
      setSuccessMessage(`Un email de réinitialisation a été envoyé à ${email}`);
      setStep('confirmation');
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
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
        
        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Mot de passe oublié</h2>
            <p className="text-blue-100">
              {step === 'request' 
                ? 'Réinitialisez votre mot de passe en quelques étapes' 
                : 'Vérifiez votre boîte de réception'}
            </p>
          </div>
          
          {/* Card Body */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            {step === 'request' ? (
              <>
                <div className="mb-6">
                  <p className="text-slate-600">
                    Entrez l'adresse email associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
                
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
                    {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Email envoyé !</h3>
                <p className="text-slate-600 mb-6">
                  {successMessage}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Conseils de sécurité</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1 list-disc list-inside">
                        <li>Le lien est valide pendant 30 minutes</li>
                        <li>Vérifiez votre dossier spam si vous ne trouvez pas l'email</li>
                        <li>Ne partagez jamais ce lien avec quelqu'un d'autre</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEmail('');
                      setStep('request');
                      setSuccessMessage('');
                    }}
                    className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour
                  </button>
                  <a
                    href="/login"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Connexion
                  </a>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Vous vous souvenez de votre mot de passe ?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Se connecter
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

export default ForgotPasswordPage;