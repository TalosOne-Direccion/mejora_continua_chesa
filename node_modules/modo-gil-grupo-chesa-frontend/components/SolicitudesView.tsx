import React, { useState } from 'react';
import { useAppStore } from '../store';
import { SolicitudType, SolicitudTag, ProjectType } from '../types';
import { cn, canEditModo } from '../utils';

export const SolicitudesView: React.FC = () => {
  const { currentUser, solicitudes, addSolicitud, updateSolicitudStatus, deleteSolicitud, areas, addModo } = useAppStore();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [approvalModal, setApprovalModal] = useState<{ isOpen: boolean, solicitudId: string | null }>({ isOpen: false, solicitudId: null });
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>('MODO');

  const allSolicitudes = Object.values(solicitudes).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const isAdmin = canEditModo(currentUser?.name);

  const handleApprove = (id: string) => {
    setApprovalModal({ isOpen: true, solicitudId: id });
  };

  const confirmApproval = () => {
    if (approvalModal.solicitudId) {
      const solicitud = solicitudes[approvalModal.solicitudId];
      
      // 1. Update status
      updateSolicitudStatus(approvalModal.solicitudId, 'Aprobada');
      
      // 2. Create new project based on the request
      addModo({
        name: solicitud.title,
        projectType: selectedProjectType,
        area: solicitud.area
      });

      setApprovalModal({ isOpen: false, solicitudId: null });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Solicitudes de Mejora</h2>
          <p className="text-[15px] text-slate-500 mt-1">Buzón de ideas, necesidades tecnológicas y problemas operativos.</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-[14px] hover:bg-primary/90 transition-all shadow-sm hover:shadow w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nueva Solicitud
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Nuevas */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider px-2">Nuevas ({allSolicitudes.filter(s => s.status === 'Nueva').length})</h3>
          {allSolicitudes.filter(s => s.status === 'Nueva').map(s => (
            <SolicitudCard key={s.id} solicitud={s} onStatusChange={updateSolicitudStatus} onApprove={handleApprove} onDelete={deleteSolicitud} isAdmin={isAdmin} />
          ))}
        </div>
        {/* Columna 2: En Revisión */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider px-2">En Revisión ({allSolicitudes.filter(s => s.status === 'En Revisión').length})</h3>
          {allSolicitudes.filter(s => s.status === 'En Revisión').map(s => (
            <SolicitudCard key={s.id} solicitud={s} onStatusChange={updateSolicitudStatus} onApprove={handleApprove} onDelete={deleteSolicitud} isAdmin={isAdmin} />
          ))}
        </div>
        {/* Columna 3: Aprobadas/Rechazadas */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider px-2">Procesadas ({allSolicitudes.filter(s => s.status === 'Aprobada' || s.status === 'Rechazada').length})</h3>
          {allSolicitudes.filter(s => s.status === 'Aprobada' || s.status === 'Rechazada').map(s => (
            <SolicitudCard key={s.id} solicitud={s} onStatusChange={updateSolicitudStatus} onApprove={handleApprove} onDelete={deleteSolicitud} isAdmin={isAdmin} />
          ))}
        </div>
      </div>

      {isWizardOpen && <SolicitudWizard onClose={() => setIsWizardOpen(false)} onSave={addSolicitud} areas={areas} currentUser={currentUser.name} />}

      {/* Approval Modal */}
      {approvalModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-[20px] font-bold text-slate-900">Aprobar Solicitud</h2>
              <p className="text-[14px] text-slate-500 mt-1">Clasifica la iniciativa para crear el proyecto.</p>
            </div>
            <div className="p-6 space-y-4">
              <label className={cn("border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", selectedProjectType === 'MODO' ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50")}>
                <input type="radio" name="projType" checked={selectedProjectType === 'MODO'} onChange={() => setSelectedProjectType('MODO')} className="text-primary focus:ring-primary" />
                <div>
                  <span className="font-bold text-slate-900 block">MODO</span>
                  <span className="text-slate-500 text-[12px]">Optimización de procesos existentes (7 fases).</span>
                </div>
              </label>
              <label className={cn("border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", selectedProjectType === 'Reingeniería' ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50")}>
                <input type="radio" name="projType" checked={selectedProjectType === 'Reingeniería'} onChange={() => setSelectedProjectType('Reingeniería')} className="text-primary focus:ring-primary" />
                <div>
                  <span className="font-bold text-slate-900 block">Reingeniería</span>
                  <span className="text-slate-500 text-[12px]">Rediseño radical de procesos core.</span>
                </div>
              </label>
              <label className={cn("border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", selectedProjectType === 'Taller de Herramientas' ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50")}>
                <input type="radio" name="projType" checked={selectedProjectType === 'Taller de Herramientas'} onChange={() => setSelectedProjectType('Taller de Herramientas')} className="text-primary focus:ring-primary" />
                <div>
                  <span className="font-bold text-slate-900 block">Taller de Herramientas</span>
                  <span className="text-slate-500 text-[12px]">Implementación rápida de herramientas específicas.</span>
                </div>
              </label>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setApprovalModal({ isOpen: false, solicitudId: null })} className="px-4 py-2 text-[14px] font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={confirmApproval} className="px-6 py-2 bg-emerald-600 text-white text-[14px] font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">Aprobar y Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SolicitudCard: React.FC<{ solicitud: any, onStatusChange: any, onApprove: (id: string) => void, onDelete: (id: string) => void, isAdmin: boolean }> = ({ solicitud, onStatusChange, onApprove, onDelete, isAdmin }) => {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Quick Win': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Proyecto Estratégico': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Backlog a Futuro': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border", getTagColor(solicitud.tag))}>
          {solicitud.tag}
        </span>
        <span className="text-[12px] text-slate-400">{new Date(solicitud.date).toLocaleDateString()}</span>
      </div>
      <h4 className="text-[16px] font-bold text-slate-900 mb-1 leading-tight">{solicitud.title}</h4>
      <p className="text-[13px] text-slate-500 mb-4">{solicitud.type} • {solicitud.area}</p>
      
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
        <p className="text-[12px] text-slate-600 line-clamp-3 italic">"{solicitud.answers.q1 || solicitud.answers.q2}"</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {solicitud.requestor.substring(0,2).toUpperCase()}
          </div>
          <span className="text-[12px] font-medium text-slate-600">{solicitud.requestor}</span>
        </div>
        
        {isAdmin && solicitud.status === 'Nueva' && (
          <button onClick={() => onStatusChange(solicitud.id, 'En Revisión')} className="text-[12px] font-bold text-primary hover:underline">Revisar</button>
        )}
        {isAdmin && solicitud.status === 'En Revisión' && (
          <div className="flex gap-2">
            <button onClick={() => onStatusChange(solicitud.id, 'Rechazada')} className="text-[12px] font-bold text-red-500 hover:underline">Rechazar</button>
            <button onClick={() => onApprove(solicitud.id)} className="text-[12px] font-bold text-emerald-600 hover:underline">Aprobar</button>
          </div>
        )}
        {solicitud.status === 'Aprobada' && <span className="text-[12px] font-bold text-emerald-600">Aprobada</span>}
        {solicitud.status === 'Rechazada' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-red-500">Rechazada</span>
            {isAdmin && (
              <button 
                onClick={() => {
                  if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la solicitud "${solicitud.title}"?`)) {
                    onDelete(solicitud.id);
                  }
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
                title="Eliminar Solicitud"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SolicitudWizard: React.FC<{ onClose: () => void, onSave: any, areas: string[], currentUser: string }> = ({ onClose, onSave, areas, currentUser }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<SolicitudType | null>(null);
  const [area, setArea] = useState(areas[0]);
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [urgency, setUrgency] = useState<number>(0);
  const [effort, setEffort] = useState<number>(0);

  const handleNext = () => {
    if (step === 1 && !type) return alert('Selecciona un tipo');
    if (step === 2 && (!title || !answers.q1)) return alert('Completa los campos obligatorios');
    if (step === 3 && (!urgency || !effort)) return alert('Selecciona urgencia y esfuerzo');
    
    if (step < 3) setStep(step + 1);
    else {
      // Calculate Tag
      let tag: SolicitudTag = 'Evaluación Pendiente';
      if ((urgency === 3 || urgency === 2) && effort === 1) tag = 'Quick Win';
      else if (urgency === 3 && (effort === 3 || effort === 2)) tag = 'Proyecto Estratégico';
      else if (urgency === 1 && (effort === 3 || effort === 2)) tag = 'Backlog a Futuro';

      onSave({ title, type, area, requestor: currentUser, answers, urgency, effort, tag });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-[20px] font-bold text-slate-900">Nueva Solicitud de Mejora</h2>
            <p className="text-[14px] text-slate-500 mt-1">Paso {step} de 3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-slate-900 mb-4">¿En qué podemos apoyarte hoy?</h3>
              <div className="grid grid-cols-1 gap-4">
                <label className={cn("border-2 rounded-xl p-5 cursor-pointer transition-all flex items-start gap-4", type === 'Idea de mejora' ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/30")}>
                  <input type="radio" name="type" className="mt-1" checked={type === 'Idea de mejora'} onChange={() => setType('Idea de mejora')} />
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-900">Idea de mejora en mi área</h4>
                    <p className="text-[13px] text-slate-500 mt-1">Tengo una propuesta para optimizar un proceso que ya controlamos.</p>
                  </div>
                </label>
                <label className={cn("border-2 rounded-xl p-5 cursor-pointer transition-all flex items-start gap-4", type === 'Nuevo sistema' ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/30")}>
                  <input type="radio" name="type" className="mt-1" checked={type === 'Nuevo sistema'} onChange={() => setType('Nuevo sistema')} />
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-900">Nuevo sistema o herramienta</h4>
                    <p className="text-[13px] text-slate-500 mt-1">Quiero proponer la adopción de nueva tecnología, software o equipo.</p>
                  </div>
                </label>
                <label className={cn("border-2 rounded-xl p-5 cursor-pointer transition-all flex items-start gap-4", type === 'Intervención' ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/30")}>
                  <input type="radio" name="type" className="mt-1" checked={type === 'Intervención'} onChange={() => setType('Intervención')} />
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-900">Solicitud de intervención</h4>
                    <p className="text-[13px] text-slate-500 mt-1">Tenemos un cuello de botella, un problema recurrente o retrabajo y necesitamos apoyo para resolverlo.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Título corto de la solicitud</label>
                  <input type="text" className="w-full p-3 border border-slate-300 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Reducción de mermas" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Área</label>
                  <select className="w-full p-3 border border-slate-300 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={area} onChange={e => setArea(e.target.value)}>
                    {areas.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              {type === 'Idea de mejora' && (
                <>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Cuál es tu idea principal de mejora?</label><textarea className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" rows={2} onChange={e => setAnswers({...answers, q1: e.target.value})}></textarea></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Qué proceso o actividad específica se verá beneficiada?</label><input type="text" className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q2: e.target.value})} /></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Cómo se realiza esta actividad actualmente?</label><textarea className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" rows={2} onChange={e => setAnswers({...answers, q3: e.target.value})}></textarea></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Cuál es el principal beneficio que esperas lograr?</label>
                    <select className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q4: e.target.value})}>
                      <option value="">Selecciona...</option><option>Reducción de tiempos</option><option>Ahorro de costos</option><option>Mayor calidad</option><option>Mejor ambiente</option>
                    </select>
                  </div>
                </>
              )}
              {type === 'Nuevo sistema' && (
                <>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Qué sistema, software o herramienta propones?</label><input type="text" className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q1: e.target.value})} /></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Qué limitación actual resolverá?</label><textarea className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" rows={2} onChange={e => setAnswers({...answers, q2: e.target.value})}></textarea></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Quiénes serán los usuarios principales?</label><input type="text" className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q3: e.target.value})} /></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">Estatus de la propuesta</label>
                    <select className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q4: e.target.value})}>
                      <option value="">Selecciona...</option><option>Idea a investigar</option><option>Tengo cotizaciones</option><option>Herramienta gratuita/existente</option>
                    </select>
                  </div>
                </>
              )}
              {type === 'Intervención' && (
                <>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Cuál es el "dolor" o problema principal?</label><textarea className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" rows={2} onChange={e => setAnswers({...answers, q1: e.target.value})}></textarea></div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Con qué frecuencia ocurre?</label>
                    <select className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q2: e.target.value})}>
                      <option value="">Selecciona...</option><option>Diario</option><option>Semanal</option><option>Mensual</option><option>Esporádico</option>
                    </select>
                  </div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Qué impacto negativo está causando?</label>
                    <select className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" onChange={e => setAnswers({...answers, q3: e.target.value})}>
                      <option value="">Selecciona...</option><option>Retrasa entrega al cliente</option><option>Genera horas extra</option><option>Provoca retrabajos</option><option>Impacto normativo</option>
                    </select>
                  </div>
                  <div><label className="block text-[13px] font-bold text-slate-700 mb-2">¿Tienen detectada la posible causa raíz? (Opcional)</label><textarea className="w-full p-3 border border-slate-300 rounded-xl text-[14px] outline-none" rows={2} onChange={e => setAnswers({...answers, q4: e.target.value})}></textarea></div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Diagnóstico de Viabilidad y Urgencia</h3>
              
              <div>
                <label className="block text-[14px] font-bold text-slate-800 mb-4">¿Qué tan crítico es abordar esta solicitud?</label>
                <div className="space-y-3">
                  <label className={cn("border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", urgency === 3 ? "border-red-500 bg-red-50" : "border-slate-200 hover:bg-slate-50")}>
                    <input type="radio" name="urgency" checked={urgency === 3} onChange={() => setUrgency(3)} />
                    <div><span className="font-bold text-slate-900">Nivel 3 (Crítico):</span> <span className="text-slate-600 text-[13px]">La operación actual está en riesgo, afecta al cliente o genera pérdidas.</span></div>
                  </label>
                  <label className={cn("border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", urgency === 2 ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:bg-slate-50")}>
                    <input type="radio" name="urgency" checked={urgency === 2} onChange={() => setUrgency(2)} />
                    <div><span className="font-bold text-slate-900">Nivel 2 (Alto):</span> <span className="text-slate-600 text-[13px]">Genera fricción constante y retrasos, pero la operación sigue funcionando.</span></div>
                  </label>
                  <label className={cn("border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", urgency === 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:bg-slate-50")}>
                    <input type="radio" name="urgency" checked={urgency === 1} onChange={() => setUrgency(1)} />
                    <div><span className="font-bold text-slate-900">Nivel 1 (Medio/Bajo):</span> <span className="text-slate-600 text-[13px]">Funciona bien, pero es oportunidad para modernizar o escalar.</span></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-slate-800 mb-4">¿De qué dependemos para que esto se haga realidad?</label>
                <div className="space-y-3">
                  <label className={cn("border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", effort === 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:bg-slate-50")}>
                    <input type="radio" name="effort" checked={effort === 1} onChange={() => setEffort(1)} />
                    <div><span className="font-bold text-slate-900">Nivel 1 (Bajo):</span> <span className="text-slate-600 text-[13px]">Está en mi control, solo necesitamos validación y guía metodológica.</span></div>
                  </label>
                  <label className={cn("border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", effort === 2 ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:bg-slate-50")}>
                    <input type="radio" name="effort" checked={effort === 2} onChange={() => setEffort(2)} />
                    <div><span className="font-bold text-slate-900">Nivel 2 (Medio):</span> <span className="text-slate-600 text-[13px]">Requiere coordinación con otra área (Sistemas, RH, Finanzas).</span></div>
                  </label>
                  <label className={cn("border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3", effort === 3 ? "border-red-500 bg-red-50" : "border-slate-200 hover:bg-slate-50")}>
                    <input type="radio" name="effort" checked={effort === 3} onChange={() => setEffort(3)} />
                    <div><span className="font-bold text-slate-900">Nivel 3 (Alto):</span> <span className="text-slate-600 text-[13px]">Requiere presupuesto nuevo, contratación o autorización de Dirección.</span></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50/50">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Atrás</button>
          ) : <div></div>}
          <button onClick={handleNext} className="px-6 py-2.5 bg-primary text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            {step === 3 ? 'Enviar Solicitud' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};