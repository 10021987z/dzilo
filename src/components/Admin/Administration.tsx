import React, { useState } from 'react';
import { Settings, FileText, Receipt, ClipboardList, Users, BarChart3, Shield, Database, Link, UserCheck, Zap, Copy, Workflow, FileSignature } from 'lucide-react';
import ContractManagement from './ContractManagement';
import InvoiceManagement from './InvoiceManagement';
import ReportsManagement from './ReportsManagement';
import AdminUserManagement from './AdminUserManagement';
import TemplateLibrary from './TemplateLibrary';
import DocumentGenerator from './DocumentGenerator';
import WorkflowManagement from './WorkflowManagement';
import SignatureHistory from './SignatureHistory';
import NewContractForm from './NewContractForm';
import NewInvoiceForm from './NewInvoiceForm';
import NewReportForm from './NewReportForm';
import NewUserForm from './NewUserForm';

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);

  const tabs = [
    { id: 'contracts', name: 'Gestion des Contrats', icon: FileText },
    { id: 'invoicing', name: 'Facturation', icon: Receipt },
    { id: 'reports', name: 'Comptes Rendus', icon: ClipboardList },
    { id: 'admin-users', name: 'Utilisateurs Admin', icon: UserCheck },
    { id: 'templates', name: 'Bibliothèque de Modèles', icon: Copy },
    { id: 'documents', name: 'Générateur de Documents', icon: FileText },
    { id: 'integrations', name: 'Intégrations CRM', icon: Link },
    { id: 'workflows', name: 'Workflows', icon: Workflow },
    { id: 'signatures', name: 'Signatures', icon: FileSignature },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contracts':
        return <ContractManagement />;
      case 'invoicing':
        return <InvoiceManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'admin-users':
        return <AdminUserManagement />;
      case 'templates':
        return <TemplateLibrary />;
      case 'documents':
        return <DocumentGenerator />;
      case 'workflows':
        return <WorkflowManagement />;
      case 'signatures':
        return <SignatureHistory />;
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
              <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Paramètres Système
              </h2>
              <p className="text-slate-600">
                Configuration avancée du système - À implémenter
              </p>
            </div>
          </div>
        );
      default:
        return <ContractManagement />;
    }
  };

  const handleNewContractSave = (contractData: any) => {
    // This would typically update your state or make an API call
    console.log('New contract created:', contractData);
    setShowNewContractModal(false);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Contrat créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleNewInvoiceSave = (invoiceData: any) => {
    console.log('New invoice created:', invoiceData);
    setShowNewInvoiceModal(false);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Facture créée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleNewReportSave = (reportData: any) => {
    console.log('New report created:', reportData);
    setShowNewReportModal(false);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Rapport créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleNewUserSave = (userData: any) => {
    console.log('New user created:', userData);
    setShowNewUserModal(false);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Utilisateur créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleNewAdminSave = (adminData: any) => {
    console.log('New admin created:', adminData);
    setShowNewAdminModal(false);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Administrateur créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interface de Gestion d'Accueil</h1>
              <p className="text-slate-600">Centralisez toutes vos tâches administratives cruciales</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Système Opérationnel
              </div>
              <button 
                onClick={() => setShowQuickActions(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <Zap className="w-4 h-4 mr-2" />
                Actions Rapides
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>

      {/* New Contract Modal */}
      <NewContractForm
        isOpen={showNewContractModal}
        onClose={() => setShowNewContractModal(false)}
        onSave={handleNewContractSave}
      />

      {/* New Invoice Modal */}
      <NewInvoiceForm
        isOpen={showNewInvoiceModal}
        onClose={() => setShowNewInvoiceModal(false)}
        onSave={handleNewInvoiceSave}
      />

      {/* New Report Modal */}
      <NewReportForm
        isOpen={showNewReportModal}
        onClose={() => setShowNewReportModal(false)}
        onSave={handleNewReportSave}
      />

      {/* New User Modal */}
      <NewUserForm
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onSave={handleNewUserSave}
        isAdmin={false}
      />

      {/* New Admin Modal */}
      <NewUserForm
        isOpen={showNewAdminModal}
        onClose={() => setShowNewAdminModal(false)}
        onSave={handleNewAdminSave}
        isAdmin={true}
      />
    </div>
  );
};

export default Administration;