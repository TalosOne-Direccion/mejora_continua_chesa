import React, { useState } from 'react';
import { DocumentosProyecto } from './DocumentosProyecto';
import { SolicitudesView } from './SolicitudesView';
import { useAppStore } from '../store';
import { SystemRole, ProjectKPI, KPITool } from '../types';
import { cn } from '../utils';
import { ToolBuilder } from './ToolBuilder';
import { MermaidChart } from './MermaidChart';

export const DocumentosView = () => (
  <div className="max-w-container-max mx-auto space-y-8">
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="font-display-lg text-display-lg text-slate-800 font-bold">Documentos</h1>
        <p className="font-body-lg text-body-lg text-slate-500 mt-2 max-w-2xl">
          Repositorio central de documentos de los proyectos.
        </p>
      </div>
    </div>

    <div>
      <h2 className="font-title-md text-title-md text-slate-800 uppercase tracking-wider mb-6 pl-2">
        Documentos de Proyectos
      </h2>
      <DocumentosProyecto />
    </div>
  </div>
);

export const KPIsView = () => {
  const { kpis, updateKPI, deleteKPI, areas, macroprocesos, procesos, currentUser, catalogoPuestos, sucursales } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [filterPuesto, setFilterPuesto] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterSucursal, setFilterSucursal] = useState('');

  // Consider KPIs that are not just "Propuesto" or maybe all of them, but usually Aprobado/Liberado are managed here
  const visibleKpis = (kpis || []).filter(k => {
    if (!k) return false;
    if (filterPuesto && k.puesto?.toLowerCase().indexOf(filterPuesto.toLowerCase()) === -1) return false;
    if (filterArea && k.area !== filterArea) return false;
    if (filterSucursal && k.sucursal !== filterSucursal) return false;
    return true;
  });

  return (
    <div className="max-w-container-max mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary text-on-primary rounded-lg shadow-sm">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <div>
          <h1 className="font-display-lg text-display-lg text-slate-800 font-bold">Tablero de Indicadores</h1>
          <p className="font-body-lg text-body-lg text-slate-500 mt-1">Gestión y construcción de KPIs transversales</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Puesto</label>
          <input 
            type="text" 
            placeholder="Filtrar por puesto..." 
            value={filterPuesto} onChange={e => setFilterPuesto(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="w-[200px]">
          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Área</label>
          <select 
            value={filterArea} onChange={e => setFilterArea(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none focus:border-primary transition-colors bg-white"
          >
            <option value="">Todas</option>
            {(areas || []).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="w-[200px]">
          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sucursal</label>
          <select 
            value={filterSucursal} onChange={e => setFilterSucursal(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-body-md outline-none focus:border-primary transition-colors bg-white"
          >
            <option value="">Todas</option>
            <option value="TGZ">TGZ</option>
            <option value="SCC">SCC</option>
            <option value="TAP">TAP</option>
            <option value="SCL">SCL</option>
          </select>
        </div>
        {(filterPuesto || filterArea || filterSucursal) && (
          <button 
            onClick={() => { setFilterPuesto(''); setFilterArea(''); setFilterSucursal(''); }}
            className="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-[14px] transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* KPI List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[18%]">Indicador</th>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[20%]">Proceso Relacionado</th>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[20%]">Puesto / Asignación</th>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[18%]">Fuente de Información</th>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[10%]">Estatus</th>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[8%]">Herramienta</th>
              <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider w-[6%] text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleKpis.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-[48px] mb-4">search_off</span>
                  <p>No se encontraron indicadores con estos filtros.</p>
                </td>
              </tr>
            ) : (
              visibleKpis.map(kpi => (
                <tr key={kpi.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <input 
                      type="text" 
                      value={kpi.name}
                      onChange={e => updateKPI(kpi.id, { name: e.target.value })}
                      disabled={!canEdit}
                      className="w-full p-1 text-[13px] font-bold border border-transparent hover:border-slate-200 focus:border-primary rounded bg-transparent focus:bg-white outline-none disabled:opacity-75"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 pl-1">ID: {kpi.id}</p>
                  </td>
                  <td className="py-4 px-6 space-y-1.5">
                    <select 
                      value={kpi.macroprocesoId || ''} 
                      onChange={e => updateKPI(kpi.id, { macroprocesoId: e.target.value, procesoId: '' })}
                      disabled={!canEdit}
                      className="w-full p-1 text-[12px] border border-slate-200 rounded outline-none bg-white disabled:opacity-55"
                    >
                      <option value="">-- Macroproceso --</option>
                      {(macroprocesos || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <select 
                      value={kpi.procesoId || ''} 
                      onChange={e => updateKPI(kpi.id, { procesoId: e.target.value })}
                      disabled={!canEdit || !kpi.macroprocesoId}
                      className="w-full p-1 text-[12px] border border-slate-200 rounded outline-none bg-white disabled:opacity-55"
                    >
                      <option value="">-- Proceso --</option>
                      {(procesos || []).filter(p => p.macroprocesoId === kpi.macroprocesoId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-6 space-y-1.5">
                    <select 
                      value={kpi.puesto || ''}
                      onChange={e => updateKPI(kpi.id, { puesto: e.target.value })}
                      disabled={!canEdit}
                      className="w-full p-1.5 text-[12px] border border-slate-200 rounded bg-white outline-none disabled:opacity-75"
                    >
                      <option value="">-- Puesto --</option>
                      {(catalogoPuestos || []).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="flex gap-2 mt-1.5">
                      <select 
                        value={kpi.sucursal || ''}
                        onChange={e => updateKPI(kpi.id, { sucursal: e.target.value })}
                        disabled={!canEdit}
                        className="w-full p-1 text-[11px] border border-slate-200 rounded bg-white outline-none disabled:opacity-75"
                      >
                        <option value="">(Sucursal)</option>
                        {(sucursales || []).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="text" 
                      placeholder="Fuente de información..." 
                      value={kpi.fuenteInfo || ''}
                      onChange={e => updateKPI(kpi.id, { fuenteInfo: e.target.value })}
                      disabled={!canEdit}
                      className="w-full p-1.5 text-[12px] border border-slate-200 rounded bg-white outline-none disabled:opacity-75"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      value={kpi.status}
                      onChange={e => updateKPI(kpi.id, { status: e.target.value as 'Propuesto' | 'Aprobado' | 'Liberado' })}
                      disabled={!canEdit}
                      className={cn(
                        "p-1.5 text-[12px] font-bold rounded outline-none border border-transparent hover:border-slate-200 transition-colors cursor-pointer disabled:opacity-75",
                        kpi.status === 'Propuesto' ? "text-amber-600 bg-amber-50" : 
                        kpi.status === 'Aprobado' ? "text-blue-600 bg-blue-50" : "text-emerald-600 bg-emerald-50"
                      )}
                    >
                      <option value="Propuesto">Propuesto</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Liberado">Liberado</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {['HK', 'RPD', 'Tuberia'].map(tool => {
                        const isSelected = kpi.tools?.includes(tool as KPITool);
                        return (
                          <button
                            key={tool}
                            onClick={() => {
                              if (!canEdit) return;
                              const currentTools = kpi.tools || [];
                              const newTools = isSelected 
                                ? currentTools.filter(t => t !== tool)
                                : [...currentTools, tool as KPITool];
                              updateKPI(kpi.id, { tools: newTools });
                            }}
                            disabled={!canEdit}
                            className={cn(
                              "px-2 py-1 rounded text-[11px] font-bold border transition-colors disabled:opacity-65",
                              isSelected 
                                ? "bg-primary text-white border-primary" 
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            )}
                          >
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {canEdit && (
                      <button 
                        onClick={() => {
                          if (confirm(`¿Estás seguro de que deseas eliminar el indicador "${kpi.name}"?`)) {
                            deleteKPI(kpi.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar Indicador"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const GlosarioView = () => {
  const { glossary, addGlossaryTerm } = useAppStore();
  const [search, setSearch] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  
  const filteredTerms = (glossary || []).filter(t => 
    t && (t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.definition.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    if (!newTerm || !newDefinition) return;
    addGlossaryTerm({ term: newTerm, definition: newDefinition });
    setNewTerm('');
    setNewDefinition('');
  };

  return (
    <div className="max-w-container-max mx-auto space-y-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-display-lg text-display-lg text-slate-800 font-bold">Glosario Metodológico</h1>
          <p className="font-body-lg text-body-lg text-slate-500 mt-2 max-w-2xl">
            Una guía curada para navegar el ecosistema MODO. Definiciones directas, libres de burocracia.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border-none shadow-sm text-body-md focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400" 
            placeholder="Buscar término (ej. SIPOC)..." 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {filteredTerms.map((item, index) => (
            <div key={item.term} className="p-8 hover:bg-slate-50 transition-colors group flex flex-col border-b border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-title-md text-title-md text-slate-800 font-bold group-hover:text-primary transition-colors">{item.term}</h3>
                <span className="font-mono text-slate-300 text-[12px] font-bold">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>
              <p className="font-body-md text-body-md text-slate-500 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
          {filteredTerms.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              No se encontraron términos que coincidan con "{search}".
            </div>
          )}
        </div>
      </div>

      {/* Agregar Término Form */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-4 text-[14px] uppercase tracking-wider">Añadir nuevo término</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <input 
              type="text" 
              value={newTerm} onChange={e => setNewTerm(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-body-md focus:border-primary outline-none transition-colors"
              placeholder="Término o Sigla"
            />
          </div>
          <div className="flex-1">
            <input 
              type="text" 
              value={newDefinition} onChange={e => setNewDefinition(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-body-md focus:border-primary outline-none transition-colors"
              placeholder="Definición clara y directa"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <button 
            onClick={handleAdd}
            disabled={!newTerm || !newDefinition}
            className="px-6 rounded-xl bg-primary text-white font-bold text-[14px] disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdministracionView = () => {
  const { users, addUser, deleteUser, updateUser, areas, sucursales, addSucursal, deleteSucursal } = useAppStore();
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [rol, setRol] = useState<SystemRole>('Facilitador');
  const [area, setArea] = useState('Todas');
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([]);
  const [telefono, setTelefono] = useState('');
  const [reportsTo, setReportsTo] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSystemUser, setIsSystemUser] = useState(true);
  const [newSucName, setNewSucName] = useState('');

  const handleSave = () => {
    if (!nombre || !puesto) return;
    
    const userPayload = {
      name: nombre,
      puesto,
      systemRole: isSystemUser ? rol : 'Lector',
      areas: area === 'Todas' ? areas : [area],
      sucursales: selectedSucursales.includes('Todas') ? ['Todas'] : selectedSucursales,
      telefono: telefono.trim() || undefined,
      reportsTo: reportsTo || undefined,
      isSystemUser: isSystemUser
    };

    if (editingUserId) {
      updateUser(editingUserId, userPayload);
      setEditingUserId(null);
    } else {
      addUser(userPayload);
    }

    setNombre('');
    setPuesto('');
    setRol('Facilitador');
    setArea('Todas');
    setSelectedSucursales([]);
    setTelefono('');
    setReportsTo('');
    setIsSystemUser(true);
  };

  const handleStartEdit = (u: User) => {
    setEditingUserId(u.id);
    setNombre(u.name);
    setPuesto(u.puesto || '');
    setRol(u.systemRole);
    setArea(u.areas.includes('Todas') ? 'Todas' : (u.areas[0] || 'Todas'));
    setSelectedSucursales(u.sucursales || []);
    setTelefono(u.telefono || '');
    setReportsTo(u.reportsTo || '');
    setIsSystemUser(u.isSystemUser !== false);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNombre('');
    setPuesto('');
    setRol('Facilitador');
    setArea('Todas');
    setSelectedSucursales([]);
    setTelefono('');
    setReportsTo('');
    setIsSystemUser(true);
  };

  return (
    <div className="max-w-container-max mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary text-on-primary rounded-lg shadow-sm">
          <span className="material-symbols-outlined">settings</span>
        </div>
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Administración</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Configuración del sistema y catálogos</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="font-title-md text-title-md text-on-surface uppercase tracking-wider mb-4">USUARIOS Y COLABORADORES</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant text-label-sm text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Nombre</th>
                  <th className="py-3 px-4 font-semibold">Puesto</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Rol de sistema</th>
                  <th className="py-3 px-4 font-semibold">Áreas</th>
                  <th className="py-3 px-4 font-semibold">Sucursales</th>
                  <th className="py-3 px-4 font-semibold">Teléfono</th>
                  <th className="py-3 px-4 font-semibold">Reporta a</th>
                  <th className="py-3 px-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="py-3 px-4 text-body-md text-on-surface font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-body-md text-on-surface-variant">{u.puesto || 'N/A'}</td>
                    <td className="py-3 px-4">
                      {u.isSystemUser !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Usuario
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Colaborador
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {u.isSystemUser !== false ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-label-sm border border-outline-variant bg-surface">
                          {u.systemRole}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[13px]">Sin Acceso</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-body-md text-on-surface-variant">{u.areas.includes('Todas') || u.areas.length === areas.length ? 'Todas' : u.areas.join(', ')}</td>
                    <td className="py-3 px-4 text-body-md text-on-surface-variant">{u.sucursales?.includes('Todas') ? 'Todas' : (u.sucursales?.join(', ') || 'Todas')}</td>
                    <td className="py-3 px-4 text-body-md text-on-surface-variant">{u.telefono || 'N/A'}</td>
                    <td className="py-3 px-4 text-body-md text-on-surface-variant">
                      {u.reportsTo ? (users.find(parent => parent.id === u.reportsTo)?.name || 'N/A') : 'Ninguno (Raíz)'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button onClick={() => handleStartEdit(u)} className="text-outline-variant hover:text-primary transition-colors cursor-pointer" title="Editar usuario">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="text-outline-variant hover:text-red-500 transition-colors cursor-pointer" title="Eliminar usuario">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-surface-container-lowest">
          <h4 className="font-title-sm text-title-sm text-on-surface uppercase tracking-wider mb-4">
            {editingUserId ? 'EDITAR COLABORADOR / USUARIO' : 'AGREGAR NUEVO COLABORADOR / USUARIO'}
          </h4>
          
          <div className="space-y-6">
            {/* Checkbox de Acceso a Sistema */}
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg w-fit">
              <input 
                type="checkbox" 
                id="isSystemUser" 
                checked={isSystemUser} 
                onChange={e => setIsSystemUser(e.target.checked)}
                className="rounded border-slate-350 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer animate-none"
              />
              <label htmlFor="isSystemUser" className="text-[13px] font-bold text-slate-700 cursor-pointer select-none">
                ¿Tiene acceso al sistema? (Habilitar como usuario)
              </label>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="min-w-[200px]">
                <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Nombre</label>
                <input 
                  type="text" 
                  value={nombre} onChange={e => setNombre(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none transition-colors"
                  placeholder="Nombre completo"
                />
              </div>
              <div className="min-w-[200px]">
                <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Puesto</label>
                <input 
                  type="text" 
                  value={puesto} onChange={e => setPuesto(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none transition-colors"
                  placeholder="Cargo o puesto"
                />
              </div>
              
              {/* Rol de Sistema / Oculto si no es usuario */}
              {isSystemUser ? (
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Rol de sistema</label>
                  <select 
                    value={rol} onChange={e => setRol(e.target.value as SystemRole)}
                    className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md bg-white focus:border-primary outline-none transition-colors"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Equipo de Mejora Continua">Equipo de Mejora Continua</option>
                    <option value="Patrocinador">Patrocinador</option>
                    <option value="Facilitador">Facilitador</option>
                    <option value="Usuario clave">Usuario clave</option>
                    <option value="Lector">Lector</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold opacity-50">Rol de sistema</label>
                  <div className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md bg-slate-100 text-slate-500 font-medium select-none">
                    Solo Organigrama (Sin Acceso)
                  </div>
                </div>
              )}

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Teléfono</label>
                <input 
                  type="text" 
                  value={telefono} onChange={e => setTelefono(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none transition-colors"
                  placeholder="Teléfono de contacto"
                />
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Área</label>
                <select 
                  value={area} onChange={e => setArea(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md bg-white focus:border-primary outline-none transition-colors"
                >
                  <option value="Todas">Todas</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Selector Múltiple de Sucursales */}
              <div className="lg:col-span-2">
                <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Sucursales Asociadas</label>
                <div className="flex flex-wrap gap-3.5 p-2.5 bg-slate-50 border border-outline-variant rounded-lg min-h-[46px] items-center">
                  <label className="flex items-center gap-1.5 text-body-md text-slate-700 cursor-pointer font-bold select-none pr-3 border-r border-slate-200">
                    <input 
                      type="checkbox" 
                      checked={selectedSucursales.includes('Todas')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSucursales(['Todas']);
                        } else {
                          setSelectedSucursales([]);
                        }
                      }}
                      className="rounded border-slate-350 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                    />
                    Todas
                  </label>
                  
                  {sucursales.map(s => {
                    const isChecked = selectedSucursales.includes(s) && !selectedSucursales.includes('Todas');
                    const isDisabled = selectedSucursales.includes('Todas');
                    return (
                      <label 
                        key={s} 
                        className={cn(
                          "flex items-center gap-1.5 text-body-md text-slate-700 select-none",
                          isDisabled ? "opacity-45 cursor-not-allowed" : "cursor-pointer font-medium"
                        )}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSucursales(prev => [...prev.filter(x => x !== 'Todas'), s]);
                            } else {
                              setSelectedSucursales(prev => prev.filter(x => x !== s));
                            }
                          }}
                          className="rounded border-slate-350 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                        />
                        {s}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Reporta a (Superior)</label>
                <select 
                  value={reportsTo} onChange={e => setReportsTo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md bg-white focus:border-primary outline-none transition-colors"
                >
                  <option value="">Ninguno / Raíz</option>
                  {users.filter(u => u.id !== editingUserId).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.puesto || 'Sin puesto'})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 lg:col-span-4 justify-end mt-2">
                <button 
                  onClick={handleSave}
                  disabled={!nombre || !puesto}
                  className="px-6 h-[46px] bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-lg font-label-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">{editingUserId ? 'save' : 'add'}</span>
                  {editingUserId ? 'Guardar Cambios' : 'Agregar Colaborador'}
                </button>
                {editingUserId && (
                  <button 
                    onClick={handleCancelEdit}
                    className="h-[46px] px-6 border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-slate-650 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo de Sucursales */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-6">
        <h3 className="font-title-md text-title-md text-on-surface uppercase tracking-wider mb-4">CATÁLOGO DE SUCURSALES</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Listado */}
          <div>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-3">Sucursales del Sistema</p>
            <div className="flex flex-wrap gap-2.5">
              {sucursales.map(s => (
                <div key={s} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-body-md font-bold text-slate-700">
                  <span>{s}</span>
                  <button 
                    onClick={() => deleteSucursal(s)}
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center p-0.5 hover:bg-white rounded"
                    title={`Eliminar sucursal ${s}`}
                  >
                    <span className="material-symbols-outlined text-[16px] leading-none">close</span>
                  </button>
                </div>
              ))}
              {sucursales.length === 0 && (
                <p className="text-[13px] text-slate-500 italic">No hay sucursales registradas en el catálogo.</p>
              )}
            </div>
          </div>
          
          {/* Formulario */}
          <div className="flex items-end gap-3 max-w-sm">
            <div className="flex-1">
              <label className="block text-label-sm text-on-surface-variant mb-1 font-semibold">Nueva Sucursal</label>
              <input 
                type="text" 
                value={newSucName} 
                onChange={e => setNewSucName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none transition-colors uppercase"
                placeholder="Ej: CDMX"
              />
            </div>
            <button 
              onClick={() => {
                if (newSucName.trim()) {
                  addSucursal(newSucName.trim());
                  setNewSucName('');
                }
              }}
              className="h-[46px] px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-label-md transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MacroprocesosView = () => {
  const { currentUser, macroprocesos, procesos, procedimientos, addMacroproceso, addProceso, deleteMacroproceso, deleteProceso, updateProceso, kpis, addKPI, deleteKPI, updateKPI, addProcedimiento, deleteProcedimiento, updateProcedimiento, updateMacroprocesosOrder, catalogoPuestos, catalogoSistemas, catalogoHerramientas } = useAppStore();
  const canEdit = currentUser.name === 'Carlos Barrientos' || currentUser.name === 'Ivonne' || currentUser.name === 'Armando';
  const [newMacName, setNewMacName] = useState('');
  const [newMacType, setNewMacType] = useState<'Principal' | 'Soporte'>('Soporte');
  const [newProcName, setNewProcName] = useState('');
  const [selectedMacId, setSelectedMacId] = useState<string | null>(null);
  const [viewingProcesoId, setViewingProcesoId] = useState<string | null>(null);
  const [viewingProcedimientoId, setViewingProcedimientoId] = useState<string | null>(null);
  const [diagramaEdit, setDiagramaEdit] = useState('');
  const [diagramImageEdit, setDiagramImageEdit] = useState('');
  const [collapsedProcesos, setCollapsedProcesos] = useState<Record<string, boolean>>({});

  const toggleProcessCollapse = (processId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedProcesos(prev => ({
      ...prev,
      [processId]: !prev[processId]
    }));
  };

  // Process sub-tabs and creation states
  const [activeProcessTab, setActiveProcessTab] = useState<'diagram' | 'puestos' | 'kpis' | 'procedimientos' | 'sistemas' | 'herramientas'>('diagram');
  const [newPuestoName, setNewPuestoName] = useState('');
  const [newKpiNameGlobal, setNewKpiNameGlobal] = useState('');
  const [newKpiPuesto, setNewKpiPuesto] = useState('');
  const [newKpiFuente, setNewKpiFuente] = useState('');
  const [newProcedimientoName, setNewProcedimientoName] = useState('');
  const [newSistemaName, setNewSistemaName] = useState('');
  const [newHerramientaName, setNewHerramientaName] = useState('');

  const mainMacros = macroprocesos.filter(m => m.type === 'Principal').sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const supportMacros = macroprocesos.filter(m => m.type === 'Soporte').sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const handleMoveMacro = (macrosArray: typeof mainMacros, idx: number, direction: 'left' | 'right') => {
    const newOrder = [...macrosArray];
    if (direction === 'left' && idx > 0) {
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    } else if (direction === 'right' && idx < newOrder.length - 1) {
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    } else return;
    updateMacroprocesosOrder(newOrder.map((m, i) => ({ id: m.id, order: i })));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setter(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMacro = () => {
    if (!newMacName.trim()) return;
    const isMain = newMacType === 'Principal';
    addMacroproceso({ 
      name: newMacName.trim(), 
      type: newMacType, 
      order: isMain ? mainMacros.length : supportMacros.length 
    });
    setNewMacName('');
  };

  const handleAddProc = (macId: string) => {
    if (!newProcName.trim() || selectedMacId !== macId) return;
    addProceso({ name: newProcName.trim(), macroprocesoId: macId });
    setNewProcName('');
    setSelectedMacId(null);
  };

  return (
    <div className="relative min-h-[calc(111.11vh-56px)] -mx-6 -my-6 p-6 overflow-hidden bg-slate-50">
      {/* Animated Background Layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-sky-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>
      
      {/* Floating Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 w-[800px] opacity-[0.04] pointer-events-none select-none mix-blend-luminosity animate-float z-0">
        <img src="/logo_chesa.png" alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="relative z-10 max-w-container-max mx-auto space-y-8 pb-12">
        <div className="mb-8 flex justify-between items-end bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm">
          <div>
            <h1 className="font-display-lg text-display-lg text-slate-800 font-bold">Mapa de Macroprocesos</h1>
            <p className="font-body-lg text-body-lg text-slate-500 mt-2 max-w-2xl">
              Gestiona los macroprocesos principales y áreas de servicio de la organización.
            </p>
          </div>
        </div>

      <h2 className="font-title-md text-title-md text-slate-800 font-bold mb-4">Macroprocesos Principales (Flujo de Valor)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
        {mainMacros.map((mac, idx) => (
          <div key={mac.id} className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden flex flex-col relative group">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
             <div className="p-5 border-b border-slate-100 bg-blue-50/30 flex items-center justify-between gap-3">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[14px] shrink-0">
                   {idx + 1}
                 </div>
                 <h3 className="font-bold text-slate-800">{mac.name}</h3>
               </div>
               {canEdit && (
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleMoveMacro(mainMacros, idx, 'left')} className="text-slate-400 hover:text-blue-600" title="Mover izquierda">
                     <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                   </button>
                   <button onClick={() => handleMoveMacro(mainMacros, idx, 'right')} className="text-slate-400 hover:text-blue-600" title="Mover derecha">
                     <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                   </button>
                   <div className="w-px h-4 bg-slate-200 mx-1"></div>
                   <button onClick={() => deleteMacroproceso(mac.id)} className="text-slate-400 hover:text-red-500">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3">
                {procesos.filter(p => p.macroprocesoId === mac.id).map(p => {
                  const procSub = procedimientos.filter(proc => proc.procesoId === p.id);
                  return (
                    <div key={p.id} className="flex flex-col gap-1.5">
                      <div 
                        onClick={() => { setViewingProcesoId(p.id); setViewingProcedimientoId(null); setDiagramaEdit(''); setDiagramImageEdit(''); setActiveProcessTab('diagram'); }}
                        className={cn(
                          "text-[13px] p-2 rounded-lg flex items-center justify-between group/proc cursor-pointer transition-colors border",
                          viewingProcesoId === p.id ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50 border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {procSub.length > 0 ? (
                            <button
                              onClick={(e) => toggleProcessCollapse(p.id, e)}
                              className="w-5 h-5 flex items-center justify-center text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded shrink-0 transition-transform"
                              title={collapsedProcesos[p.id] ? "Expandir procedimientos" : "Contraer procedimientos"}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {collapsedProcesos[p.id] ? 'chevron_right' : 'expand_more'}
                              </span>
                            </button>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mx-[7px]"></span>
                          )}
                          <span className="truncate">{p.name}</span>
                        </div>
                        {canEdit && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProceso(p.id); if(viewingProcesoId===p.id) { setViewingProcesoId(null); setViewingProcedimientoId(null); } }} 
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover/proc:opacity-100 transition-opacity"
                            title="Eliminar proceso"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                      
                      {/* PROCEDIMIENTOS ANIDADOS */}
                      {!collapsedProcesos[p.id] && procSub.length > 0 && (
                        <div className="pl-4 flex flex-col gap-1 border-l border-slate-100 ml-2.5">
                          {procSub.map(proc => (
                            <div 
                              key={proc.id} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingProcesoId(p.id);
                                setViewingProcedimientoId(proc.id);
                                setDiagramaEdit(proc.diagram || '');
                                setDiagramImageEdit(proc.diagramImage || '');
                                setActiveProcessTab('diagram');
                              }}
                              className={cn(
                                "text-[12px] p-1.5 rounded flex items-center justify-between group/proc-sub cursor-pointer transition-all border",
                                viewingProcedimientoId === proc.id
                                  ? "bg-blue-50/60 border-blue-150 text-blue-900 font-semibold"
                                  : "text-slate-600 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-50 border-transparent"
                              )}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">description</span>
                                <span>{proc.name}</span>
                              </div>
                              {canEdit && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteProcedimiento(proc.id); if(viewingProcedimientoId===proc.id) setViewingProcedimientoId(null); }} 
                                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover/proc-sub:opacity-100 transition-opacity"
                                  title="Eliminar procedimiento"
                                >
                                  <span className="material-symbols-outlined text-[14px]">delete</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {canEdit && (selectedMacId === mac.id ? (
                  <div className="mt-2 flex gap-2">
                    <input 
                      autoFocus
                      value={newProcName} onChange={e => setNewProcName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-200 rounded text-[13px] outline-none"
                      placeholder="Nuevo proceso..."
                      onKeyDown={e => e.key === 'Enter' && handleAddProc(mac.id)}
                    />
                    <button onClick={() => handleAddProc(mac.id)} className="text-primary material-symbols-outlined text-[16px]">check</button>
                    <button onClick={() => { setSelectedMacId(null); setNewProcName(''); }} className="text-slate-400 material-symbols-outlined text-[16px]">close</button>
                  </div>
                ) : (
                  <button onClick={() => { setSelectedMacId(mac.id); setNewProcName(''); }} className="mt-2 text-[12px] text-slate-500 hover:text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">add</span> Añadir proceso
                  </button>
                ))}
             </div>
          </div>
        ))}
      </div>

      <h2 className="font-title-md text-title-md text-slate-800 font-bold mb-4 mt-8">Áreas de Soporte / Servicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {supportMacros.map((mac, idx) => (
          <div key={mac.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-slate-400">domain</span>
                 <h3 className="font-bold text-slate-800 text-[14px]">{mac.name}</h3>
               </div>
               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleMoveMacro(supportMacros, idx, 'left')} className="text-slate-400 hover:text-blue-600" title="Mover izquierda">
                   <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                 </button>
                 <button onClick={() => handleMoveMacro(supportMacros, idx, 'right')} className="text-slate-400 hover:text-blue-600" title="Mover derecha">
                   <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                 </button>
                 <div className="w-px h-4 bg-slate-200 mx-1"></div>
                 <button onClick={() => deleteMacroproceso(mac.id)} className="text-slate-400 hover:text-red-500">
                   <span className="material-symbols-outlined text-[18px]">delete</span>
                 </button>
               </div>
             </div>
             <div className="p-4 flex-1 flex flex-col gap-3">
               {procesos.filter(p => p.macroprocesoId === mac.id).map(p => {
                  const procSub = procedimientos.filter(proc => proc.procesoId === p.id);
                  return (
                    <div key={p.id} className="flex flex-col gap-1.5">
                      <div 
                        onClick={() => { setViewingProcesoId(p.id); setViewingProcedimientoId(null); setDiagramaEdit(''); setDiagramImageEdit(''); setActiveProcessTab('diagram'); }}
                        className={cn(
                          "text-[13px] p-2 rounded-lg flex items-center justify-between group/proc cursor-pointer transition-colors border",
                          viewingProcesoId === p.id ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50 border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {procSub.length > 0 ? (
                            <button
                              onClick={(e) => toggleProcessCollapse(p.id, e)}
                              className="w-5 h-5 flex items-center justify-center text-slate-450 hover:text-slate-700 hover:bg-slate-200/50 rounded shrink-0 transition-transform"
                              title={collapsedProcesos[p.id] ? "Expandir procedimientos" : "Contraer procedimientos"}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {collapsedProcesos[p.id] ? 'chevron_right' : 'expand_more'}
                              </span>
                            </button>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mx-[7px]"></span>
                          )}
                          <span className="truncate">{p.name}</span>
                        </div>
                        {canEdit && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProceso(p.id); if(viewingProcesoId===p.id) { setViewingProcesoId(null); setViewingProcedimientoId(null); } }} 
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover/proc:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                      
                      {/* PROCEDIMIENTOS ANIDADOS */}
                      {!collapsedProcesos[p.id] && procSub.length > 0 && (
                        <div className="pl-4 flex flex-col gap-1 border-l border-slate-100 ml-2.5">
                          {procSub.map(proc => (
                            <div 
                              key={proc.id} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingProcesoId(p.id);
                                setViewingProcedimientoId(proc.id);
                                setDiagramaEdit(proc.diagram || '');
                                setDiagramImageEdit(proc.diagramImage || '');
                                setActiveProcessTab('diagram');
                              }}
                              className={cn(
                                "text-[12px] p-1.5 rounded flex items-center justify-between group/proc-sub cursor-pointer transition-all border",
                                viewingProcedimientoId === proc.id
                                  ? "bg-blue-50/60 border-blue-150 text-blue-900 font-semibold"
                                  : "text-slate-600 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-50 border-transparent"
                              )}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">description</span>
                                <span>{proc.name}</span>
                              </div>
                              {canEdit && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteProcedimiento(proc.id); if(viewingProcedimientoId===proc.id) setViewingProcedimientoId(null); }} 
                                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover/proc-sub:opacity-100 transition-opacity"
                                  title="Eliminar procedimiento"
                                >
                                  <span className="material-symbols-outlined text-[14px]">delete</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
               })}
               {selectedMacId === mac.id ? (
                 <div className="mt-2 flex gap-2">
                   <input 
                     autoFocus
                     value={newProcName} onChange={e => setNewProcName(e.target.value)}
                     className="flex-1 px-2 py-1 border border-slate-200 rounded text-[13px] outline-none"
                     placeholder="Nuevo proceso..."
                     onKeyDown={e => e.key === 'Enter' && handleAddProc(mac.id)}
                   />
                   <button onClick={() => handleAddProc(mac.id)} className="text-primary material-symbols-outlined text-[16px]">check</button>
                 </div>
               ) : (
                 <button onClick={() => { setSelectedMacId(mac.id); setNewProcName(''); }} className="mt-2 text-[12px] text-slate-500 hover:text-primary font-bold flex items-center gap-1">
                   <span className="material-symbols-outlined text-[16px]">add</span> Añadir proceso
                 </button>
               )}
             </div>
          </div>
        ))}
      </div>

        {canEdit && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-8 shadow-sm mt-12 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <h2 className="font-title-md text-title-md text-slate-800 font-bold mb-6">Añadir Nuevo Macroproceso</h2>
            <div className="flex gap-4 items-end relative z-10">
              <div className="flex-1">
                <label className="block text-[12px] font-bold text-slate-500 mb-1">Nombre</label>
                <input 
                  value={newMacName} onChange={e => setNewMacName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200/80 bg-white/90 rounded-lg outline-none focus:border-primary shadow-sm"
                  placeholder="Ej. Recursos Humanos"
                />
              </div>
              <div className="w-48">
                <label className="block text-[12px] font-bold text-slate-500 mb-1">Tipo</label>
                <select 
                  value={newMacType} onChange={e => setNewMacType(e.target.value as 'Principal' | 'Soporte')}
                  className="w-full px-4 py-2 border border-slate-200/80 bg-white/90 rounded-lg outline-none focus:border-primary shadow-sm"
                >
                  <option value="Soporte">Soporte / Servicio</option>
                  <option value="Principal">Principal (Flujo de valor)</option>
                </select>
              </div>
              <button 
                onClick={handleAddMacro} disabled={!newMacName.trim()}
                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 disabled:opacity-50 shadow-md transition-all hover:shadow-lg"
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        {viewingProcesoId && (() => {
          const proc = procesos.find(p => p.id === viewingProcesoId);
          if (!proc) return null;
          
          const procProcedimientos = procedimientos.filter(p => p.procesoId === viewingProcesoId);
          const sub = viewingProcedimientoId ? procProcedimientos.find(p => p.id === viewingProcedimientoId) : null;
          
          const procKpis = kpis.filter(k => k.procesoId === viewingProcesoId);
          const subKpis = sub ? kpis.filter(k => k.procedimientoId === sub.id) : [];
          
          const procPuestos = proc.puestos || [];
          const subPuestos = sub ? sub.puestos || [] : [];
          const compiledPuestos = Array.from(new Set([
            ...procPuestos,
            ...procProcedimientos.flatMap(p => p.puestos || [])
          ]));

          const subSistemas = sub ? sub.sistemas || [] : [];
          const compiledSistemas = Array.from(new Set([
            ...procProcedimientos.flatMap(p => p.sistemas || [])
          ]));

          const subHerramientas = sub ? sub.herramientas || [] : [];
          const compiledHerramientas = Array.from(new Set([
            ...procProcedimientos.flatMap(p => p.herramientas || [])
          ]));

          const activeTab = (viewingProcedimientoId && activeProcessTab === 'procedimientos') ? 'diagram' : activeProcessTab;

          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4 relative">
              
              {/* HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                {sub ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <button 
                        onClick={() => {
                          setViewingProcedimientoId(null);
                          setDiagramaEdit('');
                          setDiagramImageEdit('');
                          setActiveProcessTab('procedimientos');
                        }}
                        className="text-slate-500 hover:text-primary flex items-center gap-1 text-[13px] font-bold transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Proceso: {proc.name}
                      </button>
                      <span className="text-slate-350">/</span>
                      <span className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Procedimiento
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {canEdit ? (
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => updateProcedimiento(sub.id, { name: e.target.value })}
                          className="text-[20px] font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none transition-colors w-full"
                          placeholder="Nombre del procedimiento"
                        />
                      ) : (
                        <h2 className="text-[20px] font-bold text-slate-800">
                          {sub.name}
                        </h2>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-500 mt-1">
                      Configura el diagrama, puestos, indicadores, sistemas y herramientas de este procedimiento.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[20px] font-bold text-slate-800 whitespace-nowrap">
                        Detalles del Proceso: 
                      </h2>
                      {canEdit ? (
                        <input
                          type="text"
                          value={proc.name}
                          onChange={(e) => updateProceso(proc.id, { name: e.target.value })}
                          className="text-[20px] font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none transition-colors w-full"
                          placeholder="Nombre del proceso"
                        />
                      ) : (
                        <h2 className="text-[20px] font-bold text-slate-800">
                          {proc.name}
                        </h2>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-500 mt-1">
                      Consolidado de diagramas, puestos, KPIs, sistemas, herramientas y procedimientos de este proceso.
                    </p>
                  </div>
                )}

                {/* TABS SELECTOR */}
                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setActiveProcessTab('diagram')}
                      className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors flex items-center gap-1.5", activeTab === 'diagram' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                      <span className="material-symbols-outlined text-[16px]">account_tree</span> {sub ? 'Diagrama' : 'Diagramas'}
                    </button>
                    <button 
                      onClick={() => setActiveProcessTab('puestos')}
                      className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors flex items-center gap-1.5", activeTab === 'puestos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                      <span className="material-symbols-outlined text-[16px]">badge</span> Puestos / Roles ({sub ? subPuestos.length : compiledPuestos.length})
                    </button>
                    <button 
                      onClick={() => setActiveProcessTab('kpis')}
                      className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors flex items-center gap-1.5", activeTab === 'kpis' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                      <span className="material-symbols-outlined text-[16px]">analytics</span> Indicadores ({sub ? subKpis.length : procKpis.length})
                    </button>
                    <button 
                      onClick={() => setActiveProcessTab('sistemas')}
                      className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors flex items-center gap-1.5", activeTab === 'sistemas' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                      <span className="material-symbols-outlined text-[16px]">dns</span> Sistemas ({sub ? subSistemas.length : compiledSistemas.length})
                    </button>
                    <button 
                      onClick={() => setActiveProcessTab('herramientas')}
                      className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors flex items-center gap-1.5", activeTab === 'herramientas' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                      <span className="material-symbols-outlined text-[16px]">build</span> Herramientas ({sub ? subHerramientas.length : compiledHerramientas.length})
                    </button>
                    {!sub && (
                      <button 
                        onClick={() => setActiveProcessTab('procedimientos')}
                        className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors flex items-center gap-1.5", activeTab === 'procedimientos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                      >
                        <span className="material-symbols-outlined text-[16px]">description</span> Procedimientos ({procProcedimientos.length})
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setViewingProcesoId(null);
                      setViewingProcedimientoId(null);
                    }} 
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* TABS CONTENT */}

              {/* 1. DIAGRAMS TAB */}
              {activeTab === 'diagram' && (
                sub ? (
                  // MODO B: Diagram Editor
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Código Mermaid (Editable)</label>
                      <textarea 
                        value={diagramaEdit} 
                        onChange={e => setDiagramaEdit(e.target.value)}
                        disabled={!canEdit}
                        className="w-full h-[300px] p-4 border border-slate-200 rounded-xl font-mono text-[13px] bg-slate-50 focus:border-primary outline-none resize-none disabled:opacity-70"
                        placeholder="graph TD\nA[Inicio] --> B(Paso 1)\n..."
                      />
                      {canEdit && (
                        <div className="flex gap-4">
                          <button 
                            onClick={() => updateProcedimiento(sub.id, { diagram: diagramaEdit, diagramImage: diagramImageEdit })}
                            className="bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                          >
                            Guardar Diagrama
                          </button>
                          <label className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">upload_file</span>
                            Subir Imagen
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setDiagramImageEdit)} />
                          </label>
                          {diagramImageEdit && (
                            <button onClick={() => setDiagramImageEdit('')} className="text-red-500 hover:bg-red-50 font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                              Quitar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Vista Previa del Diagrama</label>
                      <div className="w-full h-[300px] border border-slate-200 rounded-xl flex items-center justify-center p-4 bg-white overflow-auto relative shadow-inner">
                        {diagramImageEdit ? (
                          <img src={diagramImageEdit} alt="Diagrama" className="max-w-full max-h-full object-contain" />
                        ) : diagramaEdit.trim() ? (
                          <MermaidChart chart={diagramaEdit} />
                        ) : (
                          <div className="text-slate-400 text-[13px] flex items-center gap-2">
                            <span className="material-symbols-outlined">account_tree</span>
                            Sin diagrama
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // MODO A: Process Diagrams (Consolidated)
                  <div className="space-y-6">
                    {/* Process diagram (legacy) */}
                    {(proc.diagram || proc.diagramImage) && (
                      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/20">
                        <h3 className="font-bold text-slate-800 text-[14px] mb-3 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-primary">account_tree</span>
                          Diagrama General del Proceso (Legacy)
                        </h3>
                        <div className="w-full h-[280px] border border-slate-200 rounded-lg flex items-center justify-center p-4 bg-white overflow-auto shadow-sm">
                          {proc.diagramImage ? (
                            <img src={proc.diagramImage} alt="Diagrama General" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <MermaidChart chart={proc.diagram || ''} />
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-slate-700 text-[13px] mb-3 uppercase tracking-wider">Diagramas por Procedimiento</h3>
                      {procProcedimientos.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-55">account_tree</span>
                          <p className="text-[13px] font-medium">No hay procedimientos definidos para este proceso.</p>
                        </div>
                      ) : procProcedimientos.filter(p => p.diagram || p.diagramImage).length === 0 ? (
                        <div className="py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-55">account_tree</span>
                          <p className="text-[13px] font-medium">Ninguno de los procedimientos de este proceso tiene un diagrama configurado.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {procProcedimientos.filter(p => p.diagram || p.diagramImage).map(pSub => (
                            <div key={pSub.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 flex flex-col gap-2 shadow-sm">
                              <h4 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                                {pSub.name}
                              </h4>
                              <div className="w-full h-[240px] border border-slate-150 rounded-lg flex items-center justify-center p-3 bg-white overflow-auto relative shadow-inner">
                                {pSub.diagramImage ? (
                                  <img src={pSub.diagramImage} alt={pSub.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                  <MermaidChart chart={pSub.diagram || ''} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* 2. PUESTOS / ROLES TAB */}
              {activeTab === 'puestos' && (
                sub ? (
                  // MODO B: Link puesto to procedure
                  <div className="space-y-6">
                    {canEdit && (
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 max-w-2xl">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            list="puestos-datalist"
                            value={newPuestoName}
                            onChange={e => setNewPuestoName(e.target.value)}
                            placeholder="Ej. Coordinador de Operaciones..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-[14px] bg-white transition-colors"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && newPuestoName.trim()) {
                                const currentPuestos = sub.puestos || [];
                                const val = newPuestoName.trim().toUpperCase();
                                if (!currentPuestos.includes(val)) {
                                  updateProcedimiento(sub.id, { puestos: [...currentPuestos, val] });
                                  if (!catalogoPuestos.includes(val)) {
                                    useAppStore.getState().addCatalogoPuesto(val);
                                  }
                                  setNewPuestoName('');
                                }
                              }
                            }}
                          />
                          <datalist id="puestos-datalist">
                            {catalogoPuestos.map(p => <option key={p} value={p} />)}
                          </datalist>
                        </div>
                        <button 
                          onClick={() => {
                            const currentPuestos = sub.puestos || [];
                            const val = newPuestoName.trim().toUpperCase();
                            if (val && !currentPuestos.includes(val)) {
                              updateProcedimiento(sub.id, { puestos: [...currentPuestos, val] });
                              if (!catalogoPuestos.includes(val)) {
                                useAppStore.getState().addCatalogoPuesto(val);
                              }
                              setNewPuestoName('');
                            }
                          }}
                          className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/95 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span> Vincular Puesto
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subPuestos.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">badge</span>
                          <p className="text-[13px] font-medium">No hay puestos vinculados a este procedimiento.</p>
                        </div>
                      ) : (
                        subPuestos.map((puesto, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-primary/50 transition-colors shadow-sm group">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[13px]">
                                {idx + 1}
                              </span>
                              <span className="text-[14px] font-semibold text-slate-700">{puesto}</span>
                            </div>
                            {canEdit && (
                              <button 
                                onClick={() => {
                                  updateProcedimiento(sub.id, { puestos: subPuestos.filter(x => x !== puesto) });
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Eliminar vinculación"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // MODO A: Compiled Puestos
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-[13px] uppercase tracking-wider">Consolidado de Roles en Procedimientos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {compiledPuestos.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">badge</span>
                          <p className="text-[13px] font-medium">No hay puestos vinculados a este proceso ni a sus procedimientos.</p>
                        </div>
                      ) : (
                        compiledPuestos.map((puesto, idx) => {
                          const isLegacy = procPuestos.includes(puesto);
                          const linkedSubs = procProcedimientos.filter(p => p.puestos?.includes(puesto)).map(p => p.name);
                          
                          return (
                            <div key={idx} className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[12px]">
                                  {idx + 1}
                                </span>
                                <span className="text-[14px] font-bold text-slate-800">{puesto}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {isLegacy && (
                                  <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Proceso General</span>
                                )}
                                {linkedSubs.map(subName => (
                                  <span key={subName} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold truncate max-w-[190px]" title={subName}>
                                    {subName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )
              )}

              {/* SISTEMAS TAB */}
              {activeTab === 'sistemas' && (
                sub ? (
                  // MODO B: Link sistema to procedure
                  <div className="space-y-6">
                    {canEdit && (
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 max-w-2xl">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            list="sistemas-datalist"
                            value={newSistemaName}
                            onChange={e => setNewSistemaName(e.target.value)}
                            placeholder="Ej. SAP, Salesforce..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-[14px] bg-white transition-colors"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && newSistemaName.trim()) {
                                const currentSistemas = sub.sistemas || [];
                                const val = newSistemaName.trim().toUpperCase();
                                if (!currentSistemas.includes(val)) {
                                  updateProcedimiento(sub.id, { sistemas: [...currentSistemas, val] });
                                  if (!catalogoSistemas.includes(val)) {
                                    useAppStore.getState().addCatalogoSistema(val);
                                  }
                                  setNewSistemaName('');
                                }
                              }
                            }}
                          />
                          <datalist id="sistemas-datalist">
                            {catalogoSistemas.map(s => <option key={s} value={s} />)}
                          </datalist>
                        </div>
                        <button 
                          onClick={() => {
                            const currentSistemas = sub.sistemas || [];
                            const val = newSistemaName.trim().toUpperCase();
                            if (val && !currentSistemas.includes(val)) {
                              updateProcedimiento(sub.id, { sistemas: [...currentSistemas, val] });
                              if (!catalogoSistemas.includes(val)) {
                                useAppStore.getState().addCatalogoSistema(val);
                              }
                              setNewSistemaName('');
                            }
                          }}
                          className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/95 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span> Vincular Sistema
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subSistemas.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">dns</span>
                          <p className="text-[13px] font-medium">No hay sistemas vinculados a este procedimiento.</p>
                        </div>
                      ) : (
                        subSistemas.map((sistema, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-primary/50 transition-colors shadow-sm group">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-[13px]">
                                {idx + 1}
                              </span>
                              <span className="text-[14px] font-semibold text-slate-700">{sistema}</span>
                            </div>
                            {canEdit && (
                              <button 
                                onClick={() => {
                                  updateProcedimiento(sub.id, { sistemas: subSistemas.filter(x => x !== sistema) });
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Eliminar vinculación"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // MODO A: Compiled Sistemas
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-[13px] uppercase tracking-wider">Consolidado de Sistemas en Procedimientos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {compiledSistemas.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">dns</span>
                          <p className="text-[13px] font-medium">No hay sistemas vinculados a los procedimientos de este proceso.</p>
                        </div>
                      ) : (
                        compiledSistemas.map((sistema, idx) => {
                          const linkedSubs = procProcedimientos.filter(p => p.sistemas?.includes(sistema)).map(p => p.name);
                          
                          return (
                            <div key={idx} className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-[12px]">
                                  {idx + 1}
                                </span>
                                <span className="text-[14px] font-bold text-slate-800">{sistema}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {linkedSubs.map(subName => (
                                  <span key={subName} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold truncate max-w-[190px]" title={subName}>
                                    {subName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )
              )}

              {/* HERRAMIENTAS TAB */}
              {activeTab === 'herramientas' && (
                sub ? (
                  // MODO B: Link herramienta to procedure
                  <div className="space-y-6">
                    {canEdit && (
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 max-w-2xl">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            list="herramientas-datalist"
                            value={newHerramientaName}
                            onChange={e => setNewHerramientaName(e.target.value)}
                            placeholder="Ej. Checkpoint Excel..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-[14px] bg-white transition-colors"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && newHerramientaName.trim()) {
                                const currentHerramientas = sub.herramientas || [];
                                const val = newHerramientaName.trim().toUpperCase();
                                if (!currentHerramientas.includes(val)) {
                                  updateProcedimiento(sub.id, { herramientas: [...currentHerramientas, val] });
                                  if (!catalogoHerramientas.includes(val)) {
                                    useAppStore.getState().addCatalogoHerramienta(val);
                                  }
                                  setNewHerramientaName('');
                                }
                              }
                            }}
                          />
                          <datalist id="herramientas-datalist">
                            {catalogoHerramientas.map(h => <option key={h} value={h} />)}
                          </datalist>
                        </div>
                        <button 
                          onClick={() => {
                            const currentHerramientas = sub.herramientas || [];
                            const val = newHerramientaName.trim().toUpperCase();
                            if (val && !currentHerramientas.includes(val)) {
                              updateProcedimiento(sub.id, { herramientas: [...currentHerramientas, val] });
                              if (!catalogoHerramientas.includes(val)) {
                                useAppStore.getState().addCatalogoHerramienta(val);
                              }
                              setNewHerramientaName('');
                            }
                          }}
                          className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/95 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span> Vincular Herramienta
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subHerramientas.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">build</span>
                          <p className="text-[13px] font-medium">No hay herramientas vinculadas a este procedimiento.</p>
                        </div>
                      ) : (
                        subHerramientas.map((herramienta, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-primary/50 transition-colors shadow-sm group">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold text-[13px]">
                                {idx + 1}
                              </span>
                              <span className="text-[14px] font-semibold text-slate-700">{herramienta}</span>
                            </div>
                            {canEdit && (
                              <button 
                                onClick={() => {
                                  updateProcedimiento(sub.id, { herramientas: subHerramientas.filter(x => x !== herramienta) });
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Eliminar vinculación"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // MODO A: Compiled Herramientas
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-[13px] uppercase tracking-wider">Consolidado de Herramientas en Procedimientos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {compiledHerramientas.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                          <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">build</span>
                          <p className="text-[13px] font-medium">No hay herramientas vinculadas a los procedimientos de este proceso.</p>
                        </div>
                      ) : (
                        compiledHerramientas.map((herramienta, idx) => {
                          const linkedSubs = procProcedimientos.filter(p => p.herramientas?.includes(herramienta)).map(p => p.name);
                          
                          return (
                            <div key={idx} className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold text-[12px]">
                                  {idx + 1}
                                </span>
                                <span className="text-[14px] font-bold text-slate-800">{herramienta}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {linkedSubs.map(subName => (
                                  <span key={subName} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold truncate max-w-[190px]" title={subName}>
                                    {subName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )
              )}

              {/* 3. INDICADORES (KPIS) TAB */}
              {activeTab === 'kpis' && (
                sub ? (
                  // MODO B: Edit KPI for procedure
                  <div className="space-y-6">
                    {canEdit && (
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre del KPI</label>
                          <input 
                            type="text"
                            value={newKpiNameGlobal}
                            onChange={e => setNewKpiNameGlobal(e.target.value)}
                            placeholder="Ej. Tiempo de Ciclo, Eficiencia general..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-[13px] bg-white"
                          />
                        </div>
                        <div className="w-full md:w-[220px]">
                          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Puesto / Propietario</label>
                          <select
                            value={newKpiPuesto}
                            onChange={e => setNewKpiPuesto(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-200 text-[13px] outline-none bg-white"
                          >
                            <option value="">-- Seleccionar Puesto --</option>
                            {subPuestos.map(p => <option key={p} value={p}>{p}</option>)}
                            <option value="Otro">Otro puesto...</option>
                          </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fuente de Información</label>
                          <input 
                            type="text"
                            value={newKpiFuente}
                            onChange={e => setNewKpiFuente(e.target.value)}
                            placeholder="Ej. Reporte mensual, Base de datos SAP..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-[13px] bg-white"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            if (newKpiNameGlobal.trim()) {
                              addKPI({
                                projectId: "global",
                                name: newKpiNameGlobal.trim(),
                                status: 'Propuesto',
                                puesto: newKpiPuesto,
                                fuenteInfo: newKpiFuente,
                                macroprocesoId: proc.macroprocesoId,
                                procesoId: proc.id,
                                procedimientoId: sub.id
                              });
                              setNewKpiNameGlobal('');
                              setNewKpiPuesto('');
                              setNewKpiFuente('');
                            }
                          }}
                          disabled={!newKpiNameGlobal.trim()}
                          className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/95 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span> Crear KPI
                        </button>
                      </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Indicador</th>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Puesto</th>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Fuente de Info</th>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Estatus</th>
                            {canEdit && <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase text-center w-12">Acción</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {subKpis.length === 0 ? (
                            <tr>
                              <td colSpan={canEdit ? 5 : 4} className="py-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">analytics</span>
                                <p className="text-[13px]">No hay KPIs definidos para este procedimiento.</p>
                              </td>
                            </tr>
                          ) : (
                            subKpis.map(kpi => (
                              <tr key={kpi.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-6 font-semibold text-slate-800 text-[14px]">
                                  {kpi.name}
                                </td>
                                <td className="py-4 px-6 text-slate-650 text-[13px]">
                                  {kpi.puesto || <span className="text-slate-400 italic">No asignado</span>}
                                </td>
                                <td className="py-4 px-6 text-slate-650 text-[13px]">
                                  {kpi.fuenteInfo || <span className="text-slate-400 italic">No especificada</span>}
                                </td>
                                <td className="py-4 px-6">
                                  <span className={cn(
                                    "px-2.5 py-1 rounded text-[11px] font-bold border",
                                    kpi.status === 'Propuesto' ? "text-amber-600 bg-amber-50 border-amber-100" : 
                                    kpi.status === 'Aprobado' ? "text-blue-600 bg-blue-50 border-blue-100" : 
                                    "text-emerald-600 bg-emerald-50 border-emerald-100"
                                  )}>
                                    {kpi.status}
                                  </span>
                                </td>
                                {canEdit && (
                                  <td className="py-4 px-6 text-center">
                                    <button 
                                      onClick={() => deleteKPI(kpi.id)}
                                      className="text-slate-400 hover:text-red-500 transition-colors"
                                      title="Eliminar KPI"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // MODO A: Compiled KPIs
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-[13px] uppercase tracking-wider">Consolidado de Indicadores del Proceso</h3>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Indicador</th>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Puesto</th>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Procedimiento / Nivel</th>
                            <th className="py-3.5 px-6 font-bold text-[12px] text-slate-500 uppercase">Estatus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {procKpis.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">analytics</span>
                                <p className="text-[13px]">No hay KPIs definidos para este proceso ni para sus procedimientos.</p>
                              </td>
                            </tr>
                          ) : (
                            procKpis.map(kpi => {
                              const kpiSub = kpi.procedimientoId ? procProcedimientos.find(p => p.id === kpi.procedimientoId) : null;
                              return (
                                <tr key={kpi.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 px-6 font-semibold text-slate-800 text-[14px]">
                                    {kpi.name}
                                  </td>
                                  <td className="py-4 px-6 text-slate-650 text-[13px]">
                                    {kpi.puesto || <span className="text-slate-400 italic">No asignado</span>}
                                  </td>
                                  <td className="py-4 px-6 text-slate-650 text-[13px]">
                                    {kpiSub ? (
                                      <span className="text-blue-600 font-bold bg-blue-50/50 px-2 py-0.5 rounded text-[11px]">
                                        {kpiSub.name}
                                      </span>
                                    ) : (
                                      <span className="text-slate-450 italic text-[11px]">Proceso General</span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={cn(
                                      "px-2.5 py-1 rounded text-[11px] font-bold border",
                                      kpi.status === 'Propuesto' ? "text-amber-600 bg-amber-50 border-amber-100" : 
                                      kpi.status === 'Aprobado' ? "text-blue-600 bg-blue-50 border-blue-100" : 
                                      "text-emerald-600 bg-emerald-50 border-emerald-100"
                                    )}>
                                      {kpi.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}

              {/* 4. PROCEDIMIENTOS TAB (MODO A ONLY) */}
              {!sub && activeTab === 'procedimientos' && (
                <div className="space-y-6">
                  {canEdit && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 max-w-2xl">
                      <input 
                        type="text"
                        value={newProcedimientoName}
                        onChange={e => setNewProcedimientoName(e.target.value)}
                        placeholder="Ej. Registro de Prospecto, Inspección de Vehículo..."
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-[14px] bg-white transition-colors"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newProcedimientoName.trim()) {
                            addProcedimiento({
                              procesoId: proc.id,
                              name: newProcedimientoName.trim()
                            });
                            setNewProcedimientoName('');
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          if (newProcedimientoName.trim()) {
                            addProcedimiento({
                              procesoId: proc.id,
                              name: newProcedimientoName.trim()
                            });
                            setNewProcedimientoName('');
                          }
                        }}
                        className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/95 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span> Crear Procedimiento
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {procProcedimientos.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                        <span className="material-symbols-outlined text-[40px] mb-2 opacity-50">description</span>
                        <p className="text-[13px] font-medium">No hay procedimientos vinculados a este proceso.</p>
                      </div>
                    ) : (
                      procProcedimientos.map((procSub, idx) => (
                        <div key={procSub.id} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-primary/50 transition-colors shadow-sm group">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[13px]">
                              {idx + 1}
                            </span>
                            <span className="text-[14px] font-semibold text-slate-700">{procSub.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => {
                                setViewingProcedimientoId(procSub.id);
                                setDiagramaEdit(procSub.diagram || '');
                                setDiagramImageEdit(procSub.diagramImage || '');
                                setActiveProcessTab('diagram');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-bold text-slate-650 flex items-center gap-1 transition-colors"
                              title="Configurar diagrama, puestos y KPIs del procedimiento"
                            >
                              <span className="material-symbols-outlined text-[14px]">settings</span>
                              Configurar
                            </button>
                            {canEdit && (
                              <button 
                                onClick={() => {
                                  deleteProcedimiento(procSub.id);
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Eliminar procedimiento"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export { SolicitudesView };

export const CatalogosView = () => {
  const [activeTab, setActiveTab] = useState<'Puestos' | 'Sistemas' | 'Herramientas' | 'Indicadores' | 'Glosario'>('Puestos');
  const { 
    currentUser, 
    catalogoPuestos, addCatalogoPuesto, deleteCatalogoPuesto,
    catalogoSistemas, addCatalogoSistema, deleteCatalogoSistema,
    catalogoHerramientas, addCatalogoHerramienta, deleteCatalogoHerramienta,
    procedimientos
  } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');

  const handleSyncFromProcedimientos = () => {
    const existingPuestos = new Set((catalogoPuestos || []).map(x => x.toUpperCase()));
    const existingSistemas = new Set((catalogoSistemas || []).map(x => x.toUpperCase()));
    const existingHerramientas = new Set((catalogoHerramientas || []).map(x => x.toUpperCase()));

    (procedimientos || []).forEach(proc => {
      (proc.puestos || []).forEach(p => {
        const val = p.trim().toUpperCase();
        if (val && !existingPuestos.has(val)) {
          addCatalogoPuesto(val);
          existingPuestos.add(val);
        }
      });
      (proc.sistemas || []).forEach(s => {
        const val = s.trim().toUpperCase();
        if (val && !existingSistemas.has(val)) {
          addCatalogoSistema(val);
          existingSistemas.add(val);
        }
      });
      (proc.herramientas || []).forEach(h => {
        const val = h.trim().toUpperCase();
        if (val && !existingHerramientas.has(val)) {
          addCatalogoHerramienta(val);
          existingHerramientas.add(val);
        }
      });
    });
  };

  React.useEffect(() => {
    // Sincronización automática al cargar el componente
    if (procedimientos && procedimientos.length > 0) {
      handleSyncFromProcedimientos();
    }
  }, [procedimientos]);
  
  const renderListEditor = (
    title: string, 
    icon: string, 
    items: string[], 
    onAdd: (v: string) => void, 
    onDelete: (v: string) => void
  ) => {
    const [newVal, setNewVal] = useState('');
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary text-on-primary rounded-lg shadow-sm">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <h2 className="font-display-sm text-display-sm font-bold text-slate-800">Catálogo de {title}</h2>
            <p className="text-body-md text-slate-500">Administra las opciones disponibles para los procedimientos.</p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input 
              type="text"
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              placeholder={`Agregar nuevo ${title.toLowerCase()}...`}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary text-[14px]"
              onKeyDown={e => {
                if (e.key === 'Enter' && newVal.trim() && !items.includes(newVal.trim().toUpperCase())) {
                  onAdd(newVal.trim().toUpperCase());
                  setNewVal('');
                }
              }}
            />
            <button 
              onClick={() => {
                if (newVal.trim() && !items.includes(newVal.trim().toUpperCase())) {
                  onAdd(newVal.trim().toUpperCase());
                  setNewVal('');
                }
              }}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Agregar
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {items.map(item => (
            <div key={item} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-700">{item}</span>
              {canEdit && (
                <button 
                  onClick={() => onDelete(item)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No hay {title.toLowerCase()} registrados.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-container-max mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-on-primary rounded-lg shadow-sm">
            <span className="material-symbols-outlined">format_list_bulleted</span>
          </div>
          <div>
            <h1 className="font-display-lg text-display-lg text-slate-800 font-bold">Catálogos</h1>
            <p className="font-body-lg text-body-lg text-slate-500 mt-1">Gestión centralizada de listas y glosarios</p>
          </div>
        </div>
        
        {canEdit && (
          <button 
            onClick={handleSyncFromProcedimientos}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-[13px] transition-colors"
            title="Importar automáticamente valores desde los procedimientos existentes"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            Sincronizar Datos Previos
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        {(['Puestos', 'Sistemas', 'Herramientas', 'Indicadores', 'Glosario'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-4 font-bold text-[13px] uppercase tracking-wider transition-all border-b-2 whitespace-nowrap",
              activeTab === tab 
                ? "border-primary text-primary" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'Puestos' && renderListEditor('Puestos', 'badge', catalogoPuestos || [], addCatalogoPuesto, deleteCatalogoPuesto)}
        {activeTab === 'Sistemas' && renderListEditor('Sistemas', 'desktop_windows', catalogoSistemas || [], addCatalogoSistema, deleteCatalogoSistema)}
        {activeTab === 'Herramientas' && renderListEditor('Herramientas', 'build', catalogoHerramientas || [], addCatalogoHerramienta, deleteCatalogoHerramienta)}
        {activeTab === 'Indicadores' && (
          <div className="-mt-8">
            <KPIsView />
          </div>
        )}
        {activeTab === 'Glosario' && (
          <div className="-mt-8">
            <GlosarioView />
          </div>
        )}
      </div>
    </div>
  );
};