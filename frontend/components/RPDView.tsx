import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Modo, RPDConfig } from '../types';

export const RPDView: React.FC<{ modo?: Modo }> = ({ modo }) => {
  const { kpis, rpds, addRPD } = useAppStore();
  const projectKpis = modo ? kpis.filter(k => k.projectId === modo.id) : kpis;
  const projectRpds = modo ? rpds.filter(r => r.projectId === modo.id) : rpds;

  const [isAdding, setIsAdding] = useState(false);
  const [newRPD, setNewRPD] = useState<Partial<RPDConfig>>({
    kpiId: '',
    nombreReporte: '',
    frecuencia: 'Semanal',
    tomadorDecision: '',
    accionSiFalla: ''
  });

  const handleSave = () => {
    if (newRPD.kpiId && newRPD.nombreReporte && newRPD.tomadorDecision) {
      addRPD({
        projectId: modo?.id || 'global',
        kpiId: newRPD.kpiId,
        nombreReporte: newRPD.nombreReporte,
        frecuencia: newRPD.frecuencia || 'Semanal',
        tomadorDecision: newRPD.tomadorDecision,
        accionSiFalla: newRPD.accionSiFalla || ''
      });
      setIsAdding(false);
      setNewRPD({ kpiId: '', nombreReporte: '', frecuencia: 'Semanal', tomadorDecision: '', accionSiFalla: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div>
          <h4 className="font-bold text-slate-800 text-[16px] mb-2">Reportes para Decidir (RPD)</h4>
          <p className="text-slate-500 text-[14px]">
            Configura el formato de decisión para cada KPI, especificando reportes, frecuencia y acciones a tomar.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Configurar RPD
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h5 className="font-bold text-slate-800">Nueva Configuración RPD</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">KPI</label>
              <select value={newRPD.kpiId} onChange={e => setNewRPD({ ...newRPD, kpiId: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                <option value="">Selecciona un KPI...</option>
                {projectKpis.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Reporte</label>
              <input type="text" value={newRPD.nombreReporte} onChange={e => setNewRPD({ ...newRPD, nombreReporte: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Ej. Tablero Semanal de Ventas" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tomador de Decisión</label>
              <input type="text" value={newRPD.tomadorDecision} onChange={e => setNewRPD({ ...newRPD, tomadorDecision: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Ej. Gerente de Ventas" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Frecuencia</label>
              <select value={newRPD.frecuencia} onChange={e => setNewRPD({ ...newRPD, frecuencia: e.target.value as any })} className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
                <option value="Anual">Anual</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Acción principal si el KPI falla</label>
              <textarea value={newRPD.accionSiFalla} onChange={e => setNewRPD({ ...newRPD, accionSiFalla: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200" rows={2} placeholder="Ej. Levantar incidencia, contactar a soporte, generar plan de acción..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold">Cancelar</button>
            <button onClick={handleSave} disabled={!newRPD.kpiId || !newRPD.nombreReporte || !newRPD.tomadorDecision} className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold disabled:opacity-50">Guardar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectRpds.map(rpd => {
          const kpi = projectKpis.find(k => k.id === rpd.kpiId);
          return (
            <div key={rpd.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="mb-4">
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">KPI: {kpi?.name || 'Desconocido'}</span>
                <h5 className="font-bold text-slate-800 text-[16px] leading-tight">{rpd.nombreReporte}</h5>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                  <span className="font-semibold text-slate-700">Decide:</span> {rpd.tomadorDecision}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                  <span className="font-semibold text-slate-700">Revisión:</span> {rpd.frecuencia}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acción ante falla</span>
                  <p className="text-[13px] text-slate-600 italic">"{rpd.accionSiFalla || 'No definida'}"</p>
                </div>
              </div>
            </div>
          );
        })}
        {projectRpds.length === 0 && !isAdding && (
          <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-400">No hay configuraciones RPD.</div>
        )}
      </div>
    </div>
  );
};
