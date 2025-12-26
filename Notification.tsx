import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose }) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setDisplay(true);
      const timer = setTimeout(() => {
        setDisplay(false);
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!display) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] bg-orange-500 text-white p-4 rounded-xl font-bold text-center z-[100] shadow-xl animate-[slideDown_0.5s_ease-out]">
      {message}
      <style>{`
        @keyframes slideDown {
          from { top: -100px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};