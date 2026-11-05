import React, { useState } from 'react';
import {
  X,
  Car,
  Compass,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Lock,
  Unlock,
  Phone,
  DollarSign,
  Users,
  MessageSquare,
  Luggage,
  Music,
  CheckCircle2,
  XCircle,
  Clock4,
  AlertCircle,
  Copy,
  Check,
  Star,
} from 'lucide-react';
import { TripPost, StudentProfile } from '../types/carpool';
import { useCarpool } from '../context/CarpoolContext';

interface TripDetailDrawerProps {
  trip: TripPost | null;
  onClose: () => void;
  onOpenChat: (tripId: string) => void;
  onOpenSplit: (tripId: string) => void;
  onOpenRateReview?: (targetStudent: StudentProfile, trip: TripPost, role: 'driver' | 'rider') => void;
}

export const TripDetailDrawer: React.FC<TripDetailDrawerProps> = ({
  trip,
  onClose,
  onOpenChat,
  onOpenSplit,
  onOpenRateReview,
}) => {
  const {
    currentStudent,
    trips,
    getStudentById,
    getDisplayContact,
    getStudentRatingStats,
    requestSeat,
    cancelSeatRequest,
    handleRosterDecision,
    deleteTrip,
    combinePosts,
    uncombinePosts,
  } = useCarpool();

  const [requestedSeats, setRequestedSeats] = useState<number>(1);
  const [pickupNote, setPickupNote] = useState<string>('');
  const [showRequestForm, setShowRequestForm] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // For drivers viewing a rider request
  const myDriverTrips = trips.filter(
    (t) => t.authorId === currentStudent.id && t.postType === 'driver_offer' && t.availableSeats > 0
  );
  const [selectedDriverTripId, setSelectedDriverTripId] = useState<string>(
    myDriverTrips[0]?.id || ''
  );
  const [combineSuccess, setCombineSuccess] = useState<boolean>(false);

  if (!trip) return null;

  const author = getStudentById(trip.authorId);
  if (!author) return null;

  const contact = getDisplayContact(author, trip.id);
  const isMyTrip = trip.authorId === currentStudent.id;
  const isDriverOffer = trip.postType === 'driver_offer';

  // Roster entries
  const myRosterEntry = trip.roster.find((r) => r.studentId === currentStudent.id);
  const isAccepted = myRosterEntry?.status === 'accepted';
  const isPending = myRosterEntry?.status === 'pending';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestSeat(trip.id, requestedSeats, pickupNote);
    setShowRequestForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isDriverOffer
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {isDriverOffer ? 'Driver Offer' : 'Rider Request'}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: #{trip.id.slice(-6)}</span>
          </div>

          <div className="flex items-center gap-2">
            {isMyTrip && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this trip post?')) {
                    deleteTrip(trip.id);
                    onClose();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Delete Post
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Route Title */}
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-1">
              <span>{trip.originCampus}</span>
              <span>→</span>
              <span>{trip.destinationCity}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {trip.destinationCity}
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Dropoff: {trip.destinationDropoff}</span>
            </p>
          </div>

          {/* Key Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Departure</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                {trip.departureDate}
              </p>
              <span className="text-[10px] text-slate-400">{trip.departureTime}</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Seats Open</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                {trip.availableSeats} of {trip.totalSeats}
              </p>
              <span className="text-[10px] text-slate-400">{trip.estimatedDistanceMiles} mi</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Fair Split</p>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5 tabular-nums">
                ${trip.suggestedSplitPerSeat.toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-400">per seat</span>
            </div>
          </div>

          {/* Departure Campus Hub */}
          <div className="p-3 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Campus Pickup Landmark
            </p>
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              {trip.originHub}
            </p>
          </div>

          {/* COMBINED POST STATUS BANNER */}
          {trip.isCombined && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔀</span>
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    Combined Carpool Post
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Post Merged
                </span>
              </div>
              <p className="text-xs text-emerald-900/90 dark:text-emerald-300/90 leading-relaxed">
                {trip.combinedSummary || 'This ride request has been combined with a driver carpool.'} Roster seat has been reserved and contact details are unlocked.
              </p>
              {(isMyTrip || (trip.combinedIntoTripId && trips.find(t => t.id === trip.combinedIntoTripId)?.authorId === currentStudent.id)) && (
                <button
                  onClick={() => {
                    if (trip.combinedIntoTripId && confirm('Separate these combined carpool posts?')) {
                      uncombinePosts(trip.combinedIntoTripId, trip.id);
                    }
                  }}
                  className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 hover:underline pt-1"
                >
                  Separate / Uncombine Posts
                </button>
              )}
            </div>
          )}

          {/* DRIVER HAS COMBINED ABSORBED POSTS */}
          {trip.combinedRiderRequestIds && trip.combinedRiderRequestIds.length > 0 && (
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🔀</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Combined Carpool ({trip.combinedRiderRequestIds.length} Merged Request)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You combined student ride requests into this carpool to travel together and share expenses.
              </p>
            </div>
          )}

          {/* DRIVER RECOMMENDATION: COMBINE POSTS (If viewing an uncombined rider request and viewer has driver trips) */}
          {!isDriverOffer && !trip.isCombined && myDriverTrips.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                    <span>✨ Driver Match: Combine Posts & Carpool</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    You are driving along this route! You can merge {author.name}'s request into your carpool with one click.
                  </p>
                </div>
              </div>

              {myDriverTrips.length > 1 && (
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Select Your Carpool to Merge Into:
                  </label>
                  <select
                    value={selectedDriverTripId}
                    onChange={(e) => setSelectedDriverTripId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {myDriverTrips.map((dt) => (
                      <option key={dt.id} value={dt.id}>
                        {dt.destinationCity} ({dt.departureDate}) · {dt.availableSeats} seat(s) open
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => {
                  const targetDriverTripId = selectedDriverTripId || myDriverTrips[0]?.id;
                  if (targetDriverTripId) {
                    combinePosts(targetDriverTripId, trip.id);
                    setCombineSuccess(true);
                    setTimeout(() => setCombineSuccess(false), 3000);
                  }
                }}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                {combineSuccess ? (
                  <span>✓ Posts Combined! Roster Updated</span>
                ) : (
                  <>
                    <span>🔀</span>
                    <span>Combine Posts & Accept {author.name.split(' ')[0]} into Carpool</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Notes & Description */}
          {trip.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Trip Details & Rest Stops
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {trip.notes}
              </p>
            </div>
          )}

          {/* Author Profile & Vehicle Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {isDriverOffer ? 'Driver Profile' : 'Requesting Student Profile'}
            </p>
            <div className="p-4 bg-white dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {contact.displayName}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3" />
                        .edu Verified
                      </span>
                      {(() => {
                        const stats = getStudentRatingStats(author.id);
                        return (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/60">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-mono tabular-nums">{stats.average.toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">({stats.count})</span>
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-slate-500">
                      {author.major} · Class of {author.gradYear}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {author.campusHub}
                    </p>
                  </div>
                </div>

                {!isMyTrip && onOpenRateReview && (
                  <button
                    onClick={() => onOpenRateReview(author, trip, isDriverOffer ? 'rider' : 'driver')}
                    className="shrink-0 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    title="Leave an anonymous review for this student"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Rate Anonymously</span>
                  </button>
                )}
              </div>

              {author.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  "{author.bio}"
                </p>
              )}

              {/* Vehicle specs if driver */}
              {isDriverOffer && author.vehicleInfo && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span>
                      {author.vehicleInfo.year} {author.vehicleInfo.make} {author.vehicleInfo.model} ({author.vehicleInfo.color})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Plate: {author.vehicleInfo.licensePlateMasked}
                  </span>
                </div>
              )}

              {/* Travel Preferences */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-slate-400" />
                  <span>Max baggage: {author.preferences.luggageSize}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{author.preferences.musicVibe}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Shield & Contact Details Box (Core user requirement!) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {contact.isUnlocked ? (
                  <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Unlock className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Personal & Financial Privacy Shield
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {contact.isUnlocked
                      ? 'Unlocked for confirmed carpool participants'
                      : 'Masked from public view for student safety'}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  contact.isUnlocked
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {contact.isUnlocked ? 'Unlocked' : 'Protected'}
              </span>
            </div>

            {/* Contact Rows */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
              
              {/* Phone */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Direct Phone:</span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className={contact.isUnlocked ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400'}>
                    {contact.phone}
                  </span>
                  {contact.isUnlocked && (
                    <button
                      onClick={() => copyToClipboard(contact.phone, 'phone')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                      title="Copy phone"
                    >
                      {copiedKey === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Venmo */}
              {author.paymentHandles.venmo && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Venmo Handle:</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={contact.isUnlocked ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400'}>
                      {contact.venmo}
                    </span>
                    {contact.isUnlocked && contact.venmo && (
                      <button
                        onClick={() => copyToClipboard(contact.venmo!, 'venmo')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                        title="Copy Venmo"
                      >
                        {copiedKey === 'venmo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Zelle */}
              {author.paymentHandles.zelle && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Zelle:</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={contact.isUnlocked ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400'}>
                      {contact.zelle}
                    </span>
                    {contact.isUnlocked && contact.zelle && (
                      <button
                        onClick={() => copyToClipboard(contact.zelle!, 'zelle')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                        title="Copy Zelle"
                      >
                        {copiedKey === 'zelle' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

            {!contact.isUnlocked && (
              <p className="text-[11px] text-slate-500 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                🔒 Full phone numbers and payment handles are disclosed automatically once your carpool request is accepted by the driver.
              </p>
            )}
          </div>

          {/* Passenger Roster Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Carpool Roster ({trip.roster.filter((r) => r.status === 'accepted').length} Confirmed)
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                {trip.availableSeats} seat(s) remaining
              </span>
            </div>

            {trip.roster.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                No join requests yet. Be the first to join!
              </p>
            ) : (
              <div className="space-y-2">
                {trip.roster.map((passenger) => {
                  const student = getStudentById(passenger.studentId);
                  if (!student) return null;
                  const passengerContact = getDisplayContact(student, trip.id);
                  const isAcceptedRoster = passenger.status === 'accepted';
                  const isPendingRoster = passenger.status === 'pending';
                  const isDeclinedRoster = passenger.status === 'declined';

                  return (
                    <div
                      key={passenger.studentId}
                      className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {passengerContact.displayName}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                                isAcceptedRoster
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : isPendingRoster
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {passenger.status}
                            </span>
                            {(() => {
                              const pStats = getStudentRatingStats(student.id);
                              return (
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{pStats.average.toFixed(1)}</span>
                                  <span className="text-slate-400 font-normal">({pStats.count})</span>
                                </span>
                              );
                            })()}
                          </div>
                          {passenger.pickupNote && (
                            <p className="text-[11px] text-slate-500 truncate">
                              "{passenger.pickupNote}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Driver Actions to Accept/Decline */}
                      {isMyTrip && isPendingRoster && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRosterDecision(trip.id, passenger.studentId, 'accepted')}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRosterDecision(trip.id, passenger.studentId, 'declined')}
                            className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Rate Passenger Option for Driver / Fellow Passengers */}
                      {passenger.studentId !== currentStudent.id && isAcceptedRoster && onOpenRateReview && (
                        <button
                          onClick={() => onOpenRateReview(student, trip, 'driver')}
                          className="shrink-0 text-[11px] font-medium text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                          title="Rate this rider anonymously"
                        >
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Rate Rider</span>
                        </button>
                      )}

                      {/* Passenger View if Accepted */}
                      {!isMyTrip && passenger.studentId === currentStudent.id && isAcceptedRoster && (
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 shrink-0">
                          Confirmed Seat
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Request Seat Form for Riders */}
          {!isMyTrip && !isAccepted && !isPending && trip.availableSeats > 0 && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Request to Join This Carpool
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The driver will review your profile and student credentials before confirming.
              </p>

              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Seats Needed:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(3, trip.availableSeats) }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRequestedSeats(num)}
                          className={`w-7 h-7 rounded text-xs font-bold font-mono transition-colors ${
                            requestedSeats === num
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Pickup Spot Note & Baggage Info:
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    placeholder="e.g. Can meet at Tressider Lot with 1 medium duffle"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-sm transition-all"
                >
                  Send Seat Request to Driver
                </button>
              </form>
            </div>
          )}

          {/* Pending Cancellation Option */}
          {!isMyTrip && isPending && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Request Pending Driver Review
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  You requested {myRosterEntry?.requestedSeats} seat(s).
                </p>
              </div>
              <button
                onClick={() => cancelSeatRequest(trip.id)}
                className="px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors"
              >
                Cancel Request
              </button>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenSplit(trip.id);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Split Calculator</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenChat(trip.id);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-xl shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Trip Chat Thread</span>
          </button>
        </div>

      </div>
    </div>
  );
};
