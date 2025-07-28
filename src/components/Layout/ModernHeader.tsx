import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, Search, User, ChevronDown, Settings, HelpCircle, 
  LogOut, Calendar, Zap, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationCenter from './NotificationCenter';
import UserProfileModal from '../User/UserProfileModal';
import UserSettingsModal from '../User/UserSettingsModal';
import HelpSupportModal from '../User/HelpSupport';
import LogoutConfirmation from '../User/LogoutConfirmation';
import QuickActions from './QuickActions';
import NewEventModal from '../Commercial/NewEventModal';
import CompanyLogo from './CompanyLogo';

interface ModernHeaderProps {
  activeModule: string;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ 
  activeModule, 
  onMenuToggle,
  isMobileMenuOpen = false 
}) => {
  const { userProfile, logout } = useAuth();
  const { unreadCount } = useNotifications();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu utilisateur en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowQuickActions(true);
      } else if (e.altKey && e.key === 'e') {
        e.preventDefault();
        setShowNewEvent(true);
      } else if (e.altKey && e.key === 'n') {
        e.preventDefault();
        setShowNotifications(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getModuleTitle = (module: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Tableau de Bord',
      rh: 'Ressources Humaines',
      recruitment: 'Recrutement',
      employees: 'Gestion du Personnel',
      documents: 'Documents RH',
      commercial: 'Interface Commerciale',
      leads: 'Prospection',
      opportunities: 'Opportunités',
      calendar: 'Agenda Commercial',
      admin: 'Administration',
      contracts: 'Gestion des Contrats',
      invoicing: 'Facturation',
      reports: 'Comptes Rendus'
    };
    return titles[module] || 'DZILJO';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirmation(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Événement créé:', eventData);
    // Logique de création d'événement
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'comptable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'commercial': return 'Commercial';
      case 'comptable': return 'Comptable';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 lg:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Section gauche */}
          <div className="flex items-center space-x-4">
            {/* Bouton menu mobile */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <CompanyLogo size="sm" className="hidden sm:flex" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {getModuleTitle(activeModule)}
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {userProfile?.department}
                </p>
              </div>
            </div>
          </div>
          
          {/* Section centre - Recherche */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          
          {/* Section droite */}
          <div className="flex items-center space-x-3">
            {/* Bouton Nouvel Événement */}
            <button 
              onClick={() => setShowNewEvent(true)}
              className="hidden sm:flex bg-green-600 text-white px-3 py-2 rounded-lg items-center hover:bg-green-700 transition-colors text-sm"
              title="Nouvel événement (Alt+E)"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Événement</span>
            </button>
            
            {/* Bouton Actions Rapides */}
            <button 
              onClick={() => setShowQuickActions(true)}
              className="hidden sm:flex bg-blue-600 text-white px-3 py-2 rounded-lg items-center hover:bg-blue-700 transition-colors text-sm"
              title="Actions rapides (Alt+A)"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Actions</span>
            </button>
            
            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              title="Notifications (Alt+N)"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Menu utilisateur */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 pl-3 border-l border-slate-200 hover:bg-slate-50 rounded-lg p-2 transition-colors"
              >
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-700">
                      {userProfile?.displayName || 'Utilisateur'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">{userProfile?.email}</span>
                    {userProfile?.role && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getRoleColor(userProfile.role)}`}>
                        {getRoleText(userProfile.role)}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Menu déroulant utilisateur */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-lg py-2 w-64 z-50 animate-scale-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{userProfile?.displayName}</p>
                    <p className="text-xs text-slate-500">{userProfile?.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{userProfile?.department}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowUserProfile(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Mon Profil
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowUserSettings(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Paramètres
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowHelpSupport(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Aide & Support
                  </button>
                  
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        setShowLogoutConfirmation(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Se Déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />

      <UserSettingsModal
        isOpen={showUserSettings}
        onClose={() => setShowUserSettings(false)}
      />

      <HelpSupportModal
        isOpen={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
      />

      <QuickActions
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        activeModule={activeModule}
      />

      <NewEventModal
        isOpen={showNewEvent}
        onClose={() => setShowNewEvent(false)}
        onSave={handleCreateEvent}
      />
    </>
  );
};

export default ModernHeader;