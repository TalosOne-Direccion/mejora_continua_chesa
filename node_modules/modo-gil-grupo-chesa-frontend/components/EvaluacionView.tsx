import React from 'react';
import { useAppStore } from '../store';
import { Modo } from '../types';
import { cn } from '../utils';

export const EvaluacionView: React.FC<{ modo?: Modo }> = ({ modo }) => {
  const { kpis, updateKPI } = useAppStore();
  const projectKpis = modo ? kpis.filter(k => k.projectId === modo.id) : kpis;

  // Filter only those that have a target set or are approved/released
  const evaluableKpis = projectKpis.filter(k => k.target && k.status !== 'Propuesto');

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-bold text-slate-800 text-[16px] mb-2">Evaluación de Desempeño</h4>
        <p className="text-slate-500 text-[14px]">
          Captura el resultado actual de los indicadores y visualiza su estatus frente a la meta (Target).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">KPI</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">Puesto(s)</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">Meta (Target)</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">Valor Actual</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider text-center">Desempeño</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {evaluableKpis.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">rule</span>
                  <p className="text-[13px]">No hay KPIs listos para evaluar. Asegúrate de definirles un "Target" y no estar en "Propuesto".</p>
                </td>
              </tr>
            ) : evaluableKpis.map(kpi => {
              let colorClass = "bg-slate-100 text-slate-500";
              let statusText = "Sin Evaluar";
              let icon = "remove";

              if (kpi.actualValue) {
                colorClass = "bg-emerald-50 text-emerald-600 border border-emerald-200";
                statusText = "Evaluado";
                icon = "check_circle";
              }

              return (
                <tr key={kpi.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-800 text-[13px] max-w-[250px]">{kpi.name}</td>
                  <td className="p-4 text-slate-600 text-[13px]">
                    <div className="flex flex-wrap gap-1">
                      {(kpi.puestos || (kpi.puesto ? [kpi.puesto] : [])).map(p => (
                        <span key={p} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {p}
                        </span>
                      ))}
                      {(!kpi.puestos?.length && !kpi.puesto) && <span className="text-slate-400 italic">No asignado</span>}
                    </div>
                  </td>
                  <td className="p-4 text-[13px] font-bold text-slate-700">
                    {kpi.target}
                  </td>
                  <td className="p-4 text-[13px]">
                    <input 
                      type="text" 
                      placeholder="Ej. 85%, $500..." 
                      className="border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-primary bg-white w-full max-w-[150px] font-medium"
                      value={kpi.actualValue || ''}
                      onChange={e => updateKPI(kpi.id, { actualValue: e.target.value })}
                    />
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold", colorClass)}>
                      <span className="material-symbols-outlined text-[14px]">{icon}</span>
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
