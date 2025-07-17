import React, { useState } from 'react';
import { 
  Edit, Send, Download, Archive, Check, X, AlertTriangle, 
  FileText, Mail, Calendar, Clock, User, Building, DollarSign
} from 'lucide-react';

interface ContractActionsProps {
  contractId: number;
  contractTitle: string;
  contractStatus: string;
  onEdit?: () => void;
  onSendForSignature?: () => void;
  onDownload?: () => void;
  onArchive?: () => void;
  vertical?: boolean;
  className?: string;
}

const ContractActions: React.FC<ContractActionsProps> = ({
  contractId,
  contractTitle,
  contractStatus,
  onEdit,
  onSendForSignature,
  onDownload,
  onArchive,
  vertical = false,
  className = ''
}) => {
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (action: string, callback?: () => void) => {
    if (action === 'archive') {
      setShowConfirmation(action);
      return;
    }
    
    if (callback) {
      setIsProcessing(true);
      
      // Simulate API call
      setTimeout(() => {
        callback();
        setIsProcessing(false);
        
        // Show success notification
        const successElement = document.createElement('div');
        successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        
        if (action === 'edit') {
          successElement.textContent = '✅ Modification en cours...';
        } else if (action === 'send') {
          successElement.textContent = '✅ Document envoyé pour signature !';
        } else if (action === 'download') {
          successElement.textContent = '✅ Téléchargement en cours...';
        }
        
        document.body.appendChild(successElement);
        setTimeout(() => document.body.removeChild(successElement), 3000);
      }, 500);
    }
  };

  const confirmAction = (confirmed: boolean) => {
    if (confirmed && showConfirmation === 'archive' && onArchive) {
      setIsProcessing(true);
      
      // Simulate API call
      setTimeout(() => {
        onArchive();
        setIsProcessing(false);
        setShowConfirmation(null);
        
        // Show success notification
        const successElement = document.createElement('div');
        successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        successElement.textContent = '✅ Document archivé avec succès !';
        document.body.appendChild(successElement);
        setTimeout(() => document.body.removeChild(successElement), 3000);
      }, 500);
    } else {
      setShowConfirmation(null);
    }
  };

  const isDisabled = isProcessing || contractStatus === 'archived';

  return (
    <>
      <div className={`${vertical ? 'flex flex-col space-y-3' : 'flex space-x-3'} ${className}`}>
        <button
          onClick={() => handleAction('edit', onEdit)}
          disabled={isDisabled}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="w-5 h-5 mr-2" />
          Modifier
        </button>
        
        <button
          onClick={() => handleAction('send', onSendForSignature)}
          disabled={isDisabled || contractStatus === 'signed'}
          className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 mr-2" />
          Envoyer pour Signature
        </button>
        
        <button
          onClick={() => handleAction('download', onDownload)}
          disabled={isDisabled}
          className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger PDF
        </button>
        
        <button
          onClick={() => handleAction('archive')}
          disabled={isDisabled || contractStatus === 'archived'}
          className="flex items-center justify-center bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Archive className="w-5 h-5 mr-2" />
          Archiver
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="bg-red-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirmer l'archivage</h3>
              <p className="text-slate-600">
                Êtes-vous sûr de vouloir archiver le document "{contractTitle}" ? 
                Cette action le rendra inaccessible dans les vues principales.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => confirmAction(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmAction(true)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Archiver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractActions;