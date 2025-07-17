import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import HR from './components/HR/HR';
import Commercial from './components/Commercial/Commercial';
import Administration from './components/Admin/Administration';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAuthPage, setCurrentAuthPage] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');

  // For demo purposes, we'll add a way to toggle authentication state
  // In a real app, this would be handled by a proper auth system
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  const renderAuthContent = () => {
    switch (currentAuthPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'reset-password':
        return <ResetPasswordPage />;
      default:
        return <LoginPage />;
    }
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'rh':
      case 'recruitment':
      case 'employees':
      case 'documents':
        return <HR />;
      case 'commercial':
      case 'leads':
      case 'opportunities':
      case 'calendar':
        return <Commercial />;
      case 'admin':
      case 'contracts':
      case 'invoicing':
      case 'reports':
      case 'admin-users':
      case 'integrations':
        return <Administration />;
      default:
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Module en Développement
              </h2>
              <p className="text-slate-600">
                Ce module sera bientôt disponible dans dziljo.
              </p>
            </div>
          </div>
        );
    }
  };

  // For demo purposes, add a floating button to toggle auth state
  const AuthToggleButton = () => (
    <button
      onClick={toggleAuth}
      className="fixed bottom-6 left-6 z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      {isAuthenticated ? "Se déconnecter (Démo)" : "Se connecter (Démo)"}
    </button>
  );

  return (
    <>
      {!isAuthenticated ? (
        <>
          {renderAuthContent()}
          <AuthToggleButton />
        </>
      ) : (
        <div className="flex h-screen bg-slate-100 flex-col">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header activeModule={activeModule} />
              <main className="flex-1 overflow-auto">
                {renderContent()}
              </main>
            </div>
          </div>
          <FloatingActionButton activeModule={activeModule} />
          <AuthToggleButton />
        </div>
      )}
    </>
  );
}

export default App;