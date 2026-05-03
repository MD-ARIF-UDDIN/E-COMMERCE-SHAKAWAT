'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gold-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white w-full ${maxWidth} rounded-[2.5rem] border border-gold-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
            >
              {/* Header */}
              <div className="h-16 px-8 border-b border-gold-100 flex items-center justify-between shrink-0 bg-white/50">
                <h2 className="text-[10px] font-black text-gold-900 uppercase tracking-[0.2em]">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gold-400 hover:text-primary hover:bg-gold-900/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar bg-white border border-gold-100">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
