import React, { useState, useEffect } from 'react';

interface ReopenPhaseModalProps {
  phaseName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ReopenPhaseModal: React.FC<ReopenPhaseModalProps> = ({ phaseName, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-slate-900">Reabrir etapa · {phaseName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6">
          <p className="text-[13px] text-slate-500 mb-4">El motivo queda registrado en la bitácora del MODO.</p>
          <textarea
            autoFocus
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo de la reapertura..."
            className="w-full p-3 text-[14px] border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          />
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button onClick={onClose} className="px-4 py-2 text-[14px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(reason)} 
            disabled={!reason.trim()}
            className="px-4 py-2 text-[14px] font-semibold text-white bg-slate-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors"
          >
            Reabrir
          </button>
        </div>
      </div>
    </div>
  );
};
