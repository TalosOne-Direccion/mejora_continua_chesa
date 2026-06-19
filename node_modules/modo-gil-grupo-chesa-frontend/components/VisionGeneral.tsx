import React, { useState } from 'react';
import { Modo, ProjectRisk, ProjectCommitment } from '../types';
import { PROJECT_PHASES } from '../constants';
import { cn } from '../utils';
import { useAppStore } from '../store';
import { AddRiskModal } from './AddRiskModal';

export const VisionGeneral: React.FC<{ modo: Modo, onNavigateToPhase?: (phaseNum: number) => void }> = ({ modo, onNavigateToPhase }) => {
  const { updateModoRisks, formatos, updateModoPhase, updateModoCompromisos, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser.name);
  const phaseNames = PROJECT_PHASES[modo.projectType] || [];
  const totalPhases = phaseNames.length;
  const [showRiskModal, setShowRiskModal] = useState(false);

  const handleAddRisk = (risk: ProjectRisk) => {
    const newRisks = [...(modo.risks || []), risk];
    updateModoRisks(modo.id, newRisks);
    setShowRiskModal(false);
  };

  // Estadísticas del proyecto
  // 1. Tareas de Fase 2 (o Fase 3 para Reingeniería)
  const tasks = ((modo.projectType === 'Reingeniería' 
    ? modo.phases[3]?.data?.tasks 
    : modo.phases[2]?.data?.tasks) || []) as any[];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.estado === 'Listo').length;
  const inProgressTasks = tasks.filter(t => t.estado === 'En curso').length;

  // 2. Documentos
  const projectDocsCount = (formatos || []).filter(f => f.projectId === modo.id).length;
  const controlDocs = (modo.phases[4]?.data?.controlDocumental || []) as any[];
  const totalControlDocs = controlDocs.length;

  // 3. Juntas de seguimiento
  const totalMeetings = modo.agendas?.length || 0;

  // Cálculos de desempeño
  const todayStr = new Date().toISOString().split('T')[0];
  let compCount = 0;
  let progCount = 0;
  let delayCount = 0;
  let notStartCount = 0;

  if (totalTasks > 0) {
    tasks.forEach(t => {
      if (t.estado === 'Listo') {
        compCount++;
      } else if (t.estado === 'En curso') {
        progCount++;
      } else {
        if (t.fechaFin && t.fechaFin < todayStr) {
          delayCount++;
        } else {
          notStartCount++;
        }
      }
    });
  } else {
    // Si no hay tareas de backlog, calculamos basándonos en el estatus de las etapas del proyecto
    phaseNames.forEach((_, idx) => {
      const phaseNum = idx + 1;
      const phaseState = modo.phases[phaseNum];
      const isApproved = phaseState?.status === 'Aprobado' || phaseState?.status === 'Completo';
      const isInProgress = phaseState?.status === 'En proceso' || modo.currentPhase === phaseNum;
      
      const schedule = phaseState?.data?.schedule || {};

      if (isApproved) {
        compCount++;
      } else if (isInProgress) {
        progCount++;
      } else {
        if (schedule.end && schedule.end < todayStr) {
          delayCount++;
        } else {
          notStartCount++;
        }
      }
    });
  }

  const totalElements = totalTasks > 0 ? totalTasks : totalPhases;
  const compPct = totalElements > 0 ? Math.round((compCount / totalElements) * 100) : 0;
  const progPct = totalElements > 0 ? Math.round((progCount / totalElements) * 100) : 0;
  const delayPct = totalElements > 0 ? Math.round((delayCount / totalElements) * 100) : 0;
  const notStartPct = totalElements > 0 ? Math.round((notStartCount / totalElements) * 100) : 0;

  // Gestión de compromisos
  const compromisos = modo.compromisos || [];

  const handleUpdateCompromiso = (id: string, field: keyof ProjectCommitment, value: any) => {
    const updated = compromisos.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateModoCompromisos(modo.id, updated);
  };

  const handleAddCompromiso = () => {
    const newComp: ProjectCommitment = {
      id: `comp_${Date.now()}`,
      text: '',
      dueDate: new Date().toISOString().split('T')[0],
      responsible: '',
      status: 'No comenzado',
      comment: ''
    };
    updateModoCompromisos(modo.id, [...compromisos, newComp]);
  };

  const handleDeleteCompromiso = (id: string) => {
    const updated = compromisos.filter(c => c.id !== id);
    updateModoCompromisos(modo.id, updated);
  };

  // Obtener/Editar datos del calendario de fases
  const getPhaseSchedule = (phaseNum: number) => {
    const phaseState = modo.phases[phaseNum];
    const schedule = phaseState?.data?.schedule || {};
    return {
      duration: schedule.duration || '5',
      start: schedule.start || '',
      end: schedule.end || ''
    };
  };

  const handleUpdateSchedule = (phaseNum: number, field: string, value: string) => {
    const phaseState = modo.phases[phaseNum] || { status: 'Pendiente', data: {} };
    const currentSchedule = phaseState.data?.schedule || {};
    const updatedSchedule = {
      ...currentSchedule,
      [field]: value
    };
    updateModoPhase(modo.id, phaseNum, {
      data: {
        ...phaseState.data,
        schedule: updatedSchedule
      }
    });
  };

  // Obtener iniciales para los avatares
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Asignar colores fijos a los avatares
  const getAvatarBg = (name: string) => {
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
      'bg-indigo-50 text-indigo-700 border-indigo-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-amber-50 text-amber-700 border-amber-200',
      'bg-rose-50 text-rose-700 border-rose-200',
      'bg-purple-50 text-purple-700 border-purple-200',
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header Panel Bento */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">{modo.name}</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
              {modo.projectType}
            </span>
            <span className={cn(
              "px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border",
              modo.status === 'On Track' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              modo.status === 'At Risk' ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-rose-50 text-rose-700 border-rose-200"
            )}>
              {modo.status === 'On Track' ? 'En Tiempo' : modo.status === 'At Risk' ? 'En Riesgo' : 'Retrasado'}
            </span>
          </div>
          <p className="text-[14px] text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-slate-400">lan</span>
            Área principal: <strong className="text-slate-700 font-semibold">{modo.area}</strong>
          </p>
        </div>

        {/* Acceso Rápido a Fase Activa */}
        <button 
          onClick={() => onNavigateToPhase && onNavigateToPhase(modo.currentPhase)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[13px] px-5 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <span>Ir a Fase Activa: {phaseNames[modo.currentPhase - 1] || `Fase ${modo.currentPhase}`}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Grid del Dashboard de Rendición de Cuentas (Fila 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Indicador de Desempeño */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">query_stats</span>
                Desempeño del Proyecto
              </h3>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Estatus del Backlog y Entregas</p>
            </div>
            
            <div className="my-6 space-y-4">
              {/* Barra Apilada */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${compPct}%` }} className="bg-emerald-500 h-full transition-all" title={`Completado: ${compPct}%`} />
                <div style={{ width: `${progPct}%` }} className="bg-blue-500 h-full transition-all" title={`En progreso: ${progPct}%`} />
                <div style={{ width: `${delayPct}%` }} className="bg-rose-500 h-full transition-all" title={`Retrasado: ${delayPct}%`} />
                <div style={{ width: `${notStartPct}%` }} className="bg-slate-300 h-full transition-all" title={`No comenzado: ${notStartPct}%`} />
              </div>

              {/* Leyenda y Detalles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[13px] border-b border-slate-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="text-slate-600 font-semibold">Completado</span>
                  </div>
                  <span className="font-bold text-slate-900">{compCount} ({compPct})</span>
                </div>
                <div className="flex items-center justify-between text-[13px] border-b border-slate-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shrink-0"></span>
                    <span className="text-slate-600 font-semibold">En progreso</span>
                  </div>
                  <span className="font-bold text-slate-900">{progCount} ({progPct}%)</span>
                </div>
                <div className="flex items-center justify-between text-[13px] border-b border-slate-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span className="text-slate-600 font-semibold">Retrasado</span>
                  </div>
                  <span className="font-bold text-slate-900">{delayCount} ({delayPct}%)</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 shrink-0"></span>
                    <span className="text-slate-600 font-semibold">No comenzado</span>
                  </div>
                  <span className="font-bold text-slate-900">{notStartCount} ({notStartPct}%)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[12px] text-slate-400 font-semibold">
              <span>Elementos totales:</span>
              <span className="text-slate-900 font-black">{totalElements} {totalTasks > 0 ? 'Tareas' : 'Etapas'}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha (2 cols): Compromisos semana anterior */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">task_alt</span>
                  Compromisos Semana Anterior
                </h3>
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Junta de rendición de cuentas</p>
              </div>
              {canEdit && (
                <button 
                  onClick={handleAddCompromiso}
                  className="text-[12px] font-bold text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl transition-all border border-slate-200 shadow-sm flex items-center gap-1.5 bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span> Añadir Compromiso
                </button>
              )}
            </div>

            <div className="flex-1 overflow-x-auto border border-slate-200 rounded-xl bg-white max-h-[220px]">
              <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-500 text-white font-bold text-[12px] border-b border-slate-200">
                    <th className="py-2 px-3 border-r border-slate-400 text-center w-[5%]">N°</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[35%]">Compromiso</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[15%] text-center">Fecha Compromiso</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[15%]">Responsable</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[15%] text-center">Estatus</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[20%]">Comentario</th>
                    <th className="py-2 px-3 text-center w-[5%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {compromisos.map((c, idx) => (
                    <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                      <td className="py-1 px-2 border-r border-slate-200 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-1 px-2 border-r border-slate-200">
                        <input 
                          type="text" 
                          value={c.text} 
                          onChange={e => handleUpdateCompromiso(c.id, 'text', e.target.value)}
                          placeholder="Escribe el compromiso..."
                          disabled={!canEdit}
                          className="w-full bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1.5 rounded outline-none text-[13px] disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="py-1 px-2 border-r border-slate-200 text-center">
                        <input 
                          type="date" 
                          value={c.dueDate} 
                          onChange={e => handleUpdateCompromiso(c.id, 'dueDate', e.target.value)}
                          disabled={!canEdit}
                          className="bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1 text-[12px] outline-none font-mono disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="py-1 px-2 border-r border-slate-200">
                        <input 
                          type="text" 
                          value={c.responsible} 
                          onChange={e => handleUpdateCompromiso(c.id, 'responsible', e.target.value)}
                          placeholder="Asignado a..."
                          disabled={!canEdit}
                          className="w-full bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1 text-[13px] outline-none font-semibold text-slate-700 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="py-1 px-2 border-r border-slate-200 text-center">
                        <select 
                          value={c.status} 
                          onChange={e => handleUpdateCompromiso(c.id, 'status', e.target.value as any)}
                          disabled={!canEdit}
                          className={cn(
                            "bg-transparent border-0 font-bold text-[12px] p-1 rounded cursor-pointer outline-none disabled:cursor-not-allowed",
                            c.status === 'Completado' ? "text-emerald-600 bg-emerald-50 border border-emerald-200" :
                            c.status === 'En progreso' ? "text-blue-600 bg-blue-50 border border-blue-200" :
                            c.status === 'Retrasado' ? "text-rose-600 bg-rose-50 border border-rose-200" :
                            "text-slate-500 bg-slate-50 border border-slate-200"
                          )}
                        >
                          <option value="No comenzado">No comenzado</option>
                          <option value="En progreso">En progreso</option>
                          <option value="Completado">Completado</option>
                          <option value="Retrasado">Retrasado</option>
                        </select>
                      </td>
                      <td className="py-1 px-2 border-r border-slate-200">
                        <input 
                          type="text" 
                          value={c.comment || ''} 
                          onChange={e => handleUpdateCompromiso(c.id, 'comment', e.target.value)}
                          placeholder="Observaciones..."
                          disabled={!canEdit}
                          className="w-full bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1 text-[12px] outline-none text-slate-600 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="py-1 px-2 text-center">
                        {canEdit && (
                          <button 
                            onClick={() => handleDeleteCompromiso(c.id)} 
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Eliminar compromiso"
                          >
                            <span className="material-symbols-outlined text-[16px] align-middle">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {compromisos.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400 italic bg-white">No hay compromisos registrados de la semana anterior. ¡Haz clic en Añadir Compromiso!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Fila 2: Estatus Semana Actual, Estadísticas Rápidas, Equipo de Trabajo, Hoja de Ruta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Estadísticas Rápidas */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Tarjeta Bento Stats */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">bar_chart</span>
                Estadísticas Rápidas
              </h3>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Resumen del backlog y entregables</p>
            </div>

            <div className="flex-1 flex flex-col gap-3 my-4 justify-center">
              {/* Stat 1: Tareas */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">checklist</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[12px]">Tareas del Backlog</h4>
                    <p className="text-[11px] text-slate-400">{totalTasks ? `${completedTasks} listas` : 'Plan no generado'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-black text-slate-900 tracking-tight">
                    {totalTasks ? `${completedTasks}/${totalTasks}` : '-'}
                  </span>
                </div>
              </div>

              {/* Stat 2: Documentos */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">folder</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[12px]">Control Documental</h4>
                    <p className="text-[11px] text-slate-400">{totalControlDocs ? 'Matriz activa' : 'Pendiente generar'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-black text-slate-900 tracking-tight">
                    {totalControlDocs || projectDocsCount || '-'}
                  </span>
                </div>
              </div>

              {/* Stat 3: Agendas */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[12px]">Juntas Registradas</h4>
                    <p className="text-[11px] text-slate-400">Historial de agendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-black text-slate-900 tracking-tight">
                    {totalMeetings}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (2 cols): Estatus Semana Actual */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">calendar_view_week</span>
                Estatus Semana Actual
              </h3>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Planificación y cronograma de etapas</p>
            </div>

            <div className="flex-1 overflow-x-auto border border-slate-200 rounded-xl bg-white mt-4 max-h-[220px]">
              <table className="w-full text-left text-[13px] border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-500 text-white font-bold text-[12px] border-b border-slate-200">
                    <th className="py-2 px-3 border-r border-slate-400 text-center w-[5%]">N°</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[45%]">Etapa</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[15%] text-center">Duración (días)</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[15%] text-center">Inicio</th>
                    <th className="py-2 px-3 border-r border-slate-400 w-[15%] text-center">Fin</th>
                    <th className="py-2 px-3 text-center w-[5%]">Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseNames.map((name, idx) => {
                    const phaseNum = idx + 1;
                    const phaseState = modo.phases[phaseNum];
                    const schedule = getPhaseSchedule(phaseNum);

                    const isApproved = phaseState?.status === 'Aprobado' || phaseState?.status === 'Completo';
                    const isInProgress = phaseState?.status === 'En proceso' || modo.currentPhase === phaseNum;

                    return (
                      <tr key={phaseNum} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="py-1 px-2 border-r border-slate-200 text-center font-bold text-slate-500">{phaseNum}</td>
                        <td className="py-1 px-3 border-r border-slate-200 font-semibold text-slate-800">{name}</td>
                        <td className="py-1 px-2 border-r border-slate-200 text-center">
                          <input 
                            type="number" 
                            value={schedule.duration} 
                            onChange={e => handleUpdateSchedule(phaseNum, 'duration', e.target.value)}
                            className="w-16 bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1 text-center rounded outline-none font-bold text-slate-800"
                            min="1"
                          />
                        </td>
                        <td className="py-1 px-2 border-r border-slate-200 text-center">
                          <input 
                            type="date" 
                            value={schedule.start} 
                            onChange={e => handleUpdateSchedule(phaseNum, 'start', e.target.value)}
                            className="bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1 text-[12px] outline-none font-mono"
                          />
                        </td>
                        <td className="py-1 px-2 border-r border-slate-200 text-center">
                          <input 
                            type="date" 
                            value={schedule.end} 
                            onChange={e => handleUpdateSchedule(phaseNum, 'end', e.target.value)}
                            className="bg-transparent border-0 hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-400 p-1 text-[12px] outline-none font-mono"
                          />
                        </td>
                        <td className="py-1 px-2 text-center">
                          <span className={cn(
                            "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border inline-block w-full text-center",
                            isApproved ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            isInProgress ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-slate-50 text-slate-450 border-slate-200"
                          )}>
                            {isApproved ? 'Listo' : isInProgress ? 'Curso' : 'Espera'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Fila 3: Equipo y Hoja de Ruta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 5: Equipo de Trabajo */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[340px]">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">groups</span>
              Equipo de Trabajo
            </h3>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Roles clave asignados</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3 my-4">
            {!modo.team || Object.keys(modo.team).length === 0 ? (
              <p className="text-[13px] text-slate-400 italic text-center p-4">Sin integrantes registrados. Agrega miembros en la Fase 1.</p>
            ) : (
              Object.entries(modo.team).map(([role, name]) => {
                const nameStr = name as string;
                return (
                  <div key={role} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] border shadow-sm shrink-0", getAvatarBg(nameStr))}>
                      {getInitials(nameStr)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-slate-900 text-[13px] truncate">{nameStr}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{role}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="pt-3 text-[11px] text-slate-400 text-center border-t border-slate-100 font-medium">
            Los roles se definen al oficializar el Acta Lean.
          </div>
        </div>

        {/* Tarjeta 6: Hoja de Ruta Metodológica */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[340px]">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">route</span>
              Hoja de Ruta Metodológica
            </h3>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Haz clic en cualquier fase para acceder directamente</p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 my-4 overflow-y-auto max-h-[220px] pr-1">
            {phaseNames.map((name, idx) => {
              const phaseNum = idx + 1;
              const phaseState = modo.phases[phaseNum];
              const isCurrent = modo.currentPhase === phaseNum;
              const isApproved = phaseState?.status === 'Aprobado' || phaseState?.status === 'Completo';
              const isInProgress = phaseState?.status === 'En proceso';

              return (
                <div 
                  key={phaseNum}
                  onClick={() => onNavigateToPhase && onNavigateToPhase(phaseNum)}
                  className={cn(
                    "border rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] min-h-[90px]",
                    isCurrent ? "border-slate-900 bg-slate-50 shadow-sm" :
                    isApproved ? "border-emerald-200 bg-emerald-50/40" :
                    isInProgress ? "border-blue-200 bg-blue-50/40" :
                    "border-slate-100 bg-slate-50/50 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                      isCurrent ? "bg-slate-900 text-white border-slate-900" :
                      isApproved ? "bg-emerald-600 text-white border-emerald-600" :
                      isInProgress ? "bg-blue-600 text-white border-blue-600" :
                      "bg-slate-200 text-slate-600 border-slate-300"
                    )}>
                      {isApproved ? (
                        <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                      ) : phaseNum}
                    </span>

                    {/* Status Badge */}
                    <span className={cn(
                      "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                      isCurrent ? "bg-slate-900 text-white" :
                      isApproved ? "bg-emerald-100 text-emerald-800" :
                      isInProgress ? "bg-blue-100 text-blue-800" :
                      "bg-slate-200 text-slate-500"
                    )}>
                      {isCurrent ? 'Activa' : isApproved ? 'Listo' : isInProgress ? 'Curso' : 'Espera'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-[12px] mt-2 line-clamp-2 leading-tight">
                    {name}
                  </h4>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Metodología oficial Chesa.</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Listo</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Curso</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Espera</span>
            </div>
          </div>
        </div>

      </div>

      {showRiskModal && (
        <AddRiskModal 
          onClose={() => setShowRiskModal(false)}
          onAdd={handleAddRisk}
        />
      )}
    </div>
  );
};