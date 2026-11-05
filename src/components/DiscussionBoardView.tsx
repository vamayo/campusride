import React, { useState } from 'react';
import {
  Car,
  Compass,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Calculator,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { TripPost, BreakCategory } from '../types/carpool';
import { TripCard } from './TripCard';
import { DriverRecommendationsPanel } from './DriverRecommendationsPanel';
import { useCarpool } from '../context/CarpoolContext';

interface DiscussionBoardViewProps {
  onSelectTrip: (trip: TripPost) => void;
  onOpenPostModal: () => void;
  onOpenCalculator: () => void;
}

export const DiscussionBoardView: React.FC<DiscussionBoardViewProps> = ({
  onSelectTrip,
  onOpenPostModal,
  onOpenCalculator,
}) => {
  const { currentStudent, trips } = useCarpool();

  // Dual Feed State: 'driver_offer' vs 'rider_request'
  const [feedType, setFeedType] = useState<'driver_offer' | 'rider_request'>('driver_offer');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<BreakCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hubFilter, setHubFilter] = useState<string>('all');

  const driverOffers = trips.filter((t) => t.postType === 'driver_offer');
  const riderRequests = trips.filter((t) => t.postType === 'rider_request');

  const activeFeedTrips = feedType === 'driver_offer' ? driverOffers : riderRequests;

  // Filtered trips
  const filteredTrips = activeFeedTrips.filter((t) => {
    // Category filter
    if (categoryFilter !== 'all' && t.breakCategory !== categoryFilter) {
      return false;
    }
    // Search query (destination city or dropoff spot)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCity = t.destinationCity.toLowerCase().includes(q);
      const matchDropoff = t.destinationDropoff.toLowerCase().includes(q);
      const matchNotes = t.notes.toLowerCase().includes(q);
      if (!matchCity && !matchDropoff && !matchNotes) return false;
    }
    // Hub filter
    if (hubFilter !== 'all' && !t.originHub.toLowerCase().includes(hubFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate live stats
  const totalSeatsAvailable = driverOffers.reduce((sum, t) => sum + t.availableSeats, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hero Announcement & Value Proposition Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-emerald-300 mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official {currentStudent.university} Student Rideshare Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            Campus Carpools for Weekends & Holiday Breaks
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            Coordinate rides home, to ski resorts, and airport holiday shuttles with verified classmates. Split gas transparently while keeping personal and financial contact strictly protected.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPostModal}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Ride or Request</span>
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Fare & Gas Split Calculator</span>
            </button>
          </div>
        </div>

        {/* Decorative stat strip on right (tabular numbers) */}
        <div className="hidden lg:flex flex-col justify-center items-end absolute right-8 top-0 bottom-0 text-right font-mono">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Verified Drivers</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {driverOffers.length} Active Cars
              </p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Seats Available</p>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                {totalSeatsAvailable} Open Spots
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DRIVER RECOMMENDATIONS PANEL */}
      <DriverRecommendationsPanel onSelectTrip={onSelectTrip} />

      {!currentStudent.isDriver && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Testing Tip for Driver Recommendations:</strong> Use the student switcher in the top right bar to switch to <strong>Alex Rivera</strong> (Senior Driver with Subaru) or <strong>Jordan Lee</strong> to see automated route matching and 1-click post combining in action!
            </span>
          </div>
        </div>
      )}

      {/* DUAL-FEED SELECTOR (Crucial aligned decision) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        
        {/* Segmented control for Driver Offers vs Rider Requests */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setFeedType('driver_offer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              feedType === 'driver_offer'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Driver Offers (Seats Available)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
              {driverOffers.length}
            </span>
          </button>

          <button
            onClick={() => setFeedType('rider_request')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              feedType === 'rider_request'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Rider Requests (Looking for Ride)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
              {riderRequests.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination, city, dropoff..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

      </div>

      {/* Break & Event Filter Bar (Interactive Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Trips' },
          { id: 'weekend', label: 'Weekend Getaway' },
          { id: 'thanksgiving', label: 'Thanksgiving Break' },
          { id: 'winter_break', label: 'Winter Recess' },
          { id: 'spring_break', label: 'Spring Break' },
          { id: 'airport_run', label: 'Airport Shuttles' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCategoryFilter(item.id as BreakCategory)}
            className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              categoryFilter === item.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Feed Results Count & Privacy Notice */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing {filteredTrips.length} {feedType === 'driver_offer' ? 'driver ride offer(s)' : 'student ride request(s)'}
        </span>
        <span className="hidden sm:inline-block">
          🛡️ Student safety: contact info disclosed only after carpool request is confirmed
        </span>
      </div>

      {/* Cards Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Car className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Carpools Match Your Search
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try clearing filters or be the first student to post a ride or request for this route!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors mr-2"
          >
            Clear Filters
          </button>
          <button
            onClick={onOpenPostModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-sm"
          >
            Post This Route
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onSelect={onSelectTrip} />
          ))}
        </div>
      )}

    </div>
  );
};
