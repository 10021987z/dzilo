import React, { useState } from 'react';
import { FileText, Search, Filter, Calendar, User, FileSignature, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SignatureRecord {
  id: number;
  documentId: number;
  documentTitle: string;
  documentType: string;
  signerName: string;
  signerEmail: string;
  signatureDate: string;
  expiryDate: string;
  status: 'completed' | 'pending' | 'expired' | 'rejected';
  viewedAt?: string;
  completedAt?: string;
  ipAddress?: string;
}

const SignatureHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SignatureRecord | null>(null);
  
  // Sample data
  const signatureRecords: SignatureRecord[] = [
    {
      id: 1,
      documentId: 101,
      documentTitle: 'Contrat de Prestation - TechCorp Solutions',
      documentType: 'Contrat',
      signerName: 'Jean Dupont',
      signerEmail: 'j.dupont@techcorp.com',
      signatureDate: '2024-01-26',
      expiryDate: '2024-02-26',
      status: 'completed',
      viewedAt: '2024-01-26 14:15',
      completedAt: '2024-01-26 14:30',
      ipAddress: '192.168.1.1'
    },
    {
      id: 2,
      documentId: 102,
      documentTitle: 'Accord de Partenariat - StartupXYZ',
      documentType: 'Partenariat',
      signerName: 'Pierre Martin',
      signerEmail: 'p.martin@startupxyz.fr',
      signatureDate: '2024-01-25',
      expiryDate: '2024-02-25',
      status: 'pending',
      viewedAt: '2024-01-25 10:20'
    },
    {
      id: 3,
      documentId: 103,
      documentTitle: 'Contrat de Maintenance - Digital Innovations',
      documentType: 'Maintenance',
      signerName: 'Marie Rousseau',
      signerEmail: 'm.rousseau@digital-innov.com',
      signatureDate: '2024-01-20',
      expiryDate: '2024-02-20',
      status: 'expired'
    },
    {
      id: 4,
      documentId: 104,
      documentTitle: 'Contrat de Confidentialité - ConsultCorp',
      documentType: 'NDA',
      signerName: 'Thomas Dubois',
      signerEmail: 't.dubois@consultcorp.com',
      signatureDate: '2024-01-22',
      expiryDate: '2024-02-22',
      status: 'rejected',
      viewedAt: '2024-01-22 16:45'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Signé';
      case 'pending': return 'En attente';
      case 'expired': return 'Expiré';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  };

  const filteredRecords = signatureRecords.filter(record => {
    const matchesSearch = 
      record.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.signerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.signerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || record.status === filterStatus;
    
    const matchesPeriod = !filterPeriod || (() => {
      const recordDate = new Date(record.signatureDate);
      const now = new Date();
      
      if (filterPeriod === 'today') {
        return recordDate.toDateString() === now.toDateString();
      } else if (filterPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return recordDate >= weekAgo;
      } else if (filterPeriod === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return recordDate >= monthAgo;
      }
      
      return true;
    })();
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Historique des Signatures</h2>
          <p className="text-slate-600">Suivez toutes les signatures électroniques de vos documents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par document, signataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="completed">Signé</option>
            <option value="pending">En attente</option>
            <option value="expired">Expiré</option>
            <option value="rejected">Refusé</option>
          </select>

          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les périodes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Signature Records */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Documents signés</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Document</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Signataire</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{record.documentTitle}</p>
                      <p className="text-sm text-slate-500">{record.documentType}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{record.signerName}</p>
                      <p className="text-sm text-slate-500">{record.signerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{record.signatureDate}</p>
                      <p className="text-sm text-slate-500">Expire le {record.expiryDate}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center w-fit ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1">{getStatusText(record.status)}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedRecord(record)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Télécharger"
                      >
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

      {/* Signature Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Détails de la signature
                  </h3>
                  <p className="text-slate-600">{selectedRecord.documentTitle}</p>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Informations du document</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">ID du document:</span>
                    <p className="text-slate-900">{selectedRecord.documentId}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Type:</span>
                    <p className="text-slate-900">{selectedRecord.documentType}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Date d'envoi:</span>
                    <p className="text-slate-900">{selectedRecord.signatureDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Date d'expiration:</span>
                    <p className="text-slate-900">{selectedRecord.expiryDate}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Informations du signataire</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Nom:</span>
                    <p className="text-slate-900">{selectedRecord.signerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Email:</span>
                    <p className="text-slate-900">{selectedRecord.signerEmail}</p>
                  </div>
                  {selectedRecord.ipAddress && (
                    <div>
                      <span className="text-slate-600">Adresse IP:</span>
                      <p className="text-slate-900">{selectedRecord.ipAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Historique d'activité</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Document envoyé:</span>
                    <span className="text-slate-900">{selectedRecord.signatureDate}</span>
                  </div>
                  {selectedRecord.viewedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Document consulté:</span>
                      <span className="text-slate-900">{selectedRecord.viewedAt}</span>
                    </div>
                  )}
                  {selectedRecord.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Document signé:</span>
                      <span className="text-slate-900">{selectedRecord.completedAt}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Statut actuel:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusIcon(selectedRecord.status)}
                      <span className="ml-1">{getStatusText(selectedRecord.status)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Fermer
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureHistory;