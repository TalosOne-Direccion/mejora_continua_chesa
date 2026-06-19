import React, { useState } from 'react';
import { Modo } from '../types';
import { useAppStore } from '../store';
import { cn } from '../utils';

export const EquipoProyecto: React.FC<{ modo: Modo }> = ({ modo }) => {
  const { currentUser, updateModoTeam, users } = useAppStore();
  const canEdit = currentUser.name === 'Carlos Barrientos' || currentUser.name === 'Ivonne' || currentUser.name === 'Armando';
  const [newRole, setNewRole] = useState('Usuario clave');
  const [newName, setNewName] = useState('');

  const teamKeys = Object.keys(modo.team);

  const handleRoleChange = (oldKey: string, newKey: string, name: string) => {
    if (oldKey === newKey) return;
    const newTeam = { ...modo.team };
    delete newTeam[oldKey];
    
    // Ensure unique key
    let finalKey = newKey;
    let count = 1;
    while (newTeam[finalKey]) {
      finalKey = `${newKey} (${++count})`;
    }
    
    newTeam[finalKey] = name;
    updateModoTeam(modo.id, newTeam);
  };

  const handleNameChange = (key: string, newName: string) => {
    const newTeam = { ...modo.team, [key]: newName };
    updateModoTeam(modo.id, newTeam);
  };

  const handleDelete = (key: string) => {
    const newTeam = { ...modo.team };
    delete newTeam[key];
    updateModoTeam(modo.id, newTeam);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const newTeam = { ...modo.team };
    let finalKey = newRole;
    let count = 1;
    while (newTeam[finalKey]) {
      finalKey = `${newRole} (${++count})`;
    }
    
    newTeam[finalKey] = newName.trim();
    updateModoTeam(modo.id, newTeam);
    setNewName('');
  };

  const rolesDisponibles = [
    'Líder del proyecto (MC)',
    'Patrocinador',
    'Dueño del proceso',
    'Usuario clave',
    'Analista de datos',
    'Facilitador',
    'Experto Técnico'
  ];

  const peopleDisponibles = users.map(u => u.name);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-slate-400">group</span>
        <h3 className="font-title-lg text-title-lg text-slate-800 uppercase tracking-wider">Participantes del Proyecto</h3>
      </div>

      <div className="space-y-4">
        {teamKeys.map(roleKey => {
          const isLider = roleKey.startsWith('Líder');
          return (
            <div key={roleKey} className={cn("flex items-center gap-4 p-4 rounded-xl border", isLider ? "bg-purple-50/30 border-purple-100" : "bg-slate-50/50 border-slate-100")}>
              <div className="w-1/4">
                <select 
                  value={roleKey.replace(/ \(\d+\)$/, '')} 
                  onChange={(e) => handleRoleChange(roleKey, e.target.value, modo.team[roleKey])}
                  disabled={!canEdit}
                  className={cn("w-full p-2.5 rounded-lg border text-[14px] bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all", isLider ? "text-purple-700 font-bold border-purple-200" : "text-slate-700 border-slate-200")}
                >
                  {rolesDisponibles.map(r => <option key={r} value={r}>{r}</option>)}
                  {!rolesDisponibles.includes(roleKey.replace(/ \(\d+\)$/, '')) && (
                    <option value={roleKey.replace(/ \(\d+\)$/, '')}>{roleKey.replace(/ \(\d+\)$/, '')}</option>
                  )}
                </select>
              </div>
              
              <div className="w-2/4">
                <select 
                  value={modo.team[roleKey] || ''}
                  onChange={(e) => handleNameChange(roleKey, e.target.value)}
                  disabled={!canEdit}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-[14px] text-slate-700 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="" disabled>- Seleccionar persona -</option>
                  {peopleDisponibles.map(p => <option key={p} value={p}>{p}</option>)}
                  {!peopleDisponibles.includes(modo.team[roleKey]) && modo.team[roleKey] && (
                    <option value={modo.team[roleKey]}>{modo.team[roleKey]}</option>
                  )}
                </select>
              </div>

              <div className="w-1/4 flex items-center justify-end gap-3 text-right">
                <span className="text-[13px] text-slate-400 font-medium">{roleKey.replace(/ \(\d+\)$/, '')}</span>
                {canEdit && (
                  <button 
                    onClick={() => handleDelete(roleKey)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    title="Eliminar participante"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {teamKeys.length === 0 && (
          <p className="text-[14px] text-slate-500 text-center py-6">Aún no hay participantes asignados a este proyecto.</p>
        )}
      </div>

      {canEdit && (
        <div className="mt-4 bg-slate-50/80 border border-slate-100 rounded-xl p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[13px] font-bold text-slate-600 mb-2">Agregar participante</label>
              <select 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-[14px] text-slate-700 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">- Seleccionar persona -</option>
                {peopleDisponibles.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="w-1/3">
              <label className="block text-[13px] font-bold text-slate-600 mb-2">Rol en el {modo.projectType}</label>
              <select 
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-[14px] text-slate-700 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                {rolesDisponibles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button 
              onClick={handleAdd}
              disabled={!newName}
              className="px-6 py-2.5 bg-slate-300 hover:bg-slate-400 text-white font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Agregar
            </button>
          </div>
          <p className="text-[12px] text-slate-400 mt-4">Una misma persona puede tener roles distintos en {modo.projectType}s distintos. Los cambios se registran en bitácora.</p>
        </div>
      )}
    </div>
  );
};
