import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

export interface NotificationProps extends Notification {
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  autoClose = true,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  }, [id, onClose]);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);
  }, []);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, autoClose, duration, handleClose]);

  const getIcon = () => {
    const iconProps = { size: 20, className: 'flex-shrink-0' };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600 dark:text-green-400" />;
      case 'error':
        return <XCircle {...iconProps} className="text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info {...iconProps} className="text-blue-600 dark:text-blue-400" />;
      default:
        return <Info {...iconProps} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'border shadow-lg backdrop-blur-sm';
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50/90 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
      default:
        return `${baseStyles} bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl max-w-md transition-all duration-300 transform ${
        isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : isLeaving 
          ? 'translate-x-full opacity-0 scale-95'
          : 'translate-x-full opacity-0 scale-95'
      } ${getStyles()}`}
      style={{
        animation: isVisible && !isLeaving ? 'slideInFromRight 0.3s ease-out' : undefined
      }}
    >
      <div className="flex-shrink-0 pt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        {message && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{message}</p>
        )}
        {autoClose && (
          <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ease-linear ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear`
              }}
            />
          </div>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
        type="button"
        aria-label="Fechar notificação"
      >
        <X size={14} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
      </button>
    </div>
  );
};

export interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification, index) => (
        <div key={notification.id} style={{ animationDelay: `${index * 100}ms` }}>
          <NotificationItem
            {...notification}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationItem;