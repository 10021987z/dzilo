import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Trash2, Download, Check } from 'lucide-react';

interface ESignatureCanvasProps {
  onSave: (signatureData: string) => void;
  width?: number;
  height?: number;
  defaultValue?: string;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
}

const ESignatureCanvas: React.FC<ESignatureCanvasProps> = ({
  onSave,
  width = 400,
  height = 200,
  defaultValue,
  penColor = '#000000',
  backgroundColor = '#ffffff',
  className = ''
}) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (defaultValue && sigCanvasRef.current) {
      // Load the default signature if provided
      const img = new Image();
      img.onload = () => {
        const ctx = sigCanvasRef.current?.getCanvas().getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setIsEmpty(false);
        }
      };
      img.src = defaultValue;
    }
  }, [defaultValue]);

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setIsEmpty(true);
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    if (sigCanvasRef.current && !isEmpty) {
      const signatureData = sigCanvasRef.current.toDataURL('image/png');
      onSave(signatureData);
      setIsSaved(true);
      
      // Reset saved state after a delay
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  };

  const handleDownload = () => {
    if (sigCanvasRef.current && !isEmpty) {
      const signatureData = sigCanvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = signatureData;
      link.download = 'signature.png';
      link.click();
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
    setIsSaved(false);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div 
        className="border-2 border-dashed border-slate-300 rounded-lg p-2 bg-white"
        style={{ backgroundColor }}
      >
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor={penColor}
          canvasProps={{
            width,
            height,
            className: 'signature-canvas w-full h-full cursor-crosshair',
          }}
          onBegin={handleBegin}
        />
      </div>
      <div className="flex justify-between mt-3">
        <div className="space-x-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={isEmpty}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Effacer
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isEmpty}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isEmpty || isSaved}
          className={`px-3 py-1.5 text-sm rounded-lg flex items-center transition-colors ${
            isSaved 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Enregistré
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </div>
  );
};

export default ESignatureCanvas;