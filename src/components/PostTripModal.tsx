import React, { useState } from 'react';
import {
  X,
  Car,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Compass,
  Luggage,
  Sparkles,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { TripPost } from '../types/carpool';

interface PostTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCalculatedData?: {
    distanceMiles: number;
    fuelCost: number;
    tollsCost: number;
    totalCost: number;
    splitPerSeat: number;
    seats: number;
  } | null;
}

export const PostTripModal: React.FC<PostTripModalProps> = ({
  isOpen,
  onClose,
  initialCalculatedData,
}) => {
  const { currentStudent, createTrip } = useCarpool();

  const [postType, setPostType] = useState<'driver_offer' | 'rider_request'>(
    currentStudent.isDriver ? 'driver_offer' : 'rider_request'
  );

  const [originCampus, setOriginCampus] = useState(currentStudent.university);
  const [originHub, setOriginHub] = useState(currentStudent.campusHub || 'Tressider Memorial Union Lot');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationDropoff, setDestinationDropoff] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-11-25');
  const [departureTime, setDepartureTime] = useState('02:00 PM');
  const [returnDate, setReturnDate] = useState('');
  const [breakCategory, setBreakCategory] = useState<
    'weekend' | 'thanksgiving' | 'winter_break' | 'spring_break' | 'airport_run'
  >('thanksgiving');

  const [totalSeats, setTotalSeats] = useState<number>(
    initialCalculatedData?.seats || (currentStudent.vehicleInfo?.totalSeats ? currentStudent.vehicleInfo.totalSeats - 1 : 3)
  );
  const [distanceMiles, setDistanceMiles] = useState<number>(
    initialCalculatedData?.distanceMiles || 150
  );
  const [fuelCostEst, setFuelCostEst] = useState<number>(
    initialCalculatedData?.fuelCost || 30
  );
  const [tollsCostEst, setTollsCostEst] = useState<number>(
    initialCalculatedData?.tollsCost || 7
  );
  const [suggestedSplit, setSuggestedSplit] = useState<number>(
    initialCalculatedData?.splitPerSeat || 15
  );
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationCity.trim()) return;

    const totalEst = fuelCostEst + tollsCostEst;

    createTrip({
      postType,
      originCampus,
      originHub,
      destinationCity: destinationCity.trim(),
      destinationDropoff: destinationDropoff.trim() || 'Central transit / campus dropoff',
      departureDate,
      departureTime,
      returnDate: returnDate || undefined,
      breakCategory,
      totalSeats,
      estimatedDistanceMiles: distanceMiles,
      fuelCostEst,
      tollsCostEst,
      totalEstimatedCost: totalEst,
      suggestedSplitPerSeat: suggestedSplit,
      notes: notes.trim() || 'Excited to carpool! Please message with your luggage size and meeting spot.',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Post to Discussion Board
            </h3>
            <p className="text-xs text-slate-500">
              Posting as {currentStudent.name} ({currentStudent.university})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Post Type Selector (Driver Offer vs Rider Request) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Post Intent
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPostType('driver_offer')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  postType === 'driver_offer'
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Offering Seats (I'm Driving)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Have open seats in your car, offset gas & toll costs with peers.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPostType('rider_request')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  postType === 'rider_request'
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Need a Ride (Rider Request)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Looking for a seat heading to your hometown, airport, or break destination.
                </p>
              </button>
            </div>
          </div>

          {/* Academic Break / Event Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Trip Category / Academic Period
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'weekend', label: 'Weekend' },
                { id: 'thanksgiving', label: 'Thanksgiving' },
                { id: 'winter_break', label: 'Winter Recess' },
                { id: 'spring_break', label: 'Spring Break' },
                { id: 'airport_run', label: 'Airport Run' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setBreakCategory(cat.id as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    breakCategory === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Route Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Campus Departure Hub
              </label>
              <input
                type="text"
                required
                value={originHub}
                onChange={(e) => setOriginHub(e.target.value)}
                placeholder="e.g. Tressider Union, FloMo, Wilbur Lot"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Destination City & State
              </label>
              <input
                type="text"
                required
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="e.g. South Lake Tahoe, Los Angeles, SFO"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Dropoff Area / Transit Landmark (Optional)
              </label>
              <input
                type="text"
                value={destinationDropoff}
                onChange={(e) => setDestinationDropoff(e.target.value)}
                placeholder="e.g. Heavenly Village, Westwood UCLA, Terminal 2"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Departure Date
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Departure Time
              </label>
              <input
                type="text"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="e.g. 03:30 PM"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Return Date (Optional)
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Seats & Cost Split Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {postType === 'driver_offer' ? 'Available Passenger Seats' : 'Seats Requested'}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => {
                      setTotalSeats(s);
                      // Recalculate suggested split
                      const total = fuelCostEst + tollsCostEst;
                      setSuggestedSplit(Math.round((total / (s + 1)) * 100) / 100);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-colors ${
                      totalSeats === s
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Est. Distance (Miles)
                </label>
                <input
                  type="number"
                  min="1"
                  value={distanceMiles}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setDistanceMiles(d);
                    const fuel = Math.round((d / 28) * 4.2 * 100) / 100;
                    setFuelCostEst(fuel);
                    const total = fuel + tollsCostEst;
                    setSuggestedSplit(Math.round((total / (totalSeats + 1)) * 100) / 100);
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Suggested Split Per Seat ($)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={suggestedSplit}
                    onChange={(e) => setSuggestedSplit(Number(e.target.value))}
                    className="w-full pl-6 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums font-bold text-emerald-800 dark:text-emerald-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Trip Details, Rest Stops & Luggage Space
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Roof rack available for skis/snowboards. Stopping in Sacramento for quick dinner. Good Spotify playlist!"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/50 text-[11px] text-emerald-900 dark:text-emerald-300">
            <strong>Privacy Shield Active:</strong> Your phone number and payment handles (Venmo/Zelle) will NOT appear on this public post. They are automatically masked and only revealed once you approve a student's seat request.
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-sm transition-all"
            >
              Publish to Board
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
