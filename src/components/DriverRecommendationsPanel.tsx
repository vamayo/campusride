import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Car,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Luggage,
  ChevronRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { RiderRecommendation, TripPost } from '../types/carpool';

interface DriverRecommendationsPanelProps {
  onSelectTrip: (trip: TripPost) => void;
  driverTripId?: string;
}

export const DriverRecommendationsPanel: React.FC<DriverRecommendationsPanelProps> = ({
  onSelectTrip,
  driverTripId,
}) => {
  const {
    currentStudent,
    trips,
    getRiderRecommendations,
    combinePosts,
    getStudentById,
  } = useCarpool();

  const [isExpanded, setIsExpanded] = useState(true);
  const [justCombinedId, setJustCombinedId] = useState<string | null>(null);

  const recommendations = getRiderRecommendations(driverTripId);

  // If current student has no driver trips, check if they are marked as a driver or have any trips
  const driverTrips = trips.filter(
    (t) => t.authorId === currentStudent.id && t.postType === 'driver_offer'
  );

  if (driverTrips.length === 0 || recommendations.length === 0) {
    return null;
  }

  const handleCombine = (rec: RiderRecommendation) => {
    combinePosts(rec.driverTrip.id, rec.riderTrip.id);
    setJustCombinedId(rec.riderTrip.id);
    setTimeout(() => setJustCombinedId(null), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950/10 via-slate-900/5 to-emerald-950/20 dark:from-emerald-950/30 dark:via-slate-900/40 dark:to-emerald-950/40 rounded-3xl border border-emerald-500/20 p-5 sm:p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rider Recommendations for Your Drives
              </h3>
              <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                {recommendations.length} Match{recommendations.length > 1 ? 'es' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Students looking for rides matching your planned routes. Combine posts to carpool together!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {recommendations.map((rec) => {
            const isJustCombined = justCombinedId === rec.riderTrip.id;

            return (
              <div
                key={`${rec.driverTrip.id}-${rec.riderTrip.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all"
              >
                <div>
                  
                  {/* Top Match Badge Line */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 font-mono text-[11px]">
                        {rec.matchScore}% Route Match
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-[11px] text-slate-500">
                        {rec.riderTrip.breakCategory.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {rec.riderTrip.departureDate}
                    </span>
                  </div>

                  {/* Rider Profile Mini-Lockup */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={rec.rider.avatarUrl}
                        alt={rec.rider.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/40"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {rec.rider.name}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {rec.rider.major.split('&')[0]} · {rec.rider.campusHub}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectTrip(rec.riderTrip)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium whitespace-nowrap"
                    >
                      View Request
                    </button>
                  </div>

                  {/* Route & Destination Wanted */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 mb-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span>Needs ride to:</span>
                      <span className="text-emerald-800 dark:text-emerald-300">
                        {rec.riderTrip.destinationCity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Dropoff: {rec.riderTrip.destinationDropoff}
                    </p>
                  </div>

                  {/* Match Reasons List */}
                  <div className="space-y-1 mb-4 text-[11px] text-slate-600 dark:text-slate-400">
                    {rec.matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{reason}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer Action: Combine Posts */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Carpool: <strong className="text-slate-800 dark:text-slate-200">{rec.driverTrip.destinationCity}</strong>
                  </div>

                  <button
                    onClick={() => handleCombine(rec)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    {isJustCombined ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Posts Combined!</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Combine Posts & Carpool</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
