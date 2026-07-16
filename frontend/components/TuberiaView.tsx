import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Modo, TuberiaData } from '../types';

export const TuberiaView: React.FC<{ modo?: Modo }> = ({ modo }) => {
  const { kpis, tuberias, addTuberia } = useAppStore();
  const projectKpis = modo ? kpis.filter(k => k.projectId === modo.id) : kpis;
  const projectTuberias = modo ? tuberias.filter(t => t.projectId === modo.id) : tuberias;

  const [isAdding, setIsAdding] = useState(false);
  const [newTuberia, setNewTuberia] = useState<Partial<TuberiaData>>({
    name: '',
    fuentesDeOrigen: [],
    kpiIds: [],
    frecuenciaActualizacion: 'Diario',
    responsableMantenimiento: ''
  });

  const handleSave = () => {
    if (newTuberia.name && newTuberia.kpiIds?.length) {
      addTuberia({
        projectId: modo?.id || 'global',
        name: newTuberia.name,
        fuentesDeOrigen: newTuberia.fuentesDeOrigen || [],
        kpiIds: newTuberia.kpiIds,
        frecuenciaActualizacion: newTuberia.frecuenciaActualizacion || 'Diario',
        responsableMantenimiento: newTuberia.responsableMantenimiento || ''
      });
      setIsAdding(false);
      setNewTuberia({ name: '', fuentesDeOrigen: [], kpiIds: [], frecuenciaActualizacion: 'Diario', responsableMantenimiento: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div>
          <h4 className="font-bold text-slate-800 text-[16px] mb-2">Tubería de Datos</h4>
          <p className="text-slate-500 text-[14px]">
            Define el flujo y origen de la información que alimentará a los indicadores.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nueva Tubería
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h5 className="font-bold text-slate-800">Crear Tubería</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del flujo</label>
              <input type="text" value={newTuberia.name} onChange={e => setNewTuberia({ ...newTuberia, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Ej. Extracción CRM" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Responsable IT / Mantenimiento</label>
              <input type="text" value={newTuberia.responsableMantenimiento} onChange={e => setNewTuberia({ ...newTuberia, responsableMantenimiento: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">KPIs Asociados</label>
              <div className="flex flex-wrap gap-2">
                {projectKpis.map(kpi => (
                  <label key={kpi.id} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input 
                      type="checkbox" 
                      checked={(newTuberia.kpiIds || []).includes(kpi.id)}
                      onChange={e => {
                        const ids = newTuberia.kpiIds || [];
                        if (e.target.checked) setNewTuberia({ ...newTuberia, kpiIds: [...ids, kpi.id] });
                        else setNewTuberia({ ...newTuberia, kpiIds: ids.filter(i => i !== kpi.id) });
                      }}
                    />
                    <span className="text-[13px] font-medium">{kpi.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold">Cancelar</button>
            <button onClick={handleSave} disabled={!newTuberia.name || !newTuberia.kpiIds?.length} className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold disabled:opacity-50">Guardar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projectTuberias.map(tuberia => (
          <div key={tuberia.id} className="bg-white p-5 rounded-xl border border-slate-200 flex gap-6 items-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">schema</span>
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-slate-800 text-[16px]">{tuberia.name}</h5>
              <div className="flex gap-4 mt-2">
                <span className="text-[12px] text-slate-500 font-medium">Resp: {tuberia.responsableMantenimiento || 'Sin asignar'}</span>
                <span className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">analytics</span>
                  {tuberia.kpiIds.length} KPIs
                </span>
                <span className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">update</span>
                  {tuberia.frecuenciaActualizacion}
                </span>
              </div>
            </div>
            <div className="shrink-0 flex gap-2">
              {tuberia.kpiIds.map(id => {
                const kName = projectKpis.find(k => k.id === id)?.name;
                return kName ? <span key={id} className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{kName}</span> : null;
              })}
            </div>
          </div>
        ))}
        {projectTuberias.length === 0 && !isAdding && (
          <div className="text-center py-12 text-slate-400">No hay tuberías de datos configuradas.</div>
        )}
      </div>
    </div>
  );
};
