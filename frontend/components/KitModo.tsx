import React, { useState } from 'react';
import { Modo } from '../types';
import { CHECKLISTS, PROJECT_PHASES } from '../constants';
import { cn } from '../utils';

export const KitModo: React.FC<{ modo: Modo }> = ({ modo }) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const getStatus = (phaseNum: number, text: string) => {
    const phase = modo.phases[phaseNum];
    if (!phase) return false;
    if (phase.status === 'Aprobado') return true;
    return phase.checklistOut?.[text] === true;
  };

  const masterChecklist = CHECKLISTS[modo.projectType] || [];
  const completedCount = masterChecklist.filter(item => getStatus(item.phase, item.text)).length;
  const progress = masterChecklist.length > 0 ? Math.round((completedCount / masterChecklist.length) * 100) : 0;
  
  const phaseNames = PROJECT_PHASES[modo.projectType];

  return (
    <div className="space-y-6">
      {/* CHECKLIST MAESTRO */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-title-md text-title-md text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <span className="material-symbols-outlined text-slate-400">check_box</span>
            CHECKLIST MAESTRO DE IMPLEMENTACIÓN
          </h2>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-[13px]"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Exportar kit
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-bold text-[15px] text-slate-800">{progress}%</span>
        </div>

        <div className="space-y-3">
          {masterChecklist.map((item, idx) => {
            const isDone = getStatus(item.phase, item.text);
            return (
              <div key={idx} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <span className="material-symbols-outlined filled text-emerald-500 text-[20px]">check_circle</span>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[11px] font-bold">
                      {idx + 1}
                    </div>
                  )}
                  <span className={cn("text-[14px] transition-colors", isDone ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700")}>
                    {item.text}
                  </span>
                </div>
                <div className="bg-slate-50 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-100">
                  E{item.phase}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ENTREGABLES POR ETAPA */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-title-md text-title-md text-slate-800 uppercase tracking-wider mb-6">
          ENTREGABLES POR ETAPA
        </h2>
        
        <div className="space-y-4">
          {phaseNames.map((phaseName, pIdx) => {
            const phaseNum = pIdx + 1;
            const items = masterChecklist.filter(i => i.phase === phaseNum);
            if (items.length === 0) return null;
            
            return (
              <div key={phaseNum} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                  <h4 className="font-bold text-[14px] text-slate-800">Etapa {phaseNum} · {phaseName}</h4>
                </div>
                <div className="p-4 space-y-3">
                  {items.map((item, idx) => {
                    const isDone = getStatus(phaseNum, item.text);
                    // Derivar el nombre del entregable desde el texto del checklist (quitar "aprobada", "definidos", etc. para que suene más a entregable)
                    let entregable = item.text.replace(/ aprobad[ao]s?\.?/i, '').replace(/ definid[ao]s?\.?/i, '').replace(/ validad[ao]s?\.?/i, '').replace(/\.$/, '');
                    
                    return (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-[14px] text-slate-600">{entregable}</span>
                        <span className={cn("text-[12px] font-bold px-3 py-1 rounded-full border", isDone ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200")}>
                          {isDone ? 'Completo' : 'Pendiente'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-slate-800 text-white">
              <div className="flex items-center gap-3">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg font-bold text-[13px] hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">print</span> Imprimir
                </button>
              </div>
              <button onClick={() => setShowExportModal(false)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-[13px] font-bold">
                <span className="material-symbols-outlined text-[18px]">close</span> Cerrar
              </button>
            </div>
            
            {/* Contenido imprimible */}
            <div className="p-8 overflow-y-auto bg-white print:p-0 print:overflow-visible">
              <table className="w-full border-collapse border-2 border-slate-800 mb-6">
                <tbody>
                  <tr>
                    <td className="border border-slate-800 p-4 text-center font-bold text-[13px] w-[25%]">
                      GRUPO CHESA<br/>MEJORA CONTINUA
                    </td>
                    <td className="border border-slate-800 p-4 text-center font-black text-[18px] tracking-widest w-[50%]">
                      KIT DEL {modo.projectType.toUpperCase()}
                    </td>
                    <td className="border border-slate-800 p-2 text-[12px] w-[25%] font-medium">
                      <div className="border-b border-slate-300 pb-1 mb-1">Código: <strong>MC-FO-KT</strong></div>
                      <div className="border-b border-slate-300 pb-1 mb-1">Versión: <strong>1.0</strong></div>
                      <div>Vigencia: <strong>18/06/2027</strong></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 text-[12px]">Responsable: <strong>{modo.team['Líder del proyecto (MC)'] || 'No asignado'}</strong></td>
                    <td className="border border-slate-800 p-2 text-[12px]">Aprobador: <strong>{modo.team['Patrocinador'] || 'No asignado'}</strong></td>
                    <td className="border border-slate-800 p-2 text-[12px]">Próxima revisión: <strong>18/12/2026</strong></td>
                  </tr>
                </tbody>
              </table>

              <h3 className="font-bold text-[14px] text-slate-800 mb-3 uppercase">CHECKLIST MAESTRO ({progress}% COMPLETO)</h3>
              <table className="w-full border-collapse mb-8 text-[12px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2 text-left w-10">#</th>
                    <th className="border border-slate-300 p-2 text-left">Punto del manual</th>
                    <th className="border border-slate-300 p-2 text-center w-16">Etapa</th>
                    <th className="border border-slate-300 p-2 text-center w-24">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {masterChecklist.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">{item.text}</td>
                      <td className="border border-slate-300 p-2 text-center text-slate-500">E{item.phase}</td>
                      <td className="border border-slate-300 p-2 text-center">
                        {getStatus(item.phase, item.text) ? 'Cumplido' : 'Pendiente'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="font-bold text-[14px] text-slate-800 mb-3 uppercase">ENTREGABLES POR ETAPA</h3>
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2 text-left w-[30%]">Etapa</th>
                    <th className="border border-slate-300 p-2 text-left">Entregable</th>
                    <th className="border border-slate-300 p-2 text-center w-24">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseNames.map((phaseName, pIdx) => {
                    const phaseNum = pIdx + 1;
                    const items = masterChecklist.filter(i => i.phase === phaseNum);
                    return items.map((item, idx) => (
                      <tr key={`${phaseNum}-${idx}`}>
                        {idx === 0 && (
                          <td className="border border-slate-300 p-2 align-top text-slate-700 font-medium" rowSpan={items.length}>
                            {phaseNum} · {phaseName}
                          </td>
                        )}
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {item.text.replace(/ aprobad[ao]s?\.?/i, '').replace(/ definid[ao]s?\.?/i, '').replace(/ validad[ao]s?\.?/i, '').replace(/\.$/, '')}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          {getStatus(item.phase, item.text) ? 'Completo' : 'Pendiente'}
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};