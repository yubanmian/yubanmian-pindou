
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md bg-opacity-90">
        <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
