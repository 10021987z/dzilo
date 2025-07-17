import React, { useState } from 'react';
import { FileText, Plus, Edit, Eye, Download, Archive, Check, X, AlertTriangle, Send, FileSignature, Clock, Search, DollarSign, CheckCircle } from 'lucide-react';
import ContractActions from './ContractActions';
import ESignature from './ESignature';
import NewContractForm from './NewContractForm';

interface ContractManagement {
  id: number;
  title: string;
  client: string;
  clientEmail: string;
  contractType: string;
  value: number;
  status: 'draft' | 'sent' | 'signed' | 'active' | 'expired' | 'archived';
  createdDate: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
  description: string;
  signatureStatus?: 'unsigned' | 'pending' | 'completed';
  terms?: string[];
}

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<ContractManagement[]>([
    {
      id: 1,
      title: 'Contrat de Prestation - TechCorp Solutions',
      client: 'TechCorp Solutions',
      clientEmail: 'j.dupont@techcorp.com',
      contractType: 'Prestation de Services',
      value: 25000,
      status: 'active',
      createdDate: '2024-01-15',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      assignedTo: 'Sophie Martin',
      description: 'Développement d\'une application web sur mesure',
      signatureStatus: 'completed'
    },
    {
      id: 2,
      title: 'Contrat de Maintenance - Digital Innovations',
      client: 'Digital Innovations',
      clientEmail: 'm.rousseau@digital-innov.com',
      contractType: 'Maintenance',
      value: 12000,
      status: 'draft',
      createdDate: '2024-01-20',
      startDate: '2024-02-15',
      endDate: '2025-02-14',
      assignedTo: 'Thomas Dubois',
      description: 'Maintenance annuelle de la plateforme e-commerce',
      signatureStatus: 'unsigned'
    },
    {
      id: 3,
      title: 'Accord de Partenariat - StartupXYZ',
      client: 'StartupXYZ',
      clientEmail: 'p.martin@startupxyz.fr',
      contractType: 'Partenariat',
      value: 15000,
      status: 'sent',
      createdDate: '2024-01-25',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      assignedTo: 'Sophie Martin',
      description: 'Partenariat stratégique pour le développement commercial',
      signatureStatus: 'pending'
    }
  ]);

  const [selectedContract, setSelectedContract] = useState<ContractManagement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [contractToSign, setContractToSign] = useState<ContractManagement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [contractToEdit, setContractToEdit] = useState<ContractManagement | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'signed': return 'Signé';
      case 'active': return 'Actif';
      case 'expired': return 'Expiré';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getSignatureStatusColor = (status?: string) => {
    switch (status) {
      case 'unsigned': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignatureStatusText = (status?: string) => {
    switch (status) {
      case 'unsigned': return 'Non signé';
      case 'pending': return 'En attente';
      case 'completed': return 'Signé';
      default: return 'Non signé';
    }
  };

  const handleSendForSignature = (contract: ContractManagement) => {
    setContractToSign(contract);
    setShowSignatureModal(true);
  };

  const handleSignatureComplete = (signatureData: any) => {
    // Update contract status
    setContracts(contracts.map(contract => 
      contract.id === signatureData.documentId ? 
        { ...contract, status: 'signed', signatureStatus: 'completed' } : 
        contract
    ));
    
    setShowSignatureModal(false);
    setContractToSign(null);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Document signé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleCreateContract = (contractData: ContractManagement) => {
    setContracts([...contracts, contractData]);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Contrat créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleEditContract = (contract: ContractManagement) => {
    setContractToEdit(contract);
    setShowEditModal(true);
  };

  const handleUpdateContract = (updatedContract: ContractManagement) => {
    setContracts(contracts.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    ));
    
    setShowEditModal(false);
    setContractToEdit(null);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Contrat mis à jour avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Contrats</h2>
          <p className="text-slate-600">Créez, gérez et suivez vos contrats et documents légaux</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Contrat
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Contrats</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{contracts.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Contrats Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {contracts.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Attente</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {contracts.filter(c => c.status === 'draft' || c.status === 'sent').length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Valeur Totale</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                €{contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Liste des Contrats</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="signed">Signé</option>
              <option value="active">Actif</option>
              <option value="expired">Expiré</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Contrat</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Valeur</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Signature</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date de début</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{contract.title}</p>
                      <p className="text-sm text-slate-500">Créé le {contract.createdDate}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{contract.client}</td>
                  <td className="py-4 px-4 text-slate-700">{contract.contractType}</td>
                  <td className="py-4 px-4 font-medium text-slate-900">
                    €{contract.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getSignatureStatusColor(contract.signatureStatus)}`}>
                      {getSignatureStatusText(contract.signatureStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{contract.startDate}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedContract(contract)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditContract(contract)}
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSendForSignature(contract)}
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Signer"
                      >
                        <FileSignature className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors" title="Télécharger">
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

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedContract.title}
                  </h3>
                  <p className="text-slate-600">{selectedContract.contractType} • {selectedContract.client}</p>
                </div>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contract Details */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Détails du Contrat</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Client:</span>
                        <p className="text-slate-900">{selectedContract.client}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Email:</span>
                        <p className="text-slate-900">{selectedContract.clientEmail}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Type de contrat:</span>
                        <p className="text-slate-900">{selectedContract.contractType}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Valeur:</span>
                        <p className="text-slate-900">€{selectedContract.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Date de début:</span>
                        <p className="text-slate-900">{selectedContract.startDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Date de fin:</span>
                        <p className="text-slate-900">{selectedContract.endDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Description</h4>
                    <p className="text-slate-700">{selectedContract.description}</p>
                  </div>

                  {/* Terms and Conditions */}
                  {selectedContract.terms && selectedContract.terms.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Termes et Conditions</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        {selectedContract.terms.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Signature Status */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Statut de Signature</h4>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSignatureStatusColor(selectedContract.signatureStatus)}`}>
                        {getSignatureStatusText(selectedContract.signatureStatus)}
                      </span>
                      {selectedContract.signatureStatus !== 'completed' && (
                        <button 
                          onClick={() => handleSendForSignature(selectedContract)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Envoyer pour signature
                        </button>
                      )}
                    </div>
                    {selectedContract.signatureStatus === 'completed' && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-medium text-green-900">Document signé</p>
                            <p className="text-sm text-green-700">Signé le 26/01/2024 à 14:30</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Statut</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Statut actuel:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedContract.status)}`}>
                          {getStatusText(selectedContract.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Assigné à:</span>
                        <span className="text-slate-900">{selectedContract.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Créé le:</span>
                        <span className="text-slate-900">{selectedContract.createdDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Actions Rapides</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleEditContract(selectedContract)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleSendForSignature(selectedContract)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <FileSignature className="w-4 h-4 mr-2" />
                        Signer
                      </button>
                      <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Fermer
                </button>
                <ContractActions
                  contractId={selectedContract.id}
                  contractTitle={selectedContract.title}
                  contractStatus={selectedContract.status}
                  onEdit={() => handleEditContract(selectedContract)}
                  onSendForSignature={() => handleSendForSignature(selectedContract)}
                  onDownload={() => {}}
                  onArchive={() => {}}
                  className="flex-row"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-Signature Modal */}
      {showSignatureModal && contractToSign && (
        <ESignature
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          documentId={contractToSign.id}
          documentTitle={contractToSign.title}
          documentType={contractToSign.contractType}
          recipientEmail={contractToSign.clientEmail}
          recipientName={contractToSign.client}
          onSignatureComplete={handleSignatureComplete}
        />
      )}

      {/* New Contract Modal */}
      <NewContractForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateContract}
      />

      {/* Edit Contract Modal */}
      {showEditModal && contractToEdit && (
        <NewContractForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setContractToEdit(null);
          }}
          onSave={handleUpdateContract}
          initialData={contractToEdit}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ContractManagement;