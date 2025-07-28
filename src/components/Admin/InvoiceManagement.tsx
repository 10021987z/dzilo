import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Share2, Users, Calendar, Clock, User, Building2, Phone, Mail, FileText, BarChart3, Filter, Search, Linkedin, Upload, Download, Trash2, X, Calculator, Printer, Check, AlertCircle, DollarSign, Receipt, Settings, Apple as WhatsApp, CreditCard, QrCode, Save, Image, ChevronDown } from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';
import NewInvoiceForm from './NewInvoiceForm';
import CompanySettings from '../Settings/CompanySettings';

interface Invoice {
  id: number;
  invoiceNumber: string;
  client: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'unpaid' | 'partially_paid' | 'refunded';
  items: Array<{
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
  }>;
  subtotal: number;
  taxTotal: number;
  total: number;
  notes?: string;
  createdDate: string;
  paymentDate?: string;
  paymentMethod?: string;
}

const InvoiceManagement: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<number | null>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'dziljo SaaS',
    address: '123 Rue de la Tech, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@dziljo.com',
    website: 'www.dziljo.com',
    siret: '12345678901234',
    vatNumber: 'FR 12 345 678 901'
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2024-0001',
      client: 'TechCorp Solutions',
      clientEmail: 'j.dupont@techcorp.com',
      clientAddress: '123 Rue de la Tech, 75001 Paris',
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      status: 'paid',
      items: [
        { id: 1, description: 'Développement application web', quantity: 1, unitPrice: 15000, taxRate: 20, total: 18000 },
        { id: 2, description: 'Maintenance mensuelle', quantity: 2, unitPrice: 1500, taxRate: 20, total: 3600 }
      ],
      subtotal: 18000,
      taxTotal: 3600,
      total: 21600,
      notes: 'Paiement par virement bancaire',
      createdDate: '2024-01-15',
      paymentDate: '2024-01-30',
      paymentMethod: 'Virement bancaire'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-0002',
      client: 'Digital Innovations',
      clientEmail: 'm.rousseau@digital-innov.com',
      clientAddress: '45 Avenue du Digital, 69001 Lyon',
      issueDate: '2024-01-20',
      dueDate: '2024-02-19',
      status: 'sent',
      items: [
        { id: 1, description: 'Refonte site web', quantity: 1, unitPrice: 8000, taxRate: 20, total: 9600 },
        { id: 2, description: 'Optimisation SEO', quantity: 1, unitPrice: 2000, taxRate: 20, total: 2400 }
      ],
      subtotal: 10000,
      taxTotal: 2000,
      total: 12000,
      createdDate: '2024-01-20'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-0003',
      client: 'StartupXYZ',
      clientEmail: 'p.martin@startupxyz.fr',
      issueDate: '2024-01-25',
      dueDate: '2024-02-24',
      status: 'draft',
      items: [
        { id: 1, description: 'Consultation stratégique', quantity: 5, unitPrice: 800, taxRate: 20, total: 4800 }
      ],
      subtotal: 4000,
      taxTotal: 800,
      total: 4800,
      notes: 'Brouillon - à finaliser',
      createdDate: '2024-01-25'
    }
  ]);

  // Load company info from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings');
    const savedLogo = localStorage.getItem('companyLogo');
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setCompanyInfo({
          name: settings.companyName || companyInfo.name,
          address: `${settings.address || ''}, ${settings.postalCode || ''} ${settings.city || ''}`,
          phone: settings.phone || companyInfo.phone,
          email: settings.email || companyInfo.email,
          website: settings.website || companyInfo.website,
          siret: settings.registrationNumber || companyInfo.siret,
          vatNumber: settings.vatNumber || companyInfo.vatNumber
        });
      } catch (e) {
        console.error('Error parsing company settings:', e);
      }
    }
    
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-slate-100 text-slate-800';
      case 'unpaid': return 'bg-yellow-100 text-yellow-800';
      case 'partially_paid': return 'bg-orange-100 text-orange-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyée';
      case 'paid': return 'Payée';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      case 'unpaid': return 'Impayée';
      case 'partially_paid': return 'Partiellement payée';
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'paid': return <Check className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'unpaid': return <AlertCircle className="w-4 h-4" />;
      case 'partially_paid': return <DollarSign className="w-4 h-4" />;
      case 'refunded': return <CreditCard className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  const handleCreateInvoice = (invoiceData: Invoice) => {
    setInvoices([...invoices, invoiceData]);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Facture créée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleChangeStatus = (invoiceId: number, newStatus: Invoice['status']) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === invoiceId) {
        const updatedInvoice = { ...invoice, status: newStatus };
        
        // Add payment date if status is changed to paid
        if (newStatus === 'paid' && !invoice.paymentDate) {
          updatedInvoice.paymentDate = new Date().toISOString().split('T')[0];
          updatedInvoice.paymentMethod = 'Virement bancaire';
        }
        
        return updatedInvoice;
      }
      return invoice;
    }));
    
    setShowStatusDropdown(null);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = `✅ Statut de la facture mis à jour : ${getStatusText(newStatus)}`;
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // Create invoice data for PDF generation
    const invoiceData = {
      invoice: {
        number: invoice.invoiceNumber,
        date: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: getStatusText(invoice.status)
      },
      client: {
        name: invoice.client,
        email: invoice.clientEmail,
        address: invoice.clientAddress || '',
        phone: ''
      },
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        total: item.total
      })),
      totals: {
        subtotal: invoice.subtotal,
        taxTotal: invoice.taxTotal,
        total: invoice.total
      },
      notes: invoice.notes,
      paymentInfo: invoice.paymentMethod ? {
        method: invoice.paymentMethod,
        details: 'Veuillez inclure le numéro de facture dans la référence de votre paiement.'
      } : undefined,
      company: {
        name: companyInfo.name,
        address: companyInfo.address,
        siret: companyInfo.siret,
        logo: companyLogo || undefined,
        phone: companyInfo.phone,
        email: companyInfo.email,
        website: companyInfo.website,
        vatNumber: companyInfo.vatNumber
      }
    };
    
    // Generate and download PDF
    PDFGenerator.generateInvoicePDF(invoiceData);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ PDF téléchargé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // Create a temporary iframe to print the invoice
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    document.body.appendChild(printFrame);
    
    // Create the content for the iframe
    const printDocument = printFrame.contentWindow?.document;
    if (printDocument) {
      printDocument.open();
      
      // Generate HTML content for the invoice
      printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Facture ${invoice.invoiceNumber}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f8fafc;
              color: #334155;
            }
            .invoice-container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 800px;
              margin: 0 auto;
            }
            .invoice-header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 40px; 
              padding-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
            }
            .company-info { max-width: 50%; }
            .logo { max-width: 120px; max-height: 60px; border-radius: 4px; }
            .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #1e293b; }
            .invoice-details, .client-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; border-radius: 8px; overflow: hidden; }
            th { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-align: left; padding: 15px; font-weight: 600; }
            td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; }
            tbody tr:nth-child(even) { background-color: #f8fafc; }
            .text-right { text-align: right; }
            .totals { 
              margin-left: auto; 
              width: 300px; 
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .total-row { 
              font-weight: bold; 
              font-size: 16px;
              background: #3b82f6 !important;
              color: white;
            }
            .notes { 
              margin-top: 30px; 
              padding: 20px; 
              background: #fef3c7; 
              border-radius: 8px; 
              border-left: 4px solid #f59e0b;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              font-size: 12px; 
              color: #64748b; 
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            .section-title {
              font-size: 16px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid #3b82f6;
              display: inline-block;
            }
            .info-box {
              background: #f1f5f9;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-info">
              ${companyLogo ? `<img src="${companyLogo}" alt="Logo" class="logo" />` : ''}
              <h2 style="margin: 10px 0; color: #1e293b;">${companyInfo.name}</h2>
              <div style="color: #64748b; line-height: 1.5;">
                <p style="margin: 2px 0;">${companyInfo.address}</p>
                <p style="margin: 2px 0;">Tél: ${companyInfo.phone}</p>
                <p style="margin: 2px 0;">Email: ${companyInfo.email}</p>
                <p style="margin: 2px 0;">SIRET: ${companyInfo.siret}</p>
                <p style="margin: 2px 0;">TVA: ${companyInfo.vatNumber}</p>
              </div>
            </div>
            <div>
              <div class="invoice-title">FACTURE</div>
              <div style="font-size: 16px; font-weight: 600; color: #3b82f6; margin: 5px 0;">N° ${invoice.invoiceNumber}</div>
              <div class="info-box">
                <div style="margin: 3px 0;"><strong>Date:</strong> ${invoice.issueDate}</div>
                <div style="margin: 3px 0;"><strong>Échéance:</strong> ${invoice.dueDate}</div>
                <div style="margin: 3px 0;"><strong>Statut:</strong> ${getStatusText(invoice.status)}</div>
              </div>
            </div>
          </div>
          
          <div class="client-details info-box">
            <div class="section-title">Facturer à</div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 5px;">${invoice.client}</div>
            ${invoice.clientAddress ? `<div style="margin: 2px 0;">${invoice.clientAddress}</div>` : ''}
            <div style="margin: 2px 0;">Email: ${invoice.clientEmail}</div>
          </div>
          
          <div class="section-title">Détail des Prestations</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>TVA</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td style="text-align: center;">${item.taxRate}%</td>
                  <td class="text-right">${formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <table style="margin: 0;">
              <tr>
                <td>Sous-total:</td>
                <td class="text-right">${formatCurrency(invoice.subtotal)}</td>
              </tr>
              <tr>
                <td>TVA:</td>
                <td class="text-right">${formatCurrency(invoice.taxTotal)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>TOTAL:</strong></td>
                <td class="text-right">${formatCurrency(invoice.total)}</td>
              </tr>
            </table>
          </div>
          
          ${invoice.notes ? `
            <div class="notes">
              <div class="section-title">Notes</div>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p><strong>${companyInfo.name}</strong></p>
            <p>${companyInfo.address} - SIRET: ${companyInfo.siret}</p>
          </div>
          </div>
        </body>
        </html>
      `);
      
      printDocument.close();
      
      // Print the document
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      
      // Remove the iframe after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Impression en cours...';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleCompanySettingsSave = (settings: any) => {
    setCompanyInfo({
      name: settings.companyName || companyInfo.name,
      address: `${settings.address || ''}, ${settings.postalCode || ''} ${settings.city || ''}`,
      phone: settings.phone || companyInfo.phone,
      email: settings.email || companyInfo.email,
      website: settings.website || companyInfo.website,
      siret: settings.registrationNumber || companyInfo.siret,
      vatNumber: settings.vatNumber || companyInfo.vatNumber
    });
    
    if (settings.logo) {
      setCompanyLogo(settings.logo);
    }
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Informations de l\'entreprise mises à jour !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {showSettings ? (
        <Settings module="invoicing" />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Gestion de la Facturation</h2>
              <p className="text-slate-600">Créez, gérez et suivez vos factures et paiements</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowCompanySettings(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Infos Entreprise
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Facture
              </button>
            </div>
          </div>

          {/* Company Info Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{companyInfo.name}</h3>
                  <p className="text-sm text-slate-600">{companyInfo.address}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {companyInfo.phone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {companyInfo.email}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      SIRET: {companyInfo.siret}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowCompanySettings(true)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center"
              >
                <Edit className="w-3 h-3 mr-1" />
                Modifier
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Factures Totales</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{invoices.length}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">En Attente</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {invoices.filter(inv => inv.status === 'sent' || inv.status === 'unpaid').length}
                  </p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Payées</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {invoices.filter(inv => inv.status === 'paid').length}
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
                  <p className="text-sm font-medium text-slate-600">Montant Total</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total, 0))}
                  </p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Liste des Factures</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="sent">Envoyée</option>
                  <option value="paid">Payée</option>
                  <option value="unpaid">Impayée</option>
                  <option value="partially_paid">Partiellement payée</option>
                  <option value="overdue">En retard</option>
                  <option value="cancelled">Annulée</option>
                  <option value="refunded">Remboursée</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Facture</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Échéance</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Montant</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-slate-500">Créée le {invoice.createdDate}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700">{invoice.client}</td>
                      <td className="py-4 px-4 text-slate-700">{invoice.issueDate}</td>
                      <td className="py-4 px-4 text-slate-700">{invoice.dueDate}</td>
                      <td className="py-4 px-4 font-medium text-slate-900">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-4 px-4 relative">
                        <div 
                          onClick={() => setShowStatusDropdown(showStatusDropdown === invoice.id ? null : invoice.id)}
                          className={`px-2 py-1 text-xs font-medium rounded flex items-center w-fit cursor-pointer ${getStatusColor(invoice.status)}`}
                        >
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{getStatusText(invoice.status)}</span>
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </div>
                        
                        {showStatusDropdown === invoice.id && (
                          <div className="absolute z-10 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-48">
                            <div className="text-xs font-medium text-slate-500 px-3 py-1 border-b border-slate-100">
                              Changer le statut
                            </div>
                            {[
                              { value: 'draft', label: 'Brouillon' },
                              { value: 'sent', label: 'Envoyée' },
                              { value: 'paid', label: 'Payée' },
                              { value: 'unpaid', label: 'Impayée' },
                              { value: 'partially_paid', label: 'Partiellement payée' },
                              { value: 'overdue', label: 'En retard' },
                              { value: 'cancelled', label: 'Annulée' },
                              { value: 'refunded', label: 'Remboursée' }
                            ].map((status) => (
                              <button
                                key={status.value}
                                onClick={() => handleChangeStatus(invoice.id, status.value as Invoice['status'])}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center ${
                                  invoice.status === status.value ? 'bg-slate-50 font-medium' : ''
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status.value)}`}></span>
                                {status.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePrintInvoice(invoice)}
                            className="p-2 text-slate-400 hover:text-purple-600 transition-colors" 
                            title="Imprimer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(invoice)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                            title="Télécharger PDF"
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

          {/* Invoice Details Modal */}
          {selectedInvoice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        Facture {selectedInvoice.invoiceNumber}
                      </h3>
                      <p className="text-slate-600">{selectedInvoice.client}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedInvoice(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Invoice Header */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-1">Facturé à</h4>
                            <p className="text-slate-700">{selectedInvoice.client}</p>
                            <p className="text-slate-700">{selectedInvoice.clientEmail}</p>
                            {selectedInvoice.clientAddress && (
                              <p className="text-slate-700">{selectedInvoice.clientAddress}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <h4 className="font-medium text-slate-900 mb-1">Facture #{selectedInvoice.invoiceNumber}</h4>
                            <p className="text-slate-700">Date d'émission: {selectedInvoice.issueDate}</p>
                            <p className="text-slate-700">Date d'échéance: {selectedInvoice.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="relative">
                            <div 
                              onClick={() => setShowStatusDropdown(showStatusDropdown === -1 ? null : -1)}
                              className={`px-2 py-1 text-xs font-medium rounded flex items-center cursor-pointer ${getStatusColor(selectedInvoice.status)}`}
                            >
                              {getStatusIcon(selectedInvoice.status)}
                              <span className="ml-1">{getStatusText(selectedInvoice.status)}</span>
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </div>
                            
                            {showStatusDropdown === -1 && (
                              <div className="absolute z-10 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-48">
                                <div className="text-xs font-medium text-slate-500 px-3 py-1 border-b border-slate-100">
                                  Changer le statut
                                </div>
                                {[
                                  { value: 'draft', label: 'Brouillon' },
                                  { value: 'sent', label: 'Envoyée' },
                                  { value: 'paid', label: 'Payée' },
                                  { value: 'unpaid', label: 'Impayée' },
                                  { value: 'partially_paid', label: 'Partiellement payée' },
                                  { value: 'overdue', label: 'En retard' },
                                  { value: 'cancelled', label: 'Annulée' },
                                  { value: 'refunded', label: 'Remboursée' }
                                ].map((status) => (
                                  <button
                                    key={status.value}
                                    onClick={() => {
                                      handleChangeStatus(selectedInvoice.id, status.value as Invoice['status']);
                                      setSelectedInvoice(prev => prev ? {...prev, status: status.value as Invoice['status']} : null);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center ${
                                      selectedInvoice.status === status.value ? 'bg-slate-50 font-medium' : ''
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status.value)}`}></span>
                                    {status.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {selectedInvoice.paymentDate && (
                            <p className="text-sm text-green-600">
                              Payée le {selectedInvoice.paymentDate} via {selectedInvoice.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Invoice Items */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-3">Articles</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="text-left py-2 px-3 text-xs font-medium text-slate-700">Description</th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-slate-700">Quantité</th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-slate-700">Prix Unitaire</th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-slate-700">TVA</th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-slate-700">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedInvoice.items.map((item) => (
                                <tr key={item.id} className="border-b border-slate-200">
                                  <td className="py-3 px-3 text-sm text-slate-700">{item.description}</td>
                                  <td className="py-3 px-3 text-sm text-slate-700 text-right">{item.quantity}</td>
                                  <td className="py-3 px-3 text-sm text-slate-700 text-right">{formatCurrency(item.unitPrice)}</td>
                                  <td className="py-3 px-3 text-sm text-slate-700 text-right">{item.taxRate}%</td>
                                  <td className="py-3 px-3 text-sm font-medium text-slate-900 text-right">{formatCurrency(item.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Invoice Totals */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-end">
                          <div className="w-64 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Sous-total:</span>
                              <span className="font-medium text-slate-900">{formatCurrency(selectedInvoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">TVA:</span>
                              <span className="font-medium text-slate-900">{formatCurrency(selectedInvoice.taxTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                              <span className="text-base font-medium text-slate-700">Total:</span>
                              <span className="text-lg font-bold text-green-600">{formatCurrency(selectedInvoice.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedInvoice.notes && (
                        <div className="bg-slate-50 rounded-lg p-4">
                          <h4 className="font-medium text-slate-900 mb-3">Notes</h4>
                          <p className="text-sm text-slate-700">{selectedInvoice.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Quick Actions */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-3">Actions Rapides</h4>
                        <div className="space-y-2">
                          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </button>
                          <button 
                            onClick={() => handlePrintInvoice(selectedInvoice)}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                          >
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimer
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(selectedInvoice)}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger PDF
                          </button>
                          {selectedInvoice.status === 'draft' && (
                            <button 
                              onClick={() => {
                                handleChangeStatus(selectedInvoice.id, 'sent');
                                setSelectedInvoice(prev => prev ? {...prev, status: 'sent'} : null);
                              }}
                              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Envoyer
                            </button>
                          )}
                          {selectedInvoice.status === 'sent' && (
                            <button 
                              onClick={() => {
                                handleChangeStatus(selectedInvoice.id, 'paid');
                                setSelectedInvoice(prev => prev ? {
                                  ...prev, 
                                  status: 'paid',
                                  paymentDate: new Date().toISOString().split('T')[0],
                                  paymentMethod: 'Virement bancaire'
                                } : null);
                              }}
                              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Marquer comme payée
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Payment Options */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-3">Options de Paiement</h4>
                        <div className="space-y-3">
                          <button className="w-full bg-white border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                              <span>Carte Bancaire</span>
                            </div>
                            <span className="text-xs text-slate-500">Instantané</span>
                          </button>
                          
                          <button className="w-full bg-white border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2 text-slate-600" />
                              <span>Virement Bancaire</span>
                            </div>
                            <span className="text-xs text-slate-500">2-3 jours</span>
                          </button>
                          
                          <button className="w-full bg-white border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center">
                              <WhatsApp className="w-4 h-4 mr-2 text-green-600" />
                              <span>WhatsApp Pay</span>
                            </div>
                            <span className="text-xs text-slate-500">Instantané</span>
                          </button>
                        </div>
                      </div>

                      {/* QR Code for WhatsApp Pay */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <QrCode className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-900 mb-2">Scannez le code QR</h4>
                            <p className="text-sm text-green-700">
                              Ouvrez WhatsApp sur votre téléphone, allez dans Paramètres &gt; WhatsApp Web et scannez le code QR ci-dessous.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 bg-white p-4 rounded-lg flex items-center justify-center">
                          <div className="w-32 h-32 bg-slate-100 flex items-center justify-center">
                            <QrCode className="w-24 h-24 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      {selectedInvoice.status === 'paid' && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="font-medium text-green-900 mb-3">Informations de Paiement</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-800">Date de paiement:</span>
                              <span className="text-green-900 font-medium">{selectedInvoice.paymentDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-800">Méthode:</span>
                              <span className="text-green-900 font-medium">{selectedInvoice.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-800">Montant:</span>
                              <span className="text-green-900 font-medium">{formatCurrency(selectedInvoice.total)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Invoice Modal */}
          <NewInvoiceForm
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateInvoice}
          />

          {/* Company Settings Modal */}
          <CompanySettings
            isOpen={showCompanySettings}
            onClose={() => setShowCompanySettings(false)}
            onSave={handleCompanySettingsSave}
          />
        </>
      )}
    </div>
  );
};

export default InvoiceManagement;