import React from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, Users, MapPin, Phone, Mail, Video, ChevronLeft, ChevronRight, Filter, Search, Bell, Target, Star, Tag, MessageSquare, Link, FileText, User, Building2 } from 'lucide-react';
import CalendarIntegration from './CalendarIntegration';

const CalendarPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agenda Intégré</h1>
              <p className="text-slate-600">Gérez vos rendez-vous, entretiens et activités</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1">
        <CalendarIntegration />
      </div>
    </div>
  );
};

export default CalendarPage;