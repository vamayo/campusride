import React, { useState } from 'react';
import {
  Car,
  Compass,
  Calendar,
  Clock,
  ShieldCheck,
  Users,
  MessageSquare,
  DollarSign,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock4,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { TripPost } from '../types/carpool';

interface MyTripsViewProps {
  onSelectTrip: (trip: TripPost) => void;
  onOpenPostModal: () => void;
  onOpenChat: (tripId: string) => void;
  onOpenSplit: (tripId: string) => void;
  onExploreBoard: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  onSelectTrip,
  onOpenPostModal,
  onOpenChat,
  onOpenSplit,
  onExploreBoard,
}) => {
  const {
    currentStudent,
    trips,
    getStudentById,
    getRiderRecommendations,
    combinePosts,
  } = useCarpool();
  const [filterMode, setFilterMode] = useState<'all' | 'driving' | 'riding'>('all');
  const [combinedAlertTripId, setCombinedAlertTripId] = useState<string | null>(null);

  const drivingTrips = trips.filter((t) => t.authorId === currentStudent.id);
  const ridingTrips = trips.filter((t) =>
    t.roster.some((r) => r.studentId === currentStudent.id)
  );

  const displayedTrips =
    filterMode === 'driving'
      ? drivingTrips
      : filterMode === 'riding'
      ? ridingTrips
      : trips.filter(
          (t) =>
            t.authorId === currentStudent.id ||
            t.roster.some((r) => r.studentId === currentStudent.id)
        );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            My Carpools & Scheduled Travel
          </h1>
          <p className="text-xs text-slate-500">
            Active carpool rosters, seat approvals, and confirmed itineraries for {currentStudent.name}
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-xl shadow-sm transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Trip</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterMode === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All My Rides ({drivingTrips.length + ridingTrips.length})
        </button>
        <button
          onClick={() => setFilterMode('driving')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterMode === 'driving'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Driving ({drivingTrips.length})
        </button>
        <button
          onClick={() => setFilterMode('riding')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterMode === 'riding'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Passenger / Riding ({ridingTrips.length})
        </button>
      </div>

      {/* Trip List */}
      {displayedTrips.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Car className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Scheduled Carpools in this View
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {filterMode === 'driving'
              ? "You haven't posted any trips as a driver yet. Post a ride to offset gas!"
              : "You haven't joined any carpools yet. Check the discussion board for seats!"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onExploreBoard}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Browse Discussion Board
            </button>
            <button
              onClick={onOpenPostModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-sm"
            >
              Post a Trip
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedTrips.map((trip) => {
            const isDriving = trip.authorId === currentStudent.id;
            const myRosterItem = trip.roster.find((r) => r.studentId === currentStudent.id);
            const driver = getStudentById(trip.authorId);
            const pendingCount = trip.roster.filter((r) => r.status === 'pending').length;
            const acceptedCount = trip.roster.filter((r) => r.status === 'accepted').length;

            return (
              <div
                key={trip.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  
                  {/* Top Status Badge */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        isDriving
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : myRosterItem?.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {isDriving
                        ? 'You are Driving'
                        : myRosterItem?.status === 'accepted'
                        ? 'Confirmed Passenger'
                        : 'Seat Request Pending'}
                    </span>

                    <span className="font-mono text-slate-400 text-[11px]">
                      {trip.departureDate}
                    </span>
                  </div>

                  {/* Route */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                    <span>{trip.originCampus.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{trip.destinationCity}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 truncate">
                    Pickup: {trip.originHub} · Dropoff: {trip.destinationDropoff}
                  </p>

                  {/* Roster & Stats */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 mb-4 space-y-1.5 text-xs">
                    {isDriving ? (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Roster: {acceptedCount} confirmed passenger(s)
                        </span>
                        {pendingCount > 0 && (
                          <span className="text-amber-800 dark:text-amber-300 font-bold font-mono">
                            {pendingCount} request(s) awaiting your review!
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Driver: {driver?.name || 'Fellow Student'}
                        </span>
                        <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                          ${trip.suggestedSplitPerSeat.toFixed(2)} fair split
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rider Recommendations for This Drive */}
                  {isDriving && trip.availableSeats > 0 && (() => {
                    const matchRecs = getRiderRecommendations(trip.id);
                    if (matchRecs.length === 0) return null;

                    return (
                      <div className="mb-4 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <span>🎯</span>
                            <span>{matchRecs.length} Student Match(es) Seeking This Ride</span>
                          </span>
                        </div>
                        {matchRecs.slice(0, 2).map((rec) => (
                          <div
                            key={rec.riderTrip.id}
                            className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg text-xs border border-emerald-100 dark:border-emerald-900/30"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={rec.rider.avatarUrl}
                                alt={rec.rider.name}
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                  {rec.rider.name}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  Needs: {rec.riderTrip.destinationCity} · {rec.matchScore}% Match
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                combinePosts(trip.id, rec.riderTrip.id);
                                setCombinedAlertTripId(rec.riderTrip.id);
                                setTimeout(() => setCombinedAlertTripId(null), 3000);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shrink-0 transition-colors"
                            >
                              {combinedAlertTripId === rec.riderTrip.id ? 'Combined!' : 'Combine Posts'}
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    View Details & Roster
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenSplit(trip.id)}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Split Expenses"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => onOpenChat(trip.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-2xs hover:bg-slate-800"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
