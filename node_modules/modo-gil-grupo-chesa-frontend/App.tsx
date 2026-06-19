import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppStore } from './store';
import { Dashboard } from './components/Dashboard';
import { ModoDetail } from './components/ModoDetail';
import { DocumentosView, KPIsView, GlosarioView, AdministracionView, SolicitudesView, MacroprocesosView } from './components/GlobalViews';
import Login from './components/Login';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { cn } from './utils';

type GlobalTab = 'Portafolio' | 'Solicitudes' | 'Documentos' | 'KPIs' | 'Glosario' | 'Administración' | 'Macroprocesos';

const MainLayout: React.FC = () => {
  const { currentUser, setCurrentUser, users, updateUser } = useAppStore();
  const [selectedModoId, setSelectedModoId] = useState<string | null>(null);
  const [activeGlobalTab, setActiveGlobalTab] = useState<GlobalTab>('Portafolio');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar || '');

  useEffect(() => {
    setProfileName(currentUser.name);
    setProfileAvatar(currentUser.avatar || '');
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        const emailMap: Record<string, string> = {
          'carlos@chesa.com': 'Carlos Barrientos',
          'ivonne@chesa.com': 'Ivonne',
          'armando@chesa.com': 'Armando',
          'lector@chesa.com': 'Líder de Área',
          'lider@chesa.com': 'Líder de Área'
        };
        const mappedName = emailMap[fbUser.email.toLowerCase().trim()];
        if (mappedName) {
          const matched = users.find(u => u.name === mappedName);
          if (matched && currentUser.id !== matched.id) {
            setCurrentUser(matched);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [users, currentUser, setCurrentUser]);

  const canEdit = currentUser.name === 'Carlos Barrientos' || currentUser.name === 'Ivonne' || currentUser.name === 'Armando';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }
    updateUser(currentUser.id, {
      name: profileName.trim(),
      avatar: profileAvatar || undefined
    });
    setIsProfileModalOpen(false);
  };

  const renderGlobalContent = () => {
    switch (activeGlobalTab) {
      case 'Portafolio': return <Dashboard onSelectModo={setSelectedModoId} />;
      case 'Solicitudes': return <SolicitudesView />;
      case 'Documentos': return <DocumentosView />;
      case 'KPIs': return <KPIsView />;
      case 'Glosario': return <GlosarioView />;
      case 'Administración': return canEdit ? <AdministracionView /> : <Dashboard onSelectModo={setSelectedModoId} />;
      case 'Macroprocesos': return <MacroprocesosView />;
      default: return <Dashboard onSelectModo={setSelectedModoId} />;
    }
  };

  return (
    <div className="flex-1 flex min-w-0 w-full bg-[#F8FAFC]">
      {/* SideNavBar - Diseño más limpio y moderno */}
      {!selectedModoId && (
        <nav className="hidden md:flex flex-col h-screen w-[260px] fixed left-0 top-0 bg-white border-r border-slate-200 z-40 py-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col items-center w-full mb-10 mt-4">
            <div className="w-48 flex items-center justify-center shrink-0 px-2">
              <img src="/logo_chesa.png" alt="Logo Grupo Chesa" className="w-full h-auto object-contain" />
            </div>
            
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-1.5"></div>
            
            <h1 className="text-[12px] font-light text-slate-500 tracking-[0.25em] uppercase text-center ml-1">
              Mejora Continua
            </h1>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-3 mt-4">Menú Principal</p>
            
            <button onClick={() => { setActiveGlobalTab('Portafolio'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'Portafolio' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'Portafolio' && !selectedModoId && "filled")}>grid_view</span>
              <span className="text-[14px]">Portafolio</span>
            </button>
            <button onClick={() => { setActiveGlobalTab('Solicitudes'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'Solicitudes' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'Solicitudes' && !selectedModoId && "filled")}>inbox</span>
              <span className="text-[14px]">Solicitudes</span>
            </button>
            <button onClick={() => { setActiveGlobalTab('Documentos'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'Documentos' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'Documentos' && !selectedModoId && "filled")}>folder_open</span>
              <span className="text-[14px]">Documentos</span>
            </button>
            <button onClick={() => { setActiveGlobalTab('KPIs'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'KPIs' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'KPIs' && !selectedModoId && "filled")}>assessment</span>
              <span className="text-[14px]">KPIs</span>
            </button>
            <button onClick={() => { setActiveGlobalTab('Glosario'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'Glosario' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'Glosario' && !selectedModoId && "filled")}>menu_book</span>
              <span className="text-[14px]">Glosario</span>
            </button>
            <button onClick={() => { setActiveGlobalTab('Macroprocesos'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'Macroprocesos' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'Macroprocesos' && !selectedModoId && "filled")}>account_tree</span>
              <span className="text-[14px]">Macroprocesos</span>
            </button>
            
            {canEdit && (
              <>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-3 mt-8">Configuración</p>
                
                <button onClick={() => { setActiveGlobalTab('Administración'); setSelectedModoId(null); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", activeGlobalTab === 'Administración' && !selectedModoId ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                  <span className={cn("material-symbols-outlined text-[22px]", activeGlobalTab === 'Administración' && !selectedModoId && "filled")}>settings</span>
                  <span className="text-[14px]">Administración</span>
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      {/* Main Content Wrapper */}
      <div className={cn("flex-1 flex flex-col min-w-0 h-screen transition-all duration-300", !selectedModoId && "md:ml-[260px]")}>
        {/* TopNavBar - Glassmorphism effect */}
        <header className="flex justify-between items-center w-full px-8 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shrink-0">
          <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="hidden sm:flex items-center bg-slate-100/80 rounded-full px-4 py-2 border border-transparent focus-within:border-primary/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10 w-64 lg:w-96 transition-all duration-300">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 w-full text-[14px] p-0 h-5 text-slate-700 outline-none placeholder:text-slate-400" placeholder="Buscar en Mejora Continua..." type="text" />
          </div>
          
          <div className="flex-1 sm:hidden"></div>
          
          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 group">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">View As</span>
                <select 
                  value={currentUser.id}
                  onChange={(e) => {
                    const selectedUser = users.find(u => u.id === e.target.value);
                    if (selectedUser) {
                      setCurrentUser(selectedUser);
                    }
                  }}
                  className="bg-transparent border-none text-[13px] font-bold text-slate-700 p-0 pr-5 focus:ring-0 cursor-pointer text-right outline-none group-hover:text-primary transition-colors bg-white"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:border-primary transition-all flex items-center justify-center bg-slate-100 cursor-pointer"
                title="Editar Perfil"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[20px] text-slate-650">person</span>
                )}
              </button>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                signOut(auth);
                window.location.href = '/login';
              }} 
              className="text-slate-400 hover:text-red-500 transition-colors ml-2"
              title="Cerrar Sesión"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col">
          <div className="flex-1">
            {selectedModoId ? (
              <ModoDetail modoId={selectedModoId} onBack={() => setSelectedModoId(null)} />
            ) : (
              renderGlobalContent()
            )}
          </div>
          
          {(selectedModoId || activeGlobalTab !== 'Portafolio') && (
            <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">security</span>
                <span className="text-[12px] font-semibold tracking-widest uppercase">Uso Interno Exclusivo</span>
              </div>
              <p className="text-[12px] font-medium">
                © {new Date().getFullYear()} Grupo Chesa — Plataforma de Mejora Continua
              </p>
            </footer>
          )}
        </main>
      </div>

      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
              <h3 className="font-semibold text-lg text-slate-800">Editar Perfil de Usuario</h3>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              {/* Avatar Selection Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md bg-slate-50 flex items-center justify-center">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Vista previa de avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[48px] text-slate-400">person</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-primary/95 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <span className="text-[12px] text-slate-400 font-medium">Recomendado: Imagen cuadrada de máx 500kb</span>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Escribe tu nombre"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-800 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Rol de Sistema</label>
                  <input 
                    type="text" 
                    value={currentUser.puesto || currentUser.systemRole}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[14px] text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-[14px] font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-lg transition-all shadow-md shadow-primary/20 text-[14px] font-semibold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Check local mock auth (Admin Bypass)
    if (localStorage.getItem('isAuthenticated') === 'true') {
      setIsAuthenticated(true);
      return;
    }

    // 2. Check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a1118] flex items-center justify-center">
        <div className="flex flex-col items-center">
           <img src="/logo_chesa.png" alt="Cargando..." className="w-32 mb-6 animate-pulse opacity-50" />
           <p className="text-slate-500 text-sm tracking-widest uppercase">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/*" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}