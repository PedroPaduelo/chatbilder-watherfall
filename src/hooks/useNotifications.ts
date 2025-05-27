import { useState, useCallback } from 'react';
import type { Notification, NotificationType } from '../components/Notification';
import { generateId } from '../utils/helpers';
import { UI_CONSTANTS } from '../utils/constants';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    const notification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? (type === 'error' ? UI_CONSTANTS.NOTIFICATIONS.ERROR_DURATION : UI_CONSTANTS.NOTIFICATIONS.DEFAULT_DURATION)
    };

    setNotifications(prev => [...prev, notification]);
    return notification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifySuccess = useCallback((title: string, message?: string) => {
    return addNotification('success', title, message);
  }, [addNotification]);

  const notifyError = useCallback((title: string, message?: string) => {
    return addNotification('error', title, message);
  }, [addNotification]);

  const notifyWarning = useCallback((title: string, message?: string) => {
    return addNotification('warning', title, message);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyError,
    notifyWarning
  };
};