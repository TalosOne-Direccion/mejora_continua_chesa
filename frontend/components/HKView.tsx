import React from 'react';
import { useAppStore } from '../store';
import { Modo } from '../types';

export const HKView: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { kpis } = useAppStore();
  const projectKpis = kpis.filter(k => k.projectId === modo.id);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-bold text-slate-800 text-[16px] mb-2">Matriz Hoshin Kanri</h4>
        <p className="text-slate-500 text-[14px]">
          Esta matriz alinea los KPIs del proyecto con los objetivos estratégicos de la empresa.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">KPI</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">Meta (Target)</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">Objetivo Estratégico (HK)</th>
              <th className="p-4 font-bold text-slate-600 text-[13px] uppercase tracking-wider">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projectKpis.map(kpi => (
              <tr key={kpi.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-800 text-[14px]">{kpi.name}</td>
                <td className="p-4 text-slate-600 text-[14px]">{kpi.target || 'No definida'}</td>
                <td className="p-4 text-slate-600 text-[14px]">{kpi.hoshinObjective || 'No alineado aún'}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                    En Evaluación
                  </span>
                </td>
              </tr>
            ))}
            {projectKpis.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">No hay KPIs registrados para alinear en HK.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
