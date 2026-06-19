import React, { useState } from 'react';
import { ProjectKPI, KPITool } from '../types';
import { useAppStore } from '../store';
import { cn } from '../utils';

export const ToolBuilder: React.FC<{ 
  kpi: ProjectKPI; 
  tool: KPITool; 
  onClose: () => void;
}> = ({ kpi, tool, onClose }) => {
  const { updateKPI, macroprocesos, procesos, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleApprove = () => {
    setIsBuilding(true);
    setTimeout(() => {
      updateKPI(kpi.id, { status: 'Liberado' });
      setIsBuilding(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">
                {tool === 'HK' ? 'dashboard' : tool === 'RPD' ? 'table_chart' : 'account_tree'}
              </span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-800">Constructor de {tool}</h2>
              <p className="text-[13px] text-slate-500 font-medium">Configurando indicador: {kpi.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content (Simulated Builder UI) */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Configuración de Origen de Datos</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fuente de Información</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Ventas Mensuales, Reporte Excel, Base de datos..." 
                      className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none bg-slate-50 disabled:opacity-70"
                      value={kpi.fuenteInfo || ''}
                      onChange={e => updateKPI(kpi.id, { fuenteInfo: e.target.value })}
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Puesto Ligado</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Técnico, Asesor, Almacenista..." 
                      className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none bg-slate-50 disabled:opacity-70"
                      value={kpi.puesto || ''}
                      onChange={e => updateKPI(kpi.id, { puesto: e.target.value })}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Macroproceso Ligado</label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none bg-slate-50 disabled:opacity-70"
                        value={kpi.macroprocesoId || ''}
                        onChange={e => updateKPI(kpi.id, { macroprocesoId: e.target.value, procesoId: '' })}
                        disabled={!canEdit}
                      >
                        <option value="">Seleccionar Macroproceso...</option>
                        {macroprocesos.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Proceso Ligado</label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none bg-slate-50 disabled:opacity-70"
                        value={kpi.procesoId || ''}
                        disabled={!kpi.macroprocesoId || !canEdit}
                        onChange={e => updateKPI(kpi.id, { procesoId: e.target.value })}
                      >
                        <option value="">Seleccionar Proceso...</option>
                        {procesos.filter(p => p.macroprocesoId === kpi.macroprocesoId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Frecuencia de Medición</label>
                    <select disabled={!canEdit} className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none bg-slate-50 disabled:opacity-70">
                      <option>Diario</option>
                      <option>Semanal</option>
                      <option>Mensual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Reglas de Negocio y Umbrales</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-red-500 uppercase mb-1">Crítico (Menor a)</label>
                    <input type="number" disabled={!canEdit} className="w-full p-2 rounded-lg border border-slate-200 disabled:opacity-70 bg-slate-50/50" placeholder="Ej. 60" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-amber-500 uppercase mb-1">Alerta (Entre)</label>
                    <input type="text" disabled={!canEdit} className="w-full p-2 rounded-lg border border-slate-200 disabled:opacity-70 bg-slate-50/50" placeholder="60 - 80" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-emerald-500 uppercase mb-1">Óptimo (Mayor a)</label>
                    <input type="number" disabled={!canEdit} className="w-full p-2 rounded-lg border border-slate-200 disabled:opacity-70 bg-slate-50/50" placeholder="Ej. 80" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-slate-900 rounded-xl p-6 shadow-sm text-white sticky top-0">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">preview</span>
                  Vista Previa
                </h3>
                <div className="w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 mb-4 overflow-hidden relative">
                  {/* Decorative chart placeholder */}
                  <div className="absolute bottom-0 w-full h-24 flex items-end gap-2 px-4">
                    <div className="flex-1 bg-primary/40 h-[40%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary/60 h-[70%] rounded-t-sm"></div>
                    <div className="flex-1 bg-primary h-[90%] rounded-t-sm"></div>
                    <div className="flex-1 bg-emerald-500 h-[100%] rounded-t-sm"></div>
                  </div>
                </div>
                <div className="text-[12px] text-slate-400 leading-relaxed">
                  Este es un simulador de construcción para la herramienta {tool}. Una vez configurados los parámetros y aprobada la medición, el indicador se liberará para su uso operativo por parte de {kpi.puesto || 'el área correspondiente'}.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-200 p-6 bg-white flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          {canEdit && (
            <button 
              onClick={handleApprove}
              disabled={isBuilding}
              className="bg-primary text-white font-bold px-8 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isBuilding ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  Liberando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Aprobar y Liberar para Uso
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
