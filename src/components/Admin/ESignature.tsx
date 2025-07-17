import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Check, X, Save, Upload, Link, Copy, Send, Edit, Trash2, User, Calendar, Clock, Shield, Eye, EyeOff, Lock, Unlock, FileSignature } from 'lucide-react';
import ESignatureCanvas from './ESignatureCanvas';

interface ESignatureProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: number;
  documentTitle?: string;
  documentType?: string;
  recipientEmail?: string;
  recipientName?: string;
  onSignatureComplete?: (signatureData: any) => void;
}

const ESignature: React.FC<ESignatureProps> = ({
  isOpen,
  onClose,
  documentId,
  documentTitle = "Document sans titre",
  documentType = "Contrat",
  recipientEmail = "",
  recipientName = "",
  onSignatureComplete
}) => {
  const [activeTab, setActiveTab] = useState('prepare');
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureFont, setSignatureFont] = useState('Pacifico');
  const [recipients, setRecipients] = useState<Array<{id: number, name: string, email: string, role: string}>>([
    { id: 1, name: recipientName || 'Client', email: recipientEmail || '', role: 'signer' },
    { id: 2, name: 'Vous', email: 's.martin@dziljo.com', role: 'sender' }
  ]);
  const [documentStatus, setDocumentStatus] = useState<'draft' | 'sent' | 'viewed' | 'signed' | 'completed'>('draft');
  const [signaturePositions, setSignaturePositions] = useState<Array<{id: number, x: number, y: number, width: number, height: number, recipientId: number}>>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [expiryDate, setExpiryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  
  const signatureBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSignatureSave = (data: string) => {
    setSignatureData(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedSignature(event.target.result as string);
        setSignatureData(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const addRecipient = () => {
    const newId = recipients.length > 0 ? Math.max(...recipients.map(r => r.id)) + 1 : 1;
    setRecipients([...recipients, { id: newId, name: '', email: '', role: 'signer' }]);
  };

  const updateRecipient = (id: number, field: string, value: string) => {
    setRecipients(recipients.map(recipient => 
      recipient.id === id ? { ...recipient, [field]: value } : recipient
    ));
  };

  const removeRecipient = (id: number) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id));
    setSignaturePositions(signaturePositions.filter(pos => pos.recipientId !== id));
  };

  const addSignatureField = (recipientId: number) => {
    if (!signatureBoxRef.current) return;
    
    const box = signatureBoxRef.current.getBoundingClientRect();
    const newPosition = {
      id: Date.now(),
      x: 50,
      y: 100,
      width: 200,
      height: 80,
      recipientId
    };
    
    setSignaturePositions([...signaturePositions, newPosition]);
  };

  const removeSignatureField = (id: number) => {
    setSignaturePositions(signaturePositions.filter(pos => pos.id !== id));
  };

  const sendForSignature = () => {
    setDocumentStatus('sent');
    setActiveTab('status');
    
    // Simulate sending email
    setTimeout(() => {
      setDocumentStatus('viewed');
      
      // Simulate document being signed after some time
      setTimeout(() => {
        setDocumentStatus('signed');
        
        // Simulate completion
        setTimeout(() => {
          setDocumentStatus('completed');
        }, 5000);
      }, 8000);
    }, 3000);
  };

  const completeSignature = () => {
    if (onSignatureComplete && signatureData) {
      onSignatureComplete({
        documentId,
        signatureData,
        recipients,
        signedAt: new Date().toISOString(),
        status: 'completed'
      });
    }
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-purple-100 text-purple-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
      case 'signed': return <FileSignature className="w-4 h-4" />;
      case 'completed': return <Check className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Signature Électronique</h1>
                <p className="text-white/80">{documentTitle} - {documentType}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 relative z-10">
            {[
              { id: 'prepare', name: 'Préparer' },
              { id: 'sign', name: 'Signer' },
              { id: 'status', name: 'Statut' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-[calc(90vh-150px)]">
          {/* Left panel - Document preview */}
          <div className="w-2/3 border-r border-slate-200 p-4 overflow-auto">
            <div className="bg-slate-50 rounded-lg p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-900">Aperçu du document</h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div 
                ref={signatureBoxRef}
                className="flex-1 bg-white border border-slate-200 rounded-lg relative overflow-auto"
              >
                {/* Document preview placeholder */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">{documentTitle}</h2>
                    <p className="text-slate-500">{documentType}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-slate-700">
                      Ce document est un exemple de {documentType.toLowerCase()} qui nécessite une signature électronique.
                      Le contenu réel du document sera affiché ici.
                    </p>
                    
                    <p className="text-slate-700">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
                      Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                    </p>
                    
                    <p className="text-slate-700">
                      Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. 
                      Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere.
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4 mb-8">
                    <h3 className="font-medium text-slate-900 mb-2">Termes et conditions</h3>
                    <p className="text-sm text-slate-600">
                      En signant ce document, vous acceptez les termes et conditions énoncés ci-dessus.
                      La signature électronique apposée sur ce document a la même valeur légale qu'une signature manuscrite.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mt-12">
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-500 mb-1">Pour le client:</p>
                      <div className="h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                        {activeTab === 'sign' && signatureData ? (
                          <img src={signatureData} alt="Signature" className="max-h-full" />
                        ) : (
                          <p className="text-slate-400">Signature</p>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Nom: {recipientName || 'Client'}</p>
                      <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-500 mb-1">Pour dziljo SaaS:</p>
                      <div className="h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                        <p className="text-slate-400">Signature</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Nom: Sophie Martin</p>
                      <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Signature fields overlay */}
                {activeTab === 'prepare' && signaturePositions.map(position => (
                  <div 
                    key={position.id}
                    className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-30 rounded-lg flex items-center justify-center"
                    style={{
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                      width: `${position.width}px`,
                      height: `${position.height}px`
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <FileSignature className="w-6 h-6 text-blue-500" />
                      <span className="text-xs text-blue-700 font-medium">
                        {recipients.find(r => r.id === position.recipientId)?.name || 'Signature'}
                      </span>
                      <button 
                        onClick={() => removeSignatureField(position.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - Controls */}
          <div className="w-1/3 p-4 overflow-auto">
            {activeTab === 'prepare' && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Destinataires</h3>
                  <div className="space-y-3">
                    {recipients.map((recipient) => (
                      <div key={recipient.id} className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={recipient.name}
                              onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                              className="w-full px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nom"
                            />
                          </div>
                          {recipient.id !== 2 && (
                            <button 
                              onClick={() => removeRecipient(recipient.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="mb-2">
                          <input
                            type="email"
                            value={recipient.email}
                            onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                            className="w-full px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Email"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <select
                            value={recipient.role}
                            onChange={(e) => updateRecipient(recipient.id, 'role', e.target.value)}
                            className="px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="signer">Signataire</option>
                            <option value="cc">Copie</option>
                            <option value="approver">Approbateur</option>
                          </select>
                          <button 
                            onClick={() => addSignatureField(recipient.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Ajouter Signature
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={addRecipient}
                      className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un destinataire
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Message</h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ajoutez un message pour les destinataires..."
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Options</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date d'expiration
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reminder"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="reminder" className="ml-2 text-sm text-slate-700">
                        Envoyer des rappels automatiques
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sequential"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="sequential" className="ml-2 text-sm text-slate-700">
                        Signature séquentielle
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setActiveTab('sign')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FileSignature className="w-4 h-4 mr-2" />
                    Continuer pour signer
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'sign' && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Votre signature</h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2 mb-4">
                      <button
                        onClick={() => setSignatureType('draw')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          signatureType === 'draw'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Dessiner
                      </button>
                      <button
                        onClick={() => setSignatureType('type')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          signatureType === 'type'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Taper
                      </button>
                      <button
                        onClick={() => setSignatureType('upload')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          signatureType === 'upload'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Importer
                      </button>
                    </div>

                    {signatureType === 'draw' && (
                      <div className="bg-white border border-slate-300 rounded-lg p-2">
                        <ESignatureCanvas 
                          onSave={handleSignatureSave}
                          width={400}
                          height={150}
                        />
                      </div>
                    )}

                    {signatureType === 'type' && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={(e) => {
                            setTypedSignature(e.target.value);
                            if (e.target.value) {
                              // Create a canvas to generate the signature image
                              const canvas = document.createElement('canvas');
                              canvas.width = 400;
                              canvas.height = 150;
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.fillStyle = 'white';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.font = `40px ${signatureFont}`;
                                ctx.fillStyle = 'black';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(e.target.value, canvas.width / 2, canvas.height / 2);
                                setSignatureData(canvas.toDataURL('image/png'));
                              }
                            } else {
                              setSignatureData(null);
                            }
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tapez votre nom"
                        />
                        <div className="flex space-x-2 mb-2">
                          {['Pacifico', 'Dancing Script', 'Satisfy', 'Caveat'].map(font => (
                            <button
                              key={font}
                              onClick={() => {
                                setSignatureFont(font);
                                if (typedSignature) {
                                  // Update signature with new font
                                  const canvas = document.createElement('canvas');
                                  canvas.width = 400;
                                  canvas.height = 150;
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) {
                                    ctx.fillStyle = 'white';
                                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                                    ctx.font = `40px ${font}`;
                                    ctx.fillStyle = 'black';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
                                    setSignatureData(canvas.toDataURL('image/png'));
                                  }
                                }
                              }}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                signatureFont === font
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                              style={{ fontFamily: font }}
                            >
                              Aa
                            </button>
                          ))}
                        </div>
                        {typedSignature && (
                          <div 
                            className="bg-white border border-slate-300 rounded-lg p-4 flex items-center justify-center h-20"
                            style={{ fontFamily: signatureFont }}
                          >
                            <span className="text-2xl">{typedSignature}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {signatureType === 'upload' && (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            id="signature-upload"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <label htmlFor="signature-upload" className="cursor-pointer">
                            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-700 font-medium">Cliquez pour importer votre signature</p>
                            <p className="text-sm text-slate-500 mt-1">
                              Formats acceptés: JPG, PNG, GIF
                            </p>
                          </label>
                        </div>
                        {uploadedSignature && (
                          <div className="bg-white border border-slate-300 rounded-lg p-4 flex items-center justify-center h-20">
                            <img src={uploadedSignature} alt="Signature" className="max-h-full" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Informations légales</h3>
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>
                      En cliquant sur "Signer le document", vous acceptez de signer électroniquement ce document.
                    </p>
                    <p>
                      Cette signature électronique a la même valeur légale qu'une signature manuscrite conformément à la réglementation en vigueur.
                    </p>
                    <div className="flex items-center mt-3">
                      <input
                        type="checkbox"
                        id="consent"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="consent" className="ml-2 text-sm text-slate-700">
                        J'accepte d'utiliser la signature électronique pour ce document
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setActiveTab('prepare')}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={sendForSignature}
                    disabled={!signatureData}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Signer et envoyer
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Statut du document</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(documentStatus)}`}>
                      {getStatusIcon(documentStatus)}
                      <span className="ml-1 capitalize">
                        {documentStatus === 'draft' ? 'Brouillon' : 
                         documentStatus === 'sent' ? 'Envoyé' : 
                         documentStatus === 'viewed' ? 'Consulté' : 
                         documentStatus === 'signed' ? 'Signé' : 'Complété'}
                      </span>
                    </span>
                    <span className="text-sm text-slate-500">
                      Mis à jour {new Date().toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 inset-y-0 w-0.5 bg-slate-200"></div>
                    <div className="space-y-6 relative">
                      <div className="flex">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          documentStatus !== 'draft' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Edit className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">Document créé</h4>
                          <p className="text-sm text-slate-500">
                            {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          documentStatus !== 'draft' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Send className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">Document envoyé</h4>
                          <p className="text-sm text-slate-500">
                            {documentStatus !== 'draft' ? 
                              `${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}` : 
                              'En attente'}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          documentStatus === 'viewed' || documentStatus === 'signed' || documentStatus === 'completed' ? 
                            'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Eye className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">Document consulté</h4>
                          <p className="text-sm text-slate-500">
                            {documentStatus === 'viewed' || documentStatus === 'signed' || documentStatus === 'completed' ? 
                              `${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}` : 
                              'En attente'}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          documentStatus === 'signed' || documentStatus === 'completed' ? 
                            'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <FileSignature className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">Document signé</h4>
                          <p className="text-sm text-slate-500">
                            {documentStatus === 'signed' || documentStatus === 'completed' ? 
                              `${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}` : 
                              'En attente'}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          documentStatus === 'completed' ? 
                            'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">Document complété</h4>
                          <p className="text-sm text-slate-500">
                            {documentStatus === 'completed' ? 
                              `${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}` : 
                              'En attente'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-3">Participants</h3>
                  <div className="space-y-3">
                    {recipients.map((recipient) => (
                      <div key={recipient.id} className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{recipient.name}</p>
                              <p className="text-sm text-slate-500">{recipient.email}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            documentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {documentStatus === 'completed' ? 'Signé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  {documentStatus === 'completed' ? (
                    <button
                      onClick={completeSignature}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Terminer
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Fermer
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignature;