import React, { createContext, useContext, useState } from 'react';
import Toast from '@/components/Toast';

const ToastContext = createContext<any>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
