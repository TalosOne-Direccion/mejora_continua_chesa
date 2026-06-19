import React, { useState, useEffect } from 'react';
import { cn, canApprovePhase } from '../utils';
import { useAppStore } from '../store';
import { Modo } from '../types';
import { CHECKLISTS } from '../constants';
import { ReopenPhaseModal } from './ReopenPhaseModal';

interface Props {
  modo: Modo;
  phaseNumber: number;
  title: string;
  dmaic: string;
  description: string;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  children: React.ReactNode;
  checklistManual?: string[];
  erroresEvitar?: string[];
}

const DEFAULT_PHASE_STATE = {
  status: 'Pendiente' as const,
  data: {},
  checklistOut: {}
};

export const PhaseLayout: React.FC<Props> = ({
  modo, phaseNumber, title, dmaic, description, onGenerate, isGenerating, error, children, checklistManual, erroresEvitar
}) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const phaseState = modo.phases[phaseNumber] || DEFAULT_PHASE_STATE;
  const isApproved = phaseState.status === 'Aprobado' || phaseState.status === 'Completo';
  const [showReopen, setShowReopen] = useState(false);
  
  const getManualDetails = () => {
    switch(modo.projectType) {
      case 'Reingeniería': return { title: 'Manual de Reingeniería', href: '/GPS-MMC-RE Manual Reingenieria.pdf' };
      case 'Taller de Herramientas': return { title: 'Manual Taller de Herramientas', href: '/GPS-MMC-TH Manual Taller de Herramientas.pdf' };
      case 'MODO':
      default: return { title: 'Manual MODO Ágil', href: '/GPS-MMC-MO Manual MODO Agil.pdf' };
    }
  };
  
  const manual = getManualDetails();
  
  const canApprove = canApprovePhase(currentUser?.name); 
  
  // Obtener criterios de salida oficiales de la metodología
  const exitCriteria = (CHECKLISTS[modo.projectType] || [])
    .filter(c => c.phase === phaseNumber)
    .map(c => c.text);

  const [localChecklist, setLocalChecklist] = useState<Record<string, boolean>>({});
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    exitCriteria.forEach(item => {
      initial[item] = phaseState.checklistOut?.[item] || false;
    });
    setLocalChecklist(initial);
  }, [phaseState.checklistOut, phaseNumber, modo.projectType]);

  const handleCheck = (item: string) => {
    if (isApproved || !canApprove) return;
    const newChecklist = { ...localChecklist, [item]: !localChecklist[item] };
    setLocalChecklist(newChecklist);
    updateModoPhase(modo.id, phaseNumber, { checklistOut: newChecklist });
  };

  const allChecked = exitCriteria.length > 0 && exitCriteria.every((item: string) => localChecklist[item]);

  const handleRequestClosure = () => {
    if (allChecked && canApprove) {
      const approvers: string[] = [];
      if (modo.team?.['Patrocinador']) approvers.push(`${modo.team['Patrocinador']} (Patrocinador)`);
      if (modo.team?.['Dueño del proceso']) approvers.push(`${modo.team['Dueño del proceso']} (Dueño del proceso)`);
      if (modo.team?.['Líder']) approvers.push(`${modo.team['Líder']} (Líder)`);
      
      const approversText = approvers.length > 0 ? approvers.join(' y ') : 'el equipo responsable';

      const newLog = {
        date: new Date().toISOString(),
        action: `Etapa ${phaseNumber} · ${title} aprobada por ${approversText}`,
        user: 'Sistema Automático'
      };

      const existingLogs = phaseState.logs || [];
      
      updateModoPhase(modo.id, phaseNumber, { 
        status: 'Aprobado', 
        approvedAt: new Date().toISOString(),
        logs: [...existingLogs, newLog]
      });
    }
  };

  const handleReopen = (reason: string) => {
    const newLog = {
      date: new Date().toISOString(),
      action: `Etapa ${phaseNumber} reabierta. Motivo: ${reason}`,
      user: currentUser?.name || 'Sistema'
    };
    const existingLogs = phaseState.logs || [];
    updateModoPhase(modo.id, phaseNumber, {
      status: 'En proceso',
      logs: [...existingLogs, newLog]
    });
    setShowReopen(false);
  };

  const handlePrintDeliverable = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 500);
    }, 100);
  };

  return (
    <>
      {isPrinting && (
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #printable-deliverable, #printable-deliverable * { visibility: visible; }
            #printable-deliverable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Main Content - 8 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="mb-2 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-md">
                  {dmaic}
                </span>
                <h3 className="text-[24px] font-bold text-slate-900 tracking-tight">Fase {phaseNumber}: {title}</h3>
              </div>
              <p className="text-[15px] text-slate-600 leading-relaxed">{description}</p>
            </div>
            
            <button 
              onClick={handlePrintDeliverable}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-colors print:hidden"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Imprimir Entregable
            </button>
          </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 print:hidden">
            <span className="material-symbols-outlined mt-0.5">error</span>
            <p className="text-[14px] font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6" id="printable-deliverable">
          {/* Printable Header */}
          <div className="hidden print:block mb-6">
            <table className="w-full border-collapse border border-slate-900 text-slate-900">
              <tbody>
                <tr>
                  <td className="border border-slate-900 p-4 text-center font-bold text-[13px] w-[20%]">
                    <img src="/logo_chesa.png" alt="Grupo Chesa" className="w-24 mx-auto mb-2" />
                    MEJORA CONTINUA
                  </td>
                  <td className="border border-slate-900 p-4 text-center font-bold text-[16px] w-[60%] tracking-wide uppercase">
                    ENTREGABLE: {title} ({modo.projectType})<br/>
                    <span className="text-[12px] font-normal text-slate-600 mt-1 block">Fase DMAIC: {dmaic}</span>
                  </td>
                  <td className="border border-slate-900 p-2 text-left text-[11px] w-[20%]">
                    <div>Proyecto: {modo.id}</div>
                    <div>Fecha: {new Date().toLocaleDateString('es-MX')}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {children}
        </div>


      </div>

      {/* Right Column (Sidebar/Context - 4 cols) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Checklist: Criterios de Salida */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">Criterios de Salida</h4>
          <div className="flex flex-col gap-3.5">
            {exitCriteria.map((item, idx) => (
              <label key={idx} className={cn("flex items-start gap-3 cursor-pointer group", isApproved && "opacity-70 cursor-not-allowed")}>
                <input 
                  className="mt-1 rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-slate-50 transition-colors" 
                  type="checkbox" 
                  checked={!!localChecklist[item]}
                  onChange={() => handleCheck(item)}
                  disabled={isApproved}
                />
                <span className={cn("text-[14px] transition-colors leading-snug", localChecklist[item] ? "text-slate-900 font-medium" : "text-slate-700 group-hover:text-slate-900")}>{item}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            {!isApproved ? (
              canApprove ? (
                <button
                  onClick={handleRequestClosure}
                  disabled={!allChecked}
                  className="w-full bg-slate-900 text-white font-semibold text-[14px] px-4 py-3 rounded-xl shadow-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Aprobar y Cerrar Etapa</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-[13px] font-medium">
                  Solo Carlos, Ivonne y Armando pueden aprobar y cerrar la etapa.
                </div>
              )
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  disabled={true}
                  className="w-full bg-slate-400 text-white font-semibold text-[14px] px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>Etapa Cerrada</span>
                </button>
                
                <button
                  onClick={handlePrintDeliverable}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-white font-semibold text-[14px] px-4 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Ver Entregable</span>
                </button>

                {canApprove && (
                  <button
                    onClick={() => setShowReopen(true)}
                    className="w-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-[14px] px-4 py-3 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    <span>Reabrir Etapa</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Errores Comunes */}
        {erroresEvitar && erroresEvitar.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Errores a evitar
            </h4>
            <ul className="list-disc pl-5 text-[13px] text-slate-700 space-y-2 leading-relaxed">
              {erroresEvitar.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <a 
          href={manual.href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group"
        >
          <div>
            <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-primary transition-colors">{manual.title}</h4>
            <p className="text-[12px] text-slate-500 mt-0.5">Referencia metodológica oficial.</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          </div>
        </a>
      </div>
    </div>
    {showReopen && (
      <ReopenPhaseModal 
        phaseName={title} 
        onClose={() => setShowReopen(false)} 
        onConfirm={handleReopen} 
      />
    )}
    </>
  );
};