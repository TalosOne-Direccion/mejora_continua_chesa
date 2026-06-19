import React, { useState } from 'react';
import { Modo, ProjectKPI, KPITool } from '../types';
import { useAppStore } from '../store';
import { ToolBuilder } from './ToolBuilder';
import { cn } from '../utils';

const INITIAL_FOLDERS = [
  { id: 'perfiles', name: 'Perfiles de puesto', icon: 'badge' },
  { id: 'procesos', name: 'Manuales de Procesos', icon: 'account_tree' },
  { id: 'formatos', name: 'Formatos', icon: 'list_alt' },
  { id: 'ido', name: 'IDO', icon: 'integration_instructions' },
  { id: 'tecnicos', name: 'Manuales Tecnicos', icon: 'menu_book' },
  { id: 'auditoria', name: 'Matriz de Auditoria', icon: 'fact_check' },
  { id: 'indicadores', name: 'Indicadores', icon: 'monitoring' }
];

const INITIAL_SUBFOLDERS: Record<string, any[]> = {
  'indicadores': [
    { id: 'rpd', name: 'RPD', icon: 'folder' },
    { id: 'hk', name: 'HK', icon: 'folder' },
    { id: 'tuberia', name: 'Tuberia', icon: 'folder' }
  ]
};

export const DocumentosProyecto: React.FC<{ modo?: Modo }> = ({ modo }) => {
  const { currentUser, kpis, macroprocesos, procesos, propuestas, formatos, addFormato, deleteFormato } = useAppStore();
  const canEdit = currentUser.name === 'Carlos Barrientos' || currentUser.name === 'Ivonne' || currentUser.name === 'Armando';
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentSubfolder, setCurrentSubfolder] = useState<string | null>(null);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [subfoldersMap, setSubfoldersMap] = useState(INITIAL_SUBFOLDERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [builderTool, setBuilderTool] = useState<{ kpi: ProjectKPI, tool: KPITool } | null>(null);

  const handleAddFolder = () => {
    const name = prompt('Nombre de la nueva carpeta:');
    if (name) {
      setFolders(prev => [...prev, { id: Date.now().toString(), name, icon: 'folder' }]);
    }
  };

  const handleAddSubfolder = () => {
    const name = prompt('Nombre de la nueva subcarpeta:');
    if (name && currentFolder) {
      setSubfoldersMap(prev => ({
        ...prev,
        [currentFolder]: [...(prev[currentFolder] || []), { id: Date.now().toString(), name, icon: 'folder' }]
      }));
    }
  };

  const renderFolders = () => {
    if (currentFolder) {
      const parentFolder = folders.find(f => f.id === currentFolder);
      const subs = subfoldersMap[currentFolder] || [];
      
      if (currentSubfolder) {
        const subFolderObj = subs.find(s => s.id === currentSubfolder);
        return (
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setCurrentSubfolder(null)} className="text-on-surface-variant hover:text-primary flex items-center gap-1 font-label-md">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
            </button>
            <span className="text-outline-variant">/</span>
            <span className="font-label-md text-on-surface cursor-pointer hover:underline" onClick={() => setCurrentSubfolder(null)}>{parentFolder?.name}</span>
            <span className="text-outline-variant">/</span>
            <span className="font-label-md text-on-surface font-bold">{subFolderObj?.name}</span>
          </div>
        );
      }

      return (
        <>
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setCurrentFolder(null)} className="text-on-surface-variant hover:text-primary flex items-center gap-1 font-label-md">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
            </button>
            <span className="text-outline-variant">/</span>
            <span className="font-label-md text-on-surface font-bold">{parentFolder?.name}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subs.map(f => (
              <div 
                key={f.id} 
                onClick={() => setCurrentSubfolder(f.id)} 
                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-surface-tint text-[32px] group-hover:scale-110 transition-transform">{f.icon}</span>
                <span className="font-label-md text-label-md text-on-surface text-center">{f.name}</span>
                {currentFolder === 'indicadores' ? (
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {kpis.filter(k => k.tools?.some(t => t.toLowerCase() === f.id.toLowerCase()) && k.status !== 'Propuesto' && (!modo || k.projectId === modo.id)).length} indicadores
                  </span>
                ) : (
                  <span className="font-label-sm text-label-sm text-on-surface-variant">0 archivos</span>
                )}
              </div>
            ))}
            {canEdit && (
              <div onClick={handleAddSubfolder} className="bg-surface border-2 border-dashed border-outline-variant rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-surface-container-lowest transition-all cursor-pointer text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[24px]">add</span>
                <span className="font-label-md text-label-md text-center">Añadir Subcarpeta</span>
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {folders.map(f => (
          <div 
            key={f.id} 
            onClick={() => setCurrentFolder(f.id)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-surface-tint text-[32px] group-hover:scale-110 transition-transform">{f.icon}</span>
            <span className="font-label-md text-label-md text-on-surface text-center">{f.name}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {f.id === 'indicadores' 
                ? `${kpis.filter(k => k.status !== 'Propuesto' && (!modo || k.projectId === modo.id)).length} indicadores`
                : subfoldersMap[f.id] ? `${subfoldersMap[f.id].length} subcarpetas` : '0 archivos'
              }
            </span>
          </div>
        ))}
        {canEdit && (
          <div onClick={handleAddFolder} className="bg-surface border-2 border-dashed border-outline-variant rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-surface-container-lowest transition-all cursor-pointer text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined text-[24px]">create_new_folder</span>
            <span className="font-label-md text-label-md text-center">Añadir Carpeta</span>
          </div>
        )}
      </div>
    );
  };

  const renderBottomContent = () => {
    if (currentFolder === 'indicadores') {
      let filteredKpis = kpis.filter(k => k.status !== 'Propuesto'); // Mostrar Aprobados y Liberados
      
      if (modo) {
        filteredKpis = filteredKpis.filter(k => k.projectId === modo.id);
      }
      
      if (currentSubfolder) {
        filteredKpis = filteredKpis.filter(k => k.tools?.some(t => t.toLowerCase() === currentSubfolder.toLowerCase()));
      }

      if (searchQuery) {
        filteredKpis = filteredKpis.filter(k => k.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      if (filteredKpis.length === 0) {
        return (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center mt-8 min-h-[300px]">
            <span className="material-symbols-outlined text-outline-variant mb-4" style={{ fontSize: '48px' }}>search_off</span>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-2">No hay indicadores</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              {currentSubfolder 
                ? `Aún no hay indicadores aprobados con la herramienta ${currentSubfolder.toUpperCase()}.` 
                : 'Aún no se han aprobado indicadores en este proyecto.'}
            </p>
          </div>
        );
      }

      return (
        <div className="bg-white border border-slate-200 rounded-xl mt-8 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">Indicador</th>
                <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">Puesto / Área</th>
                <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">Estatus</th>
                <th className="py-4 px-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKpis.map(kpi => (
                <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-[14px]">{kpi.name}</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">ID: {kpi.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-medium text-slate-700">{kpi.puesto || 'Sin asignar'}</p>
                    <p className="text-[12px] text-slate-500">{kpi.area || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[12px] font-bold",
                      kpi.status === 'Liberado' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {kpi.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {kpi.tools && kpi.tools.length > 0 ? (
                      <button 
                        onClick={() => {
                          const toolToBuild = currentSubfolder 
                            ? kpi.tools!.find(t => t.toLowerCase() === currentSubfolder.toLowerCase()) 
                            : kpi.tools![0];
                          if (toolToBuild) {
                            setBuilderTool({ kpi, tool: toolToBuild });
                          }
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-2 ml-auto",
                          kpi.status === 'Liberado' 
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        )}
                      >
                        <span className="material-symbols-outlined text-[16px]">{kpi.status === 'Liberado' ? 'visibility' : 'build'}</span>
                        {kpi.status === 'Liberado' ? 'Ver Herramienta' : 'Construir'}
                      </button>
                    ) : (
                      <span className="text-[12px] text-slate-400">Herramienta no asignada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (currentFolder === 'procesos') {
      return (
        <div className="bg-white border border-slate-200 rounded-xl mt-8 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-[16px] mb-4">Manuales de Procesos</h3>
          <div className="space-y-6">
            {macroprocesos.map(mac => {
              const macProcesos = procesos.filter(p => p.macroprocesoId === mac.id);
              if (macProcesos.length === 0) return null;
              return (
                <div key={mac.id} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">account_tree</span>
                    <span className="font-bold text-slate-700 text-[14px]">{mac.name}</span>
                    <span className="ml-auto text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">{mac.type}</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {macProcesos.map(proc => (
                      <div key={proc.id} className="px-4 py-3 hover:bg-slate-50 transition-colors flex justify-between items-center group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-300 text-[18px]">description</span>
                          <span className="text-[13px] text-slate-700 font-medium">{proc.name}</span>
                        </div>
                        <button className="text-[12px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Ver manual <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (currentFolder === 'perfiles') {
      const perfilesProject = propuestas.filter(p => p.type === 'Puesto' && p.status !== 'Propuesto' && (!modo || p.projectId === modo.id));
      
      if (perfilesProject.length === 0) {
        return (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center mt-8 min-h-[300px]">
            <span className="material-symbols-outlined text-outline-variant mb-4" style={{ fontSize: '48px' }}>badge</span>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-2">No hay Perfiles de Puesto</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Aún no se han definido perfiles de puesto en este proyecto.
            </p>
          </div>
        );
      }

      return (
        <div className="bg-white border border-slate-200 rounded-xl mt-8 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-[16px] mb-4">Perfiles de Puesto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {perfilesProject.map(puesto => {
              const mac = macroprocesos.find(m => m.id === puesto.macroprocesoId);
              const proc = procesos.find(p => p.id === puesto.procesoId);
              return (
                <div key={puesto.id} className="border border-slate-200 rounded-xl p-4 hover:border-primary/50 transition-colors bg-white group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[14px]">{puesto.name}</h4>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        puesto.status === 'Definido' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>{puesto.status}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                    <p><span className="font-bold">Macroproceso:</span> {mac?.name || 'N/A'}</p>
                    <p className="mt-0.5"><span className="font-bold">Proceso:</span> {proc?.name || 'N/A'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (currentFolder === 'formatos') {
      return (
        <div className="bg-white border border-slate-200 rounded-xl mt-8 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-[16px] mb-4">Formatos y Plantillas</h3>
          <div className="space-y-6">
            {macroprocesos.map(mac => {
              const macProcesos = procesos.filter(p => p.macroprocesoId === mac.id);
              if (macProcesos.length === 0) return null;
              return (
                <div key={mac.id} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">account_tree</span>
                    <span className="font-bold text-slate-700 text-[14px]">{mac.name}</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {macProcesos.map(proc => {
                      const procFormatos = formatos.filter(f => f.procesoId === proc.id && (!modo || f.projectId === modo.id));
                      return (
                        <div key={proc.id} className="px-4 py-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-slate-300 text-[18px]">description</span>
                              <span className="text-[13px] text-slate-700 font-bold">{proc.name}</span>
                            </div>
                            {canEdit && (
                              <label className="cursor-pointer text-[12px] text-primary font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                Subir formato
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      addFormato({
                                        projectId: modo?.id,
                                        macroprocesoId: mac.id,
                                        procesoId: proc.id,
                                        name: file.name,
                                        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                                        uploadedAt: new Date().toLocaleDateString()
                                      });
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                          
                          {procFormatos.length > 0 ? (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-8">
                              {procFormatos.map(fmt => (
                                <div key={fmt.id} className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 group">
                                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">insert_drive_file</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-slate-700 truncate" title={fmt.name}>{fmt.name}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{fmt.size} • {fmt.uploadedAt}</p>
                                  </div>
                                  {canEdit && (
                                    <button 
                                      onClick={() => deleteFormato(fmt.id)}
                                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Eliminar formato"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="pl-8 mt-1 text-[12px] text-slate-400 italic">
                              No hay formatos cargados para este proceso.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Carpeta vacía por defecto
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center mt-8 min-h-[300px]">
        <span className="material-symbols-outlined text-outline-variant mb-4" style={{ fontSize: '48px' }}>cloud_download</span>
        <h3 className="font-title-lg text-title-lg text-on-surface mb-2">Repositorio Vacío</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Aún no se han generado los documentos operativos para este proyecto. Completa los diseños TO-BE y la etapa Analyze para autogenerar la documentación requerida.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Paquete Documental</h2>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-high rounded text-label-sm font-label-sm text-on-surface-variant border border-outline-variant mt-2">
            <span className="material-symbols-outlined text-[14px]">info</span> REPO CENTRALIZADO
          </span>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input 
            className="w-full h-10 pl-10 pr-3 rounded-md bg-surface-container-lowest border border-outline-variant text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
            placeholder="Buscar por documento o indicador..." 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {renderFolders()}

      {renderBottomContent()}

      {builderTool && (
        <ToolBuilder 
          kpi={builderTool.kpi} 
          tool={builderTool.tool} 
          onClose={() => setBuilderTool(null)} 
        />
      )}
    </div>
  );
};