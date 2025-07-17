import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, Users, MapPin, Phone, Mail, Video, ChevronLeft, ChevronRight, Filter, Search, Bell, Target, Star, Tag, MessageSquare, Link, FileText, User, Building2, Check, X, RefreshCw, Globe, Share2 } from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  type: 'meeting' | 'call' | 'demo' | 'proposal' | 'follow-up' | 'internal' | 'interview';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  attendees: string[];
  client: string;
  contact: string;
  email: string;
  phone: string;
  description: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high';
  opportunity?: string;
  notes: string;
  reminderSet: boolean;
  tags?: string[];
  documents?: any[];
  source: 'internal' | 'google' | 'outlook';
  externalId?: string;
  syncStatus?: 'synced' | 'pending' | 'failed';
  lastSynced?: string;
}

interface CalendarIntegrationProps {
  events?: CalendarEvent[];
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: number) => void;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  events: initialEvents,
  onEventCreate,
  onEventUpdate,
  onEventDelete
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState<{[key: string]: boolean}>({
    'google-primary': true,
    'google-work': true,
    'outlook-primary': true
  });

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents || [
    {
      id: 1,
      title: 'Démonstration CRM - TechCorp',
      type: 'demo',
      date: '2024-01-26',
      startTime: '10:00',
      endTime: '11:30',
      duration: 90,
      location: 'Visioconférence - Google Meet',
      attendees: ['Jean Dupont', 'Sophie Martin'],
      client: 'TechCorp Solutions',
      contact: 'Jean Dupont',
      email: 'j.dupont@techcorp.com',
      phone: '+33 1 23 45 67 89',
      description: 'Présentation de la solution CRM avec focus sur les fonctionnalités enterprise',
      status: 'confirmed',
      priority: 'high',
      opportunity: 'Projet CRM Enterprise - TechCorp',
      notes: 'Préparer démo avec données de test similaires à leur environnement',
      reminderSet: true,
      source: 'internal'
    },
    {
      id: 2,
      title: 'Suivi Proposition - Digital Innov',
      type: 'follow-up',
      date: '2024-01-26',
      startTime: '14:00',
      endTime: '14:30',
      duration: 30,
      location: 'Appel téléphonique',
      attendees: ['Marie Rousseau', 'Thomas Dubois'],
      client: 'Digital Innovations',
      contact: 'Marie Rousseau',
      email: 'm.rousseau@digital-innov.com',
      phone: '+33 1 98 76 54 32',
      description: 'Suivi de la proposition commerciale envoyée la semaine dernière',
      status: 'scheduled',
      priority: 'medium',
      opportunity: 'Solution Marketing Automation - Digital Innov',
      notes: 'Répondre aux questions sur le ROI et le planning d\'implémentation',
      reminderSet: true,
      source: 'internal'
    },
    {
      id: 3,
      title: 'Réunion Équipe Commerciale',
      type: 'internal',
      date: '2024-01-26',
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      location: 'Salle de réunion A',
      attendees: ['Sophie Martin', 'Thomas Dubois', 'Pierre Rousseau'],
      client: 'Interne',
      contact: 'Équipe Commerciale',
      email: '',
      phone: '',
      description: 'Point hebdomadaire sur les opportunités en cours',
      status: 'scheduled',
      priority: 'medium',
      notes: 'Préparer rapport des activités de la semaine',
      reminderSet: false,
      source: 'internal'
    },
    {
      id: 4,
      title: 'Présentation Proposition - StartupXYZ',
      type: 'proposal',
      date: '2024-01-29',
      startTime: '11:00',
      endTime: '12:30',
      duration: 90,
      location: 'Bureaux StartupXYZ - 15 Rue de la Tech, Paris',
      attendees: ['Pierre Martin', 'Sophie Martin'],
      client: 'StartupXYZ',
      contact: 'Pierre Martin',
      email: 'p.martin@startupxyz.fr',
      phone: '+33 1 11 22 33 44',
      description: 'Présentation de la proposition pour la transformation digitale',
      status: 'scheduled',
      priority: 'high',
      opportunity: 'Transformation Digitale - StartupXYZ',
      notes: 'Apporter portfolio de projets similaires',
      reminderSet: true,
      source: 'internal'
    },
    {
      id: 5,
      title: 'Entretien - Développeur Full Stack',
      type: 'interview',
      date: '2024-01-28',
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      location: 'Salle de réunion B',
      attendees: ['Sophie Martin', 'Jean Dupont', 'Candidat: Marc Leroy'],
      client: 'Interne',
      contact: 'Marc Leroy',
      email: 'm.leroy@email.com',
      phone: '+33 6 12 34 56 78',
      description: 'Entretien technique pour le poste de développeur full stack',
      status: 'confirmed',
      priority: 'high',
      notes: 'Préparer questions techniques sur React et Node.js',
      reminderSet: true,
      source: 'internal'
    },
    {
      id: 6,
      title: 'Réunion Google Workspace',
      type: 'meeting',
      date: '2024-01-30',
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      location: 'Google Meet',
      attendees: ['Sophie Martin', 'Équipe Google'],
      client: 'Google',
      contact: 'Support Google',
      email: 'support@google.com',
      phone: '',
      description: 'Discussion sur l\'intégration Google Workspace',
      status: 'confirmed',
      priority: 'medium',
      notes: 'Préparer questions sur l\'API Calendar',
      reminderSet: true,
      source: 'google',
      externalId: 'google-123456',
      syncStatus: 'synced',
      lastSynced: '2024-01-25T14:30:00Z'
    },
    {
      id: 7,
      title: 'Planification Projet Microsoft',
      type: 'meeting',
      date: '2024-01-31',
      startTime: '11:00',
      endTime: '12:00',
      duration: 60,
      location: 'Microsoft Teams',
      attendees: ['Thomas Dubois', 'Équipe Microsoft'],
      client: 'Microsoft',
      contact: 'Support Microsoft',
      email: 'support@microsoft.com',
      phone: '',
      description: 'Planification de l\'intégration Microsoft 365',
      status: 'confirmed',
      priority: 'medium',
      notes: 'Préparer questions sur l\'API Outlook Calendar',
      reminderSet: true,
      source: 'outlook',
      externalId: 'outlook-789012',
      syncStatus: 'synced',
      lastSynced: '2024-01-25T15:45:00Z'
    }
  ]);

  useEffect(() => {
    // Simulate loading connection status from localStorage
    const googleConnected = localStorage.getItem('googleCalendarConnected') === 'true';
    const outlookConnected = localStorage.getItem('outlookCalendarConnected') === 'true';
    const lastSync = localStorage.getItem('calendarLastSync');
    
    setIsGoogleConnected(googleConnected);
    setIsOutlookConnected(outlookConnected);
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call': return 'bg-green-100 text-green-800 border-green-200';
      case 'demo': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'proposal': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'internal': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'interview': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'meeting': return 'Réunion';
      case 'call': return 'Appel';
      case 'demo': return 'Démonstration';
      case 'proposal': return 'Proposition';
      case 'follow-up': return 'Suivi';
      case 'internal': return 'Interne';
      case 'interview': return 'Entretien';
      default: return type;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'demo': return <Video className="w-4 h-4" />;
      case 'proposal': return <FileText className="w-4 h-4" />;
      case 'follow-up': return <MessageSquare className="w-4 h-4" />;
      case 'internal': return <Building2 className="w-4 h-4" />;
      case 'interview': return <User className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'rescheduled': return 'Reporté';
      default: return status;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google': return <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Google_Calendar_icon.svg" alt="Google Calendar" className="w-4 h-4" />;
      case 'outlook': return <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook Calendar" className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const getWeekDays = (date: Date) => {
    const result = [];
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the start of the week (Sunday)
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - day);
    
    // Get all 7 days of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      result.push(currentDate);
    }
    
    return result;
  };

  const getHourSlots = () => {
    const slots = [];
    for (let i = 8; i < 20; i++) { // 8 AM to 8 PM
      slots.push(`${i}:00`);
    }
    return slots;
  };

  const eventStats = {
    total: events.length,
    today: getEventsForDate(new Date()).length,
    thisWeek: events.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      return eventDate >= weekStart && eventDate <= weekEnd;
    }).length,
    confirmed: events.filter(event => event.status === 'confirmed').length,
    interviews: events.filter(event => event.type === 'interview').length
  };

  const handleConnectGoogle = () => {
    // In a real app, this would redirect to Google OAuth flow
    setIsSyncing(true);
    
    // Simulate OAuth and sync process
    setTimeout(() => {
      setIsGoogleConnected(true);
      setIsSyncing(false);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem('googleCalendarConnected', 'true');
      localStorage.setItem('calendarLastSync', now);
      
      // Show success notification
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Google Calendar connecté avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }, 2000);
  };

  const handleConnectOutlook = () => {
    // In a real app, this would redirect to Microsoft OAuth flow
    setIsSyncing(true);
    
    // Simulate OAuth and sync process
    setTimeout(() => {
      setIsOutlookConnected(true);
      setIsSyncing(false);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem('outlookCalendarConnected', 'true');
      localStorage.setItem('calendarLastSync', now);
      
      // Show success notification
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Outlook Calendar connecté avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }, 2000);
  };

  const handleSyncCalendars = () => {
    setIsSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem('calendarLastSync', now);
      
      // Show success notification
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Calendriers synchronisés avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }, 2000);
  };

  const handleDisconnectGoogle = () => {
    setIsGoogleConnected(false);
    localStorage.removeItem('googleCalendarConnected');
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Google Calendar déconnecté !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleDisconnectOutlook = () => {
    setIsOutlookConnected(false);
    localStorage.removeItem('outlookCalendarConnected');
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Outlook Calendar déconnecté !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleToggleCalendar = (calendarId: string) => {
    setSelectedCalendars(prev => ({
      ...prev,
      [calendarId]: !prev[calendarId]
    }));
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agenda Intégré</h2>
          <p className="text-slate-600">Gérez vos rendez-vous, entretiens et activités</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowIntegrationModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
          >
            <Link className="w-4 h-4 mr-2" />
            Intégrations
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Événement
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.today}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Cette Semaine</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.thisWeek}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Confirmés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.confirmed}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Entretiens</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.interviews}</p>
            </div>
            <div className="bg-pink-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Synchronisation</p>
              <p className="text-sm font-medium text-slate-900 mt-2">
                {lastSyncTime ? (
                  `Dernière: ${new Date(lastSyncTime).toLocaleTimeString()}`
                ) : (
                  'Non synchronisé'
                )}
              </p>
            </div>
            <button 
              onClick={handleSyncCalendars}
              disabled={isSyncing || (!isGoogleConnected && !isOutlookConnected)}
              className="bg-indigo-500 p-2 rounded-lg text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSyncing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (viewMode === 'month') navigateMonth('prev');
                  else if (viewMode === 'week') navigateWeek('prev');
                  else navigateDay('prev');
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
                {viewMode === 'month' ? (
                  `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                ) : viewMode === 'week' ? (
                  `Semaine du ${getWeekDays(currentDate)[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au ${getWeekDays(currentDate)[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                ) : (
                  currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                )}
              </h3>
              <button
                onClick={() => {
                  if (viewMode === 'month') navigateMonth('next');
                  else if (viewMode === 'week') navigateWeek('next');
                  else navigateDay('next');
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Jour
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'agenda' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Agenda
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="meeting">Réunion</option>
              <option value="call">Appel</option>
              <option value="demo">Démonstration</option>
              <option value="proposal">Proposition</option>
              <option value="follow-up">Suivi</option>
              <option value="internal">Interne</option>
              <option value="interview">Entretien</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="scheduled">Planifié</option>
              <option value="confirmed">Confirmé</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>

        {/* Calendar Grid - Month View */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center font-medium text-slate-700 bg-slate-50">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth(currentDate).map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-slate-200 ${
                  day ? 'bg-white hover:bg-slate-50' : 'bg-slate-50'
                } transition-colors ${
                  day && day.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500 ring-inset' : ''
                }`}
              >
                {day && (
                  <>
                    <div className="font-medium text-slate-900 mb-1">
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(day).slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`text-xs p-1 rounded cursor-pointer border ${getEventTypeColor(event.type)} flex items-center`}
                        >
                          {getSourceIcon(event.source)}
                          <div className="ml-1 truncate">{event.title}</div>
                        </div>
                      ))}
                      {getEventsForDate(day).length > 3 && (
                        <div className="text-xs text-slate-500 text-center">
                          +{getEventsForDate(day).length - 3} autres
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Calendar Grid - Week View */}
        {viewMode === 'week' && (
          <div className="flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-8 gap-1">
              <div className="p-3 text-center font-medium text-slate-700 bg-slate-50">
                Heure
              </div>
              {getWeekDays(currentDate).map((day, index) => (
                <div 
                  key={index} 
                  className={`p-3 text-center font-medium ${
                    day.toDateString() === new Date().toDateString() 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>{dayNames[day.getDay()]}</div>
                  <div>{day.getDate()}</div>
                </div>
              ))}
            </div>
            
            {/* Hour slots */}
            {getHourSlots().map((hour, hourIndex) => (
              <div key={hourIndex} className="grid grid-cols-8 gap-1">
                <div className="p-2 text-center text-xs font-medium text-slate-500 border-r border-slate-200">
                  {hour}
                </div>
                {getWeekDays(currentDate).map((day, dayIndex) => {
                  const dateString = day.toISOString().split('T')[0];
                  const hourNum = parseInt(hour.split(':')[0]);
                  const eventsInSlot = events.filter(event => {
                    const eventDate = event.date;
                    const eventStartHour = parseInt(event.startTime.split(':')[0]);
                    return eventDate === dateString && eventStartHour === hourNum;
                  });
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`min-h-[60px] p-1 border border-slate-200 ${
                        day.toDateString() === new Date().toDateString() ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      {eventsInSlot.map(event => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`text-xs p-1 rounded cursor-pointer border ${getEventTypeColor(event.type)} mb-1 truncate`}
                        >
                          <div className="flex items-center">
                            {getSourceIcon(event.source)}
                            <span className="ml-1 font-medium">{event.startTime}</span>
                          </div>
                          <div className="truncate">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Calendar Grid - Day View */}
        {viewMode === 'day' && (
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-slate-900">
                {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
            </div>
            
            {/* Hour slots */}
            {getHourSlots().map((hour, hourIndex) => {
              const hourNum = parseInt(hour.split(':')[0]);
              const dateString = currentDate.toISOString().split('T')[0];
              const eventsInSlot = events.filter(event => {
                const eventDate = event.date;
                const eventStartHour = parseInt(event.startTime.split(':')[0]);
                return eventDate === dateString && eventStartHour === hourNum;
              });
              
              return (
                <div key={hourIndex} className="flex border-b border-slate-200 min-h-[80px]">
                  <div className="w-20 p-2 text-center text-sm font-medium text-slate-500 border-r border-slate-200">
                    {hour}
                  </div>
                  <div className="flex-1 p-2">
                    {eventsInSlot.map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`p-2 rounded cursor-pointer border ${getEventTypeColor(event.type)} mb-2`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getEventTypeIcon(event.type)}
                            <span className="ml-2 font-medium text-slate-900">{event.title}</span>
                          </div>
                          <div className="flex items-center">
                            {getSourceIcon(event.source)}
                            <span className="ml-1 text-xs text-slate-500">{event.startTime} - {event.endTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Agenda View */}
        {viewMode === 'agenda' && (
          <div className="space-y-4">
            {/* Today's Events */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Aujourd'hui</h3>
              {getEventsForDate(new Date()).length > 0 ? (
                <div className="space-y-2">
                  {getEventsForDate(new Date()).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`p-2 rounded ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-slate-900">{event.title}</h4>
                            <p className="text-sm text-slate-600">{event.startTime} - {event.endTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getSourceIcon(event.source)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status)}`}>
                            {getStatusText(event.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Aucun événement prévu aujourd'hui</p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Prochains Événements</h3>
              {events
                .filter(event => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return eventDate > today && event.status !== 'cancelled';
                })
                .sort((a, b) => {
                  const dateA = new Date(`${a.date}T${a.startTime}`);
                  const dateB = new Date(`${b.date}T${b.startTime}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors mb-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`p-2 rounded ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-slate-900">{event.title}</h4>
                          <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            <span className="mx-1">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getSourceIcon(event.source)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Upcoming Interviews */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Prochains Entretiens</h3>
              {events
                .filter(event => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today && event.type === 'interview' && event.status !== 'cancelled';
                })
                .sort((a, b) => {
                  const dateA = new Date(`${a.date}T${a.startTime}`);
                  const dateB = new Date(`${b.date}T${b.startTime}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 3)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors mb-2 bg-pink-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 rounded bg-pink-100 text-pink-800">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-slate-900">{event.title}</h4>
                          <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            <span className="mx-1">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getSourceIcon(event.source)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedEvent.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getEventTypeColor(selectedEvent.type)}`}>
                      {getEventTypeIcon(selectedEvent.type)}
                      <span className="ml-1">{getEventTypeText(selectedEvent.type)}</span>
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedEvent.status)}`}>
                      {getStatusText(selectedEvent.status)}
                    </span>
                    {selectedEvent.tags && selectedEvent.tags.length > 0 && selectedEvent.tags[0] !== '' && (
                      <div className="flex items-center space-x-1">
                        {selectedEvent.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setShowEditModal(true);
                      setSelectedEvent(null);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Informations Générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{selectedEvent.startTime} - {selectedEvent.endTime} ({selectedEvent.duration} min)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      {selectedEvent.reminderSet && (
                        <div className="flex items-center">
                          <Bell className="w-4 h-4 mr-2 text-slate-500" />
                          <span>Rappel activé</span>
                        </div>
                      )}
                      {selectedEvent.priority && (
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2 text-slate-500" />
                          <span className={`font-medium ${
                            selectedEvent.priority === 'high' ? 'text-red-600' : 
                            selectedEvent.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            Priorité {selectedEvent.priority === 'high' ? 'Haute' : selectedEvent.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-slate-500" />
                        <span>Source: {
                          selectedEvent.source === 'google' ? 'Google Calendar' : 
                          selectedEvent.source === 'outlook' ? 'Outlook Calendar' : 
                          'Interne'
                        }</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Client:</span>
                        <p className="text-slate-900">{selectedEvent.client}</p>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>
                        <p className="text-slate-900">{selectedEvent.contact}</p>
                      </div>
                      {selectedEvent.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-slate-500" />
                          <span>{selectedEvent.email}</span>
                        </div>
                      )}
                      {selectedEvent.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-slate-500" />
                          <span>{selectedEvent.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Participants</h4>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-slate-500" />
                          <span>{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedEvent.opportunity && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Opportunité Liée</h4>
                      <div className="flex items-center text-sm bg-blue-50 p-2 rounded-lg">
                        <Star className="w-4 h-4 mr-2 text-blue-600" />
                        <p className="text-blue-800">{selectedEvent.opportunity}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Priorité</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      selectedEvent.priority === 'high' ? 'bg-red-100 text-red-800' :
                      selectedEvent.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedEvent.priority === 'high' && '🔴 Haute'}
                      {selectedEvent.priority === 'medium' && '🟡 Moyenne'}
                      {selectedEvent.priority === 'low' && '🟢 Basse'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedEvent.description}</p>
              </div>

              {/* Notes */}
              {selectedEvent.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                  <p className="text-sm text-slate-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{selectedEvent.notes}</p>
                </div>
              )}

              {/* Documents */}
              {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedEvent.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-slate-500" />
                          <span className="text-sm text-slate-900">{doc.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => {
                    setShowEditModal(true);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Video className="w-4 h-4 mr-2" />
                  Rejoindre
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Modal */}
      {showIntegrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">Intégrations de Calendrier</h3>
                <button 
                  onClick={() => setShowIntegrationModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Synchronisation de Calendrier</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Connectez vos calendriers Google et Outlook pour synchroniser vos événements et éviter les conflits d'horaire.
                      Les événements seront synchronisés dans les deux sens.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Calendar */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Google_Calendar_icon.svg" alt="Google Calendar" className="w-8 h-8 mr-3" />
                      <h4 className="font-medium text-slate-900">Google Calendar</h4>
                    </div>
                    <div>
                      {isGoogleConnected ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Connecté
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">
                          Non connecté
                        </span>
                      )}
                    </div>
                  </div>

                  {isGoogleConnected ? (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-slate-600 mb-2">Calendriers synchronisés:</div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="google-primary"
                              checked={selectedCalendars['google-primary']}
                              onChange={() => handleToggleCalendar('google-primary')}
                              className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="google-primary" className="text-sm text-slate-700">
                              Calendrier principal
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="google-work"
                              checked={selectedCalendars['google-work']}
                              onChange={() => handleToggleCalendar('google-work')}
                              className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="google-work" className="text-sm text-slate-700">
                              Calendrier professionnel
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSyncCalendars}
                          disabled={isSyncing}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                          {isSyncing ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          Synchroniser
                        </button>
                        <button
                          onClick={handleDisconnectGoogle}
                          className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          Déconnecter
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleConnectGoogle}
                      disabled={isSyncing}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Connecter Google Calendar
                    </button>
                  )}
                </div>

                {/* Outlook Calendar */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook Calendar" className="w-8 h-8 mr-3" />
                      <h4 className="font-medium text-slate-900">Outlook Calendar</h4>
                    </div>
                    <div>
                      {isOutlookConnected ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Connecté
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">
                          Non connecté
                        </span>
                      )}
                    </div>
                  </div>

                  {isOutlookConnected ? (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-slate-600 mb-2">Calendriers synchronisés:</div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="outlook-primary"
                              checked={selectedCalendars['outlook-primary']}
                              onChange={() => handleToggleCalendar('outlook-primary')}
                              className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="outlook-primary" className="text-sm text-slate-700">
                              Calendrier principal
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSyncCalendars}
                          disabled={isSyncing}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                          {isSyncing ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          Synchroniser
                        </button>
                        <button
                          onClick={handleDisconnectOutlook}
                          className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          Déconnecter
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleConnectOutlook}
                      disabled={isSyncing}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Connecter Outlook Calendar
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Options de Synchronisation</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-700">Synchronisation automatique</label>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={true}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-6 bg-blue-600 rounded-full cursor-pointer"
                      >
                        <div
                          className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-5 mt-1"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-700">Synchroniser les événements passés</label>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={false}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-6 bg-slate-300 rounded-full cursor-pointer"
                      >
                        <div
                          className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-1 mt-1"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-700">Notifications pour tous les calendriers</label>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={true}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-6 bg-blue-600 rounded-full cursor-pointer"
                      >
                        <div
                          className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-5 mt-1"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowIntegrationModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={handleSyncCalendars}
                  disabled={isSyncing || (!isGoogleConnected && !isOutlookConnected)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Synchroniser Maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarIntegration;