import React, { useState } from 'react';
import {
  DollarSign,
  Fuel,
  Car,
  CheckCircle2,
  Clock4,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Unlock,
  PlusCircle,
  Calculator,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { TripPost, StudentProfile } from '../types/carpool';

interface CostSplitViewProps {
  onOpenCalculator: () => void;
  onExploreBoard: () => void;
}

export const CostSplitView: React.FC<CostSplitViewProps> = ({
  onOpenCalculator,
  onExploreBoard,
}) => {
  const {
    currentStudent,
    trips,
    settlements,
    toggleSettlement,
    getStudentById,
    getDisplayContact,
    createSettlementForTrip,
  } = useCarpool();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [adjustingTripId, setAdjustingTripId] = useState<string | null>(null);
  const [extraExpenseTitle, setExtraExpenseTitle] = useState('');
  const [extraExpenseAmount, setExtraExpenseAmount] = useState<number>(10);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Trips where current student is driver or has a settlement record or is accepted
  const relevantTrips = trips.filter((t) => {
    const isDriver = t.authorId === currentStudent.id;
    const isAcceptedPassenger = t.roster.some(
      (r) => r.studentId === currentStudent.id && r.status === 'accepted'
    );
    const hasSettlement = settlements.some(
      (s) => s.tripId === t.id && (s.passengerId === currentStudent.id || isDriver)
    );
    return isDriver || isAcceptedPassenger || hasSettlement;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Carpool Cost-Splitting & Settlement Hub
          </h1>
          <p className="text-xs text-slate-500">
            Fair fuel & toll contributions with zero transaction markups and masked payment handles
          </p>
        </div>

        <button
          onClick={onOpenCalculator}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm self-start"
        >
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>Fare & Split Calculator</span>
        </button>
      </div>

      {/* Privacy & Direct Peer Settlement Guarantee */}
      <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <p className="font-bold text-emerald-950 dark:text-emerald-200">
            Financial Privacy Protection
          </p>
          <p className="text-emerald-900/80 dark:text-emerald-300/90 leading-relaxed">
            CampusRide never stores credit card numbers, bank accounts, or charges middleman processing fees. Students settle directly with peers via their verified Venmo, Zelle, or Cash App handles, which are unlocked strictly between confirmed carpool members.
          </p>
        </div>
      </div>

      {/* Trip Ledgers */}
      {relevantTrips.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <DollarSign className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Active Trip Expenses
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Once you join or post a carpool and seats are accepted, fair fuel and toll split ledgers will populate here automatically.
          </p>
          <button
            onClick={onExploreBoard}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-sm"
          >
            Explore Discussion Board
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {relevantTrips.map((trip) => {
            const isDriver = trip.authorId === currentStudent.id;
            const driver = getStudentById(trip.authorId);
            if (!driver) return null;

            const driverContact = getDisplayContact(driver, trip.id);
            const tripSettlements = settlements.filter((s) => s.tripId === trip.id);
            const acceptedPassengers = trip.roster.filter((r) => r.status === 'accepted');

            return (
              <div
                key={trip.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Trip Header Banner */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {trip.originCampus.split(' ')[0]} → {trip.destinationCity}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({trip.departureDate})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Driver: {driverContact.displayName} {isDriver && '(You)'} · {trip.originHub}
                    </p>
                  </div>

                  {/* Summary Metric Pill */}
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <p className="text-[10px] text-slate-400 uppercase">Estimated Total</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        ${trip.totalEstimatedCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right font-mono pl-3 border-l border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] text-emerald-800 dark:text-emerald-400 uppercase font-semibold">
                        Fair Seat Split
                      </p>
                      <p className="text-sm font-black text-emerald-800 dark:text-emerald-300 tabular-nums">
                        ${trip.suggestedSplitPerSeat.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Driver Unlocked Payment Card (Only visible to confirmed passengers) */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Unlock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>Driver Payment Handles for Peer Reimbursement:</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {driverContact.isUnlocked
                          ? 'Send reimbursement directly via your preferred student payment app.'
                          : 'Payment handles remain masked until seat request is confirmed.'}
                      </p>
                    </div>

                    {/* Unlocked Handles */}
                    {driverContact.isUnlocked ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {driverContact.venmo && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium shadow-2xs">
                            <span className="text-blue-700 dark:text-blue-400 font-bold">Venmo:</span>
                            <span>{driverContact.venmo}</span>
                            <button
                              onClick={() => copyToClipboard(driverContact.venmo!, `venmo-${trip.id}`)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            >
                              {copiedKey === `venmo-${trip.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}

                        {driverContact.zelle && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium shadow-2xs">
                            <span className="text-purple-700 dark:text-purple-400 font-bold">Zelle:</span>
                            <span>{driverContact.zelle}</span>
                            <button
                              onClick={() => copyToClipboard(driverContact.zelle!, `zelle-${trip.id}`)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            >
                              {copiedKey === `zelle-${trip.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono italic">
                        [🔒 Masked until driver approves request]
                      </span>
                    )}
                  </div>
                </div>

                {/* Expense Breakdown Strip */}
                <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">
                      Estimated Gas ({trip.estimatedDistanceMiles} mi):{' '}
                      <strong className="text-slate-800 dark:text-slate-200">
                        ${trip.fuelCostEst.toFixed(2)}
                      </strong>
                    </span>
                    <span>·</span>
                    <span className="text-slate-500">
                      Tolls:{' '}
                      <strong className="text-slate-800 dark:text-slate-200">
                        ${trip.tollsCostEst.toFixed(2)}
                      </strong>
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Split equally among 1 driver + {acceptedPassengers.length} confirmed rider(s)
                  </span>
                </div>

                {/* Passenger Settlement Rows */}
                <div className="p-5 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Passenger Contributions
                  </h4>

                  {tripSettlements.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                      No passengers confirmed for this trip yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {tripSettlements.map((settlement) => {
                        const passenger = getStudentById(settlement.passengerId);
                        if (!passenger) return null;
                        const isMe = settlement.passengerId === currentStudent.id;
                        const passengerContact = getDisplayContact(passenger, trip.id);

                        return (
                          <div
                            key={settlement.id}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                              settlement.isSettled
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={passenger.avatarUrl}
                                alt={passenger.name}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {passengerContact.displayName} {isMe && '(You)'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {settlement.note}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  {settlement.isSettled
                                    ? `Settled on ${new Date(
                                        settlement.settledAt || Date.now()
                                      ).toLocaleDateString()} via ${
                                        settlement.paymentMethodUsed || 'Venmo'
                                      }`
                                    : 'Awaiting direct reimbursement'}
                                </p>
                              </div>
                            </div>

                            {/* Amount & Action */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right font-mono">
                                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                                  ${settlement.amount.toFixed(2)}
                                </span>
                              </div>

                              <button
                                onClick={() => toggleSettlement(settlement.id, 'Venmo')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  settlement.isSettled
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                                    : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white shadow-xs'
                                }`}
                              >
                                {settlement.isSettled ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Settled</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock4 className="w-3.5 h-3.5" />
                                    <span>Mark Paid</span>
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

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
