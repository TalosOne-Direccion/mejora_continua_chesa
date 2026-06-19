import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Modo } from '../types';
import { cn } from '../utils';

export const KPIsProyecto: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { kpis, addKPI, macroprocesos, procesos } = useAppStore();
  const [newKpiName, setNewKpiName] = useState('');
  const [selectedMacId, setSelectedMacId] = useState('');
  const [selectedProcId, setSelectedProcId] = useState('');

  const projectKpis = kpis.filter(k => k.projectId === modo.id);

  const handleAdd = () => {
    if (!newKpiName.trim() || !selectedMacId || !selectedProcId) return;
    addKPI({
      projectId: modo.id,
      name: newKpiName.trim(),
      status: 'Propuesto',
      macroprocesoId: selectedMacId,
      procesoId: selectedProcId
    });
    setNewKpiName('');
    setSelectedProcId('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-end">
        <div>
          <h3 className="font-title-lg text-title-lg font-bold text-slate-800">Indicadores del Proyecto (KPIs)</h3>
          <p className="text-slate-500 text-body-md mt-1">Propón y gestiona los indicadores de éxito vinculados a un proceso específico.</p>
        </div>
      </div>

      {/* Add New KPI */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <select 
            value={selectedMacId} onChange={e => { setSelectedMacId(e.target.value); setSelectedProcId(''); }}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white"
          >
            <option value="">Selecciona un Macroproceso</option>
            {macroprocesos.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select 
            value={selectedProcId} onChange={e => setSelectedProcId(e.target.value)} disabled={!selectedMacId}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white disabled:opacity-50"
          >
            <option value="">Selecciona un Proceso</option>
            {procesos.filter(p => p.macroprocesoId === selectedMacId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex gap-4">
          <input 
            type="text"
            value={newKpiName}
            onChange={e => setNewKpiName(e.target.value)}
            placeholder="Ej. Tiempo de ciclo, Tasa de defecto, OEE..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button 
            onClick={handleAdd}
            disabled={!newKpiName.trim() || !selectedMacId || !selectedProcId}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Proponer KPI
          </button>
        </div>
      </div>

      {/* List of KPIs */}
      {projectKpis.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <span className="material-symbols-outlined text-[48px] mb-4">analytics</span>
          <p>No hay KPIs propuestos aún para este proyecto.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projectKpis.map(kpi => (
            <div key={kpi.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors bg-white">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-[20px]",
                  kpi.status === 'Propuesto' ? "bg-amber-50 text-amber-500" :
                  kpi.status === 'Aprobado' ? "bg-blue-50 text-blue-500" :
                  "bg-emerald-50 text-emerald-500"
                )}>
                  <span className="material-symbols-outlined">
                    {kpi.status === 'Propuesto' ? 'pending_actions' : kpi.status === 'Aprobado' ? 'fact_check' : 'check_circle'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[15px]">{kpi.name}</h4>
                  <div className="flex gap-4 mt-1">
                    <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      Estatus: {kpi.status}
                    </p>
                    {kpi.tools && kpi.tools.length > 0 && (
                      <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">build</span>
                        Herramientas: {kpi.tools.join(', ')}
                      </p>
                    )}
                    {kpi.macroprocesoId && (
                      <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1 ml-2">
                        <span className="material-symbols-outlined text-[14px]">account_tree</span>
                        {macroprocesos.find(m => m.id === kpi.macroprocesoId)?.name} 
                        {kpi.procesoId && ` > ${procesos.find(p => p.id === kpi.procesoId)?.name}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
