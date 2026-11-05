import React from 'react';
import {
  Bell,
  Car,
  DollarSign,
  Calendar,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';

interface PushNotificationToastProps {
  onOpenTrip?: (tripId: string) => void;
  onOpenSplit?: (tripId: string) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  onOpenTrip,
  onOpenSplit,
}) => {
  const { activePushToast, dismissPushToast, markNotificationAsRead } = useCarpool();

  if (!activePushToast) return null;

  const getIcon = () => {
    switch (activePushToast.category) {
      case 'departure_reminder':
        return <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'payment_reminder':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'upcoming_trip':
        return <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const handleAction = () => {
    markNotificationAsRead(activePushToast.id);
    if (activePushToast.tripId) {
      if (activePushToast.actionType === 'view_split' && onOpenSplit) {
        onOpenSplit(activePushToast.tripId);
      } else if (onOpenTrip) {
        onOpenTrip(activePushToast.tripId);
      }
    }
    dismissPushToast();
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              CampusRide Push Alert
            </span>
            <span className="text-[10px] font-mono text-slate-400">Just now</span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {activePushToast.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {activePushToast.message}
          </p>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {activePushToast.tripId && (
              <button
                onClick={handleAction}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
              >
                <span>{activePushToast.actionType === 'view_split' ? 'Settle Payment' : 'View Itinerary'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={dismissPushToast}
              className="text-xs text-slate-500 hover:text-slate-700 ml-auto"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={dismissPushToast}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
