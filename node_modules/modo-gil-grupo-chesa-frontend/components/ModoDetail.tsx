import React, { useState } from 'react';
import { useAppStore } from '../store';
import { PROJECT_PHASES } from '../constants';
import { cn } from '../utils';
import { Phase1, Phase2, Phase3, Phase4, Phase5, Phase6, Phase7, GenericPhase, TallerPhase } from './Phases';
import { VisionGeneral } from './VisionGeneral';
import { DocumentosProyecto } from './DocumentosProyecto';
import { KitModo } from './KitModo';
import { EquipoProyecto } from './EquipoProyecto';
import { KPIsProyecto } from './KPIsProyecto';
import { BitacoraProyecto } from './BitacoraProyecto';

export const ModoDetail: React.FC<{ modoId: string, onBack: () => void }> = ({ modoId, onBack }) => {
  const { modos } = useAppStore();
  const modo = modos[modoId];
  const [activeTab, setActiveTab] = useState<number | 'vision' | 'docs'>(modo.currentPhase === 1 && Object.keys(modo.phases[1]?.data || {}).length === 0 ? 'vision' : modo.currentPhase);
  const [internalTab, setInternalTab] = useState<'Detalles' | 'Documentos' | 'KPIs' | 'Equipo' | 'Kit' | 'Bitácora'>('Detalles');

  if (!modo) return <div>Proyecto no encontrado</div>;

  const phaseNames = PROJECT_PHASES[modo.projectType];

  const renderContent = () => {
    if (activeTab === 'vision') return <VisionGeneral modo={modo} onNavigateToPhase={(p) => setActiveTab(p)} />;
    if (activeTab === 'docs') return <DocumentosProyecto modo={modo} />;

    if (internalTab === 'Equipo') return <EquipoProyecto modo={modo} />;
    if (internalTab === 'Kit') return <KitModo modo={modo} />; 
    if (internalTab === 'Documentos') return <DocumentosProyecto modo={modo} />;
    if (internalTab === 'KPIs') return <KPIsProyecto modo={modo} />;
    if (internalTab === 'Bitácora') return <BitacoraProyecto modo={modo} />;
    if (internalTab !== 'Detalles') return (
      <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm mt-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-slate-300 text-[40px]">construction</span>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 mb-2">Pestaña en construcción</h3>
        <p className="text-[15px] text-slate-500 max-w-md mx-auto">Esta vista estará disponible en la Fase 2 del desarrollo de la plataforma.</p>
      </div>
    );

    if (modo.projectType === 'MODO' || modo.projectType === 'Reingeniería' || (modo.projectType === 'Taller de Herramientas' && activeTab === 1)) {
      switch (activeTab) {
        case 1: return <Phase1 modo={modo} />;
        case 2: return <Phase2 modo={modo} />;
        case 3: return <Phase3 modo={modo} />;
        case 4: return <Phase4 modo={modo} />;
        case 5: return <Phase5 modo={modo} />;
        case 6: return <Phase6 modo={modo} />;
        case 7: return <Phase7 modo={modo} />;
        default: return null;
      }
    } else if (modo.projectType === 'Taller de Herramientas') {
      return <TallerPhase modo={modo} phaseNumber={activeTab as number} title={phaseNames[(activeTab as number) - 1]} />;
    } else {
      return <GenericPhase modo={modo} phaseNumber={activeTab as number} title={phaseNames[(activeTab as number) - 1]} />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-[13px] mb-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Regresar al Portafolio
      </button>

      {/* Document Control Header */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
        <div className="flex justify-between items-start pl-2">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-slate-100 text-slate-700 font-mono text-[12px] font-bold px-2.5 py-1 rounded-md border border-slate-200">{modo.id.toUpperCase()}-2024</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">Rev. 01</span>
            </div>
            <h2 className="text-[28px] font-black text-slate-900 tracking-tight">{modo.name}</h2>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            <div>
              <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Última actualización</p>
              <p className="text-[14px] font-medium text-slate-700 mt-0.5">Hoy, 09:41 AM</p>
            </div>
            <button 
              onClick={() => setActiveTab('vision')}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold border transition-colors shadow-sm", activeTab === 'vision' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Visión General
            </button>
          </div>
        </div>
        <div className="flex gap-12 border-t border-slate-100 pt-6 pl-2">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Área</span>
            <p className="text-[15px] font-semibold text-slate-800 mt-1">{modo.area}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Líder</span>
            <p className="text-[15px] font-semibold text-slate-800 mt-1">{modo.team['Líder'] || 'No asignado'}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tipo</span>
            <p className="text-[15px] font-semibold text-slate-800 mt-1">{modo.projectType}</p>
          </div>
        </div>
      </div>

      {/* Dynamic Stepper (Horizontal) */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between w-full relative min-w-[800px] px-4">
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-10 rounded-full"></div>
          <div className="absolute top-5 left-8 h-1 bg-primary -z-10 rounded-full transition-all duration-700 ease-out" style={{ width: `calc(${((modo.currentPhase - 1) / Math.max(1, phaseNames.length - 1)) * 100}% - 2rem)` }}></div>
          
          {phaseNames.map((nameFull, idx) => {
            const phaseNum = idx + 1;
            const isApproved = modo.phases[phaseNum]?.status === 'Aprobado' || modo.phases[phaseNum]?.status === 'Completo';
            const isActive = activeTab === phaseNum;
            const isLocked = phaseNum > modo.currentPhase;
            const name = nameFull.split(' ')[0]; 

            return (
              <button 
                key={phaseNum}
                onClick={() => !isLocked && setActiveTab(phaseNum)}
                disabled={isLocked}
                className={cn("flex flex-col items-center gap-3 bg-white px-2 transition-all group", isLocked && "opacity-40 cursor-not-allowed")}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center ring-[6px] ring-white transition-all duration-300",
                  isApproved && !isActive ? "bg-primary text-white" : 
                  isActive ? "bg-white border-4 border-primary text-primary shadow-md scale-110" : 
                  "bg-slate-100 text-slate-400 border-2 border-slate-200"
                )}>
                  {isApproved && !isActive ? <span className="material-symbols-outlined text-[20px]">check</span> : <span className="text-[14px] font-bold">{phaseNum}</span>}
                </div>
                <span className={cn(
                  "text-[13px] font-bold transition-colors",
                  isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-800"
                )}>
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="border-b border-slate-200 flex gap-8 px-2 overflow-x-auto mt-8">
        {(['Detalles', 'Documentos', 'KPIs', 'Equipo', 'Kit', 'Bitácora'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setInternalTab(tab)}
            className={cn(
              "text-[14px] font-bold pb-4 px-1 whitespace-nowrap transition-all relative",
              internalTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-800"
            )}
          >
            {tab === 'Detalles' ? 'Detalles de Etapa' : tab}
            {internalTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="pt-6">
        {renderContent()}
      </div>
    </div>
  );
};