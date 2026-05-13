import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  RefreshCw,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Info
} from 'lucide-react';

interface LoginModuleProps {
  loginUser?: string;
  setLoginUser?: (v: string) => void;
  loginPass?: string;
  setLoginPass?: (v: string) => void;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  onLogin?: (credentials: { username: string; password: string }) => Promise<void> | void;
  isLoading?: boolean;
  error?: string;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({
  loginUser,
  setLoginUser,
  loginPass,
  setLoginPass,
  onSubmit,
  onLogin,
  isLoading,
  error
}) => {
  const [showForgotMsg, setShowForgotMsg] = useState(false);
  const [internalUser, setInternalUser] = useState('');
  const [internalPass, setInternalPass] = useState('');

  const resolvedUser = loginUser ?? internalUser;
  const resolvedPass = loginPass ?? internalPass;
  const isBusy = Boolean(isLoading);
  const errorMessage = error ?? '';

  const updateUser = (value: string) => {
    if (typeof setLoginUser === 'function') {
      setLoginUser(value);
      return;
    }
    setInternalUser(value);
  };

  const updatePass = (value: string) => {
    if (typeof setLoginPass === 'function') {
      setLoginPass(value);
      return;
    }
    setInternalPass(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof onSubmit === 'function') {
      await onSubmit(e);
      return;
    }

    if (typeof onLogin === 'function') {
      await onLogin({ username: resolvedUser, password: resolvedPass });
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* --- FONDO ÚNICO: MALLA GEOMÉTRICA SVG --- */}
      <div className="absolute inset-0 z-0">
        <svg className="h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          <motion.circle
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            cx="20%" cy="30%" r="150" fill="#3b82f6" filter="blur(100px)" opacity="0.3"
          />
          <motion.circle
            animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            cx="80%" cy="70%" r="200" fill="#1e40af" filter="blur(120px)" opacity="0.3"
          />
        </svg>
      </div>

      {/* --- CONTENEDOR LOGIN --- */}
      <motion.div
        className="relative z-10 w-full max-w-[480px] px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden">

          {/* Logo y Header */}
          <div className="text-center mb-10">
            <motion.div
              className="inline-flex p-4 rounded-3xl bg-blue-600 shadow-lg shadow-blue-500/30 text-white mb-6"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Package size={38} strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-white text-4xl font-black tracking-tighter mb-2">
              INVETAR<span className="text-blue-500">X</span>
            </h1>
            <div className="flex justify-center">
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                Industrial Ecosystem Pro
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Usuario */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificador Único</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  placeholder="ID de operador..."
                  value={resolvedUser}
                  onChange={(e) => updateUser(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Acceso</label>
                <button
                  type="button"
                  onClick={() => setShowForgotMsg(!showForgotMsg)}
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tight"
                >
                  ¿Olvido su clave?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  placeholder="••••••••"
                  value={resolvedPass}
                  onChange={(e) => updatePass(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Mensaje Informativo Clave */}
            <AnimatePresence>
              {showForgotMsg && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3 mt-2">
                    <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-200/70 leading-relaxed font-medium">
                      Para restablecer su acceso, contacte con el <span className="text-amber-400 font-bold">Administrador del Sistema</span> o el área de IT de su planta.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs font-bold text-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-8"
              type="submit"
              disabled={isBusy}
              whileHover={{ y: -2 }}
            >
              {isBusy ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <>
                  ACCEDER AL ECOSISTEMA
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Security */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Secured by Invetarx Cloud
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
          © 2026 INDUSTRIAL SOLUTIONS CORP.
        </p>
      </motion.div>
    </main>
  );
};