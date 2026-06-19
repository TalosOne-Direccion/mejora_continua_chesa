import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAppStore } from '../store';

export default function Login() {
  const { users, setCurrentUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Bypass temporal para probar el diseño rápido con diferentes perfiles
    const lowerEmail = email.toLowerCase().trim();
    if (password === '1234') {
      let matchedUser = null;
      if (lowerEmail === 'carlos@chesa.com' || lowerEmail === 'admin' || lowerEmail === 'admin@chesa.com') {
        matchedUser = users.find(u => u.name === 'Carlos Barrientos');
      } else if (lowerEmail === 'ivonne@chesa.com') {
        matchedUser = users.find(u => u.name === 'Ivonne');
      } else if (lowerEmail === 'armando@chesa.com') {
        matchedUser = users.find(u => u.name === 'Armando');
      } else if (lowerEmail === 'lector@chesa.com' || lowerEmail === 'lider@chesa.com') {
        matchedUser = users.find(u => u.name === 'Líder de Área');
      }

      if (matchedUser) {
        setLoading(false);
        setCurrentUser(matchedUser);
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/';
        return;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
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
          if (matched) {
            setCurrentUser(matched);
          }
        }
      }
      navigate('/');
    } catch (err: any) {
      setError('Credenciales incorrectas o usuario no encontrado.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex-1 relative flex items-center justify-start overflow-hidden bg-black">
      {/* Full Background Image without blank spaces */}
      <img src="/car_highway_bg.png" alt="Automotive background" className="absolute inset-0 w-full h-full object-cover grayscale-[10%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1118]/95 via-black/40 to-black/80"></div>

      {/* Quote with Bracket Design (Right Side floating) */}
      <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center w-[55%] px-16 xl:px-24">
        <div className="relative inline-block py-12 px-14 lg:px-20 text-center mx-auto">
          {/* Brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-[2px] border-l-[2px] border-white/80"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[2px] border-l-[2px] border-white/80"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-[2px] border-r-[2px] border-white/80"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[2px] border-r-[2px] border-white/80"></div>
          
          <h2 className="text-white text-3xl xl:text-[42px] font-light tracking-wide leading-tight drop-shadow-lg">
            "La excelencia no es un acto,<br className="hidden xl:block"/> sino un hábito."
          </h2>
          <p className="text-white/80 mt-8 text-sm font-bold tracking-[0.3em] uppercase drop-shadow-md">
            — Aristóteles
          </p>
        </div>
      </div>

      {/* Left Side: Login Form Panel */}
      <div className="w-full lg:w-[45%] xl:w-[40%] h-full min-h-screen flex items-center justify-center p-8 sm:p-12 md:p-16 relative z-10 bg-[#0a1118]/80 backdrop-blur-xl border-r border-white/5 shadow-2xl">
        <div className="w-full max-w-sm xl:max-w-md relative z-10">
          <div className="flex flex-col items-center lg:items-start mb-12">
            <img src="/logo_chesa.png" alt="Grupo Chesa" className="w-48 mb-8 brightness-0 invert opacity-90 drop-shadow-md" />
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Portal de Acceso</h1>
            <p className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mt-3">Mejora Continua</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#16202c]/80 border border-slate-700/60 text-white px-5 py-4 rounded-sm focus:outline-none focus:border-orange-500 focus:bg-[#16202c] transition-all backdrop-blur-sm"
                placeholder="ejemplo@chesa.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#16202c]/80 border border-slate-700/60 text-white px-5 py-4 rounded-sm focus:outline-none focus:border-orange-500 focus:bg-[#16202c] transition-all backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-sm uppercase tracking-[0.2em] text-sm transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] mt-4"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-800/50 text-center lg:text-left">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider leading-relaxed">
              Propiedad de Grupo Automotriz Chesa. <br/> El acceso no autorizado está estrictamente prohibido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
