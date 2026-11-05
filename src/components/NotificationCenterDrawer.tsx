import React, { useState } from 'react';
import {
  X,
  Bell,
  Car,
  DollarSign,
  Calendar,
  Sparkles,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { NotificationCategory, AppNotification } from '../types/carpool';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenTrip: (tripId: string) => void;
  onOpenSplit: (tripId: string) => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenTrip,
  onOpenSplit,
}) => {
  const {
    currentStudent,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    triggerTestReminder,
  } = useCarpool();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filter notifications for current student
  const studentNotifications = notifications.filter(
    (n) => n.recipientId === currentStudent.id
  );

  const filtered = studentNotifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'departure_reminder':
        return <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'payment_reminder':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'upcoming_trip':
        return <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.tripId) {
      onClose();
      if (notif.actionType === 'view_split') {
        onOpenSplit(notif.tripId);
      } else {
        onOpenTrip(notif.tripId);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Push Notifications
              </h3>
              <p className="text-[11px] text-slate-500">
                Departure reminders & cost split alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs & Mark All Read */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'departure_reminder', label: 'Departure' },
              { id: 'payment_reminder', label: 'Payment' },
              { id: 'upcoming_trip', label: 'Trips' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium whitespace-nowrap flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Instant Test Push Alert Strip */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Test Push Alerts:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => triggerTestReminder('departure')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              🚗 Departure
            </button>
            <button
              onClick={() => triggerTestReminder('payment')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              💵 Payment
            </button>
            <button
              onClick={() => triggerTestReminder('upcoming')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              📅 Upcoming
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No notifications in this filter
              </p>
              <p className="text-[11px] text-slate-400">
                You're all caught up on trip reminders and payments!
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all relative ${
                  item.isRead
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.tripId && (
                          <button
                            onClick={() => handleNotificationClick(item)}
                            className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
                          >
                            <span>{item.actionType === 'view_split' ? 'Settle' : 'View'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded"
                          title="Delete alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {studentNotifications.filter((n) => !n.isRead).length} unread reminder(s)
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Push Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
};
