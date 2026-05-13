import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  RefreshCw,
  ChevronDown,
  User
} from 'lucide-react';
import { ModuleId, UserRole } from '../types';

interface DynamicIslandProps {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  modules: ModuleId[];
  moduleLabels: Record<ModuleId, string>;
  moduleIcons: Record<ModuleId, React.ReactNode>;
  session: { username: string; role: UserRole };
  onLogout: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  activeModule,
  setActiveModule,
  modules,
  moduleLabels,
  moduleIcons,
  session,
  onLogout,
  onRefresh,
  isLoading
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="dynamic-island-container">
      <motion.div 
        className="dynamic-island"
        animate={{ 
          width: isExpanded ? 'min(900px, 95vw)' : 'min(500px, 90vw)',
          height: isExpanded ? 'auto' : '64px',
          borderRadius: isExpanded ? '28px' : '32px'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="island-main">
          {/* Active Module Indicator */}
          <div className="island-active-info" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="island-icon-pulse">
              {moduleIcons[activeModule]}
            </div>
            <div className="island-text">
              <span className="island-label">{moduleLabels[activeModule]}</span>
              <span className="island-subtext">Invetarx Pro</span>
            </div>
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="island-chevron"
            >
              <ChevronDown size={18} />
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="island-actions">
            <button 
              className={`island-btn ${isLoading ? 'rotating' : ''}`} 
              onClick={(e) => { e.stopPropagation(); onRefresh(); }}
              title="Sincronizar"
            >
              <RefreshCw size={20} />
            </button>
            <div className="island-divider"></div>
            <div className="island-user" title={`${session.username} (${session.role})`}>
              <User size={20} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="island-expanded-content"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="island-nav-grid">
                {modules.map((m) => (
                  <button 
                    key={m} 
                    className={`island-nav-item ${activeModule === m ? 'active' : ''}`}
                    onClick={() => {
                      setActiveModule(m);
                      setIsExpanded(false);
                    }}
                  >
                    <div className="nav-icon">{moduleIcons[m]}</div>
                    <span>{moduleLabels[m]}</span>
                  </button>
                ))}
              </div>
              
              <div className="island-footer">
                <div className="user-details">
                  <p className="user-name">{session.username}</p>
                  <p className="user-role">{session.role}</p>
                </div>
                <button className="btn-logout" onClick={onLogout}>
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
