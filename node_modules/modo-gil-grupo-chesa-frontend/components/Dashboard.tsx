import React, { useState } from 'react';
import { useAppStore } from '../store';
import { AREAS, PROJECT_PHASES } from '../constants';
import { ProjectType } from '../types';
import { canEditModo } from '../utils';

export const Dashboard: React.FC<{ onSelectModo: (id: string) => void }> = ({ onSelectModo }) => {
  const { modos, addModo, deleteModo, currentUser } = useAppStore();
  const allModos = Object.values(modos);
  const canEdit = canEditModo(currentUser?.name);

  const [filterArea, setFilterArea] = useState('Todas las Áreas');
  const [filterType, setFilterType] = useState('Todos los Tipos');

  const visibleModos = allModos.filter(m => {
    if (filterArea !== 'Todas las Áreas' && m.area !== filterArea) return false;
    if (filterType !== 'Todos los Tipos' && m.projectType !== filterType) return false;
    return true;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    projectType: ProjectType;
    area: string;
  }>({
    name: '',
    projectType: 'MODO',
    area: ''
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.area) return;

    const newId = addModo({
      name: formData.name,
      projectType: formData.projectType,
      area: formData.area
    });
    
    setIsModalOpen(false);
    onSelectModo(newId);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const modo = modos[id];
    if (!modo) return;

    if (modo.progress === 100) {
      const confirmWord = window.prompt(
        'Este proyecto está finalizado (100%). Para confirmar la eliminación, escriba la palabra "borrar":'
      );
      if (confirmWord === 'borrar') {
        deleteModo(id);
      } else if (confirmWord !== null) {
        window.alert('Confirmación incorrecta. El proyecto no ha sido eliminado.');
      }
    } else {
      if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
        deleteModo(id);
      }
    }
  };

  const activeCount = allModos.length;
  const avgProgress = activeCount > 0 ? Math.round(allModos.reduce((acc, m) => acc + m.progress, 0) / activeCount) : 0;
  const criticalCount = allModos.filter(m => m.status === 'At Risk' || m.status === 'Delayed').length;

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Hero Section with Industrial Background */}
      <div className="-mt-8 -mx-8 mb-10 relative bg-[#0a1118] overflow-hidden shadow-2xl border-b-[4px] border-orange-500">
        <img src="/hero_bg.png" alt="Industrial Factory" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity grayscale-[30%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001e40]/95 via-[#001e40]/70 to-transparent"></div>
        <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 flex flex-col items-start justify-center text-left max-w-4xl">
             <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-0.5 bg-orange-500"></span>
                <span className="text-orange-400 font-bold tracking-[0.15em] uppercase text-[11px]">Portafolio de Proyectos Mejora Continua</span>
             </div>
             <h1 className="text-4xl md:text-[46px] lg:text-[50px] font-black text-white leading-[1.15] mb-5 tracking-tight">
                 Impulsando la Excelencia desde <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Nuestra Operación</span>
             </h1>
             <p className="text-slate-300 text-[15px] md:text-[16px] max-w-2xl mb-8 font-light leading-relaxed">
                 Construimos una operación más confiable, eficiente y sostenible, que genera valor para toda la organización.
             </p>
             {canEdit && (
               <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 font-bold tracking-widest text-[13px] uppercase transition-all flex items-center gap-3 shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.4)] rounded-none border border-orange-400/50 hover:-translate-y-0.5">
                   Nuevo Proyecto
                   <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
               </button>
             )}
        </div>
      </div>
      
      <div className="space-y-12">

      {/* Global Filters */}
      <div className="bg-white p-6 shadow-sm border border-slate-200 flex flex-wrap gap-5 items-end rounded-sm relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800"></div>
        <div className="flex-1 min-w-[200px] ml-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Área</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-none text-[14px] font-semibold text-slate-700 px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            value={filterArea}
            onChange={e => setFilterArea(e.target.value)}
          >
            <option>Todas las Áreas</option>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tipo de Proyecto</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-none text-[14px] font-semibold text-slate-700 px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option>Todos los Tipos</option>
            <option>MODO</option>
            <option>Reingeniería</option>
            <option>Taller de Herramientas</option>
          </select>
        </div>
        <button className="px-6 py-3 bg-slate-900 border border-slate-900 text-white font-bold tracking-wider uppercase text-[12px] rounded-none hover:bg-orange-500 hover:border-orange-500 transition-all flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined mr-2 text-[18px]">filter_list</span>
          Filtrar
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-sm border border-slate-200 flex items-start gap-5 hover:shadow-md transition-shadow relative rounded-sm group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
            <span className="material-symbols-outlined text-[100px] leading-none">precision_manufacturing</span>
          </div>
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
            <span className="text-[18px] font-bold text-orange-500">01</span>
          </div>
          <div className="relative z-10 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Proyectos Activos</p>
            <p className="text-[32px] font-black text-slate-900 leading-none mt-2">{activeCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-sm border border-slate-200 flex items-start gap-5 hover:shadow-md transition-shadow relative rounded-sm group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
            <span className="material-symbols-outlined text-[100px] leading-none">timeline</span>
          </div>
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
            <span className="text-[18px] font-bold text-orange-500">02</span>
          </div>
          <div className="flex-1 relative z-10 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avance Promedio</p>
            <div className="flex items-end gap-3 mt-2">
              <p className="text-[32px] font-black text-slate-900 leading-none">{avgProgress}%</p>
              <div className="flex-1 h-1.5 bg-slate-100 mb-2 overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${avgProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a1118] p-6 shadow-sm border border-slate-800 flex items-start gap-5 hover:shadow-md transition-shadow relative rounded-sm group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 text-white">
            <span className="material-symbols-outlined text-[100px] leading-none">warning</span>
          </div>
          <div className="absolute left-0 top-0 w-1 h-full bg-red-500"></div>
          <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center text-red-400 shrink-0">
            <span className="text-[18px] font-bold">03</span>
          </div>
          <div className="relative z-10 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bloqueos Críticos</p>
            <p className="text-[32px] font-black text-white leading-none mt-2">{criticalCount}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleModos.map(modo => {
          const isFinished = modo.progress === 100;
          const isGreen = modo.status === 'On Track';
          const isYellow = modo.status === 'Delayed';
          
          const topBarColor = isFinished ? 'bg-primary' : isGreen ? 'bg-emerald-500' : isYellow ? 'bg-amber-400' : 'bg-red-500';
          const semBg = isFinished ? 'bg-primary/10' : isGreen ? 'bg-emerald-50' : isYellow ? 'bg-amber-50' : 'bg-red-50';
          const semText = isFinished ? 'text-primary' : isGreen ? 'text-emerald-700' : isYellow ? 'text-amber-700' : 'text-red-700';
          const semDot = isFinished ? 'bg-primary' : isGreen ? 'bg-emerald-500' : isYellow ? 'bg-amber-500' : 'bg-red-500';
          const semLabel = isFinished ? 'Finalizado' : isGreen ? 'En Tiempo' : isYellow ? 'Retraso Leve' : 'Bloqueado';

          const phaseNames = PROJECT_PHASES[modo.projectType];
          const currentPhaseName = phaseNames[modo.currentPhase - 1] || 'Completado';

          return (
            <article 
              key={modo.id} 
              onClick={() => onSelectModo(modo.id)}
              className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 relative group cursor-pointer flex flex-col"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${topBarColor.replace('bg-primary', 'bg-[#001e40]')}`}></div>
              
              {/* Delete Button (Only if not finished and user has edit permissions) */}
              {!isFinished && canEdit && (
                <button 
                  onClick={(e) => handleDelete(e, modo.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-sm"
                  title="Eliminar proyecto"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4 pr-8">
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {modo.projectType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {modo.area}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-[18px] font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                  {modo.name}
                </h3>
                
                {isFinished && modo.expirationDate ? (
                  <div className="mb-6 flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-lg w-fit mt-2">
                    <span className="material-symbols-outlined text-[18px]">event_available</span>
                    <span className="text-[13px] font-semibold">Vigencia: {new Date(modo.expirationDate).toLocaleDateString('es-MX')}</span>
                  </div>
                ) : (
                  <p className="text-[14px] text-slate-500 mb-6 line-clamp-2 mt-1">
                    Proyecto de mejora continua en fase de {currentPhaseName.toLowerCase()}.
                  </p>
                )}
                
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                      {isFinished ? 'Completado' : `Fase ${modo.currentPhase}: ${currentPhaseName.split(' ')[0]}`}
                    </span>
                    <span className="text-[14px] font-bold text-slate-900">{modo.progress}%</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    {phaseNames.map((_, idx) => {
                      const p = idx + 1;
                      return (
                        <div key={p} className={`flex-1 rounded-full ${
                          p < modo.currentPhase || isFinished ? 'bg-primary' : 
                          p === modo.currentPhase ? `bg-primary/40` : 
                          'bg-slate-100'
                        }`}></div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[12px]">
                    {modo.team['Líder'] ? modo.team['Líder'].substring(0,2).toUpperCase() : 'ND'}
                  </div>
                  <span className="text-[13px] font-medium text-slate-600">
                    {modo.team['Líder'] || 'Sin asignar'}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 ${semBg} rounded-full shrink-0`}>
                  <span className={`w-2 h-2 rounded-full ${semDot}`}></span>
                  <span className={`text-[12px] font-bold ${semText}`}>{semLabel}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8 transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900">Crear Nuevo Proyecto</h2>
                <p className="text-[14px] text-slate-500 mt-1">Selecciona el tipo de iniciativa a implementar.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-8 space-y-8">
              
              {/* Project Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <label className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${formData.projectType === 'MODO' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50'}`}>
                  <input type="radio" name="projectType" value="MODO" checked={formData.projectType === 'MODO'} onChange={() => setFormData({...formData, projectType: 'MODO', area: ''})} className="hidden" />
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-5 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">bolt</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-2">Proyecto MODO</h3>
                  <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">Metodología de mejora continua en 7 fases. Ideal para optimización de procesos existentes.</p>
                  <span className={`text-[13px] font-bold flex items-center gap-1 ${formData.projectType === 'MODO' ? 'text-primary' : 'text-slate-400'}`}>
                    Seleccionar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </label>

                <label className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${formData.projectType === 'Reingeniería' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50'}`}>
                  <input type="radio" name="projectType" value="Reingeniería" checked={formData.projectType === 'Reingeniería'} onChange={() => setFormData({...formData, projectType: 'Reingeniería', area: AREAS[0]})} className="hidden" />
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-5 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">settings</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-2">Reingeniería</h3>
                  <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">Rediseño radical y creación de nuevos procesos core. Requiere asignación estricta de alcance.</p>
                  <span className={`text-[13px] font-bold flex items-center gap-1 ${formData.projectType === 'Reingeniería' ? 'text-primary' : 'text-slate-400'}`}>
                    Seleccionar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </label>

                <label className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${formData.projectType === 'Taller de Herramientas' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50'}`}>
                  <input type="radio" name="projectType" value="Taller de Herramientas" checked={formData.projectType === 'Taller de Herramientas'} onChange={() => setFormData({...formData, projectType: 'Taller de Herramientas', area: ''})} className="hidden" />
                  <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-5 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">build</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-2">Taller de Herramientas</h3>
                  <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">Implementación rápida de herramientas específicas (5S, Kanban, etc.) sin el ciclo completo.</p>
                  <span className={`text-[13px] font-bold flex items-center gap-1 ${formData.projectType === 'Taller de Herramientas' ? 'text-primary' : 'text-slate-400'}`}>
                    Seleccionar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 border border-slate-300 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Ej. Optimización de entregas"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Área Principal</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-xl text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                  >
                    <option value="" disabled>Selecciona un área...</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-[14px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white text-[14px] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};