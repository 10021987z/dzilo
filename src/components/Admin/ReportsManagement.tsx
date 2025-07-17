import React, { useState } from 'react';
import { ClipboardList, Plus, Edit, Eye, Download, Calendar, Search, Filter, User, Building2, FileText, BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import NewReportForm from './NewReportForm';

interface Report {
  id: number;
  title: string;
  type: string;
  client: string;
  clientEmail: string;
  period: {
    startDate: string;
    endDate: string;
  };
  author: string;
  summary: string;
  sections: Array<{
    id: number;
    title: string;
    content: string;
  }>;
  conclusion?: string;
  status: 'draft' | 'published' | 'archived';
  createdDate: string;
  publishedDate?: string;
}

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'Rapport d\'Activité - TechCorp Solutions - Q4 2023',
      type: 'activity',
      client: 'TechCorp Solutions',
      clientEmail: 'j.dupont@techcorp.com',
      period: {
        startDate: '2023-10-01',
        endDate: '2023-12-31'
      },
      author: 'Sophie Martin',
      summary: 'Ce rapport présente les activités réalisées pour TechCorp Solutions au cours du dernier trimestre 2023, incluant le développement de nouvelles fonctionnalités, la maintenance et le support.',
      sections: [
        { id: 1, title: 'Introduction', content: 'Présentation des objectifs du trimestre et des résultats attendus.' },
        { id: 2, title: 'Développement', content: 'Détail des fonctionnalités développées et des améliorations apportées à la plateforme.' },
        { id: 3, title: 'Support et Maintenance', content: 'Résumé des interventions de support et des opérations de maintenance effectuées.' }
      ],
      conclusion: 'Le trimestre a été marqué par une forte productivité et l\'atteinte de tous les objectifs fixés. Plusieurs améliorations significatives ont été apportées à la plateforme.',
      status: 'published',
      createdDate: '2024-01-10',
      publishedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Compte-Rendu de Réunion - Lancement Projet Digital Innovations',
      type: 'meeting',
      client: 'Digital Innovations',
      clientEmail: 'm.rousseau@digital-innov.com',
      period: {
        startDate: '2024-01-20',
        endDate: '2024-01-20'
      },
      author: 'Thomas Dubois',
      summary: 'Compte-rendu de la réunion de lancement du projet de refonte du site web de Digital Innovations.',
      sections: [
        { id: 1, title: 'Participants', content: 'Liste des participants à la réunion et leurs rôles.' },
        { id: 2, title: 'Objectifs du Projet', content: 'Définition des objectifs principaux et des attentes du client.' },
        { id: 3, title: 'Planning', content: 'Présentation du planning prévisionnel et des jalons clés.' }
      ],
      status: 'draft',
      createdDate: '2024-01-20'
    },
    {
      id: 3,
      title: 'Rapport Financier - StartupXYZ - Janvier 2024',
      type: 'financial',
      client: 'StartupXYZ',
      clientEmail: 'p.martin@startupxyz.fr',
      period: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      author: 'Marie Rousseau',
      summary: 'Analyse financière des activités de StartupXYZ pour le mois de janvier 2024.',
      sections: [
        { id: 1, title: 'Résumé Financier', content: 'Présentation des principaux indicateurs financiers du mois.' },
        { id: 2, title: 'Analyse des Revenus', content: 'Détail des sources de revenus et comparaison avec les prévisions.' },
        { id: 3, title: 'Analyse des Dépenses', content: 'Ventilation des dépenses par catégorie et identification des postes principaux.' }
      ],
      conclusion: 'Le mois de janvier a été marqué par une croissance significative des revenus, dépassant les prévisions de 15%.',
      status: 'published',
      createdDate: '2024-02-05',
      publishedDate: '2024-02-10'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const reportTypes = [
    { id: 'activity', name: 'Rapport d\'Activité' },
    { id: 'project', name: 'Rapport de Projet' },
    { id: 'financial', name: 'Rapport Financier' },
    { id: 'meeting', name: 'Compte-Rendu de Réunion' },
    { id: 'client', name: 'Rapport Client' },
    { id: 'custom', name: 'Rapport Personnalisé' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    const reportType = reportTypes.find(t => t.id === type);
    return reportType ? reportType.name : type;
  };

  const handleCreateReport = (reportData: Report) => {
    setReports([...reports, reportData]);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Rapport créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || report.type === filterType;
    const matchesStatus = !filterStatus || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Rapports</h2>
          <p className="text-slate-600">Créez et gérez vos rapports et comptes-rendus</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rapport
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Rapports</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reports.length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Publiés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {reports.filter(r => r.status === 'published').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Brouillons</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {reports.filter(r => r.status === 'draft').length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ce Mois</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {reports.filter(r => {
                  const date = new Date(r.createdDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Liste des Rapports</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Rapport</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Période</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Auteur</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{report.title}</p>
                      <p className="text-sm text-slate-500">Créé le {report.createdDate}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{getTypeText(report.type)}</td>
                  <td className="py-4 px-4 text-slate-700">{report.client}</td>
                  <td className="py-4 px-4 text-slate-700">
                    {report.period.startDate} - {report.period.endDate}
                  </td>
                  <td className="py-4 px-4 text-slate-700">{report.author}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center w-fit ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{getStatusText(report.status)}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Télécharger">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedReport.title}
                  </h3>
                  <p className="text-slate-600">{getTypeText(selectedReport.type)} • {selectedReport.client}</p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Report Header */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-1">Client</h4>
                        <p className="text-slate-700">{selectedReport.client}</p>
                        <p className="text-slate-700">{selectedReport.clientEmail}</p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-medium text-slate-900 mb-1">Période</h4>
                        <p className="text-slate-700">Du {selectedReport.period.startDate}</p>
                        <p className="text-slate-700">Au {selectedReport.period.endDate}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(selectedReport.status)}`}>
                        {getStatusIcon(selectedReport.status)}
                        <span className="ml-1">{getStatusText(selectedReport.status)}</span>
                      </span>
                      <p className="text-sm text-slate-600">
                        Auteur: {selectedReport.author}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Résumé Exécutif</h4>
                    <p className="text-slate-700">{selectedReport.summary}</p>
                  </div>

                  {/* Report Sections */}
                  <div className="space-y-4">
                    {selectedReport.sections.map((section) => (
                      <div key={section.id} className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-3">{section.title}</h4>
                        <p className="text-slate-700">{section.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Conclusion */}
                  {selectedReport.conclusion && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Conclusion</h4>
                      <p className="text-slate-700">{selectedReport.conclusion}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Informations</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Statut:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedReport.status)}`}>
                          {getStatusText(selectedReport.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="text-slate-900">{getTypeText(selectedReport.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Créé le:</span>
                        <span className="text-slate-900">{selectedReport.createdDate}</span>
                      </div>
                      {selectedReport.publishedDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Publié le:</span>
                          <span className="text-slate-900">{selectedReport.publishedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Actions Rapides</h4>
                    <div className="space-y-2">
                      <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </button>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger PDF
                      </button>
                      {selectedReport.status === 'draft' && (
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Publier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      <NewReportForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateReport}
      />
    </div>
  );
};

export default ReportsManagement;