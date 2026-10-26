import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 GeekTabs-card p-10 rounded-[3rem] w-full max-w-sm shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold word-color mb-4">{title}</h2>
        <p className="text-sm word-color opacity-70 mb-8 w-full font-medium">{message}</p>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-black/5 dark:bg-white/5 word-color rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold shadow-lg shadow-red-500/20"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
