// Component for setting up notification reminders
import React from 'react';
import type { Reminder } from '@/hooks/useNotifications';

interface ReminderSetupProps {
  permission: NotificationPermission;
  reminders: Reminder[];
  onRequestPermission: () => void;
  onTestNotification: () => void;
}

export default function ReminderSetup({
  permission,
  reminders,
  onRequestPermission,
  onTestNotification,
}: ReminderSetupProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>

      {/* Permission status */}
      <div className="mb-4">
        {permission === 'default' && (
          <button
            onClick={onRequestPermission}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors active:scale-95"
          >
            Enable Notifications
          </button>
        )}

        {permission === 'denied' && (
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-red-800">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Notifications enabled
              </span>
            </div>

            <button
              onClick={onTestNotification}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              Send Test Notification
            </button>
          </div>
        )}
      </div>

      {/* Reminder list */}
      {reminders.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 mb-2">Active Reminders</p>
          {reminders
            .filter(r => r.enabled)
            .map(reminder => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{reminder.title}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatTime(reminder.time)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
