import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AppState, Modo, PhaseState, ProjectType, Solicitud, User, GlossaryTerm, ProjectKPI, Macroproceso, Proceso, Procedimiento, PropuestaProyecto, Formato, MeetingAgenda } from './types';
import { INITIAL_MODOS, AREAS, PROJECT_PHASES, MOCK_USERS, INITIAL_SOLICITUDES, INITIAL_GLOSSARY, INITIAL_MACROPROCESOS, INITIAL_PROCESOS, INITIAL_PROCEDIMIENTOS, INITIAL_KPIS } from './constants';
import { db, auth } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AppContextType extends AppState {
  setCurrentUser: (user: User) => void;
  updateModoPhase: (modoId: string, phase: number, data: Partial<PhaseState>) => void;
  updateModoTeam: (modoId: string, team: Record<string, string>) => void;
  addModo: (data: { name: string; projectType: ProjectType; area: string }) => string;
  deleteModo: (id: string) => void;
  updateModoRisks: (modoId: string, risks: any[]) => void;
  updateModoCompromisos: (modoId: string, compromisos: any[]) => void;
  addPhaseLog: (modoId: string, phase: number, log: { action: string, user: string }) => void;
  addAgenda: (modoId: string, agenda: Omit<MeetingAgenda, 'id'>) => void;
  deleteAgenda: (modoId: string, agendaId: string) => void;
  addSolicitud: (solicitud: Omit<Solicitud, 'id' | 'date' | 'status'>) => void;
  updateSolicitudStatus: (id: string, status: Solicitud['status']) => void;
  deleteSolicitud: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  glossary: GlossaryTerm[];
  addGlossaryTerm: (term: GlossaryTerm) => void;
  addKPI: (kpi: Omit<ProjectKPI, 'id'>) => void;
  updateKPI: (id: string, updates: Partial<ProjectKPI>) => void;
  deleteKPI: (id: string) => void;
  addMacroproceso: (m: Omit<Macroproceso, 'id'>) => void;
  updateMacroproceso: (id: string, m: Partial<Macroproceso>) => void;
  updateMacroprocesosOrder: (updates: { id: string; order: number }[]) => void;
  addProceso: (p: Omit<Proceso, 'id'>) => void;
  updateProceso: (id: string, p: Partial<Proceso>) => void;

  deleteMacroproceso: (id: string) => void;
  deleteProceso: (id: string) => void;
  addFormato: (f: Omit<Formato, 'id'>) => void;
  deleteFormato: (id: string) => void;
  syncState: 'loading' | 'synced' | 'error';
  syncErrorMessage: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const loadState = <T,>(key: string, defaultVal: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadState<User[]>('chesa_users', MOCK_USERS);
    const hasCarlosMendoza = loaded.some(u => u.name === 'Carlos Mendoza');
    const hasCarlosBarrientos = loaded.some(u => u.name === 'Carlos Barrientos');
    const hasAuditor = loaded.some(u => u.name === 'Auditor ISO');
    const hasWrongPuestoCarlos = loaded.some(u => u.name === 'Carlos Barrientos' && u.puesto !== 'Gerente de Mejora Continua');
    const hasWrongPuestoArmando = loaded.some(u => u.name === 'Armando' && u.puesto !== 'Líder de Mejora Continua');
    
    if (hasCarlosMendoza || !hasCarlosBarrientos || hasAuditor || hasWrongPuestoCarlos || hasWrongPuestoArmando) {
      return MOCK_USERS;
    }
    return loaded;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const loaded = loadState<User>('chesa_currentUser', MOCK_USERS[0]);
    if (
      loaded.name === 'Carlos Mendoza' || 
      loaded.name === 'Auditor ISO' ||
      (loaded.name === 'Carlos Barrientos' && loaded.puesto !== 'Gerente de Mejora Continua') ||
      (loaded.name === 'Armando' && loaded.puesto !== 'Líder de Mejora Continua')
    ) {
      return MOCK_USERS[0];
    }
    return loaded;
  });
  const [modos, setModos] = useState<Record<string, Modo>>(() => {
    const loaded = loadState<Record<string, Modo>>('chesa_modos', INITIAL_MODOS);
    if (loaded && loaded.m3 && loaded.m3.currentPhase === 8 && Object.keys(loaded.m3.phases[1]?.data || {}).length === 0) {
      return INITIAL_MODOS;
    }
    return loaded;
  });
  const [solicitudes, setSolicitudes] = useState<Record<string, Solicitud>>(() => loadState('chesa_solicitudes', INITIAL_SOLICITUDES));
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(() => loadState('chesa_glossary', INITIAL_GLOSSARY));
  const [kpis, setKpis] = useState<ProjectKPI[]>(() => {
    const loaded = loadState<ProjectKPI[]>('chesa_kpis', INITIAL_KPIS);
    if (!loaded.some(k => k.id === 'kpi_bdc_1')) {
      return [...loaded, ...INITIAL_KPIS.filter(k => !loaded.some(lk => lk.id === k.id))];
    }
    return loaded;
  });
  const [macroprocesos, setMacroprocesos] = useState<Macroproceso[]>(() => loadState('chesa_macroprocesos', INITIAL_MACROPROCESOS));
  const [procesos, setProcesos] = useState<Proceso[]>(() => {
    const loaded = loadState<Proceso[]>('chesa_procesos', INITIAL_PROCESOS);
    if (loaded.some(p => p.id === 'p3' || p.id === 'p4')) {
      return INITIAL_PROCESOS;
    }
    return loaded;
  });
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>(() => {
    const loaded = loadState<Procedimiento[]>('chesa_procedimientos', INITIAL_PROCEDIMIENTOS);
    if (loaded.some(p => p.id === 'procsub1' || p.id === 'procsub4')) {
      return INITIAL_PROCEDIMIENTOS;
    }
    return loaded;
  });
  const [sucursales, setSucursales] = useState<string[]>(() => loadState<string[]>('chesa_sucursales', ['TGZ', 'SCC', 'TAP', 'SCL']));
  const [propuestas, setPropuestas] = useState<PropuestaProyecto[]>(() => {
    const saved = localStorage.getItem('chesa_propuestas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    const oldPuestosSaved = localStorage.getItem('chesa_puestos');
    if (oldPuestosSaved) {
      try {
        const oldPuestos = JSON.parse(oldPuestosSaved);
        if (Array.isArray(oldPuestos)) {
          return oldPuestos.map((p: any) => ({
            id: p.id,
            projectId: p.projectId,
            name: p.name,
            type: 'Puesto',
            macroprocesoId: p.macroprocesoId,
            procesoId: p.procesoId,
            status: p.status || 'Propuesto'
          }));
        }
      } catch (e) {
        // fallback
      }
    }
    return [];
  });
  const [formatos, setFormatos] = useState<Formato[]>(() => loadState('chesa_formatos', []));

  // Firebase Firestore synchronization
  const [fbUser, setFbUser] = useState<any>(null);
  const [syncState, setSyncState] = useState<'loading' | 'synced' | 'error'>('loading');
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const serverDataRef = useRef<Record<string, string>>({});
  const [hasLoadedFromServer, setHasLoadedFromServer] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadedCollections = new Set<string>();
    const collectionsToSync = [
      'users', 'modos', 'solicitudes', 'glossary',
      'kpis', 'macroprocesos', 'procesos', 'procedimientos', 'propuestas', 'formatos', 'sucursales'
    ];

    setSyncState('loading');
    setSyncErrorMessage(null);

    const syncDoc = (key: string, setter: (val: any) => void) => {
      return onSnapshot(doc(db, 'app_state', key), (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.data().data;
          serverDataRef.current[key] = JSON.stringify(val);
          setter(val);
        }
        loadedCollections.add(key);
        if (loadedCollections.size === collectionsToSync.length) {
          setSyncState('synced');
          setSyncErrorMessage(null);
        }
        setHasLoadedFromServer(prev => ({ ...prev, [key]: true }));
      }, (error) => {
        console.error(`Error syncing ${key} from Firestore:`, error);
        setSyncState('error');
        setSyncErrorMessage(`Error al sincronizar ${key}: ${error.message || error}`);
        // Do NOT set hasLoadedFromServer to true here to avoid overwriting clean server data with local defaults
      });
    };

    const unsubscribes = [
      syncDoc('users', setUsers),
      syncDoc('modos', setModos),
      syncDoc('solicitudes', setSolicitudes),
      syncDoc('glossary', setGlossary),
      syncDoc('kpis', setKpis),
      syncDoc('macroprocesos', setMacroprocesos),
      syncDoc('procesos', setProcesos),
      syncDoc('procedimientos', setProcedimientos),
      syncDoc('propuestas', setPropuestas),
      syncDoc('formatos', setFormatos),
      syncDoc('sucursales', setSucursales)
    ];

    return () => unsubscribes.forEach(unsub => unsub());
  }, [fbUser]);

  useEffect(() => {
    // 1. Save currentUser locally (keeps session local per browser)
    try {
      localStorage.setItem('chesa_currentUser', JSON.stringify(currentUser));
    } catch (e) {
      console.warn("Writing currentUser failed:", e);
    }
  }, [currentUser]);

  useEffect(() => {
    // 2. Save global states locally and to Firestore
    try {
      localStorage.setItem('chesa_users', JSON.stringify(users));
      localStorage.setItem('chesa_modos', JSON.stringify(modos));
      localStorage.setItem('chesa_solicitudes', JSON.stringify(solicitudes));
      localStorage.setItem('chesa_glossary', JSON.stringify(glossary));
      localStorage.setItem('chesa_kpis', JSON.stringify(kpis));
      localStorage.setItem('chesa_macroprocesos', JSON.stringify(macroprocesos));
      localStorage.setItem('chesa_procesos', JSON.stringify(procesos));
      localStorage.setItem('chesa_procedimientos', JSON.stringify(procedimientos));
      localStorage.setItem('chesa_propuestas', JSON.stringify(propuestas));
      localStorage.setItem('chesa_formatos', JSON.stringify(formatos));
      localStorage.setItem('chesa_sucursales', JSON.stringify(sucursales));
    } catch (e) {
      console.warn("Local storage quota exceeded or writing failed:", e);
    }

    const saveDoc = async (key: string, data: any) => {
      if (!hasLoadedFromServer[key]) return; // Avoid overwriting server data with default states before loading
      const dataStr = JSON.stringify(data);
      if (serverDataRef.current[key] !== dataStr) {
        serverDataRef.current[key] = dataStr;
        try {
          // Clean undefined values by parsing the stringified JSON
          const cleanData = JSON.parse(dataStr);
          await setDoc(doc(db, 'app_state', key), { data: cleanData });
        } catch (e: any) {
          console.error(`Error saving ${key} to Firestore:`, e);
          setSyncState('error');
          setSyncErrorMessage(`Error al guardar ${key}: ${e.message || e}`);
        }
      }
    };

    saveDoc('users', users);
    saveDoc('modos', modos);
    saveDoc('solicitudes', solicitudes);
    saveDoc('glossary', glossary);
    saveDoc('kpis', kpis);
    saveDoc('macroprocesos', macroprocesos);
    saveDoc('procesos', procesos);
    saveDoc('procedimientos', procedimientos);
    saveDoc('propuestas', propuestas);
    saveDoc('formatos', formatos);
    saveDoc('sucursales', sucursales);
  }, [users, modos, solicitudes, glossary, kpis, macroprocesos, procesos, procedimientos, propuestas, formatos, sucursales, hasLoadedFromServer]);

  const addMacroproceso = (m: Omit<Macroproceso, 'id'>) => setMacroprocesos(prev => [...prev, { ...m, id: `mac${Date.now()}` }]);
  const updateMacroproceso = (id: string, updates: Partial<Macroproceso>) => setMacroprocesos(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  const updateMacroprocesosOrder = (updates: { id: string; order: number }[]) => {
    setMacroprocesos(prev => {
      const updated = prev.map(m => {
        const u = updates.find(x => x.id === m.id);
        return u ? { ...m, order: u.order } : m;
      });
      try {
        localStorage.setItem('chesa_macroprocesos', JSON.stringify(updated));
      } catch (e) {
        console.warn("Writing macroprocesos order failed locally:", e);
      }
      if (fbUser && hasLoadedFromServer['macroprocesos']) {
        const dataStr = JSON.stringify(updated);
        serverDataRef.current['macroprocesos'] = dataStr;
        setDoc(doc(db, 'app_state', 'macroprocesos'), { data: updated }).catch(e => {
          console.error("Error saving macroprocesos order to Firestore:", e);
        });
      }
      return updated;
    });
  };
  const deleteMacroproceso = (id: string) => {
    setMacroprocesos(prev => prev.filter(m => m.id !== id));
    const procIdsToDelete = procesos.filter(p => p.macroprocesoId === id).map(p => p.id);
    const procSubIdsToDelete = procedimientos.filter(proc => procIdsToDelete.includes(proc.procesoId)).map(p => p.id);
    setProcesos(prev => prev.filter(p => p.macroprocesoId !== id));
    setProcedimientos(prev => prev.filter(proc => !procIdsToDelete.includes(proc.procesoId)));
    setKpis(prev => prev.filter(k => !procIdsToDelete.includes(k.procesoId || '') && (!k.procedimientoId || !procSubIdsToDelete.includes(k.procedimientoId))));
    setFormatos(prev => prev.filter(f => f.macroprocesoId !== id));
  };
  const addProceso = (p: Omit<Proceso, 'id'>) => setProcesos(prev => [...prev, { ...p, id: `proc${Date.now()}` }]);
  const updateProceso = (id: string, updates: Partial<Proceso>) => setProcesos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProceso = (id: string) => {
    const procSubIds = procedimientos.filter(proc => proc.procesoId === id).map(p => p.id);
    setProcesos(prev => prev.filter(p => p.id !== id));
    setProcedimientos(prev => prev.filter(proc => proc.procesoId !== id));
    setKpis(prev => prev.filter(k => k.procesoId !== id && (!k.procedimientoId || !procSubIds.includes(k.procedimientoId))));
    setFormatos(prev => prev.filter(f => f.procesoId !== id));
  };
  const addProcedimiento = (p: Omit<Procedimiento, 'id'>) => setProcedimientos(prev => [...prev, { ...p, id: `procsub${Date.now()}` }]);
  const updateProcedimiento = (id: string, updates: Partial<Procedimiento>) => setProcedimientos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProcedimiento = (id: string) => {
    setProcedimientos(prev => prev.filter(p => p.id !== id));
    setKpis(prev => prev.filter(k => k.procedimientoId !== id));
  };
  const addPropuesta = (p: Omit<PropuestaProyecto, 'id'>) => setPropuestas(prev => [...prev, { ...p, id: `prop${Date.now()}` }]);
  const updatePropuesta = (id: string, updates: Partial<PropuestaProyecto>) => setPropuestas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePropuesta = (id: string) => setPropuestas(prev => prev.filter(p => p.id !== id));
  
  const addFormato = (f: Omit<Formato, 'id'>) => setFormatos(prev => [...prev, { ...f, id: `fmt${Date.now()}` }]);
  const deleteFormato = (id: string) => setFormatos(prev => prev.filter(f => f.id !== id));

  const addSucursal = (name: string) => {
    const cleanName = name.trim().toUpperCase();
    if (!cleanName || sucursales.includes(cleanName)) return;
    setSucursales(prev => [...prev, cleanName]);
  };

  const deleteSucursal = (name: string) => {
    setSucursales(prev => prev.filter(s => s !== name));
  };

  const addKPI = (kpi: Omit<ProjectKPI, 'id'>) => {
    setKpis(prev => [...prev, { ...kpi, id: `kpi${Date.now()}` }]);
  };

  const updateKPI = (id: string, updates: Partial<ProjectKPI>) => {
    setKpis(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  };

  const deleteKPI = (id: string) => {
    setKpis(prev => prev.filter(k => k.id !== id));
  };

  const addGlossaryTerm = (term: GlossaryTerm) => {
    setGlossary(prev => [...prev, term]);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: `u${Date.now()}` }]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => {
      const userToDelete = prev.find(u => u.id === id);
      if (userToDelete?.systemRole === 'Admin') {
        const adminCount = prev.filter(u => u.systemRole === 'Admin').length;
        if (adminCount <= 1) {
          alert('No se puede eliminar al último administrador del sistema.');
          return prev;
        }
      }
      return prev.filter(u => u.id !== id);
    });
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const updateModoPhase = (modoId: string, phase: number, data: Partial<PhaseState>) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      
      const currentPhaseState = modo.phases[phase] || { status: 'Pendiente', data: {}, checklistOut: {} };
      
      // Update phases dictionary first with the new data
      const updatedPhases = {
        ...modo.phases,
        [phase]: { ...currentPhaseState, ...data }
      };

      const maxPhases = (PROJECT_PHASES[modo.projectType] || []).length || 7;

      // Calculate first unapproved/incomplete phase
      let firstUnapproved = maxPhases;
      for (let p = 1; p <= maxPhases; p++) {
        const pStatus = updatedPhases[p]?.status || 'Pendiente';
        if (pStatus !== 'Aprobado' && pStatus !== 'Completo') {
          firstUnapproved = p;
          break;
        }
      }

      // Calculate max sequential approved phases for progress
      let maxApprovedSequential = 0;
      for (let p = 1; p <= maxPhases; p++) {
        const pStatus = updatedPhases[p]?.status || 'Pendiente';
        if (pStatus === 'Aprobado' || pStatus === 'Completo') {
          maxApprovedSequential = p;
        } else {
          break;
        }
      }

      const newProgress = Math.min(100, Math.round((maxApprovedSequential / maxPhases) * 100));

      let expirationDate = modo.expirationDate;
      if (maxApprovedSequential === maxPhases) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        expirationDate = nextYear.toISOString();
      } else {
        expirationDate = null;
      }

      return {
        ...prev,
        [modoId]: {
          ...modo,
          progress: newProgress,
          expirationDate,
          currentPhase: firstUnapproved,
          phases: updatedPhases
        }
      };
    });
  };

  const updateModoTeam = (modoId: string, team: Record<string, string>) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      return {
        ...prev,
        [modoId]: { ...modo, team }
      };
    });
  };

  const addModo = (data: { name: string; projectType: ProjectType; area: string }) => {
    const id = `m${Date.now()}`;
    setModos(prev => ({
      ...prev,
      [id]: {
        id,
        ...data,
        currentPhase: 1,
        progress: 0,
        status: 'On Track',
        team: {},
        phases: {
          1: { status: 'Pendiente', data: {}, checklistOut: {} }
        }
      }
    }));
    return id;
  };

  const deleteModo = (id: string) => {
    setModos(prev => {
      const newModos = { ...prev };
      delete newModos[id];
      return newModos;
    });
  };

  const addPhaseLog = (modoId: string, phase: number, log: { action: string, user: string }) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      
      const currentPhaseState = modo.phases[phase] || { status: 'Pendiente', data: {}, checklistOut: {} };
      const currentLogs = currentPhaseState.logs || [];
      
      return {
        ...prev,
        [modoId]: {
          ...modo,
          phases: {
            ...modo.phases,
            [phase]: {
              ...currentPhaseState,
              logs: [...currentLogs, { ...log, date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }]
            }
          }
        }
      };
    });
  };

  const addSolicitud = (data: Omit<Solicitud, 'id' | 'date' | 'status'>) => {
    const id = `s${Date.now()}`;
    setSolicitudes(prev => ({
      ...prev,
      [id]: {
        ...data,
        id,
        date: new Date().toISOString(),
        status: 'Nueva'
      }
    }));
  };

  const updateSolicitudStatus = (id: string, status: Solicitud['status']) => {
    setSolicitudes(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], status }
      };
    });
  };

  const deleteSolicitud = (id: string) => {
    setSolicitudes(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateModoRisks = (modoId: string, risks: any[]) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      return {
        ...prev,
        [modoId]: { ...modo, risks }
      };
    });
  };

  const updateModoCompromisos = (modoId: string, compromisos: any[]) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      return {
        ...prev,
        [modoId]: { ...modo, compromisos }
      };
    });
  };

  const addAgenda = (modoId: string, agenda: Omit<MeetingAgenda, 'id'>) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      const id = `ag${Date.now()}`;
      return {
        ...prev,
        [modoId]: { ...modo, agendas: [...(modo.agendas || []), { ...agenda, id }] }
      };
    });
  };

  const deleteAgenda = (modoId: string, agendaId: string) => {
    setModos(prev => {
      const modo = prev[modoId];
      if (!modo) return prev;
      return {
        ...prev,
        [modoId]: { ...modo, agendas: (modo.agendas || []).filter(a => a.id !== agendaId) }
      };
    });
  };

  return (
    <AppContext.Provider      value={{ 
        currentUser, setCurrentUser, 
        users, addUser, deleteUser, updateUser,
        glossary, addGlossaryTerm,
        kpis, addKPI, updateKPI, deleteKPI,
        modos, updateModoPhase, updateModoTeam, addModo, deleteModo, updateModoRisks, updateModoCompromisos, addPhaseLog, addAgenda, deleteAgenda,
        solicitudes, addSolicitud, updateSolicitudStatus, deleteSolicitud,
        areas: macroprocesos.length > 0 ? macroprocesos.map(m => m.name) : AREAS,
        macroprocesos, addMacroproceso, updateMacroproceso, deleteMacroproceso, updateMacroprocesosOrder,
        procesos, addProceso, updateProceso, deleteProceso,
        procedimientos, addProcedimiento, updateProcedimiento, deleteProcedimiento,
        propuestas, addPropuesta, updatePropuesta, deletePropuesta,
        formatos, addFormato, deleteFormato,
        sucursales, addSucursal, deleteSucursal,
        syncState, syncErrorMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};