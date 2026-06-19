import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Modo, MeetingAgenda, MeetingParticipant, MeetingTopic } from '../types';
import { PROJECT_PHASES } from '../constants';
import { cn } from '../utils';

export const BitacoraProyecto: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { currentUser, addPhaseLog, addAgenda, deleteAgenda } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser.name);
  const phaseNames = PROJECT_PHASES[modo.projectType];
  const [activeTab, setActiveTab] = useState<'Agendas' | 'Bitacora'>('Agendas');
  
  const [newLogs, setNewLogs] = useState<Record<number, string>>({});
  
  // Agenda Form State
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [agendaForm, setAgendaForm] = useState<Omit<MeetingAgenda, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    avance: '',
    acuerdosAnteriores: '',
    estatus: 'En tiempo',
    proximosPasos: ''
  });

  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [topics, setTopics] = useState<MeetingTopic[]>([]);

  const [customPartName, setCustomPartName] = useState('');
  const [customPartRole, setCustomPartRole] = useState('');

  const [newTopic, setNewTopic] = useState('');
  const [newTopicResp, setNewTopicResp] = useState('');
  const [newTopicDuration, setNewTopicDuration] = useState('0:15');

  const initializeAgendaForm = () => {
    const list: MeetingParticipant[] = [];
    if (modo.team) {
      Object.entries(modo.team).forEach(([role, name]) => {
        const nameStr = name as string;
        if (nameStr && nameStr.trim()) {
          list.push({ name: nameStr.trim(), role, attended: true });
        }
      });
    }
    // Add default members if list is empty
    if (list.length === 0) {
      list.push({ name: 'Líder de Mejora Continua', role: 'Mejora Continua', attended: true });
    }
    setParticipants(list);
    setTopics([
      { topic: 'Bienvenida y objetivo de la sesión', responsible: 'Mejora Continua', duration: '0:05' }
    ]);
    setShowAgendaForm(true);
  };

  const handleAddCustomParticipant = () => {
    if (!customPartName.trim()) return;
    setParticipants([...participants, {
      name: customPartName.trim(),
      role: customPartRole.trim() || 'Participante',
      attended: true
    }]);
    setCustomPartName('');
    setCustomPartRole('');
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setTopics([...topics, {
      topic: newTopic.trim(),
      responsible: newTopicResp.trim() || 'Responsable',
      duration: newTopicDuration.trim()
    }]);
    setNewTopic('');
    setNewTopicResp('');
    setNewTopicDuration('0:15');
  };

  const sumDurations = (topicList: MeetingTopic[]) => {
    let totalMinutes = 0;
    topicList.forEach(t => {
      const parts = t.duration.split(':');
      if (parts.length === 2) {
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(h) && !isNaN(m)) {
          totalMinutes += h * 60 + m;
        }
      } else {
        const mins = parseInt(t.duration, 10);
        if (!isNaN(mins)) totalMinutes += mins;
      }
    });
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const handleAddLog = (phaseNum: number) => {
    const text = newLogs[phaseNum]?.trim();
    if (!text) return;
    
    addPhaseLog(modo.id, phaseNum, {
      action: text,
      user: currentUser.name
    });
    
    setNewLogs(prev => ({ ...prev, [phaseNum]: '' }));
  };

  const handleAddAgenda = () => {
    addAgenda(modo.id, {
      ...agendaForm,
      participants,
      topics
    });
    setShowAgendaForm(false);
    setAgendaForm({
      date: new Date().toISOString().split('T')[0],
      avance: '',
      acuerdosAnteriores: '',
      estatus: 'En tiempo',
      proximosPasos: ''
    });
    setParticipants([]);
    setTopics([]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl mt-8 shadow-sm p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400 text-[24px]">view_timeline</span>
          <h3 className="font-bold text-slate-800 text-[18px]">Seguimiento del MODO</h3>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('Agendas')}
            className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", activeTab === 'Agendas' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Agendas de Juntas
          </button>
          <button 
            onClick={() => setActiveTab('Bitacora')}
            className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", activeTab === 'Bitacora' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Bitácora Técnica
          </button>
        </div>
      </div>
      
      {activeTab === 'Agendas' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[15px] font-bold text-slate-800">Histórico de Juntas</h4>
            {canEdit && (
              <button 
                onClick={() => {
                  if (showAgendaForm) {
                    setShowAgendaForm(false);
                  } else {
                    initializeAgendaForm();
                  }
                }}
                className="px-4 py-2 bg-slate-900 text-white text-[13px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">{showAgendaForm ? 'close' : 'add'}</span>
                {showAgendaForm ? 'Cancelar' : 'Nueva Agenda'}
              </button>
            )}
          </div>

          {showAgendaForm && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Fecha</label>
                  <input type="date" value={agendaForm.date} onChange={e => setAgendaForm({...agendaForm, date: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-primary bg-white" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Estatus del Proyecto</label>
                  <select value={agendaForm.estatus} onChange={e => setAgendaForm({...agendaForm, estatus: e.target.value as any})} className="w-full p-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-primary bg-white">
                    <option value="En tiempo">En tiempo</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="En riesgo">En riesgo</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
              </div>

              {/* Tabla de Participantes y Asistencia */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-[12px] font-bold text-slate-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">how_to_reg</span>
                    Participantes y Asistencia
                  </span>
                </div>
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-2.5 px-4 w-[45%]">Nombre</th>
                      <th className="py-2.5 px-4 w-[45%]">Puesto / Equipo</th>
                      <th className="py-2.5 px-4 w-[10%] text-center">Asistió</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-2 px-4 font-semibold text-slate-800">{p.name}</td>
                        <td className="py-2 px-4 text-slate-500">{p.role}</td>
                        <td className="py-2 px-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={p.attended}
                            onChange={() => {
                              const updated = [...participants];
                              updated[idx].attended = !updated[idx].attended;
                              setParticipants(updated);
                            }}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4 bg-slate-50 transition-all cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                    {/* Fila para agregar participante personalizado */}
                    <tr className="bg-slate-50/50">
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="Agregar nombre..." 
                          value={customPartName}
                          onChange={e => setCustomPartName(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-[12px] outline-none bg-white focus:border-slate-400"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="Puesto o Equipo..." 
                          value={customPartRole}
                          onChange={e => setCustomPartRole(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-[12px] outline-none bg-white focus:border-slate-400"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button 
                          type="button"
                          onClick={handleAddCustomParticipant}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold transition-colors"
                        >
                          Añadir
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tabla de Agenda / Temas Relevantes */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-[12px] font-bold text-slate-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">list_alt</span>
                    Temas Relevantes
                  </span>
                  <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Duración Total: {sumDurations(topics)}
                  </span>
                </div>
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-2.5 px-4 w-[50%]">Temas Relevantes</th>
                      <th className="py-2.5 px-4 w-[35%]">Responsable</th>
                      <th className="py-2.5 px-4 w-[15%] text-right">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics.map((t, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-2 px-4 text-slate-800 font-semibold">{t.topic}</td>
                        <td className="py-2 px-4 text-slate-500">{t.responsible}</td>
                        <td className="py-2 px-4 text-right font-mono font-medium text-slate-755">
                          <span>{t.duration}</span>
                          <button 
                            type="button" 
                            onClick={() => setTopics(topics.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-600 ml-2"
                            title="Eliminar tema"
                          >
                            <span className="material-symbols-outlined text-[16px] align-middle">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Fila para agregar nuevo tema */}
                    <tr className="bg-slate-50/50">
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="Agregar tema..." 
                          value={newTopic}
                          onChange={e => setNewTopic(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-[12px] outline-none bg-white focus:border-slate-400"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="Responsable..." 
                          value={newTopicResp}
                          onChange={e => setNewTopicResp(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-[12px] outline-none bg-white focus:border-slate-400"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <input 
                            type="text" 
                            placeholder="0:15" 
                            value={newTopicDuration}
                            onChange={e => setNewTopicDuration(e.target.value)}
                            className="w-16 p-1.5 border border-slate-200 rounded text-[12px] text-center font-mono outline-none bg-white focus:border-slate-400"
                          />
                          <button 
                            type="button"
                            onClick={handleAddTopic}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold transition-colors"
                          >
                            Añadir
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Aspectos Positivos y Avances clave</label>
                <textarea rows={2} value={agendaForm.avance} onChange={e => setAgendaForm({...agendaForm, avance: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-primary bg-white" placeholder="¿Qué se presentó en esta junta?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Revisión de Compromisos Anteriores</label>
                  <textarea rows={2} value={agendaForm.acuerdosAnteriores} onChange={e => setAgendaForm({...agendaForm, acuerdosAnteriores: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-primary bg-white" placeholder="Acuerdos de la junta pasada..." />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Nuevos Compromisos y Próximos Pasos</label>
                  <textarea rows={2} value={agendaForm.proximosPasos} onChange={e => setAgendaForm({...agendaForm, proximosPasos: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-primary bg-white" placeholder="¿Qué sigue?" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleAddAgenda} disabled={!agendaForm.avance && topics.length === 0} className="px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">Guardar Agenda</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {(!modo.agendas || modo.agendas.length === 0) ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <span className="material-symbols-outlined text-slate-300 text-[48px] mb-2">event_note</span>
                <p className="text-slate-500 text-[14px]">No hay agendas de juntas registradas.</p>
              </div>
            ) : (
              [...modo.agendas].reverse().map(ag => (
                <div key={ag.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600">calendar_month</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-[15px]">{new Date(ag.date + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                        <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block border", 
                          ag.estatus === 'En tiempo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          ag.estatus === 'Atrasado' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          ag.estatus === 'En riesgo' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                        )}>{ag.estatus === 'En tiempo' ? 'En Tiempo' : ag.estatus === 'Atrasado' ? 'Atrasado' : ag.estatus === 'En riesgo' ? 'En Riesgo' : 'Completado'}</span>
                      </div>
                    </div>
                    {canEdit && (
                      <button onClick={() => deleteAgenda(modo.id, ag.id)} className="text-slate-400 hover:text-red-600 p-1 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Participantes y Asistencia en el Historial */}
                  {ag.participants && ag.participants.length > 0 && (
                    <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                      <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wide block mb-2">Asistencia de Participantes</span>
                      <div className="flex flex-wrap gap-2">
                        {ag.participants.map((p, pIdx) => (
                          <span 
                            key={pIdx} 
                            className={cn(
                              "text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 font-semibold",
                              p.attended 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60"
                            )}
                          >
                            <span className="material-symbols-outlined text-[12px] font-bold">
                              {p.attended ? 'check' : 'close'}
                            </span>
                            {p.name} <span className="font-normal opacity-85">({p.role})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agenda / Temas en el Historial */}
                  {ag.topics && ag.topics.length > 0 && (
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/20">
                      <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Agenda y Tiempos</span>
                        <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Total: {sumDurations(ag.topics)}
                        </span>
                      </div>
                      <table className="w-full text-left text-[12px] border-collapse">
                        <thead>
                          <tr className="bg-white border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px]">
                            <th className="py-2 px-3">Tema Relevante</th>
                            <th className="py-2 px-3">Responsable</th>
                            <th className="py-2 px-3 text-right">Duración</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ag.topics.map((t, tIdx) => (
                            <tr key={tIdx} className="border-b border-slate-100/50 last:border-0 hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-800">{t.topic}</td>
                              <td className="py-2 px-3 text-slate-500">{t.responsible}</td>
                              <td className="py-2 px-3 text-right font-mono text-slate-600">{t.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="space-y-4 text-[13px] pt-2 border-t border-slate-50">
                    {ag.avance && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-1">Aspectos Positivos y Avances:</span>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">{ag.avance}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ag.acuerdosAnteriores && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-700 block mb-1">Revisión de Compromisos Anteriores:</span>
                          <p className="text-slate-600 whitespace-pre-line leading-relaxed">{ag.acuerdosAnteriores}</p>
                        </div>
                      )}
                      {ag.proximosPasos && (
                        <div className="bg-slate-900/5 p-3 rounded-lg border border-slate-900/10">
                          <span className="font-bold text-slate-950 block mb-1">Nuevos Compromisos y Próximos Pasos:</span>
                          <p className="text-slate-850 whitespace-pre-line leading-relaxed">{ag.proximosPasos}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'Bitacora' && (
        <div className="space-y-8">
          {phaseNames.map((nameFull, idx) => {
            const phaseNum = idx + 1;
            const phaseState = modo.phases[phaseNum];
            
            // Only show active or past phases
            if (phaseNum > modo.currentPhase && !phaseState) return null;
            
            const logs = phaseState?.logs || [];
            
            return (
              <div key={phaseNum} className="relative pl-6 border-l-2 border-slate-100 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary"></div>
                <h4 className="font-bold text-slate-800 text-[15px] mb-4">Etapa {phaseNum} - {nameFull}</h4>
                
                <div className="space-y-4 mb-4">
                  {logs.length === 0 ? (
                    <p className="text-[13px] text-slate-400 italic">No hay avances registrados en esta etapa.</p>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[13px] text-slate-700 font-medium mb-1">{log.action}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="material-symbols-outlined text-[12px]">person</span> {log.user}
                          <span className="text-slate-300">•</span>
                          <span className="material-symbols-outlined text-[12px]">schedule</span> {log.date}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {canEdit && (
                  <div className="flex gap-2 items-start mt-2">
                    <input 
                      type="text"
                      value={newLogs[phaseNum] || ''}
                      onChange={e => setNewLogs(prev => ({ ...prev, [phaseNum]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddLog(phaseNum);
                      }}
                      placeholder="Agregar avance o comentario..."
                      className="flex-1 h-9 px-3 text-[13px] rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    />
                    <button 
                      onClick={() => handleAddLog(phaseNum)}
                      disabled={!newLogs[phaseNum]?.trim()}
                      className="h-9 px-4 bg-slate-900 text-white text-[13px] font-bold rounded-lg hover:bg-slate-850 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
