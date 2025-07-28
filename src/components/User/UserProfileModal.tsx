import React, { useState } from 'react';
import { 
  User, Camera, Save, X, Mail, Phone, MapPin, Calendar, 
  Briefcase, Award, Star, Heart, Coffee, Zap, Target, 
  TrendingUp, Clock, CheckCircle, Upload, Download, Share2, 
  Settings, Shield, Bell, Eye, EyeOff, Edit, Trash2 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile, uploadProfileImage, deleteProfileImage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || '',
    department: userProfile?.department || '',
    role: userProfile?.role || 'employee',
    photoURL: userProfile?.photoURL || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!userProfile?.uid) {
        throw new Error('User profile not loaded');
      }
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la sauvegarde du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || '',
      email: userProfile?.email || '',
      department: userProfile?.department || '',
      role: userProfile?.role || 'employee',
      photoURL: userProfile?.photoURL || ''
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const downloadURL = await uploadProfileImage(file);
      setFormData(prev => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      try {
        await deleteProfileImage();
        setFormData(prev => ({ ...prev, photoURL: '' }));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                {(formData.photoURL || userProfile?.photoURL) ? (
                  <img
                    src={formData.photoURL || userProfile?.photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                )}
                {isEditing && (formData.photoURL || userProfile?.photoURL) && (
                  <button
                    onClick={handleDeleteImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {userProfile?.displayName || 'Utilisateur'}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(userProfile?.role || 'employee')}`}>
                    {getRoleText(userProfile?.role || 'employee')}
                  </span>
                  <span className="text-white/80 text-sm">{userProfile?.department}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <Edit className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 relative z-10">
            {[
              { label: 'Projets', value: '12', icon: Target, color: 'text-yellow-300' },
              { label: 'Heures', value: '847', icon: Clock, color: 'text-green-300' },
              { label: 'Équipes', value: '3', icon: Heart, color: 'text-pink-300' },
              { label: 'Certifs', value: '5', icon: Award, color: 'text-blue-300' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                  <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <div className="space-y-2">
              {[
                { id: 'profile', name: 'Profil', icon: User, color: 'text-blue-600' },
                { id: 'security', name: 'Sécurité', icon: Shield, color: 'text-purple-600' },
                { id: 'activity', name: 'Activité', icon: TrendingUp, color: 'text-green-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white shadow-md border border-slate-200 scale-105'
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 mr-3 ${tab.color} ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                  <span className={`font-medium ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-600'}`}>
                    {tab.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Image Upload Section */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Photo de Profil</h3>
                <div className="space-y-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <div className="cursor-pointer bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center transition-colors">
                      {isUploadingImage ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                          <span className="text-sm text-blue-600">Téléchargement...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-600 font-medium">Changer la photo</p>
                          <p className="text-xs text-blue-500">JPG, PNG (max 5MB)</p>
                        </>
                      )}
                    </div>
                  </label>
                  
                  {(formData.photoURL || userProfile?.photoURL) && (
                    <button
                      onClick={handleDeleteImage}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer la photo
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Informations Personnelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom complet
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{userProfile?.displayName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-slate-500 mr-2" />
                      <p className="text-slate-900">{userProfile?.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Département
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{userProfile?.department}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rôle
                    </label>
                    <span className={`px-3 py-2 text-sm font-medium rounded-lg ${getRoleColor(userProfile?.role || 'employee')}`}>
                      {getRoleText(userProfile?.role || 'employee')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Membre depuis le {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Sécurité du Compte
                </h2>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-green-900">Compte sécurisé</h3>
                        <p className="text-sm text-green-700">Votre compte utilise l'authentification Firebase</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-900 mb-3">Dernière connexion</h3>
                    <p className="text-sm text-slate-600">
                      {userProfile?.lastLogin ? new Date(userProfile.lastLogin).toLocaleString('fr-FR') : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-900 mb-3">Préférences de sécurité</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Authentification à deux facteurs</span>
                        <div className="relative">
                          <input type="checkbox" className="sr-only" />
                          <div className="w-10 h-6 bg-slate-300 rounded-full cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform translate-x-1 mt-1"></div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Activité Récente
                </h2>

                <div className="space-y-4">
                  {[
                    { action: 'Connexion au système', time: '2h', icon: CheckCircle, color: 'text-green-600' },
                    { action: 'Modification du profil', time: '1j', icon: Edit, color: 'text-blue-600' },
                    { action: 'Consultation des rapports', time: '2j', icon: Eye, color: 'text-purple-600' },
                    { action: 'Création d\'un document', time: '3j', icon: Coffee, color: 'text-orange-600' }
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-slate-900">{activity.action}</p>
                        <p className="text-sm text-slate-500">Il y a {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;