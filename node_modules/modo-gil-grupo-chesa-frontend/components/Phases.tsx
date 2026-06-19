import React, { useState, useEffect } from 'react';
import { PhaseLayout } from './PhaseLayout';
import { Modo } from '../types';
import { generatePhaseData, generateTallerData } from '../api';
import { useAppStore } from '../store';
import { MermaidChart } from './MermaidChart';
import { TALLER_INFO, CHECKLISTS } from '../constants';
import { cn } from '../utils';

const INVENTORY_CATEGORIES = [
  { id: 'perfiles', label: 'Perfiles de Puesto', icon: 'badge' },
  { id: 'procesos', label: 'Manuales de Procesos', icon: 'account_tree' },
  { id: 'formatos', label: 'Formatos', icon: 'list_alt' },
  { id: 'ido', label: 'IDO', icon: 'integration_instructions' },
  { id: 'tecnicos', label: 'Manuales Técnicos', icon: 'menu_book' },
  { id: 'auditoria', label: 'Matriz de Auditoría', icon: 'fact_check' },
  { id: 'indicadores', label: 'Indicadores', icon: 'monitoring' }
];

const EditableInventory: React.FC<{ title: string, subtitle: string, data: Record<string, string[]>, onChange: (newData: Record<string, string[]>) => void }> = ({ title, subtitle, data, onChange }) => {
  const { currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');

  const handleAddItem = (categoryId: string) => {
    if (!canEdit) return;
    const item = prompt('Nombre del nuevo elemento:');
    if (item && item.trim() !== '') {
      onChange({ ...data, [categoryId]: [...(data[categoryId] || []), item.trim()] });
    }
  };

  const handleRemoveItem = (categoryId: string, index: number) => {
    if (!canEdit) return;
    const newItems = [...(data[categoryId] || [])];
    newItems.splice(index, 1);
    onChange({ ...data, [categoryId]: newItems });
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-[18px] font-bold text-slate-900">{title}</h3>
          <p className="text-[13px] text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {INVENTORY_CATEGORIES.map(cat => {
          const items = data[cat.id] || [];
          return (
            <div key={cat.id} className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">{cat.icon}</span>
                <h4 className="text-[14px] font-bold text-slate-800">{cat.label}</h4>
                <span className="ml-auto bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-[11px] font-bold">{items.length}</span>
              </div>
              <ul className="space-y-2 mb-3">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2.5 rounded-lg group border border-slate-100">
                    <span className="text-[13px] font-medium text-slate-700">{item}</span>
                    {canEdit && (
                      <button onClick={() => handleRemoveItem(cat.id, idx)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-[12px] text-slate-400 italic px-2 py-1">Sin elementos registrados</li>
                )}
              </ul>
              {canEdit && (
                <button onClick={() => handleAddItem(cat.id)} className="text-[12px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors mt-2">
                  <span className="material-symbols-outlined text-[16px]">add</span> Añadir elemento
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const GestorPropuestas: React.FC<{ modoId: string, phaseName: 'Análisis' | 'Diseño' }> = ({ modoId, phaseName }) => {
  const { propuestas, addPropuesta, updatePropuesta, macroprocesos, procesos, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [newPuestoName, setNewPuestoName] = useState('');
  const [newPropType, setNewPropType] = useState<'Puesto' | 'Proceso' | 'Indicador' | 'Herramienta' | 'Sistema'>('Puesto');
  const [selectedMacId, setSelectedMacId] = useState('');
  const [selectedProcId, setSelectedProcId] = useState('');

  const projectPropuestas = propuestas?.filter(p => p.projectId === modoId) || [];

  const handleAdd = () => {
    if (!canEdit || !newPuestoName.trim() || !selectedMacId || !selectedProcId) return;
    addPropuesta({
      projectId: modoId,
      name: newPuestoName.trim(),
      type: newPropType,
      status: phaseName === 'Análisis' ? 'Propuesto' : 'Confirmado',
      macroprocesoId: selectedMacId,
      procesoId: selectedProcId
    });
    setNewPuestoName('');
    setSelectedProcId('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm mt-8">
      <h3 className="text-[18px] font-bold text-slate-900 mb-2">
        {phaseName === 'Análisis' ? 'Propuestas de Mejora (TO-BE)' : 'Propuestas Confirmadas'}
      </h3>
      <p className="text-[13px] text-slate-500 mb-6">
        {phaseName === 'Análisis' 
          ? 'Propón roles, procesos, indicadores o herramientas para el modelo futuro basándote en el análisis.'
          : 'Confirma y define los roles y elementos requeridos en el nuevo diseño.'}
      </p>

      {canEdit && (
        <div className="flex gap-4 mb-6 flex-wrap">
          <select 
            value={selectedMacId} onChange={e => { setSelectedMacId(e.target.value); setSelectedProcId(''); }}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white"
          >
            <option value="">Macroproceso...</option>
            {macroprocesos?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select 
            value={selectedProcId} onChange={e => setSelectedProcId(e.target.value)} disabled={!selectedMacId}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white disabled:opacity-50"
          >
            <option value="">Proceso...</option>
            {procesos?.filter(p => p.macroprocesoId === selectedMacId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            value={newPropType} onChange={e => setNewPropType(e.target.value as any)}
            className="w-1/4 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white"
          >
            <option value="Puesto">Puesto / Rol</option>
            <option value="Proceso">Proceso / Procedimiento</option>
            <option value="Indicador">Indicador (KPI)</option>
            <option value="Herramienta">Herramienta</option>
            <option value="Sistema">Sistema / Software</option>
          </select>
          <input 
            type="text"
            value={newPuestoName}
            onChange={e => setNewPuestoName(e.target.value)}
            placeholder={`Nombre del ${newPropType.toLowerCase()}...`}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none transition-colors text-body-md bg-white min-w-[200px]"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button 
            onClick={handleAdd}
            disabled={!newPuestoName.trim() || !selectedMacId || !selectedProcId}
            className="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Agregar
          </button>
        </div>
      )}

      {projectPropuestas.length > 0 ? (
        <div className="space-y-3">
          {projectPropuestas.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {p.type}
                  </span>
                  <h4 className="font-bold text-slate-800 text-[14px]">{p.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {macroprocesos?.find(m => m.id === p.macroprocesoId)?.name} {'>'} {procesos?.find(proc => proc.id === p.procesoId)?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                  p.status === 'Propuesto' ? "bg-amber-50 text-amber-600 border-amber-200" :
                  p.status === 'Confirmado' ? "bg-blue-50 text-blue-600 border-blue-200" :
                  "bg-emerald-50 text-emerald-600 border-emerald-200"
                )}>
                  {p.status}
                </span>
                {canEdit && phaseName === 'Diseño' && p.status === 'Propuesto' && (
                  <button onClick={() => updatePropuesta(p.id, { status: 'Confirmado' })} className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Confirmar
                  </button>
                )}
                {canEdit && phaseName === 'Diseño' && p.status === 'Confirmado' && p.type === 'Puesto' && (
                  <button onClick={() => updatePropuesta(p.id, { status: 'Definido' })} className="text-[12px] font-bold text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span> Definir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-slate-400 italic">No hay propuestas aún.</p>
      )}
    </div>
  );
};

// --- Taller de Herramientas Phase ---
export const TallerPhase: React.FC<{ modo: Modo, phaseNumber: number, title: string }> = ({ modo, phaseNumber, title }) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[phaseNumber]?.data || {};
  const isApproved = modo.phases[phaseNumber]?.status === 'Aprobado' || modo.phases[phaseNumber]?.status === 'Completo';
  
  const info = TALLER_INFO[phaseNumber] || { proposito: 'Fase del taller', queSeHace: [] };
  const checklistManual = (CHECKLISTS['Taller de Herramientas'] || []).filter(c => c.phase === phaseNumber).map(c => c.text);

  // General notes state
  const [notas, setNotas] = useState('');

  // Phase 2: Clasificación y entendimiento
  const [macroproceso, setMacroproceso] = useState('');
  const [procedimientos, setProcedimientos] = useState('');
  const [sistemas, setSistemas] = useState('');
  const [puestos, setPuestos] = useState('');
  const [entradasSalidas, setEntradasSalidas] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [diagramTab, setDiagramTab] = useState<'image' | 'mermaid'>('mermaid');
  const [asIsImage, setAsIsImage] = useState<string | null>(null);

  // Phase 3: Roles
  const [roles, setRoles] = useState<any[]>([]);
  // Phase 4: Documental
  const [documentos, setDocumentos] = useState<any[]>([]);
  // Phase 5: Técnico
  const [manuales, setManuales] = useState<any[]>([]);
  // Phase 6: Indicadores
  const [indicadores, setIndicadores] = useState<any[]>([]);
  // Phase 7: Control
  const [auditorias, setAuditorias] = useState<any[]>([]);
  // Phase 8: Liberación
  const [capacitaciones, setCapacitaciones] = useState<any[]>([]);
  const [checklistCierre, setChecklistCierre] = useState<Record<string, boolean>>({});

  // Sync state with props
  useEffect(() => {
    setNotas(phaseData.notas || '');
    if (phaseNumber === 2) {
      setMacroproceso(phaseData.macroproceso || '');
      setProcedimientos(phaseData.procedimientos || '');
      setSistemas(phaseData.sistemas || '');
      setPuestos(phaseData.puestos || '');
      setEntradasSalidas(phaseData.entradasSalidas || '');
      setExternalLink(phaseData.asIsLink || '');
      setMermaidCode(phaseData.mermaidASIS || '');
      setAsIsImage(phaseData.asIsImage || null);
      setDiagramTab(phaseData.asIsImage ? 'image' : 'mermaid');
    } else if (phaseNumber === 3) {
      setRoles(phaseData.rolesList || []);
    } else if (phaseNumber === 4) {
      setDocumentos(phaseData.documentosList || []);
    } else if (phaseNumber === 5) {
      setManuales(phaseData.manualesList || []);
    } else if (phaseNumber === 6) {
      setIndicadores(phaseData.indicadoresList || []);
    } else if (phaseNumber === 7) {
      setAuditorias(phaseData.auditoriaList || []);
    } else if (phaseNumber === 8) {
      setCapacitaciones(phaseData.capacitaciones || []);
      setChecklistCierre(phaseData.checklistCierre || {
        'Validado con usuarios clave': false,
        'Ajustes de redacción e IDO incorporados': false,
        'Codificación y versionamiento completado': false,
        'Evidencia de capacitación registrada': false
      });
    }
  }, [phaseNumber, phaseData]);

  const updateStore = (fields: any) => {
    if (isApproved || !canEdit) return;
    updateModoPhase(modo.id, phaseNumber, { data: { ...phaseData, ...fields } });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateTallerData(phaseNumber, { notas });
      const checklistObj = checklistManual.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
      updateModoPhase(modo.id, phaseNumber, { data: { ...phaseData, ...data, notas }, checklistOut: checklistObj, status: 'En proceso' });
    } catch (err: any) {} finally { setIsGenerating(false); }
  };

  const renderPhaseTool = () => {
    switch (phaseNumber) {
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
                Mapeo de la Arquitectura de Procesos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase">Macroproceso</label>
                  <input type="text" className="p-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 outline-none focus:ring-1 focus:ring-primary disabled:opacity-60" placeholder="Ej. Postventa, Ventas" value={macroproceso} onChange={e => setMacroproceso(e.target.value)} onBlur={() => updateStore({ macroproceso })} disabled={isApproved || !canEdit} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase">Procedimientos Involucrados</label>
                  <input type="text" className="p-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 outline-none focus:ring-1 focus:ring-primary disabled:opacity-60" placeholder="Ej. Recepción de unidad, Lavado" value={procedimientos} onChange={e => setProcedimientos(e.target.value)} onBlur={() => updateStore({ procedimientos })} disabled={isApproved || !canEdit} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase">Sistemas y Herramientas</label>
                  <input type="text" className="p-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 outline-none focus:ring-1 focus:ring-primary disabled:opacity-60" placeholder="Ej. Intelisis CRM, Excel" value={sistemas} onChange={e => setSistemas(e.target.value)} onBlur={() => updateStore({ sistemas })} disabled={isApproved || !canEdit} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase">Puestos y Roles Clave</label>
                  <input type="text" className="p-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 outline-none focus:ring-1 focus:ring-primary disabled:opacity-60" placeholder="Ej. Técnico Lavador, Asesor de Servicio" value={puestos} onChange={e => setPuestos(e.target.value)} onBlur={() => updateStore({ puestos })} disabled={isApproved || !canEdit} />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[12px] font-bold text-slate-500 uppercase">Límites del Proceso (Entradas y Salidas)</label>
                  <textarea className="p-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 outline-none focus:ring-1 focus:ring-primary disabled:opacity-60 resize-none animate-none" rows={2} placeholder="Entrada: Unidad sucia; Salida: Unidad limpia y checklist lleno" value={entradasSalidas} onChange={e => setEntradasSalidas(e.target.value)} onBlur={() => updateStore({ entradasSalidas })} disabled={isApproved || !canEdit} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">Diagrama de Flujo del Proceso</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">Elige entre escribir código Mermaid o subir una imagen de tu diagrama.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setDiagramTab('image')} className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramTab === 'image' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Imagen / Enlace</button>
                  <button onClick={() => setDiagramTab('mermaid')} className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramTab === 'mermaid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Código Mermaid</button>
                </div>
              </div>

              {diagramTab === 'image' ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">link</span>
                    <input type="text" placeholder="Enlace externo a Lucidchart o draw.io (opcional)" className="flex-1 p-2.5 border border-slate-200 rounded-lg text-[13px] outline-none bg-slate-50 disabled:opacity-60" value={externalLink} onChange={e => setExternalLink(e.target.value)} onBlur={() => updateStore({ asIsLink: externalLink })} disabled={isApproved || !canEdit} />
                    {externalLink && <a href={externalLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-[13px] hover:underline">Abrir enlace</a>}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className={cn("cursor-pointer bg-white border border-slate-200 text-slate-700 font-bold text-[13px] px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2 shadow-sm", (isApproved || !canEdit) && "opacity-50 cursor-not-allowed pointer-events-none")}>
                      <span className="material-symbols-outlined text-[18px]">upload</span> Subir Imagen
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => {
                            setAsIsImage(r.result as string);
                            updateStore({ asIsImage: r.result as string });
                          };
                          r.readAsDataURL(file);
                        }
                      }} disabled={isApproved || !canEdit} />
                    </label>
                    {asIsImage && (
                      <button onClick={() => { setAsIsImage(null); updateStore({ asIsImage: null }); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center" disabled={isApproved || !canEdit}>
                        <span className="material-symbols-outlined text-[18px]">delete</span> Eliminar
                      </button>
                    )}
                  </div>
                  {asIsImage ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-center"><img src={asIsImage} className="max-w-full max-h-[300px] rounded-lg border border-slate-200" alt="Diagrama" /></div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-slate-200 border-dashed rounded-xl bg-slate-50/50">Aún no hay una imagen cargada</div>
                  )}
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono text-[12px] text-slate-700 outline-none focus:ring-1 focus:ring-primary disabled:opacity-60" rows={6} value={mermaidCode} onChange={e => setMermaidCode(e.target.value)} onBlur={() => updateStore({ mermaidASIS: mermaidCode })} disabled={isApproved || !canEdit} placeholder="graph TD..." />
                  {mermaidCode ? (
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex justify-center min-h-[150px] overflow-auto"><MermaidChart chart={mermaidCode} /></div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-slate-200 border-dashed rounded-xl bg-slate-50/50">Escribe código Mermaid arriba para ver el diagrama en vivo.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                Matriz de Puestos, Roles y Responsabilidades
              </h3>
              {canEdit && !isApproved && (
                <button onClick={() => {
                  const newList = [...roles, { id: Math.random().toString(), puesto: '', funciones: '', kpi: '', tipoResp: 'Principal' }];
                  setRoles(newList);
                  updateStore({ rolesList: newList });
                }} className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[13px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span> Agregar Puesto
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Puesto</th>
                    <th className="p-3">Funciones Clave</th>
                    <th className="p-3">KPI del Puesto</th>
                    <th className="p-3 w-1/4">Responsabilidad</th>
                    {canEdit && !isApproved && <th className="p-3 w-12 text-center">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {roles.map((r, idx) => (
                    <tr key={r.id || idx}>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={r.puesto} onChange={e => {
                        const copy = [...roles]; copy[idx].puesto = e.target.value; setRoles(copy);
                      }} onBlur={() => updateStore({ rolesList: roles })} disabled={isApproved || !canEdit} placeholder="Ej. Operador" /></td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={r.funciones} onChange={e => {
                        const copy = [...roles]; copy[idx].funciones = e.target.value; setRoles(copy);
                      }} onBlur={() => updateStore({ rolesList: roles })} disabled={isApproved || !canEdit} placeholder="Ej. Lavado de autos" /></td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={r.kpi} onChange={e => {
                        const copy = [...roles]; copy[idx].kpi = e.target.value; setRoles(copy);
                      }} onBlur={() => updateStore({ rolesList: roles })} disabled={isApproved || !canEdit} placeholder="Ej. Tiempos de ciclo" /></td>
                      <td className="p-2">
                        <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={r.tipoResp} onChange={e => {
                          const copy = [...roles]; copy[idx].tipoResp = e.target.value; setRoles(copy); updateStore({ rolesList: copy });
                        }} disabled={isApproved || !canEdit}>
                          <option value="Principal">Principal</option>
                          <option value="Secundaria">Secundaria</option>
                        </select>
                      </td>
                      {canEdit && !isApproved && (
                        <td className="p-2 text-center">
                          <button onClick={() => {
                            const copy = roles.filter((_, i) => i !== idx); setRoles(copy); updateStore({ rolesList: copy });
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {roles.length === 0 && (
                    <tr><td colSpan={canEdit && !isApproved ? 5 : 4} className="p-8 text-center text-slate-400 italic">No hay puestos registrados en esta etapa.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                Paquete Documental MVP (Manuales, IDOs y Formatos)
              </h3>
              {canEdit && !isApproved && (
                <button onClick={() => {
                  const newList = [...documentos, { id: Math.random().toString(), nombre: '', tipo: 'Manual de Proceso', responsable: '', estatus: 'Pendiente' }];
                  setDocumentos(newList);
                  updateStore({ documentosList: newList });
                }} className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[13px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span> Agregar Documento
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Nombre del Documento</th>
                    <th className="p-3 w-1/5">Tipo</th>
                    <th className="p-3">Responsable</th>
                    <th className="p-3 w-1/5">Estatus</th>
                    {canEdit && !isApproved && <th className="p-3 w-12 text-center">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {documentos.map((d, idx) => (
                    <tr key={d.id || idx}>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={d.nombre} onChange={e => {
                        const copy = [...documentos]; copy[idx].nombre = e.target.value; setDocumentos(copy);
                      }} onBlur={() => updateStore({ documentosList: documentos })} disabled={isApproved || !canEdit} placeholder="Ej. Procedimiento de lavado" /></td>
                      <td className="p-2">
                        <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={d.tipo} onChange={e => {
                          const copy = [...documentos]; copy[idx].tipo = e.target.value; setDocumentos(copy); updateStore({ documentosList: copy });
                        }} disabled={isApproved || !canEdit}>
                          <option value="Manual de Proceso">Manual de Proceso</option>
                          <option value="IDO">IDO</option>
                          <option value="Formato">Formato</option>
                          <option value="Checklist">Checklist</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={d.responsable} onChange={e => {
                        const copy = [...documentos]; copy[idx].responsable = e.target.value; setDocumentos(copy);
                      }} onBlur={() => updateStore({ documentosList: documentos })} disabled={isApproved || !canEdit} placeholder="Ej. Lider de MC" /></td>
                      <td className="p-2">
                        <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60 font-bold" value={d.estatus} onChange={e => {
                          const copy = [...documentos]; copy[idx].estatus = e.target.value; setDocumentos(copy); updateStore({ documentosList: copy });
                        }} disabled={isApproved || !canEdit}>
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Borrador">En Borrador</option>
                          <option value="Terminado">Terminado</option>
                        </select>
                      </td>
                      {canEdit && !isApproved && (
                        <td className="p-2 text-center">
                          <button onClick={() => {
                            const copy = documentos.filter((_, i) => i !== idx); setDocumentos(copy); updateStore({ documentosList: copy });
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {documentos.length === 0 && (
                    <tr><td colSpan={canEdit && !isApproved ? 5 : 4} className="p-8 text-center text-slate-400 italic">No hay documentos registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">construction</span>
                Manual Técnico y Criterios de Sistemas / Herramientas
              </h3>
              {canEdit && !isApproved && (
                <button onClick={() => {
                  const newList = [...manuales, { id: Math.random().toString(), sistema: '', pasos: '', criterios: '', soporte: '' }];
                  setManuales(newList);
                  updateStore({ manualesList: newList });
                }} className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[13px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span> Agregar Sistema
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3 w-1/4">Sistema / Herramienta</th>
                    <th className="p-3">Pasos de Uso</th>
                    <th className="p-3">Criterios Técnicos / Errores</th>
                    <th className="p-3 w-1/5">Soporte</th>
                    {canEdit && !isApproved && <th className="p-3 w-12 text-center">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {manuales.map((m, idx) => (
                    <tr key={m.id || idx}>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={m.sistema} onChange={e => {
                        const copy = [...manuales]; copy[idx].sistema = e.target.value; setManuales(copy);
                      }} onBlur={() => updateStore({ manualesList: manuales })} disabled={isApproved || !canEdit} placeholder="Ej. Intelisis CRM" /></td>
                      <td className="p-2"><textarea className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60 resize-none text-[12px] animate-none" rows={2} value={m.pasos} onChange={e => {
                        const copy = [...manuales]; copy[idx].pasos = e.target.value; setManuales(copy);
                      }} onBlur={() => updateStore({ manualesList: manuales })} disabled={isApproved || !canEdit} placeholder="Pasos clave..." /></td>
                      <td className="p-2"><textarea className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60 resize-none text-[12px] animate-none" rows={2} value={m.criterios} onChange={e => {
                        const copy = [...manuales]; copy[idx].criterios = e.target.value; setManuales(copy);
                      }} onBlur={() => updateStore({ manualesList: manuales })} disabled={isApproved || !canEdit} placeholder="Errores comunes..." /></td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={m.soporte} onChange={e => {
                        const copy = [...manuales]; copy[idx].soporte = e.target.value; setManuales(copy);
                      }} onBlur={() => updateStore({ manualesList: manuales })} disabled={isApproved || !canEdit} placeholder="Ej. Soporte TI" /></td>
                      {canEdit && !isApproved && (
                        <td className="p-2 text-center">
                          <button onClick={() => {
                            const copy = manuales.filter((_, i) => i !== idx); setManuales(copy); updateStore({ manualesList: copy });
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {manuales.length === 0 && (
                    <tr><td colSpan={canEdit && !isApproved ? 5 : 4} className="p-8 text-center text-slate-400 italic">No hay sistemas técnicos registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                Tablero de KPIs, Tuberías y RPD
              </h3>
              {canEdit && !isApproved && (
                <button onClick={() => {
                  const newList = [...indicadores, { id: Math.random().toString(), kpi: '', formula: '', meta: '', frecuencia: 'Mensual', responsable: '', vinculo: 'RPD' }];
                  setIndicadores(newList);
                  updateStore({ indicadoresList: newList });
                }} className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[13px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span> Agregar Indicador
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Indicador</th>
                    <th className="p-3">Fórmula</th>
                    <th className="p-3 w-28">Meta</th>
                    <th className="p-3 w-32">Frecuencia</th>
                    <th className="p-3">Responsable</th>
                    <th className="p-3 w-36">Vínculo / Uso</th>
                    {canEdit && !isApproved && <th className="p-3 w-12 text-center">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {indicadores.map((ind, idx) => (
                    <tr key={ind.id || idx}>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={ind.kpi} onChange={e => {
                        const copy = [...indicadores]; copy[idx].kpi = e.target.value; setIndicadores(copy);
                      }} onBlur={() => updateStore({ indicadoresList: indicadores })} disabled={isApproved || !canEdit} placeholder="Ej. NPS" /></td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={ind.formula} onChange={e => {
                        const copy = [...indicadores]; copy[idx].formula = e.target.value; setIndicadores(copy);
                      }} onBlur={() => updateStore({ indicadoresList: indicadores })} disabled={isApproved || !canEdit} placeholder="Ej. Promoción % - Detracción %" /></td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={ind.meta} onChange={e => {
                        const copy = [...indicadores]; copy[idx].meta = e.target.value; setIndicadores(copy);
                      }} onBlur={() => updateStore({ indicadoresList: indicadores })} disabled={isApproved || !canEdit} placeholder="Ej. > 85%" /></td>
                      <td className="p-2">
                        <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={ind.frecuencia} onChange={e => {
                          const copy = [...indicadores]; copy[idx].frecuencia = e.target.value; setIndicadores(copy); updateStore({ indicadoresList: copy });
                        }} disabled={isApproved || !canEdit}>
                          <option value="Diario">Diario</option>
                          <option value="Semanal">Semanal</option>
                          <option value="Quincenal">Quincenal</option>
                          <option value="Mensual">Mensual</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={ind.responsable} onChange={e => {
                        const copy = [...indicadores]; copy[idx].responsable = e.target.value; setIndicadores(copy);
                      }} onBlur={() => updateStore({ indicadoresList: indicadores })} disabled={isApproved || !canEdit} placeholder="Ej. Gerente de Calidad" /></td>
                      <td className="p-2">
                        <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={ind.vinculo} onChange={e => {
                          const copy = [...indicadores]; copy[idx].vinculo = e.target.value; setIndicadores(copy); updateStore({ indicadoresList: copy });
                        }} disabled={isApproved || !canEdit}>
                          <option value="Hoshin Kanri">Hoshin Kanri</option>
                          <option value="RPD">RPD (Reportes)</option>
                          <option value="Tubería">Tubería de Info</option>
                        </select>
                      </td>
                      {canEdit && !isApproved && (
                        <td className="p-2 text-center">
                          <button onClick={() => {
                            const copy = indicadores.filter((_, i) => i !== idx); setIndicadores(copy); updateStore({ indicadoresList: copy });
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {indicadores.length === 0 && (
                    <tr><td colSpan={canEdit && !isApproved ? 7 : 6} className="p-8 text-center text-slate-400 italic">No hay indicadores registrados en esta etapa.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
                Matriz de Auditoría y Control Operativo
              </h3>
              {canEdit && !isApproved && (
                <button onClick={() => {
                  const newList = [...auditorias, { id: Math.random().toString(), criterio: '', frecuencia: 'Mensual', evidencia: '', auditor: '' }];
                  setAuditorias(newList);
                  updateStore({ auditoriaList: newList });
                }} className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[13px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span> Agregar Control
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Criterio de Revisión / Control</th>
                    <th className="p-3 w-36">Frecuencia</th>
                    <th className="p-3">Evidencia Requerida</th>
                    <th className="p-3">Auditor Responsable</th>
                    {canEdit && !isApproved && <th className="p-3 w-12 text-center">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditorias.map((a, idx) => (
                    <tr key={a.id || idx}>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={a.criterio} onChange={e => {
                        const copy = [...auditorias]; copy[idx].criterio = e.target.value; setAuditorias(copy);
                      }} onBlur={() => updateStore({ auditoriaList: auditorias })} disabled={isApproved || !canEdit} placeholder="Ej. Llenado del checklist de lavado" /></td>
                      <td className="p-2">
                        <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={a.frecuencia} onChange={e => {
                          const copy = [...auditorias]; copy[idx].frecuencia = e.target.value; setAuditorias(copy); updateStore({ auditoriaList: copy });
                        }} disabled={isApproved || !canEdit}>
                          <option value="Semanal">Semanal</option>
                          <option value="Quincenal">Quincenal</option>
                          <option value="Mensual">Mensual</option>
                          <option value="Trimestral">Trimestral</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={a.evidencia} onChange={e => {
                        const copy = [...auditorias]; copy[idx].evidencia = e.target.value; setAuditorias(copy);
                      }} onBlur={() => updateStore({ auditoriaList: auditorias })} disabled={isApproved || !canEdit} placeholder="Ej. Formatos físicos / digitalizados" /></td>
                      <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={a.auditor} onChange={e => {
                        const copy = [...auditorias]; copy[idx].auditor = e.target.value; setAuditorias(copy);
                      }} onBlur={() => updateStore({ auditoriaList: auditorias })} disabled={isApproved || !canEdit} placeholder="Ej. Auditor ISO / Calidad" /></td>
                      {canEdit && !isApproved && (
                        <td className="p-2 text-center">
                          <button onClick={() => {
                            const copy = auditorias.filter((_, i) => i !== idx); setAuditorias(copy); updateStore({ auditoriaList: copy });
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {auditorias.length === 0 && (
                    <tr><td colSpan={canEdit && !isApproved ? 5 : 4} className="p-8 text-center text-slate-400 italic">No hay criterios de auditoría registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                Checklist de Cierre y Criterios de Liberación Documental
              </h3>
              <div className="space-y-3">
                {Object.keys(checklistCierre).map((key) => (
                  <label key={key} className={cn("flex items-center gap-3 p-3 border border-slate-150 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-[13px] font-semibold text-slate-700", checklistCierre[key] && "bg-emerald-50/30 border-emerald-100 text-emerald-800")}>
                    <input type="checkbox" className="w-4.5 h-4.5 text-primary focus:ring-primary rounded" checked={checklistCierre[key]} onChange={e => {
                      if (isApproved || !canEdit) return;
                      const updated = { ...checklistCierre, [key]: e.target.checked };
                      setChecklistCierre(updated);
                      updateStore({ checklistCierre: updated });
                    }} disabled={isApproved || !canEdit} />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                  Plan de Capacitación y Difusión a la Operación
                </h3>
                {canEdit && !isApproved && (
                  <button onClick={() => {
                    const newList = [...capacitaciones, { id: Math.random().toString(), fecha: '', tema: '', asistencia: '', estatus: 'Pendiente' }];
                    setCapacitaciones(newList);
                    updateStore({ capacitaciones: newList });
                  }} className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[13px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span> Agregar Capacitación
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <th className="p-3 w-1/4">Fecha Programada</th>
                      <th className="p-3">Tema / Herramienta</th>
                      <th className="p-3 w-32">Asistencia %</th>
                      <th className="p-3 w-36">Estatus</th>
                      {canEdit && !isApproved && <th className="p-3 w-12 text-center">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {capacitaciones.map((cap, idx) => (
                      <tr key={cap.id || idx}>
                        <td className="p-2"><input type="date" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={cap.fecha} onChange={e => {
                          const copy = [...capacitaciones]; copy[idx].fecha = e.target.value; setCapacitaciones(copy);
                        }} onBlur={() => updateStore({ capacitaciones: capacitaciones })} disabled={isApproved || !canEdit} /></td>
                        <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={cap.tema} onChange={e => {
                          const copy = [...capacitaciones]; copy[idx].tema = e.target.value; setCapacitaciones(copy);
                        }} onBlur={() => updateStore({ capacitaciones: capacitaciones })} disabled={isApproved || !canEdit} placeholder="Ej. Capacitación en el IDO de Lavado" /></td>
                        <td className="p-2"><input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={cap.asistencia} onChange={e => {
                          const copy = [...capacitaciones]; copy[idx].asistencia = e.target.value; setCapacitaciones(copy);
                        }} onBlur={() => updateStore({ capacitaciones: capacitaciones })} disabled={isApproved || !canEdit} placeholder="Ej. 100%" /></td>
                        <td className="p-2">
                          <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50 disabled:opacity-60" value={cap.estatus} onChange={e => {
                            const copy = [...capacitaciones]; copy[idx].estatus = e.target.value; setCapacitaciones(copy); updateStore({ capacitaciones: copy });
                          }} disabled={isApproved || !canEdit}>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Completado">Completado</option>
                          </select>
                        </td>
                        {canEdit && !isApproved && (
                          <td className="p-2 text-center">
                            <button onClick={() => {
                              const copy = capacitaciones.filter((_, i) => i !== idx); setCapacitaciones(copy); updateStore({ capacitaciones: copy });
                            }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {capacitaciones.length === 0 && (
                      <tr className="border-t border-slate-100"><td colSpan={canEdit && !isApproved ? 5 : 4} className="p-8 text-center text-slate-400 italic">No hay sesiones de capacitación registradas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PhaseLayout 
      modo={modo} 
      phaseNumber={phaseNumber} 
      title={title} 
      dmaic="Taller" 
      description={info.proposito} 
      onGenerate={handleGenerate} 
      isGenerating={isGenerating} 
      error={null} 
      checklistManual={info.queSeHace} 
      erroresEvitar={["Avanzar sin documentar acuerdos", "No involucrar a los usuarios clave"]}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <label className="block text-[13px] font-bold text-slate-700 mb-3">Notas de la Sesión</label>
        <textarea 
          className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:cursor-not-allowed" 
          rows={4} 
          value={notas}
          onChange={e => setNotas(e.target.value)}
          onBlur={() => updateStore({ notas })}
          disabled={isApproved || !canEdit}
          placeholder="Documenta aquí los acuerdos, hallazgos y definiciones de esta sesión del taller..." 
        />
      </div>

      {renderPhaseTool()}

      {phaseData.entregablesGenerados && (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[18px] font-bold text-slate-900">Entregables Generados</h3>
            <p className="text-[13px] text-slate-500 mt-1">{phaseData.resumenEjecutivo}</p>
          </div>
          <div className="p-6 space-y-6">
            {phaseData.entregablesGenerados.map((ent: any, idx: number) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-5">
                <h4 className="text-[15px] font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  {ent.nombre}
                </h4>
                <div className="text-[14px] text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono text-[13px]">
                  {ent.contenido}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PhaseLayout>
  );
};

// --- Generic Phase for Reingeniería ---
export const GenericPhase: React.FC<{ modo: Modo, phaseNumber: number, title: string }> = ({ modo, phaseNumber, title }) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[phaseNumber]?.data || {};

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = { notas: 'Contenido generado para ' + title };
      updateModoPhase(modo.id, phaseNumber, { data, checklistOut: { 'Completado': false }, status: 'En proceso' });
    } catch (err: any) {} finally { setIsGenerating(false); }
  };

  return (
    <PhaseLayout modo={modo} phaseNumber={phaseNumber} title={title} dmaic="General" description={`Fase de ${title} para el proyecto ${modo.projectType}.`} onGenerate={handleGenerate} isGenerating={isGenerating} error={null} checklistManual={["Completar actividades de la fase", "Validar con el equipo"]} erroresEvitar={["Avanzar sin documentar"]}>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Notas de la Fase</label>
        <textarea className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:cursor-not-allowed" rows={6} disabled={!canEdit} defaultValue={phaseData.notas || ''} placeholder="Documenta aquí los avances de esta phase..." />
      </div>
    </PhaseLayout>
  );
};

import { ActaLeanModal } from './ActaLeanModal';

// --- Phase 1 ---
export const Phase1: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, updateModoTeam, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showActa, setShowActa] = useState(false);

  const phaseData = modo.phases[1]?.data || {};
  const isApproved = modo.phases[1]?.status === 'Aprobado' || modo.phases[1]?.status === 'Completo';

  const [inputs, setInputs] = useState({ 
    dolorOperativo: phaseData.problema || '', 
    objetivoGeneral: phaseData.objetivoGeneral || '', 
    contextoAdicional: phaseData.contextoAdicional || '',
    alcance: phaseData.alcance || '', 
    fueraDeAlcance: phaseData.fueraDeAlcance || '',
    kpisPreliminares: phaseData.kpisPreliminares || '',
    frecuenciaSeguimiento: phaseData.frecuenciaSeguimiento || 'Semanal',
    canales: phaseData.canales || 'Presencial / Teams',
    obstaculosOperativos: phaseData.obstaculosOperativos || '',
    beneficiosEsperados: phaseData.beneficiosEsperados || '',
    // Team
    patrocinador: modo.team?.['Patrocinador'] || '',
    duenoProceso: modo.team?.['Dueño del proceso'] || '',
    lider: modo.team?.['Líder'] || '',
    usuariosClave: modo.team?.['Usuarios clave'] || ''
  });
  
  const handleGenerateManual = () => {
    const data = {
      ...phaseData,
      nombreProyecto: inputs.objetivoGeneral || modo.name, // Uso de objetivoGeneral como nombre si está lleno
      problema: inputs.dolorOperativo,
      objetivoGeneral: inputs.objetivoGeneral,
      contextoAdicional: inputs.contextoAdicional,
      alcance: inputs.alcance,
      fueraDeAlcance: inputs.fueraDeAlcance,
      kpisPreliminares: inputs.kpisPreliminares,
      frecuenciaSeguimiento: inputs.frecuenciaSeguimiento,
      canales: inputs.canales,
      obstaculosOperativos: inputs.obstaculosOperativos,
      beneficiosEsperados: inputs.beneficiosEsperados,
      equipo: {
        patrocinador: inputs.patrocinador,
        duenoProceso: inputs.duenoProceso,
        lider: inputs.lider,
        usuariosClave: inputs.usuariosClave
      },
      checklistOut: (CHECKLISTS[modo.projectType] || [])
        .filter(c => c.phase === 1)
        .map(c => c.text)
    };
    const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: true }), {});
    
    updateModoTeam(modo.id, {
      'Patrocinador': inputs.patrocinador,
      'Dueño del proceso': inputs.duenoProceso,
      'Líder': inputs.lider,
      'Usuarios clave': inputs.usuariosClave
    });

    updateModoPhase(modo.id, 1, { data, checklistOut: checklistObj, status: 'Completo' });
  };



  const checklistManual = modo.projectType === 'Taller de Herramientas'
    ? [
        "Definir el proceso o subproceso a trabajar en el taller",
        "Identificar al dueño del proceso, usuarios clave y aprobadores",
        "Seleccionar los entregables requeridos de la matriz del taller",
        "Preparar agenda del taller, insumos, plantillas y criterios de salida"
      ]
    : [
        "Identificar el dolor operativo y describirlo con datos o ejemplos concretos",
        "Definir el objetivo medible (indicador, meta y plazo)",
        "Acordar alcance y fuera de alcance con el patrocinador y el dueño del proceso",
        "Nombrar al equipo: patrocinador, dueño del proceso, líder, usuarios clave y analista",
        "Registrar KPIs preliminares si se conocen",
        "Definir las reglas de trabajo: cadencia de seguimiento, responsables y canales"
      ];

  const erroresEvitar = modo.projectType === 'Taller de Herramientas'
    ? [
        "Convocar al taller sin insumos previos o sin responsables de decisión.",
        "Definir un alcance de proceso demasiado amplio para el tiempo del taller.",
        "Avanzar sin definir la matriz de entregables mínima."
      ]
    : [
        "Arrancar sin patrocinador o sin dueño de proceso.",
        "Definir objetivos vagos como 'mejorar la operación' sin métrica.",
        "Incluir demasiados procesos en el alcance inicial."
      ];

  const title = modo.projectType === 'Reingeniería' 
    ? 'Activación de la reingeniería' 
    : modo.projectType === 'Taller de Herramientas'
      ? 'Preparación del taller'
      : 'Inicio Ágil';
  const description = modo.projectType === 'Reingeniería'
    ? 'Objetivo: Definir claramente el alcance del proyecto, el problema a resolver, los roles clave y la urgencia estratégica de la reingeniería.'
    : modo.projectType === 'Taller de Herramientas'
      ? 'Objetivo: Definir el alcance, participantes y entregables sugeridos para el taller de herramientas operativas.'
      : 'Objetivo: Definir claramente el alcance del proyecto, el problema a resolver y los roles clave para asegurar el alineamiento estratégico.';
  const headerLabel = modo.projectType === 'Reingeniería' 
    ? 'CAPTURA Y GENERACIÓN · ACTA DE REINGENIERÍA' 
    : modo.projectType === 'Taller de Herramientas'
      ? 'CAPTURA Y GENERACIÓN · ACTA DEL TALLER'
      : 'CAPTURA Y GENERACIÓN · ACTA LEAN';

  return (
    <PhaseLayout modo={modo} phaseNumber={1} title={title} dmaic="Define" description={description} onGenerate={() => {}} isGenerating={isGenerating} error={error} checklistManual={checklistManual} erroresEvitar={erroresEvitar}>
      
      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm flex flex-col gap-6 relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider">{headerLabel}</h4>
          {isApproved && <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Acta confirmada</span>}
        </div>

        {isApproved ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-1">{phaseData.nombreProyecto || 'Proyecto sin nombre'}</h3>
              <p className="text-[14px] text-slate-700">{phaseData.problema}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/60 pt-4 text-[13px]">
              <div>
                <span className="font-bold text-slate-500 block uppercase tracking-wider text-[11px] mb-1">Objetivo General</span>
                <p className="text-slate-800">{phaseData.objetivoGeneral || '-'}</p>
              </div>
              {phaseData.contextoAdicional && (
                <div>
                  <span className="font-bold text-slate-500 block uppercase tracking-wider text-[11px] mb-1">Contexto Adicional</span>
                  <p className="text-slate-800">{phaseData.contextoAdicional}</p>
                </div>
              )}
              {phaseData.obstaculosOperativos && (
                <div>
                  <span className="font-bold text-slate-500 block uppercase tracking-wider text-[11px] mb-1">Obstáculos Operativos</span>
                  <p className="text-slate-800">{phaseData.obstaculosOperativos}</p>
                </div>
              )}
              {phaseData.beneficiosEsperados && (
                <div>
                  <span className="font-bold text-slate-500 block uppercase tracking-wider text-[11px] mb-1">Beneficios Esperados</span>
                  <p className="text-slate-800">{phaseData.beneficiosEsperados}</p>
                </div>
              )}
            </div>

            <button onClick={() => setShowActa(true)} className="bg-white border border-slate-200 text-slate-700 font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm w-fit mt-2">
              <span className="material-symbols-outlined text-[18px]">description</span> Ver Acta imprimible
            </button>
          </div>
        ) : (
          <fieldset disabled={!canEdit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold text-slate-600">Dolor operativo</label>
                <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" rows={3} value={inputs.dolorOperativo} onChange={e => setInputs({...inputs, dolorOperativo: e.target.value})} placeholder="Reducir el tiempo de surtido..."></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-600">Objetivo general</label>
                <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" rows={3} value={inputs.objetivoGeneral} onChange={e => setInputs({...inputs, objetivoGeneral: e.target.value})}></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-600">Contexto adicional</label>
                <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" rows={3} value={inputs.contextoAdicional} onChange={e => setInputs({...inputs, contextoAdicional: e.target.value})}></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-600">Alcance</label>
                <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" rows={3} value={inputs.alcance} onChange={e => setInputs({...inputs, alcance: e.target.value})}></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-600">Fuera de alcance</label>
                <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" rows={3} value={inputs.fueraDeAlcance} onChange={e => setInputs({...inputs, fueraDeAlcance: e.target.value})}></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-600">KPIs preliminares (si se conocen)</label>
                <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" rows={3} value={inputs.kpisPreliminares} onChange={e => setInputs({...inputs, kpisPreliminares: e.target.value})} placeholder="Ej. Tiempo de entrega (días)..."></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100">
                <h5 className="text-[14px] font-bold text-slate-800 mb-4">Detalles del Acta</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-600">Obstáculos Operativos</label>
                    <textarea 
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                      rows={3} 
                      value={inputs.obstaculosOperativos} 
                      onChange={e => setInputs({...inputs, obstaculosOperativos: e.target.value})} 
                      placeholder="Ej. Resistencia al cambio, falta de capacitación del personal, sistemas informáticos lentos o desconectados..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-600">Beneficios Esperados</label>
                    <textarea 
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                      rows={3} 
                      value={inputs.beneficiosEsperados} 
                      onChange={e => setInputs({...inputs, beneficiosEsperados: e.target.value})} 
                      placeholder="Ej. Reducción de 20% en tiempos de ciclo, eliminación de retrabajos, mayor trazabilidad..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600">Frecuencia de seguimiento</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={inputs.frecuenciaSeguimiento} onChange={e => setInputs({...inputs, frecuenciaSeguimiento: e.target.value})}>
                    <option>Semanal</option>
                    <option>Quincenal</option>
                    <option>Mensual</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600">Canales</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={inputs.canales} onChange={e => setInputs({...inputs, canales: e.target.value})} placeholder="Presencial / Teams" />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100 grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600">Patrocinador</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={inputs.patrocinador} onChange={e => setInputs({...inputs, patrocinador: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600">Dueño del Proceso</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={inputs.duenoProceso} onChange={e => setInputs({...inputs, duenoProceso: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600">Líder</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={inputs.lider} onChange={e => setInputs({...inputs, lider: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600">Usuarios Clave</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={inputs.usuariosClave} onChange={e => setInputs({...inputs, usuariosClave: e.target.value})} />
                </div>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex justify-end pt-6 border-t border-slate-100 mt-4">
                <button onClick={handleGenerateManual} className="bg-primary hover:bg-primary/90 text-white font-bold text-[14px] px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">save</span> {
                    modo.projectType === 'Reingeniería' 
                      ? 'Confirmar Acta de Reingeniería' 
                      : modo.projectType === 'Taller de Herramientas'
                        ? 'Confirmar Acta del Taller'
                        : 'Confirmar Acta Lean'
                  }
                </button>
              </div>
            )}
          </fieldset>
        )}
      </div>

      {showActa && <ActaLeanModal modo={modo} onClose={() => setShowActa(false)} />}
    </PhaseLayout>
  );
};

import { modoTasksTemplate } from '../modoTasksTemplate';
import { ModoTask, TaskStatus } from '../types';

// --- Phase 2 ---
export const Phase2: React.FC<{ modo: Modo }> = ({ modo }) => {
  if (modo.projectType === 'Reingeniería') {
    return <Phase2Reengineering modo={modo} />;
  }
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const phaseData = modo.phases[2]?.data || {};
  const tasks: ModoTask[] = phaseData.tasks || [];

  const handleGeneratePlan = () => {
    const newTasks = modoTasksTemplate.map(t => ({
      ...t,
      id: Math.random().toString(36).substring(2, 11),
      estado: 'Por hacer' as TaskStatus,
      responsableAsignado: t.responsableDefault,
    }));
    
    // Checklist for this phase
    const checklistOut = {
      'Backlog inicial creado': false,
      'Actividades priorizadas y en secuencia': false,
      'Responsables y fechas asignadas': false,
      'Tablero Kanban configurado': false
    };

    updateModoPhase(modo.id, 2, { data: { ...phaseData, tasks: newTasks }, checklistOut, status: 'En proceso' });
  };

  const updateTask = (taskId: string, field: keyof ModoTask, value: any) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t);
    updateModoPhase(modo.id, 2, { data: { ...phaseData, tasks: newTasks }, status: 'En proceso' });
  };

  const checklistManual = [
    "Crear el backlog del MODO.", 
    "Asignar responsables a cada actividad.", 
    "Definir el periodo o fechas compromiso."
  ];
  
  const erroresEvitar = [
    "Hacer un cronograma excesivamente detallado sin espacio para ajustes.", 
    "Asignar actividades sin confirmar disponibilidad del responsable."
  ];

  // Group tasks by phase
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.fase]) acc[task.fase] = [];
    acc[task.fase].push(task);
    return acc;
  }, {} as Record<string, ModoTask[]>);

  const statusColors = {
    'Por hacer': 'bg-slate-100 text-slate-600 border-slate-200',
    'En curso': 'bg-blue-50 text-blue-700 border-blue-200',
    'Listo': 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <PhaseLayout modo={modo} phaseNumber={2} title="Planeación Ágil" dmaic="Measure" description="Construcción del plan de trabajo, priorización del backlog y hoja de ruta." onGenerate={() => {}} isGenerating={false} error={null} checklistManual={checklistManual} erroresEvitar={erroresEvitar}>
      
      {!tasks.length ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[32px] text-primary">format_list_bulleted</span>
          </div>
          <h3 className="text-[18px] font-bold text-slate-900">Plan de Trabajo Vacío</h3>
          <p className="text-[14px] text-slate-500 max-w-md">Inicia con el catálogo estándar de actividades del MODO. Podrás asignar responsables y fechas una vez generado.</p>
          {canEdit ? (
            <button onClick={handleGeneratePlan} className="mt-4 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">bolt</span> Generar Plan Estándar
            </button>
          ) : (
            <p className="text-[13px] text-slate-500 italic mt-2">Solo los administradores pueden inicializar el plan de trabajo.</p>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h4 className="text-[15px] font-bold text-slate-900">Backlog y Plan de Trabajo</h4>
              <p className="text-[13px] text-slate-500 mt-1">Asigna responsables, define fechas y actualiza el estado de las tareas.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Por hacer</div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-300"></span> En curso</div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Listo</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6 w-[5%]">ID</th>
                  <th className="py-3 px-6 w-[35%]">Actividad y Entregable</th>
                  <th className="py-3 px-6 w-[25%]">Responsable</th>
                  <th className="py-3 px-6 w-[15%]">Fecha Límite</th>
                  <th className="py-3 px-6 w-[20%]">Estado</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-700">
                {Object.entries(groupedTasks).map(([faseName, faseTasks]) => (
                  <React.Fragment key={faseName}>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <td colSpan={5} className="py-3 px-6 font-bold text-[12px] text-slate-800 tracking-wide">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">view_timeline</span>
                          {faseName}
                        </div>
                      </td>
                    </tr>
                    {faseTasks.map((task) => (
                      <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">{task.codigo}</td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 mb-1">{task.actividad}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{task.descripcion}</div>
                          <div className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1 opacity-80"><span className="material-symbols-outlined text-[14px]">inventory_2</span> {task.entregable}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative">
                            <input 
                              type="text" 
                              value={task.responsableAsignado || ''} 
                              onChange={(e) => updateTask(task.id, 'responsableAsignado', e.target.value)}
                              placeholder="Asignar..."
                              disabled={!canEdit}
                              className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 px-2.5 text-[13px] font-medium transition-all outline-none disabled:cursor-not-allowed"
                            />
                            {!task.responsableAsignado && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none group-hover:opacity-0 transition-opacity">Sugerido: {task.responsableDefault}</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <input 
                            type="date" 
                            value={task.fechaFin || ''} 
                            onChange={(e) => updateTask(task.id, 'fechaFin', e.target.value)}
                            disabled={!canEdit}
                            className="bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 px-2 text-[12px] font-mono text-slate-600 transition-all outline-none disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <select 
                            value={task.estado} 
                            onChange={(e) => updateTask(task.id, 'estado', e.target.value as TaskStatus)}
                            disabled={!canEdit}
                            className={`w-full appearance-none border rounded-lg py-1.5 px-3 text-[12px] font-bold outline-none cursor-pointer transition-colors disabled:cursor-not-allowed ${statusColors[task.estado]}`}
                          >
                            <option value="Por hacer">Por hacer</option>
                            <option value="En curso">En curso</option>
                            <option value="Listo">Listo</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PhaseLayout>
  );
};

// --- SUB-COMPONENTS FOR REINGENIERÍA AND OBJECTIVES ---

const ObjetivosMediblesSection: React.FC<{
  modoId: string;
  phaseNum: number;
  objetivos: any[];
  canEdit: boolean;
  isApproved: boolean;
}> = ({ modoId, phaseNum, objetivos, canEdit, isApproved }) => {
  const { updateModoPhase } = useAppStore();
  const [indicador, setIndicador] = useState('');
  const [meta, setMeta] = useState('');
  const [plazo, setPlazo] = useState('');

  const handleAdd = () => {
    if (!indicador.trim() || !meta.trim() || !plazo.trim()) return;
    const newItems = [
      ...objetivos,
      { id: `obj_${Date.now()}`, indicador: indicador.trim(), meta: meta.trim(), plazo: plazo.trim() }
    ];
    updateModoPhase(modoId, phaseNum, {
      data: {
        ...(useAppStore.getState().modos[modoId]?.phases[phaseNum]?.data || {}),
        objetivosMedibles: newItems
      }
    });
    setIndicador('');
    setMeta('');
    setPlazo('');
  };

  const handleRemove = (id: string) => {
    const newItems = objetivos.filter(item => item.id !== id);
    updateModoPhase(modoId, phaseNum, {
      data: {
        ...(useAppStore.getState().modos[modoId]?.phases[phaseNum]?.data || {}),
        objetivosMedibles: newItems
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">target</span>
          Objetivos Medibles del Proyecto
        </h4>
        <p className="text-[12px] text-slate-500 mt-1">Define los indicadores de éxito, metas específicas y plazos de cumplimiento del proyecto.</p>
      </div>

      {canEdit && !isApproved && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-2">
          <input 
            type="text" 
            placeholder="Indicador Principal (ej. Tiempo de surtido)" 
            value={indicador} 
            onChange={e => setIndicador(e.target.value)}
            className="col-span-12 md:col-span-4 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <input 
            type="text" 
            placeholder="Meta (ej. Reducir a 15 min)" 
            value={meta} 
            onChange={e => setMeta(e.target.value)}
            className="col-span-12 md:col-span-4 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <input 
            type="text" 
            placeholder="Plazo (ej. 120 días)" 
            value={plazo} 
            onChange={e => setPlazo(e.target.value)}
            className="col-span-12 md:col-span-3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <button 
            onClick={handleAdd}
            disabled={!indicador.trim() || !meta.trim() || !plazo.trim()}
            className="col-span-12 md:col-span-1 bg-primary text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-primary/95 transition-colors disabled:opacity-50"
          >
            Añadir
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-100 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-2.5">Indicador</th>
              <th className="px-4 py-2.5">Meta</th>
              <th className="px-4 py-2.5 w-1/4">Plazo</th>
              {canEdit && !isApproved && <th className="px-4 py-2.5 w-[50px]"></th>}
            </tr>
          </thead>
          <tbody className="text-[13px] text-slate-700">
            {objetivos.map(obj => (
              <tr key={obj.id} className="border-b border-slate-100 hover:bg-slate-50/30">
                <td className="px-4 py-2.5 font-medium text-slate-800">{obj.indicador}</td>
                <td className="px-4 py-2.5">{obj.meta}</td>
                <td className="px-4 py-2.5 text-slate-500">{obj.plazo}</td>
                {canEdit && !isApproved && (
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => handleRemove(obj.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {objetivos.length === 0 && (
              <tr>
                <td colSpan={canEdit && !isApproved ? 4 : 3} className="px-4 py-6 text-center text-slate-400 italic">
                  No se han registrado objetivos medibles en esta etapa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Phase2Reengineering: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, macroprocesos, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[2]?.data || {};
  const isApproved = modo.phases[2]?.status === 'Aprobado';
  const [notas, setNotas] = useState(phaseData.notas || '');
  const [diagramMode, setDiagramMode] = useState<'image' | 'mermaid'>(
    phaseData.asIsImage ? 'image' : (phaseData.mermaidASIS ? 'mermaid' : 'image')
  );

  const toArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' && val ? val.split(',').map(s=>s.trim()) : []);

  const [mappingInputs, setMappingInputs] = useState({
    macroproceso: phaseData.asIsMapping?.macroproceso || '',
    procedimientos: toArray(phaseData.asIsMapping?.procedimientos),
    indicadores: toArray(phaseData.asIsMapping?.indicadores),
    herramientas: toArray(phaseData.asIsMapping?.herramientas),
    sistemas: toArray(phaseData.asIsMapping?.sistemas),
    puestos: toArray(phaseData.asIsMapping?.puestos),
    externalLink: phaseData.asIsLink || ''
  });

  const [lineaBaseMetrics, setLineaBaseMetrics] = useState({
    tiempos: phaseData.lineaBaseMetrics?.tiempos || '',
    errores: phaseData.lineaBaseMetrics?.errores || '',
    productividad: phaseData.lineaBaseMetrics?.productividad || '',
    adicional: phaseData.lineaBaseMetrics?.adicional || ''
  });

  useEffect(() => {
    setNotas(phaseData.notas || '');
  }, [phaseData.notas]);

  useEffect(() => {
    setMappingInputs({
      macroproceso: phaseData.asIsMapping?.macroproceso || '',
      procedimientos: toArray(phaseData.asIsMapping?.procedimientos),
      indicadores: toArray(phaseData.asIsMapping?.indicadores),
      herramientas: toArray(phaseData.asIsMapping?.herramientas),
      sistemas: toArray(phaseData.asIsMapping?.sistemas),
      puestos: toArray(phaseData.asIsMapping?.puestos),
      externalLink: phaseData.asIsLink || ''
    });
  }, [phaseData.asIsMapping, phaseData.asIsLink]);

  useEffect(() => {
    setLineaBaseMetrics({
      tiempos: phaseData.lineaBaseMetrics?.tiempos || '',
      errores: phaseData.lineaBaseMetrics?.errores || '',
      productividad: phaseData.lineaBaseMetrics?.productividad || '',
      adicional: phaseData.lineaBaseMetrics?.adicional || ''
    });
  }, [phaseData.lineaBaseMetrics]);

  const handleNotesBlur = () => {
    if (isApproved || !canEdit) return;
    updateModoPhase(modo.id, 2, {
      data: {
        ...phaseData,
        notas: notas
      }
    });
  };

  const handleBlur = () => {
    if (isApproved || !canEdit) return;
    const currentPhaseData = modo.phases[2]?.data || {};
    updateModoPhase(modo.id, 2, { 
      data: { 
        ...currentPhaseData, 
        asIsMapping: {
          macroproceso: mappingInputs.macroproceso,
          procedimientos: mappingInputs.procedimientos,
          indicadores: mappingInputs.indicadores,
          herramientas: mappingInputs.herramientas,
          sistemas: mappingInputs.sistemas,
          puestos: mappingInputs.puestos
        },
        asIsLink: mappingInputs.externalLink,
        lineaBaseMetrics
      } 
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApproved || !canEdit) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateModoPhase(modo.id, 2, { data: { ...phaseData, asIsImage: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!canEdit) return;
    setIsGenerating(true);
    try {
      const data = await generatePhaseData(3, { notas }, {});
      const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
      updateModoPhase(modo.id, 2, { 
        data: {
          ...phaseData,
          ...data,
          notas
        }, 
        checklistOut: checklistObj, 
        status: 'En proceso' 
      });
    } catch (err: any) {} finally { setIsGenerating(false); }
  };

  const checklistManual = ["Mapear el proceso actual AS-IS con VSM/SIPOC.", "Identificar entradas, salidas, responsables y sistemas.", "Medir la línea base (tiempos, errores, productividad)."];
  const erroresEvitar = ["Mapear con excesivo detalle irrelevante.", "Suponer cómo funciona el proceso en lugar de observar la realidad."];

  return (
    <PhaseLayout modo={modo} phaseNumber={2} title="Diagnóstico AS-IS" dmaic="Measure" description="Entender cómo opera hoy el proceso y levantar evidencias a través de un SIPOC/VSM y línea base." onGenerate={handleGenerate} isGenerating={isGenerating} error={null} checklistManual={checklistManual} erroresEvitar={erroresEvitar}>
      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm">
        <label className="block text-[13px] font-bold text-slate-700 mb-3">Notas de entrevistas y observación</label>
        <textarea 
          className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60" 
          rows={4} 
          value={notas} 
          onChange={e => setNotas(e.target.value)} 
          onBlur={handleNotesBlur}
          disabled={isApproved || !canEdit}
          placeholder="Pega aquí las notas..." 
        />
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-slate-900">Diagrama AS-IS (SIPOC con VSM)</h3>
            <p className="text-[13px] text-slate-500 mt-1">Elige entre escribir código Mermaid o subir una imagen de tu diagrama.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setDiagramMode('image')}
              className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramMode === 'image' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Imagen / Enlace
            </button>
            <button 
              onClick={() => setDiagramMode('mermaid')}
              className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramMode === 'mermaid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Código Mermaid
            </button>
          </div>
        </div>

        {diagramMode === 'image' ? (
          <>
            <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 max-w-2xl flex-1">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">link</span>
                <input 
                  type="text" 
                  placeholder="Enlace externo a Lucidchart o draw.io (opcional)" 
                  className="flex-1 p-2 border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60"
                  value={mappingInputs.externalLink}
                  onChange={e => setMappingInputs(prev => ({ ...prev, externalLink: e.target.value }))}
                  onBlur={handleBlur}
                  disabled={isApproved || !canEdit}
                />
                {mappingInputs.externalLink && (
                  <a href={mappingInputs.externalLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-[13px] hover:underline whitespace-nowrap">
                    Abrir enlace
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3 justify-end">
                <label className={cn(
                  "cursor-pointer bg-white border border-slate-200 text-slate-700 font-bold text-[13px] px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-2 shadow-sm",
                  (isApproved || !canEdit) && "opacity-50 cursor-not-allowed pointer-events-none"
                )}>
                  <span className="material-symbols-outlined text-[18px]">upload</span> Subir Imagen
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isApproved || !canEdit} />
                </label>
                {phaseData.asIsImage && !isApproved && canEdit && (
                  <button onClick={() => updateModoPhase(modo.id, 2, { data: { ...phaseData, asIsImage: null } })} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center" title="Eliminar imagen">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>

            {phaseData.asIsImage ? (
              <div className="p-8 bg-slate-50 flex justify-center items-center">
                <img src={phaseData.asIsImage as string} alt="Diagrama AS-IS" className="max-w-full rounded-lg shadow-sm border border-slate-200" />
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 border-dashed bg-slate-50/50">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">image</span>
                <p className="text-[14px] font-medium">Aún no hay una imagen de diagrama cargada</p>
                <p className="text-[12px] mt-1 text-center max-w-md">Sube una imagen de tu SIPOC/VSM usando el botón de arriba o pega el enlace externo.</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-white flex flex-col gap-5">
            {phaseData.mermaidASIS ? (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center min-h-[220px] overflow-auto">
                <MermaidChart chart={phaseData.mermaidASIS} />
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 border border-slate-200 border-dashed bg-slate-50/50 rounded-xl">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">code</span>
                <p className="text-[14px] font-medium">No hay código Mermaid ingresado</p>
                <button 
                  onClick={() => {
                    updateModoPhase(modo.id, 2, { 
                      data: { 
                        ...phaseData, 
                        mermaidASIS: 'graph TD\n    A[Inicio] --> B[Paso 1]\n    B --> C[Fin]' 
                      } 
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={isApproved || !canEdit}
                >
                  Generar plantilla de inicio
                </button>
              </div>
            )}

            {phaseData.mermaidASIS && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Código Mermaid (Editable)</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
                  rows={8}
                  value={phaseData.mermaidASIS}
                  onChange={(e) => {
                    updateModoPhase(modo.id, 2, { 
                      data: { 
                        ...phaseData, 
                        mermaidASIS: e.target.value 
                      } 
                    });
                  }}
                  disabled={isApproved || !canEdit}
                  placeholder="Escribe tu código Mermaid aquí..."
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Línea Base Metrics Card */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm mt-6 p-8">
        <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
          Métricas de Línea Base
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600">Tiempos de Ciclo / Espera</label>
            <input 
              type="text" 
              placeholder="Ej. Tiempo de ciclo actual: 45 min; tiempo de espera: 15 min"
              value={lineaBaseMetrics.tiempos}
              onChange={e => {
                const updated = { ...lineaBaseMetrics, tiempos: e.target.value };
                setLineaBaseMetrics(updated);
              }}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600">Porcentaje de Errores / Retrabajos</label>
            <input 
              type="text" 
              placeholder="Ej. Tasa de error actual: 8% en facturación"
              value={lineaBaseMetrics.errores}
              onChange={e => {
                const updated = { ...lineaBaseMetrics, errores: e.target.value };
                setLineaBaseMetrics(updated);
              }}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600">Productividad / Cumplimiento</label>
            <input 
              type="text" 
              placeholder="Ej. Cumplimiento de entregas a tiempo: 82%"
              value={lineaBaseMetrics.productividad}
              onChange={e => {
                const updated = { ...lineaBaseMetrics, productividad: e.target.value };
                setLineaBaseMetrics(updated);
              }}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600">Métricas Adicionales</label>
            <input 
              type="text" 
              placeholder="Ej. 12 llamadas sin contestar al día en promedio"
              value={lineaBaseMetrics.adicional}
              onChange={e => {
                const updated = { ...lineaBaseMetrics, adicional: e.target.value };
                setLineaBaseMetrics(updated);
              }}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <ObjetivosMediblesSection 
        modoId={modo.id} 
        phaseNum={2} 
        objetivos={phaseData.objetivosMedibles || []} 
        canEdit={canEdit} 
        isApproved={isApproved} 
      />

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm mt-6 p-8">
        <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">schema</span>
          Mapeo y Vinculación del Proceso (AS-IS)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
            <label className="text-[13px] font-bold text-slate-600">Macroproceso Asociado</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              value={mappingInputs.macroproceso}
              onChange={e => setMappingInputs(prev => ({ ...prev, macroproceso: e.target.value }))}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
            >
              <option value="">-- Seleccionar Macroproceso --</option>
              {macroprocesos?.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
              <option value="Otro">Otro (No registrado)</option>
            </select>
          </div>
          
          <MultiTagInput 
            label="Procedimientos Involucrados"
            placeholder="Ej. Recepción de piezas, Diagnóstico... (Presiona Enter)"
            tags={mappingInputs.procedimientos}
            onChange={tags => setMappingInputs(prev => ({ ...prev, procedimientos: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Puestos / Roles Necesarios"
            placeholder="Ej. Técnico, Asesor, Almacenista... (Presiona Enter)"
            tags={mappingInputs.puestos}
            onChange={tags => setMappingInputs(prev => ({ ...prev, puestos: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Indicadores (KPIs)"
            placeholder="Ej. Tiempo de ciclo, % Defectos... (Presiona Enter)"
            tags={mappingInputs.indicadores}
            onChange={tags => setMappingInputs(prev => ({ ...prev, indicadores: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Herramientas"
            placeholder="Ej. Scanner OBD2, Multímetro... (Presiona Enter)"
            tags={mappingInputs.herramientas}
            onChange={tags => setMappingInputs(prev => ({ ...prev, herramientas: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Sistemas Informáticos"
            placeholder="Ej. ERP, CRM, Portal de citas... (Presiona Enter)"
            tags={mappingInputs.sistemas}
            onChange={tags => setMappingInputs(prev => ({ ...prev, sistemas: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />
        </div>
      </div>

      {phaseData.inventarioActual && (
        <EditableInventory 
          title="Inventario Actual (AS-IS)" 
          subtitle="Documentos, roles y sistemas identificados en el proceso actual."
          data={phaseData.inventarioActual} 
          onChange={(newData) => updateModoPhase(modo.id, 2, { data: { ...phaseData, inventarioActual: newData } })} 
        />
      )}

      <GestorPropuestas modoId={modo.id} phaseName="Análisis" />
    </PhaseLayout>
  );
};

const LEAN_WASTES = [
  { id: 'sobreproduccion', label: 'Sobreproducción', desc: 'Procesar más información o piezas antes de que se requieran.' },
  { id: 'espera', label: 'Espera / Demoras', desc: 'Tiempos muertos de personal o sistemas esperando firmas, aprobaciones o insumos.' },
  { id: 'transporte', label: 'Transporte innecesario', desc: 'Mover archivos o documentos físicos o digitales innecesariamente.' },
  { id: 'sobreprocesamiento', label: 'Sobreprocesamiento', desc: 'Hacer retrabajos o añadir pasos que no agregan valor al cliente.' },
  { id: 'inventario', label: 'Inventario excesivo', desc: 'Acumulación de folios pendientes, cotizaciones sin cerrar o correos sin contestar.' },
  { id: 'movimiento', label: 'Movimiento innecesario', desc: 'Desplazamientos físicos innecesarios en la oficina o clics extras en sistemas.' },
  { id: 'defectos', label: 'Retrabajos / Defectos', desc: 'Errores en la captura de información que requieren ser corregidos de nuevo.' },
  { id: 'talento', label: 'Talento no aprovechado', desc: 'No escuchar propuestas de los operadores ni utilizar sus habilidades.' }
];

const Phase3Reengineering: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const phaseData = modo.phases[3]?.data || {};
  const isApproved = modo.phases[3]?.status === 'Aprobado';
  const tasks: ModoTask[] = phaseData.tasks || [];

  const [wastes, setWastes] = useState<Record<string, { checked: boolean; obs: string }>>(() => phaseData.wastes || {});

  const [ishikawa, setIshikawa] = useState({
    manoObra: phaseData.ishikawa?.manoObra || '',
    metodo: phaseData.ishikawa?.metodo || '',
    maquina: phaseData.ishikawa?.maquina || '',
    material: phaseData.ishikawa?.material || '',
    medioAmbiente: phaseData.ishikawa?.medioAmbiente || '',
    medicion: phaseData.ishikawa?.medicion || ''
  });

  const [whys, setWhys] = useState({
    why1: phaseData.whys?.why1 || '',
    why2: phaseData.whys?.why2 || '',
    why3: phaseData.whys?.why3 || '',
    why4: phaseData.whys?.why4 || '',
    why5: phaseData.whys?.why5 || '',
    finalCause: phaseData.whys?.finalCause || ''
  });

  const [ieActions, setIeActions] = useState<any[]>(() => phaseData.ieActions || [
    { id: '1', accion: 'Capacitación al personal operativo', impacto: 'Alto', esfuerzo: 'Bajo' },
    { id: '2', accion: 'Automatizar cotizaciones en el CRM', impacto: 'Alto', esfuerzo: 'Alto' }
  ]);
  const [newIeAction, setNewIeAction] = useState('');
  const [newIeImpact, setNewIeImpact] = useState<'Alto' | 'Medio' | 'Bajo'>('Alto');
  const [newIeEsfuerzo, setNewIeEsfuerzo] = useState<'Alto' | 'Medio' | 'Bajo'>('Bajo');

  const handleWasteChange = (id: string, checked: boolean, obs: string) => {
    const updated = { ...wastes, [id]: { checked, obs } };
    setWastes(updated);
    if (!isApproved && canEdit) {
      updateModoPhase(modo.id, 3, { data: { ...phaseData, wastes: updated } });
    }
  };

  const handleIshikawaBlur = () => {
    if (isApproved || !canEdit) return;
    updateModoPhase(modo.id, 3, { data: { ...phaseData, ishikawa } });
  };

  const handleWhysBlur = () => {
    if (isApproved || !canEdit) return;
    updateModoPhase(modo.id, 3, { data: { ...phaseData, whys } });
  };

  const handleAddIeAction = () => {
    if (!newIeAction.trim() || !canEdit) return;
    const updated = [
      ...ieActions,
      { id: `ie_${Date.now()}`, accion: newIeAction.trim(), impacto: newIeImpact, esfuerzo: newIeEsfuerzo }
    ];
    setIeActions(updated);
    updateModoPhase(modo.id, 3, { data: { ...phaseData, ieActions: updated } });
    setNewIeAction('');
  };

  const handleRemoveIeAction = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = ieActions.filter(item => item.id !== id);
    setIeActions(updated);
    updateModoPhase(modo.id, 3, { data: { ...phaseData, ieActions: updated } });
  };

  const handleGeneratePlan = () => {
    const newTasks = modoTasksTemplate.map(t => ({
      ...t,
      id: Math.random().toString(36).substring(2, 11),
      estado: 'Por hacer' as TaskStatus,
      responsableAsignado: t.responsableDefault,
    }));
    
    const checklistOut = {
      'Mapa de desperdicios creado': false,
      'Causas raíz (Ishikawa/5 Porqués) validadas': false,
      'Matriz impacto-esfuerzo y backlog priorizado': false
    };

    updateModoPhase(modo.id, 3, { data: { ...phaseData, tasks: newTasks }, checklistOut, status: 'En proceso' });
  };

  const updateTask = (taskId: string, field: keyof ModoTask, value: any) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t);
    updateModoPhase(modo.id, 3, { data: { ...phaseData, tasks: newTasks }, status: 'En proceso' });
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.fase]) acc[task.fase] = [];
    acc[task.fase].push(task);
    return acc;
  }, {} as Record<string, ModoTask[]>);

  const statusColors = {
    'Por hacer': 'bg-slate-100 text-slate-600 border-slate-200',
    'En curso': 'bg-blue-50 text-blue-700 border-blue-200',
    'Listo': 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const checklistManual = [
    "Identificar los desperdicios presentes utilizando la guía de 8 desperdicios Lean.",
    "Realizar el diagrama de Ishikawa (6M) para estructurar posibles causas.",
    "Utilizar los 5 Porqués para profundizar hasta llegar a la causa raíz de la fricción principal.",
    "Priorizar las iniciativas y soluciones mediante la matriz impacto-esfuerzo.",
    "Construir el backlog priorizado (Plan de Trabajo) asignando responsables y fechas compromiso."
  ];

  const erroresEvitar = [
    "Tratar de solucionar todos los desperdicios a la vez en lugar de enfocar esfuerzos.",
    "Hacer el Ishikawa de manera teórica sin validar en campo con el equipo operativo."
  ];

  const q1 = ieActions.filter(a => a.impacto === 'Alto' && a.esfuerzo === 'Bajo');
  const q2 = ieActions.filter(a => a.impacto === 'Alto' && a.esfuerzo === 'Alto');
  const q3 = ieActions.filter(a => a.impacto === 'Bajo' && a.esfuerzo === 'Bajo');
  const q4 = ieActions.filter(a => a.impacto === 'Bajo' && a.esfuerzo === 'Alto');

  return (
    <PhaseLayout modo={modo} phaseNumber={3} title="Análisis Lean, causa raíz y priorización" dmaic="Analyze" description="Detección de desperdicios, análisis de causa raíz con Ishikawa/5 Porqués y priorización de backlog." onGenerate={() => {}} isGenerating={false} error={null} checklistManual={checklistManual} erroresEvitar={erroresEvitar}>
      
      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm">
        <h3 className="text-[16px] font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">delete_sweep</span>
          Mapeo de Desperdicios (Lean 8 Desperdicios)
        </h3>
        <p className="text-[12px] text-slate-500 mb-6">Analiza y documenta cuáles de los 8 desperdicios de Lean están presentes en el proceso actual.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEAN_WASTES.map(w => {
            const state = wastes[w.id] || { checked: false, obs: '' };
            return (
              <div key={w.id} className={cn("p-4 border rounded-xl transition-all flex flex-col gap-3", state.checked ? "border-amber-200 bg-amber-50/10" : "border-slate-200 bg-white")}>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={state.checked} 
                    disabled={isApproved || !canEdit}
                    onChange={e => handleWasteChange(w.id, e.target.checked, state.obs)}
                    className="rounded text-primary h-4.5 w-4.5 mt-0.5 disabled:opacity-50"
                  />
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-800">{w.label}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{w.desc}</p>
                  </div>
                </div>
                {state.checked && (
                  <textarea 
                    placeholder="Describe el hallazgo y su impacto en la operación..."
                    value={state.obs}
                    disabled={isApproved || !canEdit}
                    onChange={e => handleWasteChange(w.id, state.checked, e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-[13px] bg-white outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                    rows={2}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm mt-6">
        <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
          Análisis de Causa Raíz (Ishikawa & 5 Porqués)
        </h3>

        <div className="mb-8">
          <h4 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-slate-400 text-[18px]">account_tree</span>
            Diagrama Ishikawa (Las 6M)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase">Mano de Obra (Personal)</label>
              <textarea 
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                rows={2} placeholder="Ej. Falta de capacitación en el sistema..."
                value={ishikawa.manoObra}
                onChange={e => setIshikawa({ ...ishikawa, manoObra: e.target.value })}
                onBlur={handleIshikawaBlur}
                disabled={isApproved || !canEdit}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase">Métodos (Procesos)</label>
              <textarea 
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                rows={2} placeholder="Ej. Duplicidad de aprobaciones en el manual..."
                value={ishikawa.metodo}
                onChange={e => setIshikawa({ ...ishikawa, metodo: e.target.value })}
                onBlur={handleIshikawaBlur}
                disabled={isApproved || !canEdit}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase">Máquinas (Sistemas / Tecnologías)</label>
              <textarea 
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                rows={2} placeholder="Ej. El ERP se traba en horas pico..."
                value={ishikawa.maquina}
                onChange={e => setIshikawa({ ...ishikawa, maquina: e.target.value })}
                onBlur={handleIshikawaBlur}
                disabled={isApproved || !canEdit}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase">Materiales (Insumos / Formatos)</label>
              <textarea 
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                rows={2} placeholder="Ej. Formatos obsoletos o demasiado largos..."
                value={ishikawa.material}
                onChange={e => setIshikawa({ ...ishikawa, material: e.target.value })}
                onBlur={handleIshikawaBlur}
                disabled={isApproved || !canEdit}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase">Medio Ambiente (Entorno de trabajo)</label>
              <textarea 
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                rows={2} placeholder="Ej. Distribución física de la bahía lejana..."
                value={ishikawa.medioAmbiente}
                onChange={e => setIshikawa({ ...ishikawa, medioAmbiente: e.target.value })}
                onBlur={handleIshikawaBlur}
                disabled={isApproved || !canEdit}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase">Medición (Indicadores)</label>
              <textarea 
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                rows={2} placeholder="Ej. No se miden las incidencias ni mermas..."
                value={ishikawa.medicion}
                onChange={e => setIshikawa({ ...ishikawa, medicion: e.target.value })}
                onBlur={handleIshikawaBlur}
                disabled={isApproved || !canEdit}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-slate-400 text-[18px]">help_center</span>
            Los 5 Porqués
          </h4>
          <div className="space-y-4 max-w-3xl">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-[13px] flex items-center justify-center flex-shrink-0">{num}</span>
                <input 
                  type="text" 
                  placeholder={`¿Por qué ocurre esto? (Por qué ${num})`}
                  value={whys[`why${num}` as keyof typeof whys]}
                  onChange={e => setWhys({ ...whys, [`why${num}`]: e.target.value })}
                  onBlur={handleWhysBlur}
                  disabled={isApproved || !canEdit}
                  className="flex-1 p-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                />
              </div>
            ))}
            
            <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50/10 rounded-xl">
              <label className="block text-[12px] font-bold text-emerald-800 uppercase mb-2">Causa Raíz Identificada</label>
              <textarea 
                placeholder="Escribe la causa raíz final a la que se llegó tras los 5 Porqués..."
                value={whys.finalCause}
                onChange={e => setWhys({ ...whys, finalCause: e.target.value })}
                onBlur={handleWhysBlur}
                disabled={isApproved || !canEdit}
                rows={2}
                className="w-full p-2.5 border border-emerald-200 bg-white rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm mt-6">
        <h3 className="text-[16px] font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">grid_goldenratio</span>
          Priorización de Iniciativas (Matriz Impacto-Esfuerzo)
        </h3>
        <p className="text-[12px] text-slate-500 mb-6">Registra iniciativas de solución y evalúa su impacto operativo y esfuerzo de implementación para priorizar.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-4">
            {canEdit && !isApproved && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder="Iniciativa de solución..." 
                  value={newIeAction} 
                  onChange={e => setNewIeAction(e.target.value)}
                  className="col-span-12 md:col-span-6 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <select 
                  value={newIeImpact} 
                  onChange={e => setNewIeImpact(e.target.value as any)}
                  className="col-span-6 md:col-span-3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none bg-white"
                >
                  <option value="Alto">Impacto Alto</option>
                  <option value="Medio">Impacto Medio</option>
                  <option value="Bajo">Impacto Bajo</option>
                </select>
                <select 
                  value={newIeEsfuerzo} 
                  onChange={e => setNewIeEsfuerzo(e.target.value as any)}
                  className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none bg-white"
                >
                  <option value="Bajo">Esfuerzo Bajo</option>
                  <option value="Medio">Esfuerzo Medio</option>
                  <option value="Alto">Esfuerzo Alto</option>
                </select>
                <button 
                  onClick={handleAddIeAction}
                  disabled={!newIeAction.trim()}
                  className="col-span-12 md:col-span-1 bg-slate-900 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {ieActions.map(a => (
                <div key={a.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between gap-4">
                  <span className="text-[13px] font-semibold text-slate-800">{a.accion}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", a.impacto === 'Alto' ? "bg-emerald-100 text-emerald-800" : a.impacto === 'Medio' ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-500")}>
                      Imp: {a.impacto}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", a.esfuerzo === 'Bajo' ? "bg-blue-100 text-blue-800" : a.esfuerzo === 'Medio' ? "bg-slate-100 text-slate-700" : "bg-red-100 text-red-800")}>
                      Esf: {a.esfuerzo}
                    </span>
                    {canEdit && !isApproved && (
                      <button onClick={() => handleRemoveIeAction(a.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {ieActions.length === 0 && <p className="text-[12px] text-slate-400 italic text-center py-4">Sin iniciativas registradas.</p>}
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="grid grid-cols-2 grid-rows-2 w-[280px] h-[280px] border-2 border-slate-300 relative">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impacto (Alto &uarr;)</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Esfuerzo (Bajo &larr;)</div>
              
              <div className="border border-dashed border-slate-200 bg-emerald-50/20 p-2.5 flex flex-col gap-1 overflow-hidden relative group">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Victorias Rápidas</div>
                <div className="text-[9px] text-slate-400">{q1.length} iniciativas</div>
                <div className="hidden group-hover:block absolute inset-0 bg-white/95 p-2 overflow-y-auto text-[9px] text-slate-700">
                  {q1.map((x, idx) => <div key={idx} className="border-b border-slate-100 pb-0.5 mb-0.5">• {x.accion}</div>)}
                </div>
              </div>

              <div className="border border-dashed border-slate-200 bg-blue-50/20 p-2.5 flex flex-col gap-1 overflow-hidden relative group">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Proyectos Clave</div>
                <div className="text-[9px] text-slate-400">{q2.length} iniciativas</div>
                <div className="hidden group-hover:block absolute inset-0 bg-white/95 p-2 overflow-y-auto text-[9px] text-slate-700">
                  {q2.map((x, idx) => <div key={idx} className="border-b border-slate-100 pb-0.5 mb-0.5">• {x.accion}</div>)}
                </div>
              </div>

              <div className="border border-dashed border-slate-200 bg-slate-50 p-2.5 flex flex-col gap-1 overflow-hidden relative group">
                <div className="text-[10px] font-bold text-slate-700 uppercase">Tareas Simples</div>
                <div className="text-[9px] text-slate-400">{q3.length} iniciativas</div>
                <div className="hidden group-hover:block absolute inset-0 bg-white/95 p-2 overflow-y-auto text-[9px] text-slate-700">
                  {q3.map((x, idx) => <div key={idx} className="border-b border-slate-100 pb-0.5 mb-0.5">• {x.accion}</div>)}
                </div>
              </div>

              <div className="border border-dashed border-slate-200 bg-red-50/10 p-2.5 flex flex-col gap-1 overflow-hidden relative group">
                <div className="text-[10px] font-bold text-red-800 uppercase">Descartables</div>
                <div className="text-[9px] text-slate-400">{q4.length} iniciativas</div>
                <div className="hidden group-hover:block absolute inset-0 bg-white/95 p-2 overflow-y-auto text-[9px] text-slate-700">
                  {q4.map((x, idx) => <div key={idx} className="border-b border-slate-100 pb-0.5 mb-0.5">• {x.accion}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {!tasks.length ? (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[32px] text-primary">format_list_bulleted</span>
            </div>
            <h3 className="text-[18px] font-bold text-slate-900">Plan de Trabajo / Backlog</h3>
            <p className="text-[14px] text-slate-500 max-w-md">Inicializa el plan de trabajo y backlog de reingeniería basado en la plantilla estándar.</p>
            {canEdit ? (
              <button onClick={handleGeneratePlan} className="mt-4 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">bolt</span> Generar Backlog Priorizado
              </button>
            ) : (
              <p className="text-[13px] text-slate-500 italic mt-2">Solo los administradores pueden inicializar el plan de trabajo.</p>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">Backlog y Plan de Trabajo Priorizado</h4>
                <p className="text-[13px] text-slate-500 mt-1">Planifica la ejecución de reingeniería asignando responsables y fechas compromiso.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6 w-[5%]">ID</th>
                    <th className="py-3 px-6 w-[35%]">Actividad y Entregable</th>
                    <th className="py-3 px-6 w-[25%]">Responsable</th>
                    <th className="py-3 px-6 w-[15%]">Fecha Límite</th>
                    <th className="py-3 px-6 w-[20%]">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-slate-700">
                  {Object.entries(groupedTasks).map(([faseName, faseTasks]) => (
                    <React.Fragment key={faseName}>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <td colSpan={5} className="py-3 px-6 font-bold text-[12px] text-slate-800 tracking-wide">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">view_timeline</span>
                            {faseName}
                          </div>
                        </td>
                      </tr>
                      {faseTasks.map((task) => (
                        <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">{task.codigo}</td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-900 mb-1">{task.actividad}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{task.descripcion}</div>
                            <div className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1 opacity-80"><span className="material-symbols-outlined text-[14px]">inventory_2</span> {task.entregable}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="relative">
                              <input 
                                type="text" 
                                value={task.responsableAsignado || ''} 
                                onChange={(e) => updateTask(task.id, 'responsableAsignado', e.target.value)}
                                placeholder="Asignar..."
                                disabled={!canEdit}
                                className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 px-2.5 text-[13px] font-medium transition-all outline-none disabled:cursor-not-allowed"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <input 
                              type="date" 
                              value={task.fechaFin || ''} 
                              onChange={(e) => updateTask(task.id, 'fechaFin', e.target.value)}
                              disabled={!canEdit}
                              className="bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 px-2.5 text-[13px] font-medium transition-all outline-none disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <select 
                              value={task.estado} 
                              onChange={(e) => updateTask(task.id, 'estado', e.target.value as TaskStatus)}
                              disabled={!canEdit}
                              className={cn("px-2.5 py-1.5 rounded-full text-[12px] font-bold border outline-none bg-white", statusColors[task.estado])}
                            >
                              <option value="Por hacer">Por hacer</option>
                              <option value="En curso">En curso</option>
                              <option value="Listo">Listo</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </PhaseLayout>
  );
};

const MultiTagInput: React.FC<{
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  onBlur: () => void;
  disabled?: boolean;
}> = ({ label, placeholder, tags, onChange, onBlur, disabled = false }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
    }
    setInput('');
  };

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-slate-600">{label}</label>
      <div 
        className={cn(
          "w-full min-h-[48px] p-2 border border-slate-200 rounded-xl bg-slate-50 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all cursor-text",
          disabled && "opacity-60 cursor-not-allowed pointer-events-none"
        )}
        onClick={(e) => {
          if (disabled) return;
          const inputEl = e.currentTarget.querySelector('input');
          if (inputEl) inputEl.focus();
        }}
      >
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-[13px] text-slate-700 flex items-center gap-1 shadow-sm">
            {tag}
            {!disabled && (
              <button 
                onClick={(e) => { e.stopPropagation(); removeTag(idx); setTimeout(onBlur, 0); }} 
                className="hover:text-red-500 flex items-center justify-center opacity-70 hover:opacity-100"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <input 
            type="text" 
            className="flex-1 min-w-[120px] bg-transparent text-[14px] outline-none px-2 py-1" 
            placeholder={tags.length === 0 ? placeholder : ''}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { addTag(); onBlur(); }}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

// --- Phase 3 ---
export const Phase3: React.FC<{ modo: Modo }> = ({ modo }) => {
  if (modo.projectType === 'Reingeniería') {
    return <Phase3Reengineering modo={modo} />;
  }
  const { updateModoPhase, macroprocesos, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[3]?.data || {};
  const isApproved = modo.phases[3]?.status === 'Aprobado';
  const [notas, setNotas] = useState(phaseData.notas || '');
  const [diagramMode, setDiagramMode] = useState<'image' | 'mermaid'>(
    phaseData.asIsImage ? 'image' : (phaseData.mermaidASIS ? 'mermaid' : 'image')
  );

  const toArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' && val ? val.split(',').map(s=>s.trim()) : []);

  const [mappingInputs, setMappingInputs] = useState({
    macroproceso: phaseData.asIsMapping?.macroproceso || '',
    procedimientos: toArray(phaseData.asIsMapping?.procedimientos),
    indicadores: toArray(phaseData.asIsMapping?.indicadores),
    herramientas: toArray(phaseData.asIsMapping?.herramientas),
    sistemas: toArray(phaseData.asIsMapping?.sistemas),
    puestos: toArray(phaseData.asIsMapping?.puestos),
    externalLink: phaseData.asIsLink || ''
  });

  useEffect(() => {
    setNotas(phaseData.notas || '');
  }, [phaseData.notas]);

  useEffect(() => {
    setMappingInputs({
      macroproceso: phaseData.asIsMapping?.macroproceso || '',
      procedimientos: toArray(phaseData.asIsMapping?.procedimientos),
      indicadores: toArray(phaseData.asIsMapping?.indicadores),
      herramientas: toArray(phaseData.asIsMapping?.herramientas),
      sistemas: toArray(phaseData.asIsMapping?.sistemas),
      puestos: toArray(phaseData.asIsMapping?.puestos),
      externalLink: phaseData.asIsLink || ''
    });
  }, [phaseData.asIsMapping, phaseData.asIsLink]);

  const handleNotesBlur = () => {
    if (isApproved || !canEdit) return;
    updateModoPhase(modo.id, 3, {
      data: {
        ...phaseData,
        notas: notas
      }
    });
  };

  const handleBlur = () => {
    if (isApproved || !canEdit) return;
    const currentPhaseData = modo.phases[3]?.data || {};
    updateModoPhase(modo.id, 3, { 
      data: { 
        ...currentPhaseData, 
        asIsMapping: {
          macroproceso: mappingInputs.macroproceso,
          procedimientos: mappingInputs.procedimientos,
          indicadores: mappingInputs.indicadores,
          herramientas: mappingInputs.herramientas,
          sistemas: mappingInputs.sistemas,
          puestos: mappingInputs.puestos
        },
        asIsLink: mappingInputs.externalLink
      } 
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApproved || !canEdit) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateModoPhase(modo.id, 3, { data: { ...phaseData, asIsImage: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!canEdit) return;
    setIsGenerating(true);
    try {
      const data = await generatePhaseData(3, { notas }, {});
      const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
      updateModoPhase(modo.id, 3, { 
        data: {
          ...phaseData,
          ...data,
          notas
        }, 
        checklistOut: checklistObj, 
        status: 'En proceso' 
      });
    } catch (err: any) {} finally { setIsGenerating(false); }
  };

  const checklistManual = ["Mapear el proceso actual AS-IS.", "Identificar dolores operativos.", "Realizar análisis de causa raíz."];
  const erroresEvitar = ["Caer en parálisis por análisis.", "Mapear demasiado detalle que no ayuda a decidir."];

  return (
    <PhaseLayout modo={modo} phaseNumber={3} title="Análisis Rápido" dmaic="Analyze" description="Mapeo del proceso actual (AS-IS) e identificación de causas raíz." onGenerate={handleGenerate} isGenerating={isGenerating} error={null} checklistManual={checklistManual} erroresEvitar={erroresEvitar}>
      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm">
        <label className="block text-[13px] font-bold text-slate-700 mb-3">Notas de entrevistas y observación</label>
        <textarea 
          className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60" 
          rows={4} 
          value={notas} 
          onChange={e => setNotas(e.target.value)} 
          onBlur={handleNotesBlur}
          disabled={isApproved || !canEdit}
          placeholder="Pega aquí las notas..." 
        />
      </div>
      
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-slate-900">Diagrama AS-IS (SIPOC con VSM)</h3>
            <p className="text-[13px] text-slate-500 mt-1">Elige entre escribir código Mermaid o subir una imagen de tu diagrama.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setDiagramMode('image')}
              className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramMode === 'image' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Imagen / Enlace
            </button>
            <button 
              onClick={() => setDiagramMode('mermaid')}
              className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramMode === 'mermaid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Código Mermaid
            </button>
          </div>
        </div>

        {diagramMode === 'image' ? (
          <>
            <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 max-w-2xl flex-1">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">link</span>
                <input 
                  type="text" 
                  placeholder="Enlace externo a Lucidchart o draw.io (opcional)" 
                  className="flex-1 p-2 border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60"
                  value={mappingInputs.externalLink}
                  onChange={e => setMappingInputs(prev => ({ ...prev, externalLink: e.target.value }))}
                  onBlur={handleBlur}
                  disabled={isApproved || !canEdit}
                />
                {mappingInputs.externalLink && (
                  <a href={mappingInputs.externalLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-[13px] hover:underline whitespace-nowrap">
                    Abrir enlace
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3 justify-end">
                <label className={cn(
                  "cursor-pointer bg-white border border-slate-200 text-slate-700 font-bold text-[13px] px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-2 shadow-sm",
                  (isApproved || !canEdit) && "opacity-50 cursor-not-allowed pointer-events-none"
                )}>
                  <span className="material-symbols-outlined text-[18px]">upload</span> Subir Imagen
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isApproved || !canEdit} />
                </label>
                {phaseData.asIsImage && !isApproved && canEdit && (
                  <button onClick={() => updateModoPhase(modo.id, 3, { data: { ...phaseData, asIsImage: null } })} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center" title="Eliminar imagen">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>

            {phaseData.asIsImage ? (
              <div className="p-8 bg-slate-50 flex justify-center items-center">
                <img src={phaseData.asIsImage as string} alt="Diagrama AS-IS" className="max-w-full rounded-lg shadow-sm border border-slate-200" />
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 border-dashed bg-slate-50/50">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">image</span>
                <p className="text-[14px] font-medium">Aún no hay una imagen de diagrama cargada</p>
                <p className="text-[12px] mt-1 text-center max-w-md">Sube una imagen de tu SIPOC/VSM usando el botón de arriba o pega el enlace externo.</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-white flex flex-col gap-5">
            {phaseData.mermaidASIS ? (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center min-h-[220px] overflow-auto">
                <MermaidChart chart={phaseData.mermaidASIS} />
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 border border-slate-200 border-dashed bg-slate-50/50 rounded-xl">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">code</span>
                <p className="text-[14px] font-medium">No hay código Mermaid ingresado</p>
                <button 
                  onClick={() => {
                    updateModoPhase(modo.id, 3, { 
                      data: { 
                        ...phaseData, 
                        mermaidASIS: 'graph TD\n    A[Inicio] --> B[Paso 1]\n    B --> C[Fin]' 
                      } 
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={isApproved || !canEdit}
                >
                  Generar plantilla de inicio
                </button>
              </div>
            )}

            {phaseData.mermaidASIS && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Código Mermaid (Editable)</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
                  rows={8}
                  value={phaseData.mermaidASIS}
                  onChange={(e) => {
                    updateModoPhase(modo.id, 3, { 
                      data: { 
                        ...phaseData, 
                        mermaidASIS: e.target.value 
                      } 
                    });
                  }}
                  disabled={isApproved || !canEdit}
                  placeholder="Escribe tu código Mermaid aquí..."
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm mt-6 p-8">
        <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">schema</span>
          Mapeo y Vinculación del Proceso (AS-IS)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
            <label className="text-[13px] font-bold text-slate-600">Macroproceso Asociado</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              value={mappingInputs.macroproceso}
              onChange={e => setMappingInputs(prev => ({ ...prev, macroproceso: e.target.value }))}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
            >
              <option value="">-- Seleccionar Macroproceso --</option>
              {macroprocesos?.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
              <option value="Otro">Otro (No registrado)</option>
            </select>
          </div>
          
          <MultiTagInput 
            label="Procedimientos Involucrados"
            placeholder="Ej. Recepción de piezas, Diagnóstico... (Presiona Enter)"
            tags={mappingInputs.procedimientos}
            onChange={tags => setMappingInputs(prev => ({ ...prev, procedimientos: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Puestos / Roles Necesarios"
            placeholder="Ej. Técnico, Asesor, Almacenista... (Presiona Enter)"
            tags={mappingInputs.puestos}
            onChange={tags => setMappingInputs(prev => ({ ...prev, puestos: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Indicadores (KPIs)"
            placeholder="Ej. Tiempo de ciclo, % Defectos... (Presiona Enter)"
            tags={mappingInputs.indicadores}
            onChange={tags => setMappingInputs(prev => ({ ...prev, indicadores: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Herramientas"
            placeholder="Ej. Scanner OBD2, Multímetro... (Presiona Enter)"
            tags={mappingInputs.herramientas}
            onChange={tags => setMappingInputs(prev => ({ ...prev, herramientas: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Sistemas Informáticos"
            placeholder="Ej. ERP, CRM, Portal de citas... (Presiona Enter)"
            tags={mappingInputs.sistemas}
            onChange={tags => setMappingInputs(prev => ({ ...prev, sistemas: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />
        </div>
      </div>

      <ObjetivosMediblesSection 
        modoId={modo.id} 
        phaseNum={3} 
        objetivos={phaseData.objetivosMedibles || []} 
        canEdit={canEdit} 
        isApproved={isApproved} 
      />

      {phaseData.inventarioActual && (
        <EditableInventory 
          title="Inventario Actual (AS-IS)" 
          subtitle="Documentos, roles y sistemas identificados en el proceso actual."
          data={phaseData.inventarioActual} 
          onChange={(newData) => updateModoPhase(modo.id, 3, { data: { ...phaseData, inventarioActual: newData } })} 
        />
      )}

      <GestorPropuestas modoId={modo.id} phaseName="Análisis" />
    </PhaseLayout>
  );
};

// --- Phase 4 ---
const DEFAULT_CONTROL_DOCUMENTAL = [
  { id: '1', doc: 'Perfil de puesto', codigo: 'MC-PP-01', version: '1.0', responsable: 'Líder MC', vigencia: '2026-12-31', aprobador: 'Dueño del proceso', revision: '2026-06-30', debeResponder: 'Qué hace el puesto, qué responsabilidades tiene y cómo se mide.' },
  { id: '2', doc: 'Manual de proceso', codigo: 'MC-MP-01', version: '1.0', responsable: 'Dueño del proceso', vigencia: '2026-12-31', aprobador: 'Líder MC', revision: '2026-06-30', debeResponder: 'Cómo fluye el proceso, quién interviene y cuáles son sus reglas (BPMN 2.0 / Swimlanes).' },
  { id: '3', doc: 'IDO', codigo: 'MC-ID-01', version: '1.0', responsable: 'Usuarios clave', vigencia: '2026-12-31', aprobador: 'Dueño del proceso', revision: '2026-06-30', debeResponder: 'Cómo se ejecuta una actividad específica paso a paso.' },
  { id: '4', doc: 'Manual técnico', codigo: 'MC-MT-01', version: '1.0', responsable: 'TI / Experto técnico', vigencia: '2026-12-31', aprobador: 'Líder MC', revision: '2026-06-30', debeResponder: 'Cómo usar una herramienta, sistema, configuración o criterio técnico.' },
  { id: '5', doc: 'Formato', codigo: 'MC-FO-01', version: '1.0', responsable: 'Equipo operativo', vigencia: '2026-12-31', aprobador: 'Dueño del proceso', revision: '2026-06-30', debeResponder: 'Qué información debe capturarse y para qué se usa.' },
  { id: '6', doc: 'Matriz de auditoría', codigo: 'MC-MA-01', version: '1.0', responsable: 'Líder MC', vigencia: '2026-12-31', aprobador: 'Patrocinador', revision: '2026-06-30', debeResponder: 'Qué se revisa, con qué criterio, frecuencia y evidencia.' },
  { id: '7', doc: 'Tablero de KPIs', codigo: 'MC-KPI-01', version: '1.0', responsable: 'Líder MC', vigencia: '2026-12-31', aprobador: 'Patrocinador', revision: '2026-06-30', debeResponder: 'Qué indicadores se monitorean, meta, frecuencia y responsable.' }
];

const DOCUMENT_CATEGORIES = [
  { id: 'direccion', title: 'Dirección del proyecto', docs: 'Acta Lean, plan de trabajo, hoja de ruta, riesgos y comunicación.', use: 'Dirigir y controlar la implementación.', icon: 'assignment' },
  { id: 'proceso', title: 'Proceso', docs: 'AS-IS, TO-BE, manual de proceso, reglas de operación y procedimientos.', use: 'Definir cómo debe operar el proceso.', icon: 'account_tree' },
  { id: 'organizacion', title: 'Organización', docs: 'Perfiles y descripciones de puesto, matriz de comunicación y lista de actividades.', use: 'Clarificar responsabilidades.', icon: 'badge' },
  { id: 'operacion', title: 'Operación', docs: 'IDO, checklists y formatos operativos.', use: 'Ejecutar actividades de forma estándar.', icon: 'list_alt' },
  { id: 'tecnica', title: 'Técnica', docs: 'Manuales técnicos, guías de sistema y parámetros.', use: 'Asegurar uso correcto de herramientas.', icon: 'menu_book' },
  { id: 'control', title: 'Control', docs: 'KPIs, tablero, matriz de auditoría, Reportes para decidir y tubería.', use: 'Medir cumplimiento y resultados.', icon: 'monitoring' },
  { id: 'cierre', title: 'Cierre', docs: 'Reporte final, lecciones aprendidas y backlog de mejora.', use: 'Transferir control y sostener mejora.', icon: 'task' }
];

export const Phase4: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, macroprocesos, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[4]?.data || {};
  const isApproved = modo.phases[4]?.status === 'Aprobado';
  const [diagramMode, setDiagramMode] = useState<'image' | 'mermaid'>(
    phaseData.toBeImage ? 'image' : (phaseData.mermaidTOBE ? 'mermaid' : 'image')
  );

  const asIsPhaseNum = modo.projectType === 'Reingeniería' ? 2 : 3;

  const [controlDocumental, setControlDocumental] = useState<any[]>([]);

  const initializeControlDocumental = (currentModo: Modo) => {
    const macroprocesoName = currentModo.phases[4]?.data?.toBeMapping?.macroproceso || currentModo.phases[asIsPhaseNum]?.data?.asIsMapping?.macroproceso || currentModo.name || 'Proceso';
    
    const toArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' && val ? val.split(',').map(s=>s.trim()) : []);
    
    const puestos = toArray(currentModo.phases[asIsPhaseNum]?.data?.asIsMapping?.puestos);
    const procedimientos = toArray(currentModo.phases[asIsPhaseNum]?.data?.asIsMapping?.procedimientos);

    const list: any[] = [];
    
    // 1. Puestos from Phase 3
    puestos.forEach((p: string, idx: number) => {
      list.push({
        id: `puesto-${idx}-${Date.now()}`,
        doc: `Perfil de puesto - ${p}`,
        codigo: `MC-PP-${String(idx + 1).padStart(2, '0')}`,
        version: '1.0',
        responsable: 'Líder MC',
        vigencia: '2026-12-31',
        aprobador: 'Dueño del proceso',
        revision: '2026-06-30',
        debeResponder: 'Qué hace el puesto, qué responsabilidades tiene y cómo se mide.'
      });
    });

    // 2. Procesos from Phase 3
    procedimientos.forEach((proc: string, idx: number) => {
      list.push({
        id: `proc-${idx}-${Date.now()}`,
        doc: `Manual de proceso - ${proc}`,
        codigo: `MC-MP-${String(idx + 1).padStart(2, '0')}`,
        version: '1.0',
        responsable: 'Dueño del proceso',
        vigencia: '2026-12-31',
        aprobador: 'Líder MC',
        revision: '2026-06-30',
        debeResponder: 'Cómo fluye el proceso, quién interviene y cuáles son sus reglas (BPMN 2.0 / Swimlanes).'
      });
    });

    // 3. IDO
    list.push({
      id: `ido-${Date.now()}`,
      doc: `IDO - ${macroprocesoName}`,
      codigo: 'MC-ID-01',
      version: '1.0',
      responsable: 'Usuarios clave',
      vigencia: '2026-12-31',
      aprobador: 'Dueño del proceso',
      revision: '2026-06-30',
      debeResponder: 'Cómo se ejecuta una actividad específica paso a paso.'
    });

    // 4. Manual técnico
    list.push({
      id: `tech-${Date.now()}`,
      doc: `Manual técnico - ${macroprocesoName}`,
      codigo: 'MC-MT-01',
      version: '1.0',
      responsable: 'TI / Experto técnico',
      vigencia: '2026-12-31',
      aprobador: 'Líder MC',
      revision: '2026-06-30',
      debeResponder: 'Cómo usar una herramienta, sistema, configuración o criterio técnico.'
    });

    // 5. Formato
    list.push({
      id: `form-${Date.now()}`,
      doc: `Formato - ${macroprocesoName}`,
      codigo: 'MC-FO-01',
      version: '1.0',
      responsable: 'Equipo operativo',
      vigencia: '2026-12-31',
      aprobador: 'Dueño del proceso',
      revision: '2026-06-30',
      debeResponder: 'Qué información debe capturarse y para qué se usa.'
    });

    // 6. Matriz de auditoría
    list.push({
      id: `aud-${Date.now()}`,
      doc: `Matriz de auditoría - ${macroprocesoName}`,
      codigo: 'MC-MA-01',
      version: '1.0',
      responsable: 'Líder MC',
      vigencia: '2026-12-31',
      aprobador: 'Patrocinador',
      revision: '2026-06-30',
      debeResponder: 'Qué se revisa, con qué criterio, frecuencia y evidencia.'
    });

    // 7. Tablero de KPIs
    list.push({
      id: `kpi-${Date.now()}`,
      doc: `Tablero de KPIs - ${macroprocesoName}`,
      codigo: 'MC-KPI-01',
      version: '1.0',
      responsable: 'Líder MC',
      vigencia: '2026-12-31',
      aprobador: 'Patrocinador',
      revision: '2026-06-30',
      debeResponder: 'Qué indicadores se monitorean, meta, frecuencia y responsable.'
    });

    return list;
  };

  useEffect(() => {
    if (phaseData.controlDocumental && phaseData.controlDocumental.length > 0) {
      setControlDocumental(phaseData.controlDocumental);
    } else {
      const initial = initializeControlDocumental(modo);
      setControlDocumental(initial);
      updateModoPhase(modo.id, 4, {
        data: {
          ...phaseData,
          controlDocumental: initial
        }
      });
    }
  }, [phaseData.controlDocumental, modo.id]);

  const toArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' && val ? val.split(',').map(s=>s.trim()) : []);

  const [mappingInputs, setMappingInputs] = useState({
    macroproceso: phaseData.toBeMapping?.macroproceso || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.macroproceso || '',
    procedimientos: toArray(phaseData.toBeMapping?.procedimientos || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.procedimientos),
    indicadores: toArray(phaseData.toBeMapping?.indicadores || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.indicadores),
    herramientas: toArray(phaseData.toBeMapping?.herramientas || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.herramientas),
    sistemas: toArray(phaseData.toBeMapping?.sistemas || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.sistemas),
    puestos: toArray(phaseData.toBeMapping?.puestos || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.puestos),
    externalLink: phaseData.toBeLink || ''
  });

  useEffect(() => {
    setMappingInputs({
      macroproceso: phaseData.toBeMapping?.macroproceso || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.macroproceso || '',
      procedimientos: toArray(phaseData.toBeMapping?.procedimientos || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.procedimientos),
      indicadores: toArray(phaseData.toBeMapping?.indicadores || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.indicadores),
      herramientas: toArray(phaseData.toBeMapping?.herramientas || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.herramientas),
      sistemas: toArray(phaseData.toBeMapping?.sistemas || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.sistemas),
      puestos: toArray(phaseData.toBeMapping?.puestos || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.puestos),
      externalLink: phaseData.toBeLink || ''
    });
  }, [phaseData.toBeMapping, modo.phases[asIsPhaseNum]?.data?.asIsMapping, phaseData.toBeLink]);

  const handleBlur = () => {
    if (isApproved || !canEdit) return;
    updateModoPhase(modo.id, 4, { 
      data: { 
        ...phaseData, 
        toBeMapping: {
          macroproceso: mappingInputs.macroproceso,
          procedimientos: mappingInputs.procedimientos,
          indicadores: mappingInputs.indicadores,
          herramientas: mappingInputs.herramientas,
          sistemas: mappingInputs.sistemas,
          puestos: mappingInputs.puestos
        },
        toBeLink: mappingInputs.externalLink
      } 
    });
  };

  const handleUpdateDocField = (id: string, field: string, value: string) => {
    if (isApproved || !canEdit) return;
    const updated = controlDocumental.map((d: any) => 
      d.id === id ? { ...d, [field]: value } : d
    );
    updateModoPhase(modo.id, 4, {
      data: {
        ...phaseData,
        controlDocumental: updated
      }
    });
  };

  const handleAddDocument = () => {
    if (isApproved || !canEdit) return;
    const newDoc = {
      id: `custom-${Date.now()}`,
      doc: 'Nuevo Documento',
      codigo: 'MC-GEN-01',
      version: '1.0',
      responsable: 'Líder MC',
      vigencia: '2026-12-31',
      aprobador: 'Dueño del proceso',
      revision: '2026-06-30',
      debeResponder: 'Propósito del documento'
    };
    updateModoPhase(modo.id, 4, {
      data: {
        ...phaseData,
        controlDocumental: [...controlDocumental, newDoc]
      }
    });
  };

  const handleRemoveDocument = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = controlDocumental.filter((d: any) => d.id !== id);
    updateModoPhase(modo.id, 4, {
      data: {
        ...phaseData,
        controlDocumental: updated
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApproved || !canEdit) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateModoPhase(modo.id, 4, { data: { ...phaseData, toBeImage: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!canEdit) return;
    setIsGenerating(true);
    try {
      const data = await generatePhaseData(4, { asis: modo.phases[asIsPhaseNum]?.data?.mermaidASIS }, {});
      const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
      
      const generatedInventario = data.inventarioPropuesto || {};
      const newToBeMapping = {
        macroproceso: phaseData.toBeMapping?.macroproceso || modo.phases[asIsPhaseNum]?.data?.asIsMapping?.macroproceso || '',
        procedimientos: toArray(generatedInventario.procesos).length > 0 ? toArray(generatedInventario.procesos) : toArray(modo.phases[asIsPhaseNum]?.data?.asIsMapping?.procedimientos),
        indicadores: toArray(generatedInventario.indicadores).length > 0 ? toArray(generatedInventario.indicadores) : toArray(modo.phases[asIsPhaseNum]?.data?.asIsMapping?.indicadores),
        herramientas: toArray(generatedInventario.herramientas).length > 0 ? toArray(generatedInventario.herramientas) : toArray(modo.phases[asIsPhaseNum]?.data?.asIsMapping?.herramientas),
        sistemas: toArray(generatedInventario.sistemas).length > 0 ? toArray(generatedInventario.sistemas) : toArray(modo.phases[asIsPhaseNum]?.data?.asIsMapping?.sistemas),
        puestos: toArray(generatedInventario.perfiles).length > 0 ? toArray(generatedInventario.perfiles) : toArray(modo.phases[asIsPhaseNum]?.data?.asIsMapping?.puestos),
      };

      const freshControl = initializeControlDocumental({
        ...modo,
        phases: {
          ...modo.phases,
          4: {
            ...modo.phases[4],
            data: {
              ...phaseData,
              toBeMapping: newToBeMapping
            }
          }
        }
      });

      updateModoPhase(modo.id, 4, { 
        data: {
          ...phaseData,
          ...data,
          toBeMapping: newToBeMapping,
          controlDocumental: freshControl
        }, 
        checklistOut: checklistObj, 
        status: 'En proceso' 
      });
    } catch (err: any) {} finally { setIsGenerating(false); }
  };

  const getDocStatus = (currentPhase: number, phases: any) => {
    if (phases[7]?.status === 'Aprobado') return { label: 'Controlado', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (phases[6]?.status === 'Aprobado') return { label: 'Liberado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (phases[5]?.status === 'Aprobado') return { label: 'Validado', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (phases[4]?.status === 'Aprobado') return { label: 'Diseñado', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'En diseño', color: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  const docStatus = getDocStatus(modo.currentPhase, modo.phases);

  const checklistManual = [
    "Diseñar el proceso futuro TO-BE con base en las brechas priorizadas.",
    "Eliminar actividades que no agregan valor.",
    "Definir roles y responsabilidades futuras.",
    "Establecer reglas básicas de operación.",
    "Diseñar estándares mínimos, listas de verificación y controles.",
    "Definir indicadores del nuevo modelo.",
    "Diseñar rutinas de seguimiento y escalación.",
    "Validar el diseño con usuarios clave y líderes del área.",
    "Ajustar el modelo antes de llevarlo a piloto."
  ];

  const erroresEvitar = [
    "Diseñar un modelo demasiado complejo.",
    "Agregar controles que nadie usará.",
    "No involucrar a quienes ejecutan el proceso.",
    "Confundir procedimiento largo con modelo operativo efectivo."
  ];

  return (
    <PhaseLayout
      modo={modo}
      phaseNumber={4}
      title={modo.projectType === 'Reingeniería' ? 'Diseño TO-BE' : 'Diseño MODO MVP'}
      dmaic="Improve"
      description={modo.projectType === 'Reingeniería' 
        ? 'Diseñar el modelo operativo optimizado (TO-BE) eliminando desperdicios y definiendo nuevos roles.'
        : 'Diseñar una versión mínima funcional (MVP) del modelo operativo futuro.'}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      error={null}
      checklistManual={checklistManual}
      erroresEvitar={erroresEvitar}
    >
      {/* Document Lifecycle & Control Documental Mínimo */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500">assignment_turned_in</span>
            Control Documental Mínimo y Ciclo de Vida
          </h4>
          {!isApproved && canEdit && (
            <button 
              onClick={handleAddDocument}
              className="bg-primary text-white text-[12px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/95 transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Añadir Documento
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 w-1/4">Documento</th>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Versión</th>
                <th className="px-6 py-3">Responsable</th>
                <th className="px-6 py-3">Aprobador</th>
                <th className="px-6 py-3">Vigencia / Próx Rev</th>
                <th className="px-6 py-3">Ciclo</th>
                {!isApproved && <th className="px-4 py-3 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="text-[13px] text-slate-700">
              {controlDocumental.map((d: any) => (
                <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                  <td className="px-6 py-3 font-semibold text-slate-800">
                    <div className="flex flex-col gap-1">
                      <input 
                        type="text" 
                        value={d.doc} 
                        onChange={e => handleUpdateDocField(d.id, 'doc', e.target.value)} 
                        disabled={isApproved || !canEdit}
                        className="w-full font-bold p-1 text-[13px] border border-slate-200 rounded outline-none bg-white focus:border-primary disabled:bg-transparent disabled:border-transparent disabled:p-0"
                      />
                      <input 
                        type="text" 
                        value={d.debeResponder} 
                        onChange={e => handleUpdateDocField(d.id, 'debeResponder', e.target.value)} 
                        disabled={isApproved || !canEdit}
                        placeholder="¿Qué debe responder este documento?"
                        className="w-full text-[10px] text-slate-400 p-1 border border-slate-150 rounded outline-none bg-white focus:border-primary disabled:bg-transparent disabled:border-transparent disabled:p-0"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={d.codigo} 
                      onChange={e => handleUpdateDocField(d.id, 'codigo', e.target.value)} 
                      disabled={isApproved || !canEdit}
                      className="w-full p-1.5 text-[12px] border border-slate-200 rounded outline-none bg-white focus:border-primary"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={d.version} 
                      onChange={e => handleUpdateDocField(d.id, 'version', e.target.value)} 
                      disabled={isApproved || !canEdit}
                      className="w-12 p-1.5 text-[12px] border border-slate-200 rounded text-center outline-none bg-white focus:border-primary"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={d.responsable} 
                      onChange={e => handleUpdateDocField(d.id, 'responsable', e.target.value)} 
                      disabled={isApproved || !canEdit}
                      className="w-full p-1.5 text-[12px] border border-slate-200 rounded outline-none bg-white focus:border-primary"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={d.aprobador} 
                      onChange={e => handleUpdateDocField(d.id, 'aprobador', e.target.value)} 
                      disabled={isApproved || !canEdit}
                      className="w-full p-1.5 text-[12px] border border-slate-200 rounded outline-none bg-white focus:border-primary"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <input 
                        type="date" 
                        value={d.vigencia} 
                        onChange={e => handleUpdateDocField(d.id, 'vigencia', e.target.value)} 
                        disabled={isApproved || !canEdit}
                        className="p-1 text-[11px] border border-slate-200 rounded outline-none bg-white"
                      />
                      <input 
                        type="date" 
                        value={d.revision} 
                        onChange={e => handleUpdateDocField(d.id, 'revision', e.target.value)} 
                        disabled={isApproved || !canEdit}
                        className="p-1 text-[11px] border border-slate-200 rounded outline-none bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold border whitespace-nowrap block text-center", docStatus.color)}>
                      {docStatus.label}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 block text-center leading-none">
                      (Fase {modo.currentPhase})
                    </span>
                  </td>
                  {!isApproved && canEdit && (
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => handleRemoveDocument(d.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Eliminar documento"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagrama TO-BE */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-slate-900">Diagrama TO-BE (BPMN / Swimlanes)</h3>
            <p className="text-[13px] text-slate-500 mt-1">Elige entre escribir código Mermaid o subir una imagen de tu diagrama.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setDiagramMode('image')}
              className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramMode === 'image' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Imagen / Enlace
            </button>
            <button 
              onClick={() => setDiagramMode('mermaid')}
              className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors", diagramMode === 'mermaid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Código Mermaid
            </button>
          </div>
        </div>

        {diagramMode === 'image' ? (
          <>
            <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 max-w-2xl flex-1">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">link</span>
                <input 
                  type="text" 
                  placeholder="Enlace externo a Lucidchart o draw.io (opcional)" 
                  className="flex-1 p-2 border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60"
                  value={mappingInputs.externalLink}
                  onChange={e => setMappingInputs(prev => ({ ...prev, externalLink: e.target.value }))}
                  onBlur={handleBlur}
                  disabled={isApproved || !canEdit}
                />
                {mappingInputs.externalLink && (
                  <a href={mappingInputs.externalLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-[13px] hover:underline whitespace-nowrap">
                    Abrir enlace
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3 justify-end">
                <label className={cn(
                  "cursor-pointer bg-white border border-slate-200 text-slate-700 font-bold text-[13px] px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-2 shadow-sm",
                  (isApproved || !canEdit) && "opacity-50 cursor-not-allowed pointer-events-none"
                )}>
                  <span className="material-symbols-outlined text-[18px]">upload</span> Subir Imagen
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isApproved || !canEdit} />
                </label>
                {phaseData.toBeImage && !isApproved && canEdit && (
                  <button onClick={() => updateModoPhase(modo.id, 4, { data: { ...phaseData, toBeImage: null } })} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center" title="Eliminar imagen">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>

            {phaseData.toBeImage ? (
              <div className="p-8 bg-slate-50 flex justify-center items-center">
                <img src={phaseData.toBeImage as string} alt="Diagrama TO-BE" className="max-w-full rounded-lg shadow-sm border border-slate-200" />
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 border-dashed bg-slate-50/50">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">image</span>
                <p className="text-[14px] font-medium">Aún no hay una imagen de diagrama cargada</p>
                <p className="text-[12px] mt-1 text-center max-w-md">Sube una imagen de tu diagrama TO-BE usando el botón de arriba o pega el enlace externo.</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-white flex flex-col gap-5">
            {phaseData.mermaidTOBE ? (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center min-h-[220px] overflow-auto">
                <MermaidChart chart={phaseData.mermaidTOBE} />
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 border border-slate-200 border-dashed bg-slate-50/50 rounded-xl">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">code</span>
                <p className="text-[14px] font-medium">No hay código Mermaid ingresado</p>
                <button 
                  onClick={() => {
                    updateModoPhase(modo.id, 4, { 
                      data: { 
                        ...phaseData, 
                        mermaidTOBE: 'graph TD\n    A[Inicio TO-BE] --> B[Paso Optimizado]\n    B --> C[Fin]' 
                      } 
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-[12px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={isApproved || !canEdit}
                >
                  Generar plantilla de inicio
                </button>
              </div>
            )}

            {phaseData.mermaidTOBE && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Código Mermaid (Editable)</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
                  rows={8}
                  value={phaseData.mermaidTOBE}
                  onChange={(e) => {
                    updateModoPhase(modo.id, 4, { 
                      data: { 
                        ...phaseData, 
                        mermaidTOBE: e.target.value 
                      } 
                    });
                  }}
                  disabled={isApproved || !canEdit}
                  placeholder="Escribe tu código Mermaid aquí..."
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mapeo y Vinculación del Proceso (TO-BE) */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm mt-8 p-8">
        <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">schema</span>
          Mapeo y Vinculación del Proceso (TO-BE)
        </h3>
        <p className="text-[13px] text-slate-500 mb-6 -mt-4">
          Diseña cómo va a quedar el proceso optimizado, especificando los roles, herramientas y sistemas futuros.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
            <label className="text-[13px] font-bold text-slate-600">Macroproceso Asociado (TO-BE)</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              value={mappingInputs.macroproceso}
              onChange={e => setMappingInputs(prev => ({ ...prev, macroproceso: e.target.value }))}
              onBlur={handleBlur}
              disabled={isApproved || !canEdit}
            >
              <option value="">-- Seleccionar Macroproceso --</option>
              {macroprocesos?.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
              <option value="Otro">Otro (No registrado)</option>
            </select>
          </div>
          
          <MultiTagInput 
            label="Procedimientos Optimistas Involucrados (TO-BE)"
            placeholder="Ej. Recepción Express, Diagnóstico Automatizado... (Presiona Enter)"
            tags={mappingInputs.procedimientos}
            onChange={tags => setMappingInputs(prev => ({ ...prev, procedimientos: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Puestos / Roles Propuestos (TO-BE)"
            placeholder="Ej. Técnico Especialista, Asesor Digital... (Presiona Enter)"
            tags={mappingInputs.puestos}
            onChange={tags => setMappingInputs(prev => ({ ...prev, puestos: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Indicadores de Eficiencia (TO-BE)"
            placeholder="Ej. Tiempo de ciclo reducido, Tasa de Reclamos... (Presiona Enter)"
            tags={mappingInputs.indicadores}
            onChange={tags => setMappingInputs(prev => ({ ...prev, indicadores: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Herramientas Tecnológicas / Físicas (TO-BE)"
            placeholder="Ej. Scanner OBD2 Inalámbrico... (Presiona Enter)"
            tags={mappingInputs.herramientas}
            onChange={tags => setMappingInputs(prev => ({ ...prev, herramientas: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />

          <MultiTagInput 
            label="Sistemas Informáticos Futuros (TO-BE)"
            placeholder="Ej. Nuevo Módulo de Citas, Portal Operador... (Presiona Enter)"
            tags={mappingInputs.sistemas}
            onChange={tags => setMappingInputs(prev => ({ ...prev, sistemas: tags }))}
            onBlur={handleBlur}
            disabled={isApproved || !canEdit}
          />
        </div>
      </div>

      {phaseData.matrizRACI && (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[18px] font-bold text-slate-900">Matriz RACI</h3>
            <p className="text-[13px] text-slate-500 mt-1">Asignación de responsabilidades para el nuevo modelo.</p>
          </div>
          <div className="p-6 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 pr-2">Actividad</th>
                  <th className="py-3 px-2 text-center">Sponsor</th>
                  <th className="py-3 px-2 text-center">Owner</th>
                  <th className="py-3 px-2 text-center">Operación</th>
                </tr>
              </thead>
              <tbody className="text-[14px] text-slate-700">
                {phaseData.matrizRACI?.map((r: any, i: number) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-2 font-medium text-slate-900">{r.actividad}</td>
                    <td className="py-3 px-2 text-center"><span className="inline-flex w-7 h-7 items-center justify-center bg-slate-100 text-slate-600 rounded-full font-bold text-[12px]">{r.sponsor || '-'}</span></td>
                    <td className="py-3 px-2 text-center"><span className="inline-flex w-7 h-7 items-center justify-center bg-primary/10 text-primary rounded-full font-bold text-[12px]">{r.dueñoProceso || '-'}</span></td>
                    <td className="py-3 px-2 text-center"><span className="inline-flex w-7 h-7 items-center justify-center bg-indigo-50 text-indigo-600 rounded-full font-bold text-[12px]">{r.operación || '-'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {phaseData.inventarioPropuesto && (
        <div className="mt-8">
          <EditableInventory 
            title="Inventario Propuesto (TO-BE)" 
            subtitle="Documentos, roles y sistemas requeridos para el nuevo modelo."
            data={phaseData.inventarioPropuesto} 
            onChange={(newData) => updateModoPhase(modo.id, 4, { data: { ...phaseData, inventarioPropuesto: newData } })} 
          />
        </div>
      )}

      <GestorPropuestas modoId={modo.id} phaseName="Diseño" />
    </PhaseLayout>
  );
};

// --- Phase Methodology Info Component ---
interface MethodologyInfoProps {
  propósito: string;
  comoTrabajar: string[];
  herramientas: string[];
  entregables: string[];
  responsables: { rol: string; participacion: string }[];
}

const PhaseMethodologyInfo: React.FC<MethodologyInfoProps> = ({
  propósito, comoTrabajar, herramientas, entregables, responsables
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Propósito Práctico & Agile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-slate-500">info</span>
            Propósito Práctico
          </h4>
          <p className="text-[14px] text-slate-700 leading-relaxed">{propósito}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-slate-500">directions_run</span>
            Trabajo Ágil
          </h4>
          <ul className="list-disc pl-5 text-[13px] text-slate-700 space-y-1.5 leading-relaxed">
            {comoTrabajar.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      </div>

      {/* Herramientas & Entregables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[13px] font-bold text-slate-950 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">build</span>
            Herramientas Sugeridas
          </h4>
          <ul className="flex flex-col gap-2">
            {herramientas.map((h, i) => (
              <li key={i} className="text-[13px] text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[13px] font-bold text-slate-950 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-[20px]">inventory_2</span>
            Entregables Mínimos
          </h4>
          <ul className="flex flex-col gap-2">
            {entregables.map((e, i) => (
              <li key={i} className="text-[13px] text-slate-600 bg-emerald-50/30 border border-emerald-100/50 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Responsables */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
          <h4 className="text-[13px] font-bold text-slate-950 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500 text-[20px]">groups</span>
            Responsables sugeridos
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Participación en la etapa</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-slate-700">
              {responsables.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-3 font-semibold text-slate-900">{r.rol}</td>
                  <td className="px-6 py-3">{r.participacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Phase 5: Ejecución Piloto ---
export const Phase5: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[5]?.data || {};
  const isApproved = modo.phases[5]?.status === 'Aprobado';
  
  const [newBlockage, setNewBlockage] = useState('');
  const [newBlockageResp, setNewBlockageResp] = useState('');
  const [newAdjustmentElem, setNewAdjustmentElem] = useState('');
  const [newAdjustmentDesc, setNewAdjustmentDesc] = useState('');

  const blockages = phaseData.blockages || [
    { id: '1', descripcion: 'Falta de capacitación en el equipo operativo piloto.', responsable: 'Líder MC', estatus: 'Abierto' },
    { id: '2', descripcion: 'El formato de control inicial es demasiado complejo.', responsable: 'Dueño del proceso', estatus: 'Abierto' }
  ];

  const adjustments = phaseData.ajustes || [
    { id: '1', elemento: 'Formato de Registro de Entradas', cambio: 'Simplificar a 3 campos obligatorios en lugar de 8' },
    { id: '2', elemento: 'Perfil de Puesto Operador', cambio: 'Aclarar la responsabilidad sobre el cierre de folios' }
  ];

  const handleAddBlockage = () => {
    if (!newBlockage.trim() || !canEdit) return;
    const item = {
      id: `bl${Date.now()}`,
      descripcion: newBlockage.trim(),
      responsable: newBlockageResp.trim() || 'Sin asignar',
      estatus: 'Abierto'
    };
    updateModoPhase(modo.id, 5, {
      data: {
        ...phaseData,
        blockages: [...blockages, item],
        ajustes: adjustments
      }
    });
    setNewBlockage('');
    setNewBlockageResp('');
  };

  const handleToggleBlockage = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = blockages.map((b: any) => 
      b.id === id ? { ...b, estatus: b.estatus === 'Abierto' ? 'Resuelto' : 'Abierto' } : b
    );
    updateModoPhase(modo.id, 5, {
      data: {
        ...phaseData,
        blockages: updated,
        ajustes: adjustments
      }
    });
  };

  const handleAddAdjustment = () => {
    if (!newAdjustmentElem.trim() || !newAdjustmentDesc.trim() || !canEdit) return;
    const item = {
      id: `adj${Date.now()}`,
      elemento: newAdjustmentElem.trim(),
      cambio: newAdjustmentDesc.trim()
    };
    updateModoPhase(modo.id, 5, {
      data: {
        ...phaseData,
        ajustes: [...adjustments, item],
        blockages: blockages
      }
    });
    setNewAdjustmentElem('');
    setNewAdjustmentDesc('');
  };

  const handleRemoveAdjustment = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = adjustments.filter((a: any) => a.id !== id);
    updateModoPhase(modo.id, 5, {
      data: {
        ...phaseData,
        ajustes: updated,
        blockages: blockages
      }
    });
  };

  const handleGenerate = async () => {
    if (!canEdit) return;
    setIsGenerating(true);
    const data = await generatePhaseData(5, {}, {});
    const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
    updateModoPhase(modo.id, 5, { 
      data: {
        ...phaseData,
        ...data,
        blockages,
        ajustes: adjustments
      }, 
      checklistOut: checklistObj, 
      status: 'En proceso' 
    });
    setIsGenerating(false);
  };

  const isReeng = modo.projectType === 'Reingeniería';

  const checklistManual = isReeng ? [
    "Iniciar la ejecución del plan de trabajo en ciclos semanales (Sprints).",
    "Realizar reuniones diarias de pie (Daily Standups) de 15 min.",
    "Actualizar el tablero Kanban del proyecto.",
    "Registrar y escalar bloqueos en el tablero correspondiente.",
    "Probar procedimientos en campo y documentar ajustes necesarios.",
    "Asegurar entregables y evidencias para cada tarea completada."
  ] : [
    "Seleccionar el área, equipo, proceso o muestra piloto.",
    "Comunicar el propósito y alcance del piloto.",
    "Capacitar de forma práctica al equipo piloto.",
    "Ejecutar el nuevo flujo operativo.",
    "Acompañar la operación y resolver bloqueos rápidamente.",
    "Medir indicadores durante el piloto.",
    "Recolectar retroalimentación del equipo.",
    "Identificar ajustes necesarios al proceso, roles o controles.",
    "Actualizar el MODO con base en evidencia."
  ];

  const erroresEvitar = isReeng ? [
    "Dejar de hacer las Daily Standups por considerarlas repetitivas.",
    "No documentar los ajustes que se le hacen a los formatos en caliente.",
    "Tener tareas en curso por más de dos semanas sin dividir su alcance."
  ] : [
    "Lanzar el piloto sin capacitación.",
    "Probar en un alcance demasiado grande.",
    "No medir resultados durante el piloto.",
    "Ignorar la retroalimentación del equipo operativo."
  ];

  const title = isReeng ? "Ejecución Agile" : "Ejecución Piloto";
  const dmaic = isReeng ? "Improve" : "Improve / Control";
  const description = isReeng
    ? "Implementar soluciones mediante sprints cortos, gestionando activamente bloqueos y haciendo ajustes en tiempo real."
    : "Probar el MODO en un ambiente de piloto controlado.";

  return (
    <PhaseLayout
      modo={modo}
      phaseNumber={5}
      title={title}
      dmaic={dmaic}
      description={description}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      error={null}
      checklistManual={checklistManual}
      erroresEvitar={erroresEvitar}
    >
      {/* Interactive Pilot Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blockages board */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">grid_view</span>
            Tablero de Bloqueos (Piloto)
          </h4>
          <p className="text-[12px] text-slate-500 mb-4">Registra incidencias, dudas o bloqueos detectados por el equipo durante el piloto.</p>

          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Descripción del bloqueo..." 
              value={newBlockage} 
              onChange={e => setNewBlockage(e.target.value)} 
              disabled={isApproved || !canEdit}
              className="flex-1 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
            />
            <input 
              type="text" 
              placeholder="Responsable" 
              value={newBlockageResp} 
              onChange={e => setNewBlockageResp(e.target.value)} 
              disabled={isApproved || !canEdit}
              className="w-28 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
            />
            <button 
              onClick={handleAddBlockage}
              disabled={isApproved || !canEdit || !newBlockage.trim()}
              className="bg-slate-900 text-white font-bold text-[12px] px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Registrar
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-60 pr-1">
            {blockages.map((b: any) => (
              <div key={b.id} className={cn("p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors", b.estatus === 'Resuelto' ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-white border-slate-200 text-slate-700")}>
                <div className="flex flex-col">
                  <span className={cn("text-[13px] font-medium leading-snug", b.estatus === 'Resuelto' && "line-through")}>{b.descripcion}</span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Resp: {b.responsable}</span>
                </div>
                <button 
                  onClick={() => handleToggleBlockage(b.id)} 
                  disabled={isApproved || !canEdit}
                  className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors disabled:opacity-75", b.estatus === 'Resuelto' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200")}
                >
                  {b.estatus}
                </button>
              </div>
            ))}
            {blockages.length === 0 && <p className="text-[12px] text-slate-400 italic text-center py-4">Sin bloqueos registrados.</p>}
          </div>
        </div>

        {/* Adjustments board */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">edit_note</span>
            Ajustes al MODO (Evidencia)
          </h4>
          <p className="text-[12px] text-slate-500 mb-4">Ajustes concretos requeridos en base a la experiencia del piloto.</p>

          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Elemento (Ej. Formato X)" 
              value={newAdjustmentElem} 
              onChange={e => setNewAdjustmentElem(e.target.value)} 
              disabled={isApproved || !canEdit}
              className="w-1/3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
            />
            <input 
              type="text" 
              placeholder="Ajuste / Cambio requerido" 
              value={newAdjustmentDesc} 
              onChange={e => setNewAdjustmentDesc(e.target.value)} 
              disabled={isApproved || !canEdit}
              className="flex-1 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
            />
            <button 
              onClick={handleAddAdjustment}
              disabled={isApproved || !canEdit || !newAdjustmentElem.trim() || !newAdjustmentDesc.trim()}
              className="bg-slate-900 text-white font-bold text-[12px] px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Añadir
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-60 pr-1">
            {adjustments.map((a: any) => (
              <div key={a.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start justify-between gap-3 text-slate-700">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-900">{a.elemento}</span>
                  <span className="text-[12px] text-slate-600 mt-0.5 leading-snug">{a.cambio}</span>
                </div>
                {!isApproved && canEdit && (
                  <button 
                    onClick={() => handleRemoveAdjustment(a.id)} 
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            ))}
            {adjustments.length === 0 && <p className="text-[12px] text-slate-400 italic text-center py-4">Sin ajustes registrados.</p>}
          </div>
        </div>
      </div>
    </PhaseLayout>
  );
};

// --- Phase 6: Implementación Formal ---
export const Phase6: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[6]?.data || {};
  const isApproved = modo.phases[6]?.status === 'Aprobado';

  const [newIncident, setNewIncident] = useState('');
  const [newIncidentImpact, setNewIncidentImpact] = useState<'Alto' | 'Medio' | 'Bajo'>('Medio');
  const [newIncidentResp, setNewIncidentResp] = useState('');
  const [newIncidentSol, setNewIncidentSol] = useState('');

  const [newKaizenAccion, setNewKaizenAccion] = useState('');
  const [newKaizenResp, setNewKaizenResp] = useState('');
  const [newKaizenFecha, setNewKaizenFecha] = useState('');
  const [newKaizenEstado, setNewKaizenEstado] = useState<'Por hacer' | 'En curso' | 'Listo'>('Por hacer');

  const DEFAULT_KOTTER_STEPS = [
    { id: '1', step: 'Crear sentido de urgencia', checked: false, nota: '' },
    { id: '2', step: 'Formar una coalición potente', checked: false, nota: '' },
    { id: '3', step: 'Crear una visión para el cambio', checked: false, nota: '' },
    { id: '4', step: 'Comunicar la visión', checked: false, nota: '' },
    { id: '5', step: 'Eliminar los obstáculos', checked: false, nota: '' },
    { id: '6', step: 'Asegurar triunfos a corto plazo', checked: false, nota: '' },
    { id: '7', step: 'Construir sobre el camino andado', checked: false, nota: '' },
    { id: '8', step: 'Anclar el cambio en la cultura', checked: false, nota: '' }
  ];

  const kotterSteps = phaseData.kotterSteps || DEFAULT_KOTTER_STEPS;
  const accionesKaizen = phaseData.accionesKaizen || [];

  const handleToggleKotterStep = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = kotterSteps.map((s: any) => 
      s.id === id ? { ...s, checked: !s.checked } : s
    );
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        kotterSteps: updated
      }
    });
  };

  const handleKotterNoteBlur = (id: string, note: string) => {
    if (isApproved || !canEdit) return;
    const updated = kotterSteps.map((s: any) => 
      s.id === id ? { ...s, nota: note } : s
    );
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        kotterSteps: updated
      }
    });
  };

  const handleAddKaizenAction = () => {
    if (!newKaizenAccion.trim() || !canEdit) return;
    const item = {
      id: `kz${Date.now()}`,
      accion: newKaizenAccion.trim(),
      responsable: newKaizenResp.trim() || 'Sin asignar',
      fecha: newKaizenFecha || new Date().toISOString().split('T')[0],
      estado: newKaizenEstado
    };
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        accionesKaizen: [...accionesKaizen, item]
      }
    });
    setNewKaizenAccion('');
    setNewKaizenResp('');
    setNewKaizenFecha('');
  };

  const handleRemoveKaizenAction = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = accionesKaizen.filter((a: any) => a.id !== id);
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        accionesKaizen: updated
      }
    });
  };

  const handleUpdateKaizenStatus = (id: string, status: any) => {
    if (isApproved || !canEdit) return;
    const updated = accionesKaizen.map((a: any) => 
      a.id === id ? { ...a, estado: status } : a
    );
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        accionesKaizen: updated
      }
    });
  };

  const [raciData, setRaciData] = useState<Record<string, string[]>>(() => phaseData.raci || {
    'Capacitación operativa': ['Líder MC', 'Dueño del proceso'],
    'Liberación de formatos y controles': ['Líder MC'],
    'Operación diaria del nuevo flujo': ['Equipo operativo'],
    'Monitoreo semanal de KPIs': ['Dueño del proceso', 'Líder MC'],
    'Auditoría y soporte en campo': ['Líder MC', 'Jefaturas']
  });

  const incidents = phaseData.incidencias || [
    { id: '1', descripcion: 'El personal de la tarde no recibió capacitación presencial.', impacto: 'Medio', responsable: 'Jefaturas', solucion: 'Programar sesión corta complementaria', estatus: 'Abierto' },
    { id: '2', descripcion: 'Desfase en la visualización del tablero en la sucursal.', impacto: 'Alto', responsable: 'Líder MC', solucion: 'Actualizar ligas de acceso y compartir de nuevo', estatus: 'Cerrado' }
  ];

  const handleAddIncident = () => {
    if (!newIncident.trim() || !canEdit) return;
    const item = {
      id: `inc${Date.now()}`,
      descripcion: newIncident.trim(),
      impacto: newIncidentImpact,
      responsable: newIncidentResp.trim() || 'Sin asignar',
      solucion: newIncidentSol.trim() || 'Por definir',
      estatus: 'Abierto'
    };
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        incidencias: [...incidents, item],
        raci: raciData
      }
    });
    setNewIncident('');
    setNewIncidentResp('');
    setNewIncidentSol('');
  };

  const handleToggleIncident = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = incidents.map((i: any) => 
      i.id === id ? { ...i, estatus: i.estatus === 'Abierto' ? 'Cerrado' : 'Abierto' } : i
    );
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        incidencias: updated,
        raci: raciData
      }
    });
  };

  const handleSaveRaci = (activity: string, teamRoles: string[]) => {
    if (isApproved || !canEdit) return;
    const newRaci = { ...raciData, [activity]: teamRoles };
    setRaciData(newRaci);
    updateModoPhase(modo.id, 6, {
      data: {
        ...phaseData,
        raci: newRaci,
        incidencias: incidents
      }
    });
  };

  const handleGenerate = async () => {
    if (!canEdit) return;
    setIsGenerating(true);
    const data = await generatePhaseData(6, {}, {});
    const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
    updateModoPhase(modo.id, 6, { 
      data: {
        ...phaseData,
        ...data,
        incidencias: incidents,
        raci: raciData,
        kotterSteps: phaseData.kotterSteps || DEFAULT_KOTTER_STEPS,
        accionesKaizen: phaseData.accionesKaizen || []
      }, 
      checklistOut: checklistObj, 
      status: 'En proceso' 
    });
    setIsGenerating(false);
  };

  const isReeng = modo.projectType === 'Reingeniería';

  const checklistManual = isReeng ? [
    "Establecer la coalición conductora y comunicar la visión de cambio.",
    "Evaluar y checklistear los 8 pasos de Kotter.",
    "Organizar y documentar Talleres Kaizen de 1 día para resolver fricciones.",
    "Consolidar mejoras y producir más cambios vinculados al nuevo diseño."
  ] : [
    "Comunicar la implementación oficial del MODO.",
    "Capacitar a todos los involucrados.",
    "Liberar procedimiento, formatos, controles y tablero de indicadores.",
    "Implementar el nuevo flujo operativo.",
    "Dar acompañamiento durante las primeras semanas.",
    "Monitorear cumplimiento del nuevo estándar.",
    "Medir indicadores de desempeño.",
    "Corregir desviaciones y resolver bloqueos.",
    "Formalizar responsables del seguimiento operativo."
  ];

  const erroresEvitar = isReeng ? [
    "Declarar victoria prematuramente con los primeros éxitos rápidos.",
    "No involucrar a los líderes informales en la coalición del cambio.",
    "Hacer talleres Kaizen teóricos sin meter las manos a la masa."
  ] : [
    "Implementar sin comunicación formal.",
    "Soltar el modelo sin acompañamiento.",
    "Capacitar solo con documentos y no con práctica.",
    "No revisar cumplimiento durante las primeras semanas."
  ];

  return (
    <PhaseLayout
      modo={modo}
      phaseNumber={6}
      title={isReeng ? "Gestión del Cambio y Kaizen" : "Implementación Formal"}
      dmaic="Improve / Control"
      description={isReeng ? "Asegurar la adopción del nuevo modelo mediante el plan de 8 pasos de Kotter y talleres rápidos de mejora (Kaizen)." : "Llevar el MODO corregido al alcance completo definido, asegurando adopción y control."}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      error={null}
      checklistManual={checklistManual}
      erroresEvitar={erroresEvitar}
    >
      {isReeng ? (
        <div className="space-y-8">
          {/* Kotter's 8 Steps */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
            <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">sync_alt</span>
              Plan de Gestión del Cambio (Los 8 Pasos de Kotter)
            </h4>
            <p className="text-[12px] text-slate-500 mb-4">
              Monitorea las acciones para asegurar que la reingeniería sea adoptada por toda la organización de forma sostenible.
            </p>

            <div className="space-y-4">
              {kotterSteps.map((step: any) => (
                <div key={step.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <input 
                      type="checkbox" 
                      checked={step.checked} 
                      disabled={isApproved || !canEdit}
                      onChange={() => handleToggleKotterStep(step.id)}
                      className="rounded text-primary h-4.5 w-4.5 mt-0.5 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <h5 className="text-[13px] font-bold text-slate-800">{step.step}</h5>
                      <input 
                        type="text"
                        placeholder="Registra notas o evidencia sobre esta etapa..."
                        value={step.nota || ''}
                        disabled={isApproved || !canEdit}
                        onChange={(e) => {
                          const updated = kotterSteps.map((s: any) => s.id === step.id ? { ...s, nota: e.target.value } : s);
                          updateModoPhase(modo.id, 6, { data: { ...phaseData, kotterSteps: updated } });
                        }}
                        onBlur={(e) => handleKotterNoteBlur(step.id, e.target.value)}
                        className="w-full mt-1.5 p-2 border border-slate-200 rounded-lg text-[12px] bg-slate-50/30 outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 text-center w-24",
                    step.checked ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"
                  )}>
                    {step.checked ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones Kaizen (Taller de 1 día) */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
            <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">flash_on</span>
              Acciones Kaizen (Talleres rápidos de 1 día)
            </h4>
            <p className="text-[12px] text-slate-500 mb-4">
              Registra mejoras puntuales y soluciones de choque de un día para resolver problemas del nuevo proceso.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
              <input 
                type="text" 
                placeholder="Acción de mejora rápida..." 
                value={newKaizenAccion} 
                onChange={e => setNewKaizenAccion(e.target.value)} 
                disabled={isApproved || !canEdit}
                className="col-span-12 md:col-span-5 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
              />
              <input 
                type="text" 
                placeholder="Responsable" 
                value={newKaizenResp} 
                onChange={e => setNewKaizenResp(e.target.value)} 
                disabled={isApproved || !canEdit}
                className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
              />
              <input 
                type="date" 
                value={newKaizenFecha} 
                onChange={e => setNewKaizenFecha(e.target.value)} 
                disabled={isApproved || !canEdit}
                className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none text-slate-600 disabled:opacity-50"
              />
              <select 
                value={newKaizenEstado} 
                onChange={e => setNewKaizenEstado(e.target.value as any)}
                disabled={isApproved || !canEdit}
                className="col-span-12 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none bg-white disabled:opacity-50"
              >
                <option value="Por hacer">Por hacer</option>
                <option value="En curso">En curso</option>
                <option value="Listo">Listo</option>
              </select>
              <button 
                onClick={handleAddKaizenAction}
                disabled={isApproved || !canEdit || !newKaizenAccion.trim()}
                className="col-span-12 md:col-span-1 bg-slate-900 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {accionesKaizen.map((act: any) => (
                <div key={act.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                  <div className="flex-1">
                    <h5 className="text-[13px] font-bold text-slate-800">{act.accion}</h5>
                    <div className="flex gap-4 text-[11px] text-slate-500 mt-1">
                      <span><strong>Responsable:</strong> {act.responsable}</span>
                      <span><strong>Fecha:</strong> {act.fecha}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={act.estado} 
                      onChange={e => handleUpdateKaizenStatus(act.id, e.target.value)}
                      disabled={isApproved || !canEdit}
                      className={cn("px-2.5 py-1.5 rounded-lg text-[12px] font-bold border outline-none bg-white disabled:opacity-50",
                        act.estado === 'Listo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        act.estado === 'En curso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      )}
                    >
                      <option value="Por hacer">Por hacer</option>
                      <option value="En curso">En curso</option>
                      <option value="Listo">Listo</option>
                    </select>
                    {!isApproved && canEdit && (
                      <button onClick={() => handleRemoveKaizenAction(act.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {accionesKaizen.length === 0 && <p className="text-[12px] text-slate-400 italic text-center py-4">Sin acciones Kaizen registradas.</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* RACI Matrix */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
              <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600">checklist</span>
                Matriz de Responsabilidad Final
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3 w-1/3">Actividad / Responsabilidad</th>
                    <th className="px-6 py-3">Dueño Proceso</th>
                    <th className="px-6 py-3">Líder MC</th>
                    <th className="px-6 py-3">Jefaturas</th>
                    <th className="px-6 py-3">Equipo Operativo</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-slate-700">
                  {Object.keys(raciData).map((act, i) => {
                    const roles = raciData[act] || [];
                    const checkRole = (roleName: string) => {
                      if (isApproved || !canEdit) return;
                      const hasRole = roles.includes(roleName);
                      const newRoles = hasRole ? roles.filter(r => r !== roleName) : [...roles, roleName];
                      handleSaveRaci(act, newRoles);
                    };
                    return (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                        <td className="px-6 py-3 font-semibold text-slate-800">{act}</td>
                        <td className="px-6 py-3">
                          <input type="checkbox" checked={roles.includes('Dueño del proceso')} onChange={() => checkRole('Dueño del proceso')} disabled={isApproved || !canEdit} className="rounded text-primary h-4 w-4 disabled:opacity-50" />
                        </td>
                        <td className="px-6 py-3">
                          <input type="checkbox" checked={roles.includes('Líder MC')} onChange={() => checkRole('Líder MC')} disabled={isApproved || !canEdit} className="rounded text-primary h-4 w-4 disabled:opacity-50" />
                        </td>
                        <td className="px-6 py-3">
                          <input type="checkbox" checked={roles.includes('Jefaturas')} onChange={() => checkRole('Jefaturas')} disabled={isApproved || !canEdit} className="rounded text-primary h-4 w-4 disabled:opacity-50" />
                        </td>
                        <td className="px-6 py-3">
                          <input type="checkbox" checked={roles.includes('Equipo operativo')} onChange={() => checkRole('Equipo operativo')} disabled={isApproved || !canEdit} className="rounded text-primary h-4 w-4 disabled:opacity-50" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incidencias Board */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col mt-8">
            <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">report_problem</span>
              Registro de Incidencias de Arranque
            </h4>
            <p className="text-[12px] text-slate-500 mb-4">Captura desviaciones o incidencias en las primeras semanas de arranque y su plan de solución rápido.</p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
              <input 
                type="text" 
                placeholder="Describir incidencia..." 
                value={newIncident} 
                onChange={e => setNewIncident(e.target.value)} 
                disabled={isApproved || !canEdit}
                className="col-span-12 md:col-span-4 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
              />
              <input 
                type="text" 
                placeholder="Responsable" 
                value={newIncidentResp} 
                onChange={e => setNewIncidentResp(e.target.value)} 
                disabled={isApproved || !canEdit}
                className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
              />
              <input 
                type="text" 
                placeholder="Solución rápida" 
                value={newIncidentSol} 
                onChange={e => setNewIncidentSol(e.target.value)} 
                disabled={isApproved || !canEdit}
                className="col-span-12 md:col-span-3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
              />
              <select 
                value={newIncidentImpact} 
                onChange={e => setNewIncidentImpact(e.target.value as 'Alto' | 'Medio' | 'Bajo')}
                disabled={isApproved || !canEdit}
                className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none bg-white disabled:opacity-50"
              >
                <option value="Bajo">Impacto Bajo</option>
                <option value="Medio">Impacto Medio</option>
                <option value="Alto">Impacto Alto</option>
              </select>
              <button 
                onClick={handleAddIncident}
                disabled={isApproved || !canEdit || !newIncident.trim()}
                className="col-span-12 md:col-span-1 bg-slate-900 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {incidents.map((inc: any) => (
                <div key={inc.id} className={cn("p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors bg-white", inc.estatus === 'Cerrado' ? "bg-slate-50 border-slate-100 opacity-60" : "border-slate-200")}>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", inc.impacto === 'Alto' ? "bg-red-100 text-red-700" : inc.impacto === 'Medio' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700")}>
                        {inc.impacto}
                      </span>
                      <span className="text-[13px] font-bold text-slate-900">{inc.descripcion}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-1">
                      <span><strong>Acción:</strong> {inc.solucion}</span>
                      <span><strong>Responsable:</strong> {inc.responsable}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleIncident(inc.id)} 
                    disabled={isApproved || !canEdit}
                    className={cn("px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-colors self-start md:self-auto disabled:opacity-75", inc.estatus === 'Cerrado' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200")}
                  >
                    {inc.estatus === 'Cerrado' ? 'Cerrada' : 'Abierta'}
                  </button>
                </div>
              ))}
              {incidents.length === 0 && <p className="text-[12px] text-slate-400 italic text-center py-4">Sin incidencias registradas.</p>}
            </div>
          </div>
        </div>
      )}
    </PhaseLayout>
  );
};

// --- Phase 7: Cierre y Control ---
export const Phase7: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { updateModoPhase, currentUser } = useAppStore();
  const canEdit = ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(currentUser?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const phaseData = modo.phases[7]?.data || {};
  const isApproved = modo.phases[7]?.status === 'Aprobado';

  // Interactive states
  const [newKpiName, setNewKpiName] = useState('');
  const [newKpiBase, setNewKpiBase] = useState('');
  const [newKpiTarget, setNewKpiTarget] = useState('');
  const [newKpiReal, setNewKpiReal] = useState('');
  const [newKpiStatus, setNewKpiStatus] = useState<'Éxito' | 'En Riesgo' | 'Atrasado'>('Éxito');

  const [newControlKpi, setNewControlKpi] = useState('');
  const [newControlMeta, setNewControlMeta] = useState('');
  const [newControlResp, setNewControlResp] = useState('');

  const [newLesson, setNewLesson] = useState('');
  const [newBacklog, setNewBacklog] = useState('');

  // Default values or store values
  const kpisComparativa = phaseData.kpisComparativa || [
    { id: '1', kpi: 'Tiempo de Surtido (Min)', lineaBase: '45 min', meta: '15 min', real: '14 min', estado: 'Éxito' }
  ];

  const controlPoints = phaseData.tableroControl || [
    { id: '1', kpi: 'Auditoría semanal de llenado de formatos', meta: 'Semanal', responsable: 'Dueño del proceso' }
  ];

  const leccionesAprendidas = phaseData.leccionesAprendidas || [
    'Involucrar a TI desde el día 1 para evitar retrasos de accesos.',
    'La capacitación práctica en piso es 10 veces más efectiva que enviar el PDF.'
  ];

  const backlogMejoras = phaseData.backlog || [
    'Integración automatizada con el sistema ERP.',
    'Módulo móvil para firmas y aprobaciones rápidas.'
  ];

  const handleAddKpiComp = () => {
    if (!newKpiName.trim() || !canEdit) return;
    const item = {
      id: `kp${Date.now()}`,
      kpi: newKpiName.trim(),
      lineaBase: newKpiBase.trim() || 'N/A',
      meta: newKpiTarget.trim() || 'N/A',
      real: newKpiReal.trim() || 'Por medir',
      estado: newKpiStatus
    };
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        kpisComparativa: [...kpisComparativa, item],
        tableroControl: controlPoints,
        leccionesAprendidas,
        backlog: backlogMejoras
      }
    });
    setNewKpiName('');
    setNewKpiBase('');
    setNewKpiTarget('');
    setNewKpiReal('');
  };

  const handleRemoveKpiComp = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = kpisComparativa.filter((k: any) => k.id !== id);
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        kpisComparativa: updated,
        tableroControl: controlPoints,
        leccionesAprendidas,
        backlog: backlogMejoras
      }
    });
  };

  const handleAddControl = () => {
    if (!newControlKpi.trim() || !canEdit) return;
    const item = {
      id: `ct${Date.now()}`,
      kpi: newControlKpi.trim(),
      meta: newControlMeta.trim() || 'N/A',
      responsable: newControlResp.trim() || 'Sin asignar'
    };
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        tableroControl: [...controlPoints, item],
        kpisComparativa,
        leccionesAprendidas,
        backlog: backlogMejoras
      }
    });
    setNewControlKpi('');
    setNewControlMeta('');
    setNewControlResp('');
  };

  const handleRemoveControl = (id: string) => {
    if (isApproved || !canEdit) return;
    const updated = controlPoints.filter((c: any) => c.id !== id);
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        tableroControl: updated,
        kpisComparativa,
        leccionesAprendidas,
        backlog: backlogMejoras
      }
    });
  };

  const handleAddLesson = () => {
    if (!newLesson.trim() || !canEdit) return;
    const updated = [...leccionesAprendidas, newLesson.trim()];
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        leccionesAprendidas: updated,
        kpisComparativa,
        tableroControl: controlPoints,
        backlog: backlogMejoras
      }
    });
    setNewLesson('');
  };

  const handleRemoveLesson = (idx: number) => {
    if (isApproved || !canEdit) return;
    const updated = leccionesAprendidas.filter((_: any, i: number) => i !== idx);
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        leccionesAprendidas: updated,
        kpisComparativa,
        tableroControl: controlPoints,
        backlog: backlogMejoras
      }
    });
  };

  const handleAddBacklog = () => {
    if (!newBacklog.trim() || !canEdit) return;
    const updated = [...backlogMejoras, newBacklog.trim()];
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        backlog: updated,
        kpisComparativa,
        tableroControl: controlPoints,
        leccionesAprendidas
      }
    });
    setNewBacklog('');
  };

  const handleRemoveBacklog = (idx: number) => {
    if (isApproved || !canEdit) return;
    const updated = backlogMejoras.filter((_: any, i: number) => i !== idx);
    updateModoPhase(modo.id, 7, {
      data: {
        ...phaseData,
        backlog: updated,
        kpisComparativa,
        tableroControl: controlPoints,
        leccionesAprendidas
      }
    });
  };

  const handleGenerate = async () => {
    if (!canEdit) return;
    setIsGenerating(true);
    try {
      const data = await generatePhaseData(7, {}, {});
      const checklistObj = data.checklistOut.reduce((acc: any, item: string) => ({ ...acc, [item]: false }), {});
      updateModoPhase(modo.id, 7, { 
        data: {
          ...phaseData,
          ...data,
          kpisComparativa,
          tableroControl: controlPoints,
          leccionesAprendidas,
          backlog: backlogMejoras
        }, 
        checklistOut: checklistObj, 
        status: 'En proceso' 
      });
    } catch (err: any) {} finally { setIsGenerating(false); }
  };

  const isReeng = modo.projectType === 'Reingeniería';

  const checklistManual = isReeng ? [
    "Comparar los indicadores reales obtenidos contra la línea base de la Etapa 2.",
    "Validar el cumplimiento de metas del Acta de Reingeniería.",
    "Establecer los puntos de control y auditoría a largo plazo.",
    "Documentar lecciones aprendidas y backlog de mejoras pendientes.",
    "Realizar el cierre formal con patrocinadores y líderes."
  ] : [
    "Comparar resultados finales contra la línea base inicial.",
    "Validar el cumplimiento de objetivos del Acta Lean del Proyecto.",
    "Documentar resultados, aprendizajes y beneficios.",
    "Formalizar al dueño del proceso como responsable del control.",
    "Entregar documentación final del MODO.",
    "Realizar retrospectiva con el equipo del proyecto.",
    "Crear backlog de mejoras futuras.",
    "Definir frecuencia de seguimiento posterior.",
    "Cerrar formalmente el proyecto."
  ];

  const erroresEvitar = isReeng ? [
    "Cerrar sin medir formalmente el impacto en las métricas de línea base.",
    "No transferir el control y auditorías al dueño del proceso definitivo.",
    "No documentar lecciones aprendidas del cambio cultural."
  ] : [
    "Cerrar sin medir resultados.",
    "No transferir responsabilidades al dueño del proceso.",
    "Dejar controles demasiado pesados.",
    "No mantener backlog de mejora continua."
  ];

  return (
    <PhaseLayout
      modo={modo}
      phaseNumber={7}
      title={isReeng ? "Control y Cierre" : "Cierre y Control"}
      dmaic="Control"
      description={isReeng ? "Sostener las mejoras de la reingeniería mediante un plan de control formal, lecciones aprendidas y el backlog de mejora continua." : "Asegurar la sostenibilidad del modelo y transferir formalmente el control de la operación."}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      error={null}
      checklistManual={checklistManual}
      erroresEvitar={erroresEvitar}
    >
      {/* Interactive KPI comparison */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500">query_stats</span>
            Comparativa Final de KPIs vs Línea Base
          </h4>
        </div>
        <div className="p-6 border-b border-slate-100 bg-slate-50/10 grid grid-cols-1 md:grid-cols-12 gap-3">
          <input type="text" placeholder="Indicador (Ej. Tiempo surtido)" value={newKpiName} onChange={e => setNewKpiName(e.target.value)} disabled={isApproved || !canEdit} className="col-span-12 md:col-span-3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <input type="text" placeholder="Línea Base" value={newKpiBase} onChange={e => setNewKpiBase(e.target.value)} disabled={isApproved || !canEdit} className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <input type="text" placeholder="Meta" value={newKpiTarget} onChange={e => setNewKpiTarget(e.target.value)} disabled={isApproved || !canEdit} className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <input type="text" placeholder="Real" value={newKpiReal} onChange={e => setNewKpiReal(e.target.value)} disabled={isApproved || !canEdit} className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <select value={newKpiStatus} onChange={e => setNewKpiStatus(e.target.value as any)} disabled={isApproved || !canEdit} className="col-span-6 md:col-span-2 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none bg-white disabled:opacity-50">
            <option value="Éxito">Éxito</option>
            <option value="En Riesgo">En Riesgo</option>
            <option value="Atrasado">Atrasado</option>
          </select>
          <button onClick={handleAddKpiComp} disabled={isApproved || !canEdit || !newKpiName.trim()} className="col-span-12 md:col-span-1 bg-slate-900 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">Add</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Indicador</th>
                <th className="px-6 py-3">Línea Base</th>
                <th className="px-6 py-3">Meta</th>
                <th className="px-6 py-3">Resultado Real</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-slate-700">
              {kpisComparativa.map((k: any) => (
                <tr key={k.id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                  <td className="px-6 py-3 font-semibold text-slate-800">{k.kpi}</td>
                  <td className="px-6 py-3">{k.lineaBase}</td>
                  <td className="px-6 py-3">{k.meta}</td>
                  <td className="px-6 py-3 font-bold text-primary">{k.real}</td>
                  <td className="px-6 py-3">
                    <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold border", k.estado === 'Éxito' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : k.estado === 'En Riesgo' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-red-50 text-red-700 border-red-100")}>
                      {k.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {!isApproved && canEdit && (
                      <button onClick={() => handleRemoveKpiComp(k.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan de Control */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
          <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">verified_user</span>
            Plan de Control Operativo
          </h4>
        </div>
        <div className="p-6 border-b border-slate-100 bg-slate-50/10 grid grid-cols-1 md:grid-cols-12 gap-3">
          <input type="text" placeholder="Punto de Control (Qué se revisa)" value={newControlKpi} onChange={e => setNewControlKpi(e.target.value)} disabled={isApproved || !canEdit} className="col-span-12 md:col-span-5 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <input type="text" placeholder="Frecuencia" value={newControlMeta} onChange={e => setNewControlMeta(e.target.value)} disabled={isApproved || !canEdit} className="col-span-6 md:col-span-3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <input type="text" placeholder="Responsable" value={newControlResp} onChange={e => setNewControlResp(e.target.value)} disabled={isApproved || !canEdit} className="col-span-6 md:col-span-3 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50" />
          <button onClick={handleAddControl} disabled={isApproved || !canEdit || !newControlKpi.trim()} className="col-span-12 md:col-span-1 bg-slate-900 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">Add</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 w-1/2">Punto de Control</th>
                <th className="px-6 py-3">Frecuencia</th>
                <th className="px-6 py-3">Responsable</th>
                <th className="px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-slate-700">
              {controlPoints.map((c: any) => (
                <tr key={c.id || c.kpi} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                  <td className="px-6 py-3 font-semibold text-slate-800">{c.kpi}</td>
                  <td className="px-6 py-3">{c.meta}</td>
                  <td className="px-6 py-3">{c.responsable}</td>
                  <td className="px-6 py-3 text-right">
                    {!isApproved && canEdit && (
                      <button onClick={() => handleRemoveControl(c.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retrospectiva y Backlog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Lecciones Aprendidas */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">psychology</span>
            Lecciones Aprendidas (Retrospectiva)
          </h4>
          <p className="text-[12px] text-slate-500 mb-4">Aprendizajes de cara a futuros proyectos de mejora continua.</p>

          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Nueva lección aprendida..." 
              value={newLesson} 
              onChange={e => setNewLesson(e.target.value)} 
              disabled={isApproved || !canEdit}
              className="flex-1 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
            />
            <button 
              onClick={handleAddLesson}
              disabled={isApproved || !canEdit || !newLesson.trim()}
              className="bg-slate-900 text-white font-bold text-[12px] px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Añadir
            </button>
          </div>

          <ul className="flex flex-col gap-3">
            {leccionesAprendidas.map((l: string, i: number) => (
              <li key={i} className="flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">lightbulb</span>
                  <span className="text-[13px] text-slate-700 leading-snug">{l}</span>
                </div>
                {!isApproved && canEdit && (
                  <button onClick={() => handleRemoveLesson(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Backlog de Mejoras Futuras */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="text-[15px] font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">list_alt</span>
            Backlog de Mejoras Futuras
          </h4>
          <p className="text-[12px] text-slate-500 mb-4">Oportunidades de mejora detectadas que se trabajarán después.</p>

          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Nueva idea o mejora futura..." 
              value={newBacklog} 
              onChange={e => setNewBacklog(e.target.value)} 
              disabled={isApproved || !canEdit}
              className="flex-1 p-2.5 text-[13px] border border-slate-200 rounded-lg outline-none disabled:opacity-50"
            />
            <button 
              onClick={handleAddBacklog}
              disabled={isApproved || !canEdit || !newBacklog.trim()}
              className="bg-slate-900 text-white font-bold text-[12px] px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Añadir
            </button>
          </div>

          <ul className="flex flex-col gap-3">
            {backlogMejoras.map((b: string, i: number) => (
              <li key={i} className="flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5">add_circle</span>
                  <span className="text-[13px] text-slate-700 leading-snug">{b}</span>
                </div>
                {!isApproved && canEdit && (
                  <button onClick={() => handleRemoveBacklog(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PhaseLayout>
  );
};