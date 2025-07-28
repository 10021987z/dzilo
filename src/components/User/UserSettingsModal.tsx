import React, { useState } from 'react';
import { 
  Settings, Bell, Shield, Palette, Globe, Moon, Sun, 
  Volume2, VolumeX, Monitor, Save, X, Check 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    language: userProfile?.preferences?.language || 'fr',
    theme: userProfile?.preferences?.theme || 'light',
    notifications: userProfile?.preferences?.notifications || true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    autoSave: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        preferences: {
          language: settings.language,
          theme: settings.theme as 'light' | 'dark' | 'system',
          notifications: settings.notifications
        }
      });
      toast.success('Paramètres sauvegardés !');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-white/80">Personnalisez votre expérience DZILJO</p>
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Général */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Général
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Langue</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Thème</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', name: 'Clair', icon: Sun },
                    { id: 'dark', name: 'Sombre', icon: Moon },
                    { id: 'system', name: 'Système', icon: Monitor }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleChange('theme', theme.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                        settings.theme === theme.id
                          ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <theme.icon className={`w-6 h-6 mb-2 ${settings.theme === theme.id ? 'text-blue-600' : 'text-slate-600'}`} />
                      <span className="text-sm font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-green-600" />
              Notifications
            </h2>
            
            <div className="space-y-4">
              {[
                { key: 'notifications', label: 'Notifications générales', description: 'Recevoir toutes les notifications' },
                { key: 'emailNotifications', label: 'Notifications par email', description: 'Recevoir les notifications importantes par email' },
                { key: 'pushNotifications', label: 'Notifications push', description: 'Notifications en temps réel dans le navigateur' },
                { key: 'soundEnabled', label: 'Sons activés', description: 'Sons pour les nouvelles notifications' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">{item.label}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={(e) => handleChange(item.key, e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => handleChange(item.key, !settings[item.key as keyof typeof settings])}
                      className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                        settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          settings[item.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sécurité */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Sécurité
            </h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Sauvegarde automatique</h3>
                    <p className="text-sm text-slate-600">Sauvegarder automatiquement vos modifications</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleChange('autoSave', e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => handleChange('autoSave', !settings.autoSave)}
                      className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                        settings.autoSave ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          settings.autoSave ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;