// Hook for managing PWA notifications
import { useState, useEffect, useCallback } from 'react';

export interface Reminder {
  id: number;
  title: string;
  time: string; // HH:MM format
  enabled: number;
  days_of_week: string;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  // Fetch reminders from API
  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reminders');
      if (!response.ok) throw new Error('Failed to fetch reminders');
      const data = await response.json();
      setReminders(data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Schedule notifications via service worker
  const scheduleNotifications = useCallback(async () => {
    if ('serviceWorker' in navigator && permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;

      // Clear existing notifications
      const notifications = await registration.getNotifications();
      notifications.forEach(n => n.close());

      // Schedule new ones based on reminders
      reminders
        .filter(r => r.enabled)
        .forEach(reminder => {
          const [hours, minutes] = reminder.time.split(':').map(Number);
          const now = new Date();
          const scheduledTime = new Date(now);
          scheduledTime.setHours(hours, minutes, 0, 0);

          // If time has passed today, schedule for tomorrow
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }

          const delay = scheduledTime.getTime() - now.getTime();

          // Note: This is a simplified version. For production, use Background Sync API
          setTimeout(() => {
            registration.showNotification('Winter Arc Habit Tracker', {
              body: reminder.title,
              icon: '/icon-192.png',
              badge: '/badge-72.png',
              tag: `reminder-${reminder.id}`,
              requireInteraction: true,
            } as NotificationOptions);
          }, Math.min(delay, 2147483647)); // Max setTimeout value
        });
    }
  }, [reminders, permission]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Test Notification', {
        body: 'Your notifications are working! 🎉',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
      });
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    fetchReminders();
  }, [fetchReminders]);

  useEffect(() => {
    if (permission === 'granted' && reminders.length > 0) {
      scheduleNotifications();
    }
  }, [permission, reminders, scheduleNotifications]);

  return {
    permission,
    reminders,
    loading,
    requestPermission,
    sendTestNotification,
    refetch: fetchReminders,
  };
}
