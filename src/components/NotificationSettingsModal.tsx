import React, { useState } from 'react';
import {
  X,
  Bell,
  Car,
  DollarSign,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Check,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    pushSettings,
    updatePushSettings,
    browserPushPermission,
    requestPushPermission,
    triggerTestReminder,
  } = useCarpool();

  const [testSentType, setTestSentType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = (type: 'departure' | 'payment' | 'upcoming') => {
    triggerTestReminder(type);
    setTestSentType(type);
    setTimeout(() => setTestSentType(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Push Notification Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure departure alerts, upcoming trips, and payment reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Browser Permission Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Device Push Notification Status:
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  browserPushPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {browserPushPermission === 'granted' ? 'Active / Granted' : 'Permission Needed'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Enable browser notifications to receive critical time-sensitive pickup alerts and passenger payment confirmations directly on your phone or computer.
            </p>

            {browserPushPermission !== 'granted' && (
              <button
                type="button"
                onClick={requestPushPermission}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-xs transition-all"
              >
                Grant Device Push Permissions
              </button>
            )}
          </div>

          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Master Push Notifications
              </p>
              <p className="text-[11px] text-slate-500">
                Receive in-app banner toasts and device push alerts
              </p>
            </div>
            <input
              type="checkbox"
              checked={pushSettings.enablePush}
              onChange={(e) => updatePushSettings({ enablePush: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* Granular Notification Options */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notification Preferences
            </h4>

            {/* Departure Reminders */}
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Departure Reminders
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Alerts 2 hours and 30 minutes before campus hub pickup with driver/passenger status.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushSettings.departureReminders}
                onChange={(e) =>
                  updatePushSettings({ departureReminders: e.target.checked })
                }
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Payment & Cost Split Reminders */}
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2.5">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Payment & Cost-Splitting Reminders
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Notifies riders of pending fuel & toll reimbursements and alerts drivers when settled.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushSettings.paymentReminders}
                onChange={(e) =>
                  updatePushSettings({ paymentReminders: e.target.checked })
                }
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Upcoming Trips */}
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Upcoming Holiday & Break Trips
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Early check-ins (24h & 48h before break) to verify luggage size and seat counts.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushSettings.upcomingTrips}
                onChange={(e) =>
                  updatePushSettings({ upcomingTrips: e.target.checked })
                }
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Combined Carpool Alerts */}
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Combined Carpool & Seat Approvals
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Instant alerts when a driver merges your ride request or confirms your seat.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushSettings.combinedCarpoolAlerts}
                onChange={(e) =>
                  updatePushSettings({ combinedCarpoolAlerts: e.target.checked })
                }
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

          </div>

          {/* Test Push Notifications Strip */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-2.5">
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
              <span>🚀 Test Push Notifications Live:</span>
            </h4>
            <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80">
              Simulate realistic student carpool alerts to verify device toast delivery:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleTest('departure')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-2xs text-center"
              >
                {testSentType === 'departure' ? '✓ Alert Sent!' : '🚗 Departure Alert'}
              </button>

              <button
                type="button"
                onClick={() => handleTest('payment')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-2xs text-center"
              >
                {testSentType === 'payment' ? '✓ Alert Sent!' : '💵 Payment Reminder'}
              </button>

              <button
                type="button"
                onClick={() => handleTest('upcoming')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-2xs text-center"
              >
                {testSentType === 'upcoming' ? '✓ Alert Sent!' : '📅 Upcoming Trip'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
