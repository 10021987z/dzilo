import React, { useState } from 'react';
import { Receipt, User, Building2, Calendar, DollarSign, Save, X, Plus, Trash2, Check, AlertCircle, Calculator } from 'lucide-react';

interface NewInvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoiceData: any) => void;
}

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

const NewInvoiceForm: React.FC<NewInvoiceFormProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    client: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: '30',
    notes: '',
    status: 'draft',
    taxRate: 20
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, description: '', quantity: 1, unitPrice: 0, taxRate: 20, total: 0 }
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Calculate due date based on issue date and payment terms
  const calculateDueDate = (issueDate: string, terms: string) => {
    if (!issueDate) return '';
    
    const date = new Date(issueDate);
    date.setDate(date.getDate() + parseInt(terms));
    return date.toISOString().split('T')[0];
  };

  // Update due date when issue date or payment terms change
  React.useEffect(() => {
    if (formData.issueDate && formData.paymentTerms) {
      const newDueDate = calculateDueDate(formData.issueDate, formData.paymentTerms);
      setFormData(prev => ({ ...prev, dueDate: newDueDate }));
    }
  }, [formData.issueDate, formData.paymentTerms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate total when quantity or unit price changes
          if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
            const quantity = field === 'quantity' ? Number(value) : item.quantity;
            const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
            const taxRate = field === 'taxRate' ? Number(value) : item.taxRate;
            
            const subtotal = quantity * unitPrice;
            const tax = subtotal * (taxRate / 100);
            updatedItem.total = subtotal + tax;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addInvoiceItem = () => {
    const newId = Math.max(0, ...invoiceItems.map(item => item.id)) + 1;
    setInvoiceItems([
      ...invoiceItems,
      { id: newId, description: '', quantity: 1, unitPrice: 0, taxRate: formData.taxRate, total: 0 }
    ]);
  };

  const removeInvoiceItem = (id: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter(item => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTaxTotal = () => {
    return invoiceItems.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + (subtotal * (item.taxRate / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxTotal();
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.client) newErrors.client = 'Le client est requis';
    if (!formData.clientEmail) newErrors.clientEmail = 'L\'email du client est requis';
    if (!formData.issueDate) newErrors.issueDate = 'La date d\'émission est requise';
    if (!formData.dueDate) newErrors.dueDate = 'La date d\'échéance est requise';
    
    // Validate invoice items
    let hasItemErrors = false;
    invoiceItems.forEach((item, index) => {
      if (!item.description) {
        newErrors[`item_${index}_description`] = `La description de l'article ${index + 1} est requise`;
        hasItemErrors = true;
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = `La quantité de l'article ${index + 1} doit être supérieure à 0`;
        hasItemErrors = true;
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = `Le prix unitaire de l'article ${index + 1} doit être supérieur à 0`;
        hasItemErrors = true;
      }
    });
    
    if (hasItemErrors) {
      newErrors.items = 'Veuillez corriger les erreurs dans les articles de la facture';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare invoice data
      const invoiceData = {
        ...formData,
        items: invoiceItems,
        subtotal: calculateSubtotal(),
        taxTotal: calculateTaxTotal(),
        total: calculateTotal(),
        createdDate: new Date().toISOString().split('T')[0],
        id: Date.now()
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(invoiceData);
          setShowSuccessMessage(false);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nouvelle Facture</h1>
                <p className="text-white/80">Créez une nouvelle facture pour vos clients</p>
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

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showSuccessMessage ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Facture Créée avec Succès !</h2>
              <p className="text-slate-600 mb-6">
                La facture a été créée et est prête à être envoyée au client.
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-green-600 border-green-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Création en cours...</h2>
              <p className="text-slate-600">Nous créons votre facture</p>
            </div>
          ) : (
            <>
              {/* Errors */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-red-900">Veuillez corriger les erreurs suivantes :</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Numéro de Facture
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date d'Émission <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.issueDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Conditions de Paiement
                    </label>
                    <select
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="0">Paiement immédiat</option>
                      <option value="15">15 jours</option>
                      <option value="30">30 jours</option>
                      <option value="45">45 jours</option>
                      <option value="60">60 jours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date d'Échéance <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.dueDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-50`}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Informations Client</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          name="client"
                          value={formData.client}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.client ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                          placeholder="Nom du client ou de l'entreprise"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email du Client <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.clientEmail ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        placeholder="client@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Adresse du Client
                      </label>
                      <textarea
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Adresse complète du client"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Articles de la Facture</h2>
                    <button
                      type="button"
                      onClick={addInvoiceItem}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un Article
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700 w-24">Quantité</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700 w-32">Prix Unitaire</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700 w-24">TVA (%)</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700 w-32">Total</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700 w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item, index) => (
                          <tr key={item.id} className="border-b border-slate-200">
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors[`item_${index}_description`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                placeholder="Description de l'article"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                                min="1"
                                step="1"
                                className={`w-full px-3 py-2 border ${errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))}
                                min="0"
                                step="0.01"
                                className={`w-full px-3 py-2 border ${errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={item.taxRate}
                                onChange={(e) => handleItemChange(item.id, 'taxRate', parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">
                              {formatCurrency(item.total)}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => removeInvoiceItem(item.id)}
                                disabled={invoiceItems.length === 1}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-6 flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Sous-total:</span>
                        <span className="font-medium text-slate-900">{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">TVA:</span>
                        <span className="font-medium text-slate-900">{formatCurrency(calculateTaxTotal())}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-base font-medium text-slate-700">Total:</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Notes additionnelles pour le client..."
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Actions */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Calculator className="w-5 h-5 text-slate-500 mr-2" />
                <span className="text-sm text-slate-600">Total: {formatCurrency(calculateTotal())}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Créer la Facture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewInvoiceForm;