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
    <header className="sticky top-0 z-[100] px-4 md:px-8 py-8 flex justify-center w-full bg-transparent">
      <div className={`w-full max-w-[1700px] flex justify-between items-center border rounded-[2.5rem] p-4 px-10 shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10 backdrop-blur-2xl' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
        
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30"
          >
            <Package size={28} strokeWidth={2.5} />
          </motion.div>
          <div className="hidden sm:block">
            <h2 className={`text-3xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              INVETAR<span className="text-blue-600">X</span>
            </h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-2">Ecosistema Pro</p>
          </div>
        </div>

        <nav className={`hidden lg:flex gap-2 p-2 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveModule(item.id)}
              className={`flex items-center gap-3 px-7 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeModule === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : (isDarkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-600 hover:text-slate-950')}`}
            >
              <item.icon size={16} strokeWidth={2.5} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={toggleDarkMode}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${isDarkMode ? 'bg-white/10 border-white/10 text-amber-400 hover:bg-white/20' : 'bg-white border-slate-200 text-slate-950 hover:bg-slate-50 shadow-sm'}`}
          >
            {isDarkMode ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
          </button>

          <div className="text-right hidden md:block">
            <p className={`text-base font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{session.fullName || session.username}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{session.role}</p>
          </div>

          <button 
            onClick={onLogout} 
            className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-90"
          >
            <LogOut size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
};
