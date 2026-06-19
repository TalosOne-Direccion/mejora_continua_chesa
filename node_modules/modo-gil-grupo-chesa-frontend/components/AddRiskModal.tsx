import React, { useState } from 'react';
import { ProjectRisk } from '../types';

interface AddRiskModalProps {
  onClose: () => void;
  onAdd: (risk: ProjectRisk) => void;
}

export const AddRiskModal: React.FC<AddRiskModalProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [impact, setImpact] = useState<ProjectRisk['impact']>('Medio');
  const [probability, setProbability] = useState<ProjectRisk['probability']>('Media');
  const [mitigation, setMitigation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      id: Math.random().toString(36).substring(2, 11),
      title,
      impact,
      probability,
      mitigation,
      status: 'Abierto',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            Añadir Riesgo Crítico
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Descripción del Riesgo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Resistencia al cambio en el equipo operativo..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Impacto</label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as ProjectRisk['impact'])}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Probabilidad</label>
              <select
                value={probability}
                onChange={(e) => setProbability(e.target.value as ProjectRisk['probability'])}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Plan de Mitigación (Opcional)</label>
            <textarea
              value={mitigation}
              onChange={(e) => setMitigation(e.target.value)}
              placeholder="Acciones para reducir la probabilidad o impacto..."
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-[14px] font-bold bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Guardar Riesgo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
