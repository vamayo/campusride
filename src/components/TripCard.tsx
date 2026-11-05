import React from 'react';
import {
  Car,
  Compass,
  Calendar,
  Clock,
  ShieldCheck,
  Users,
  DollarSign,
  ArrowRight,
  Luggage,
  Sparkles,
  Lock,
} from 'lucide-react';
import { TripPost, StudentProfile } from '../types/carpool';
import { useCarpool } from '../context/CarpoolContext';

interface TripCardProps {
  trip: TripPost;
  onSelect: (trip: TripPost) => void;
}

const BREAK_LABELS: Record<string, string> = {
  weekend: 'Weekend Getaway',
  thanksgiving: 'Thanksgiving Break',
  winter_break: 'Winter Recess',
  spring_break: 'Spring Break',
  airport_run: 'Airport Run',
};

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  const { currentStudent, getStudentById, getDisplayContact } = useCarpool();
  const author = getStudentById(trip.authorId);

  if (!author) return null;

  const contact = getDisplayContact(author, trip.id);
  const isMyTrip = trip.authorId === currentStudent.id;
  const isDriverOffer = trip.postType === 'driver_offer';

  // Check current student's status on this trip
  const myRosterEntry = trip.roster.find((r) => r.studentId === currentStudent.id);
  const isAccepted = myRosterEntry?.status === 'accepted';
  const isPending = myRosterEntry?.status === 'pending';

  return (
    <div
      onClick={() => onSelect(trip)}
      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Top Kicker Line: Role & Academic Break Category (Unboxed typography with separators) */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            {trip.isCombined ? (
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <span>🔀</span>
                <span>Combined Carpool</span>
              </span>
            ) : trip.combinedRiderRequestIds && trip.combinedRiderRequestIds.length > 0 ? (
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <span>🔀</span>
                <span>Combined ({trip.combinedRiderRequestIds.length} Merged)</span>
              </span>
            ) : (
              <span
                className={`font-semibold ${
                  isDriverOffer
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-blue-700 dark:text-blue-400'
                }`}
              >
                {isDriverOffer ? 'Driver Offering Seats' : 'Rider Seeking Carpool'}
              </span>
            )}
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span>{BREAK_LABELS[trip.breakCategory] || 'Break Travel'}</span>
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            {contact.isUnlocked ? (
              <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                Contact Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500">
                <Lock className="w-3 h-3" />
                <span>Privacy Protected</span>
              </span>
            )}
          </div>
        </div>

        {/* Primary Destination Route Lockup */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {trip.originCampus.split(' ')[0]}
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {trip.destinationCity}
            </h3>
          </div>
          <p className="text-xs text-slate-500 truncate">
            Dropoff: {trip.destinationDropoff}
          </p>
        </div>

        {/* Itinerary Details: Unboxed metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">{trip.departureDate}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{trip.departureTime}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>{trip.estimatedDistanceMiles} mi</span>
        </div>

        {/* Notes preview */}
        {trip.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            "{trip.notes}"
          </p>
        )}
      </div>

      {/* Card Footer: Author Profile & Cost Split Callout */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        
        {/* Author info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={author.avatarUrl}
            alt={author.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {contact.displayName}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {isDriverOffer && author.vehicleInfo
                ? `${author.vehicleInfo.make} ${author.vehicleInfo.model}`
                : author.major.split('&')[0]}
            </p>
          </div>
        </div>

        {/* Cost & Seat Status */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ${trip.suggestedSplitPerSeat.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500">/ seat</span>
          </div>
          <p className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400">
            {isDriverOffer
              ? `${trip.availableSeats} of ${trip.totalSeats} seats open`
              : 'Looking for 1 seat'}
          </p>
        </div>

      </div>

      {/* Combined Carpool Notice Ribbon */}
      {trip.isCombined && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
          <span className="flex items-center gap-1">
            <span>🔀</span>
            <span>{trip.combinedSummary || 'Combined into active carpool'}</span>
          </span>
          <span className="font-semibold">Seat Reserved</span>
        </div>
      )}

      {trip.combinedRiderRequestIds && trip.combinedRiderRequestIds.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
          <span className="flex items-center gap-1">
            <span>🔀</span>
            <span>Combined Carpool ({trip.combinedRiderRequestIds.length} merged request)</span>
          </span>
          <span className="font-semibold">Traveling Together</span>
        </div>
      )}

      {/* User Status Ribbon if already interacting */}
      {isMyTrip && !trip.isCombined && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-900 dark:text-white">Your Trip Post</span>
          <span className="text-slate-500">
            {trip.roster.filter((r) => r.status === 'pending').length} pending request(s)
          </span>
        </div>
      )}

      {!isMyTrip && isAccepted && !trip.isCombined && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
          <span>✓ You are a confirmed passenger</span>
          <span>Contact unlocked</span>
        </div>
      )}

      {!isMyTrip && isPending && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-medium">
          <span>⏳ Seat request pending driver review</span>
          <span>Details reserved</span>
        </div>
      )}
    </div>
  );
};
