import React, { useState } from 'react';
import { useAppStore } from '../store';
import { User, Modo, Procedimiento } from '../types';
import { cn } from '../utils';

interface OrganigramaViewProps {
  onSelectModo: (id: string) => void;
}

export const OrganigramaView: React.FC<OrganigramaViewProps> = ({ onSelectModo }) => {
  const { users, modos, procedimientos, areas, sucursales } = useAppStore();

  const [filterArea, setFilterArea] = useState('Todas');
  const [filterSucursal, setFilterSucursal] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  // Determinar si un usuario coincide con los filtros activos
  const matchesFilters = (u: User) => {
    if (filterArea !== 'Todas' && !u.areas.includes(filterArea) && !u.areas.includes('Todas')) return false;
    if (filterSucursal !== 'Todas' && u.sucursales && !u.sucursales.includes(filterSucursal) && !u.sucursales.includes('Todas')) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = u.name.toLowerCase().includes(q);
      const puestoMatch = u.puesto?.toLowerCase().includes(q) || false;
      return nameMatch || puestoMatch;
    }
    
    return true;
  };

  // Obtener los usuarios raíz para el árbol visible
  const getRootUsers = () => {
    if (filterArea === 'Todas') {
      // Nodos raíz globales (sin superior o cuyo superior no existe)
      return users.filter(u => !u.reportsTo || !users.some(parent => parent.id === u.reportsTo));
    } else {
      // Encontrar usuarios del área seleccionada cuyo jefe inmediato no pertenezca a la misma área
      return users.filter(u => {
        const belongsToArea = u.areas.includes(filterArea) || u.areas.includes('Todas');
        if (!belongsToArea) return false;
        
        // Si no tiene jefe, o su jefe no está en la misma área, es un nodo raíz de esta área
        if (!u.reportsTo) return true;
        const supervisor = users.find(parent => parent.id === u.reportsTo);
        if (!supervisor) return true;
        
        const supervisorBelongsToArea = supervisor.areas.includes(filterArea) || supervisor.areas.includes('Todas');
        return !supervisorBelongsToArea;
      });
    }
  };

  const getChildren = (userId: string) => {
    const allChildren = users.filter(u => u.reportsTo === userId);
    if (filterArea === 'Todas') {
      return allChildren;
    } else {
      // Filtrar subordinados que pertenecen al área seleccionada
      return allChildren.filter(u => u.areas.includes(filterArea) || u.areas.includes('Todas'));
    }
  };

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // Buscar proyectos del usuario
  const getUserProjects = (userName: string): Modo[] => {
    return Object.values(modos).filter(m => Object.values(m.team).includes(userName));
  };

  // Buscar procedimientos asociados al puesto del usuario
  const getUserProcedures = (userPuesto?: string): Procedimiento[] => {
    if (!userPuesto) return [];
    return procedimientos.filter(p => p.puestos?.some(pos => pos.toLowerCase().trim() === userPuesto.toLowerCase().trim()));
  };

  const rootUsers = getRootUsers();

  // Renderizar un nodo y recursivamente sus hijos
  const renderTreeNode = (u: User) => {
    const children = getChildren(u.id);
    const hasChildren = children.length > 0;
    // Si hay una búsqueda activa, auto-expandimos todos los nodos para mostrar resultados
    const isCollapsed = collapsedNodes[u.id] && !searchQuery.trim();
    const isHighlighted = matchesFilters(u);
    const hasActiveFilters = filterArea !== 'Todas' || filterSucursal !== 'Todas' || searchQuery.trim() !== '';

    return (
      <div key={u.id} className="flex flex-col items-center shrink-0">
        {/* Nodo individual */}
        <div 
          onClick={() => setSelectedUser(u)}
          className={cn(
            "relative w-64 p-4 bg-white border rounded-xl shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-3 z-10",
            isHighlighted 
              ? "border-orange-500 ring-2 ring-orange-500/20" 
              : hasActiveFilters 
                ? "border-slate-200 opacity-40 hover:opacity-100" 
                : "border-slate-200"
          )}
        >
          {/* Indicador de Filtro Encontrado */}
          {isHighlighted && hasActiveFilters && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border border-white"></span>
            </span>
          )}

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-slate-100 text-slate-700 font-bold shrink-0 overflow-hidden shadow-inner">
            {u.avatar ? (
              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(u.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-[14px] font-bold text-slate-800 truncate" title={u.name}>{u.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium truncate" title={u.puesto}>{u.puesto || 'Sin Puesto'}</p>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {u.isSystemUser !== false ? (
                <span className="inline-flex px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wide">
                  {u.systemRole === 'Lector' ? 'Líder Área' : u.systemRole}
                </span>
              ) : (
                <span className="inline-flex px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-bold text-slate-700 uppercase tracking-wide">
                  {u.areas[0] || 'Organización'}
                </span>
              )}
              {u.sucursales && (
                u.sucursales.includes('Todas') ? (
                  <span className="inline-flex px-1.5 py-0.5 bg-orange-50 rounded text-[9px] font-bold text-orange-600 uppercase tracking-wide">
                    Todas
                  </span>
                ) : (
                  u.sucursales.map(s => (
                    <span key={s} className="inline-flex px-1.5 py-0.5 bg-orange-50 rounded text-[9px] font-bold text-orange-600 uppercase tracking-wide mr-0.5">
                      {s}
                    </span>
                  ))
                )
              )}
            </div>
          </div>

          {/* Botón de Colapsar/Expandir Subnivel */}
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCollapsedNodes(prev => ({ ...prev, [u.id]: !prev[u.id] }));
              }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-slate-250 hover:border-slate-400 shadow-sm flex items-center justify-center text-slate-550 hover:text-slate-800 transition-colors z-20 cursor-pointer"
              title={isCollapsed ? "Expandir subordinados" : "Colapsar subordinados"}
            >
              <span className="material-symbols-outlined text-[14px] font-bold select-none">
                {isCollapsed ? 'add' : 'remove'}
              </span>
            </button>
          )}
        </div>

        {/* Conectores y Subnodos */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center mt-6 relative w-full">
            {/* Línea vertical que baja del padre */}
            <div className="absolute top-0 w-px h-6 bg-slate-200 -mt-6"></div>

            {/* Línea horizontal que conecta a todos los hijos */}
            {children.length > 1 && (
              <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-slate-200"></div>
            )}

            {/* Hijos alineados en fila */}
            <div className="flex gap-12 pt-6 relative">
              {children.map(child => {
                return (
                  <div key={child.id} className="relative flex flex-col items-center">
                    {/* Línea vertical corta arriba de cada hijo */}
                    <div className="absolute top-0 w-px h-6 bg-slate-200 -mt-6"></div>
                    {renderTreeNode(child)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full relative h-screen bg-[#F8FAFC]">
      {/* Header and Filters Bar */}
      <div className="bg-white border-b border-slate-200 p-6 shrink-0 shadow-sm z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 text-white rounded-lg shadow-sm">
              <span className="material-symbols-outlined">badge</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Organigrama</h1>
              <p className="text-[13px] text-slate-500 font-medium">Estructura jerárquica, sucursales y responsabilidades operativas</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full md:w-80 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2">search</span>
            <input 
              type="text" 
              placeholder="Buscar colaborador o puesto..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-[13px] outline-none placeholder:text-slate-400 p-0"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Área / Macroproceso:</span>
            <select
              value={filterArea}
              onChange={e => {
                setFilterArea(e.target.value);
                setCollapsedNodes({}); // Limpiar colapsados al cambiar de área
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 px-3 py-1.5 focus:ring-1 focus:ring-orange-500 outline-none"
            >
              <option value="Todas">Todas las Áreas</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sucursal:</span>
            <select
              value={filterSucursal}
              onChange={e => setFilterSucursal(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 px-3 py-1.5 focus:ring-1 focus:ring-orange-500 outline-none"
            >
              <option value="Todas">Todas las Sucursales</option>
              {sucursales.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {(filterArea !== 'Todas' || filterSucursal !== 'Todas' || searchQuery !== '') && (
            <button 
              onClick={() => { setFilterArea('Todas'); setFilterSucursal('Todas'); setSearchQuery(''); setCollapsedNodes({}); }}
              className="text-[12px] font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas with scrollbar */}
      <div className="flex-1 overflow-auto p-12 flex justify-center items-start min-w-0">
        <div className="flex flex-col items-center gap-16 min-w-max">
          {rootUsers.map(root => renderTreeNode(root))}
          {rootUsers.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-slate-350 text-[64px] mb-4">account_tree</span>
              <p className="text-slate-500 font-bold text-[16px]">No se encontraron colaboradores en esta área.</p>
              <p className="text-slate-400 text-[13px] mt-1">Asigna colaboradores a esta área en el panel de Administración para ver su estructura.</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over User Details Panel */}
      {selectedUser && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedUser(null)} 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 transition-opacity duration-300"
          />

          {/* Drawer container */}
          <div className="fixed right-0 top-0 h-full w-[420px] max-w-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] border-l border-slate-200 z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-[#0a1118] text-white relative">
              <img src="/hero_bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/10 text-white font-black text-xl shrink-0 overflow-hidden shadow-inner">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedUser.name)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[18px] leading-tight">{selectedUser.name}</h3>
                  <p className="text-[12px] text-slate-300 mt-0.5">{selectedUser.puesto || 'Puesto no asignado'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="relative z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable details content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Información General */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5">Datos Generales</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.isSystemUser !== false && (
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400">Rol en Sistema</span>
                      <span className="text-[13px] font-bold text-slate-700">{selectedUser.systemRole}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Tipo de Miembro</span>
                    <span className="text-[13px] font-bold text-slate-700">
                      {selectedUser.isSystemUser !== false ? 'Usuario de Sistema' : 'Solo Organigrama'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Teléfono</span>
                    <span className="text-[13px] font-bold text-slate-700">{selectedUser.telefono || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Áreas</span>
                    <span className="text-[13px] font-bold text-slate-700 block truncate" title={selectedUser.areas.join(', ')}>
                      {selectedUser.areas.includes('Todas') ? 'Todas' : selectedUser.areas.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Sucursales</span>
                    <span className="text-[13px] font-bold text-slate-700 block truncate" title={selectedUser.sucursales?.join(', ')}>
                      {selectedUser.sucursales?.includes('Todas') ? 'Todas' : (selectedUser.sucursales?.join(', ') || 'Todas')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proyectos Activos */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5">Proyectos Asignados</h4>
                <div className="space-y-3">
                  {getUserProjects(selectedUser.name).map(project => {
                    return (
                      <div key={project.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-orange-200 hover:bg-orange-50/10 transition-colors flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-flex px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wide mr-1.5">
                              {project.projectType}
                            </span>
                            <span className="text-[13px] font-bold text-slate-800">{project.name}</span>
                          </div>
                          <span className="text-[13px] font-bold text-slate-900 shrink-0">{project.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <button 
                          onClick={() => { setSelectedUser(null); onSelectModo(project.id); }}
                          className="mt-1 text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 self-start transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Abrir Detalle del Proyecto
                        </button>
                      </div>
                    );
                  })}
                  {getUserProjects(selectedUser.name).length === 0 && (
                    <p className="text-[12px] text-slate-500 italic py-2">No participa en ningún proyecto MODO o Reingeniería activo.</p>
                  )}
                </div>
              </div>

              {/* Procedimientos Involucrados */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5">Procedimientos bajo su Puesto</h4>
                <div className="space-y-2.5">
                  {getUserProcedures(selectedUser.puesto).map(proc => (
                    <div key={proc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-slate-400 text-[20px] mt-0.5">description</span>
                      <div>
                        <span className="block text-[13px] font-bold text-slate-800">{proc.name}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Puestos autorizados: {proc.puestos?.join(', ') || 'Cualquiera'}</span>
                      </div>
                    </div>
                  ))}
                  {getUserProcedures(selectedUser.puesto).length === 0 && (
                    <p className="text-[12px] text-slate-500 italic py-2">No se encontraron procedimientos en el sistema ligados a este puesto.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
