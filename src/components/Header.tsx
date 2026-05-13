import React from 'react';
import { Package, LogOut, Activity, Box, Truck, QrCode, BarChart3, Users, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModuleId, AuthResponse } from '../types';

interface HeaderProps {
  activeModule: ModuleId;
  setActiveModule: (v: ModuleId) => void;
  session: AuthResponse;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  session,
  onLogout,
  isDarkMode,
  toggleDarkMode
}) => {
  const navItems = [
    { id: 'resumen' as ModuleId, label: 'Panel', icon: Activity },
    { id: 'inventario' as ModuleId, label: 'Inventario', icon: Box },
    { id: 'entregas' as ModuleId, label: 'Despacho', icon: Truck },
    { id: 'qr' as ModuleId, label: 'Mi QR', icon: QrCode },
    { id: 'auditoria' as ModuleId, label: 'Auditoría', icon: BarChart3 },
    { id: 'usuarios' as ModuleId, label: 'Talento', icon: Users },
  ].filter((item) => (item.id === 'usuarios' ? session.role === 'ADMIN' : true));

  return (
    <header className="sticky top-0 z-[100] px-4 md:px-8 py-6 flex justify-center w-full">
      <div className={`w-full max-w-[1700px] flex justify-between items-center border rounded-[2.5rem] p-3 px-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-blue-50/50'}`}>
        
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30"
          >
            <Package size={24} strokeWidth={2.5} />
          </motion.div>
          <div className="hidden xl:block">
            <h2 className={`text-2xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              INVETAR<span className="text-blue-600">X</span>
            </h2>
            <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1.5">Ecosistema Pro</p>
          </div>
        </div>

        <nav className={`hidden lg:flex gap-1.5 p-1.5 rounded-[2.2rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-100/80 border-slate-200/60'}`}>
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveModule(item.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeModule === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' : (isDarkMode ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5' : 'text-slate-500 hover:text-slate-950 hover:bg-white')}`}
            >
              <item.icon size={15} strokeWidth={2.5} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button 
            onClick={toggleDarkMode}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isDarkMode ? 'bg-white/10 border-white/10 text-amber-400 hover:bg-white/20' : 'bg-white border-slate-200 text-slate-950 hover:bg-slate-50 shadow-sm'}`}
          >
            {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </button>

          <div className="text-right hidden sm:block px-2">
            <p className={`text-sm font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{session.fullName || session.username}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{session.role}</p>
          </div>

          <button 
            onClick={onLogout} 
            className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-90"
          >
            <LogOut size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
};
