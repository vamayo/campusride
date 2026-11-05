import React, { useState } from 'react';
import {
  X,
  Calculator,
  Fuel,
  Coins,
  Car,
  Users,
  Info,
  Check,
  ArrowRight,
} from 'lucide-react';

interface FareCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToPost?: (calculatedData: {
    distanceMiles: number;
    fuelCost: number;
    tollsCost: number;
    totalCost: number;
    splitPerSeat: number;
    seats: number;
  }) => void;
}

const PRESET_ROUTES = [
  { name: 'SFO International Airport', miles: 26, tolls: 0 },
  { name: 'Downtown San Francisco', miles: 34, tolls: 7 },
  { name: 'UC Berkeley / East Bay', miles: 45, tolls: 7 },
  { name: 'Santa Cruz Beach', miles: 48, tolls: 0 },
  { name: 'Sacramento / UC Davis', miles: 112, tolls: 7 },
  { name: 'South Lake Tahoe (Ski)', miles: 215, tolls: 14 },
  { name: 'Los Angeles (Tejon Pass)', miles: 360, tolls: 0 },
];

export const FareCalculatorModal: React.FC<FareCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyToPost,
}) => {
  const [miles, setMiles] = useState<number>(215);
  const [mpg, setMpg] = useState<number>(28);
  const [gasPrice, setGasPrice] = useState<number>(4.20);
  const [tolls, setTolls] = useState<number>(14);
  const [passengerCount, setPassengerCount] = useState<number>(3); // 3 passengers sharing with driver

  if (!isOpen) return null;

  // Math
  const gallonsNeeded = miles > 0 && mpg > 0 ? miles / mpg : 0;
  const fuelCost = gallonsNeeded * gasPrice;
  const totalCost = fuelCost + tolls;
  // Total people in car = 1 driver + passengerCount
  const totalPeople = Math.max(1, passengerCount + 1);
  const fairSplitPerPassenger = totalCost / totalPeople;

  const handleApply = () => {
    if (onApplyToPost) {
      onApplyToPost({
        distanceMiles: miles,
        fuelCost: Math.round(fuelCost * 100) / 100,
        tollsCost: tolls,
        totalCost: Math.round(totalCost * 100) / 100,
        splitPerSeat: Math.round(fairSplitPerPassenger * 100) / 100,
        seats: passengerCount,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Trip Fare & Split Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Transparent collegiate gas & toll cost breakdown
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
          
          {/* Quick Route Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Popular Campus Routes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ROUTES.map((route) => (
                <button
                  key={route.name}
                  onClick={() => {
                    setMiles(route.miles);
                    setTolls(route.tolls);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                    miles === route.miles && tolls === route.tolls
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {route.name} ({route.miles} mi)
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Total Route Distance (Miles)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={miles}
                  onChange={(e) => setMiles(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">mi</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Fuel Economy (MPG)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="70"
                  value={mpg}
                  onChange={(e) => setMpg(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">mpg</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Gas Price ($/gal)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  step="0.05"
                  min="1"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-6 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Highway / Bridge Tolls ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={tolls}
                  onChange={(e) => setTolls(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-6 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Passenger Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Passengers Sharing with Driver
              </label>
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                {passengerCount} passenger{passengerCount > 1 ? 's' : ''} ({totalPeople} people total)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 rider</span>
              <span>2 riders</span>
              <span>3 riders</span>
              <span>4 riders</span>
              <span>5 riders</span>
            </div>
          </div>

          {/* Transparent Result Card */}
          <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-200 dark:border-slate-700 text-center">
              <div>
                <p className="text-[11px] text-slate-500">Estimated Fuel</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  ${fuelCost.toFixed(2)}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {gallonsNeeded.toFixed(1)} gal
                </span>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Tolls</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  ${tolls.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Total Trip Cost</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  ${totalCost.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Split Highlight */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Fair Contribution Per Passenger
                </p>
                <p className="text-[11px] text-slate-500">
                  Equal split among driver and {passengerCount} rider(s)
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300 font-mono tabular-nums">
                  ${fairSplitPerPassenger.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium"> / person</span>
              </div>
            </div>
          </div>

          {/* Student Fair Share Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>CampusRide Non-Commercial Guarantee:</strong> Drivers only offset direct fuel and tolls. No commercial markups, keeping travel affordable and student-safe.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          {onApplyToPost && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-sm transition-colors"
            >
              <span>Use in New Trip Post</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
