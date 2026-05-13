import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export type ToastType = 'success' | 'error';

export interface ToastState {
  type: ToastType;
  message: string;
}

interface BottomToastProps {
  toast: ToastState | null;
}

export const BottomToast: React.FC<BottomToastProps> = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4"
        >
          <div
            className={`min-w-[280px] max-w-[560px] rounded-2xl border px-5 py-3 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-600/95 border-emerald-300/30 text-white'
                : 'bg-rose-600/95 border-rose-300/30 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="text-xs font-black uppercase tracking-wide">{toast.message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
