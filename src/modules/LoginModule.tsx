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
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#f8fafc]">
      {/* --- LIGHT PREMIUM BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <svg className="h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-light" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-light)" />
          <motion.circle
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            cx="10%" cy="10%" r="300" fill="#dbeafe" filter="blur(120px)" opacity="0.4"
          />
          <motion.circle
            animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            cx="90%" cy="80%" r="250" fill="#eff6ff" filter="blur(100px)" opacity="0.6"
          />
        </svg>
      </div>

      {/* --- LOGIN CONTAINER --- */}
      <motion.div
        className="relative z-10 w-full max-w-[480px] px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="bg-white/70 backdrop-blur-3xl border border-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.15)] p-10 md:p-14 overflow-hidden relative">
          {/* Subtle light streak */}
          <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 pointer-events-none" />

          {/* Logo y Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex p-5 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/40 text-white mb-8"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Package size={42} strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-blue-950 text-5xl font-black tracking-tighter mb-3">
              INVETAR<span className="text-blue-600">X</span>
            </h1>
            <div className="flex justify-center">
              <span className="bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-sm">
                Industrial Ecosystem Pro
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Usuario */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-2">Identificador de Operador</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-300 group-focus-within:text-blue-600 transition-colors">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  className="w-full bg-white border border-blue-50 rounded-[1.5rem] py-5 pl-14 pr-5 text-blue-950 placeholder:text-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm shadow-sm shadow-blue-100/20"
                  placeholder="Ej: OP-4592"
                  value={resolvedUser}
                  onChange={(e) => updateUser(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Clave de Seguridad</label>
                <button
                  type="button"
                  onClick={() => setShowForgotMsg(!showForgotMsg)}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight"
                >
                  ¿Olvido su clave?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-300 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  className="w-full bg-white border border-blue-50 rounded-[1.5rem] py-5 pl-14 pr-5 text-blue-950 placeholder:text-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm shadow-sm shadow-blue-100/20"
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
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-4 mt-2">
                    <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-900/60 leading-relaxed font-bold">
                      Para restablecer su acceso, contacte con el <span className="text-blue-600">Administrador de Planta</span> o el departamento de IT asignado.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-600 text-[11px] font-black text-center uppercase tracking-widest shadow-sm"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-10"
              type="submit"
              disabled={isBusy}
              whileHover={{ y: -2, shadow: '0 25px 50px -12px rgba(37, 99, 235, 0.5)' }}
            >
              {isBusy ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <>
                  INGRESAR AL PANEL
                  <ArrowRight size={22} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Security */}
          <div className="mt-12 pt-8 border-t border-blue-50 flex items-center justify-center gap-3">
            <ShieldCheck size={18} className="text-blue-500" />
            <p className="text-[10px] text-blue-900/30 font-black uppercase tracking-[0.2em]">
              Secured by Invetarx Cloud Protocol
            </p>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] text-blue-900/20 font-black uppercase tracking-[0.4em]">
          © 2026 INDUSTRIAL SOLUTIONS CORP.
        </p>
      </motion.div>
    </main>
  );
};