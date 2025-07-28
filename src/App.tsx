import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/Auth/AuthProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import ModernHeader from './components/Layout/ModernHeader';
import ModernLoginPage from './components/Auth/ModernLoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import HR from './components/HR/HR';
import Commercial from './components/Commercial/Commercial';
import Administration from './components/Admin/Administration';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import { useAuth } from './hooks/useAuth';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For demo purposes, we'll add a way to toggle authentication state
  // In a real app, this would be handled by a proper auth system

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

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/login" element={<ModernLoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainApp 
                  activeModule={activeModule} 
                  setActiveModule={setActiveModule}
                  isMobileMenuOpen={isMobileMenuOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Composant principal de l'application (après authentification)
const MainApp: React.FC<{
  activeModule: string;
  setActiveModule: (module: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}> = ({ activeModule, setActiveModule, isMobileMenuOpen, setIsMobileMenuOpen }) => {
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
                Ce module sera bientôt disponible dans DZILJO.
              </p>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="flex h-screen bg-slate-100 flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - cachée sur mobile quand fermée */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar 
            activeModule={activeModule} 
            setActiveModule={setActiveModule} 
          />
        </div>
        
        {/* Overlay pour mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ModernHeader 
            activeModule={activeModule} 
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
      <FloatingActionButton activeModule={activeModule} />
    </div>
  );
};

export default App;