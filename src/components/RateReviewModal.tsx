import React, { useState } from 'react';
import { Star, ShieldCheck, Check, Sparkles, X, Car, UserCheck, EyeOff } from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { StudentProfile, TripPost } from '../types/carpool';

interface RateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent: StudentProfile;
  trip?: TripPost;
  reviewerRole?: 'driver' | 'rider';
}

const DRIVER_TRAITS = [
  'Safe Driver',
  'Punctual',
  'Clean Car',
  'Great Music',
  'Fair Split',
  'Smooth Highway Driving',
  'Good Communicator',
];

const RIDER_TRAITS = [
  'Punctual',
  'Quick Payment',
  'Friendly Vibe',
  'Respectful Passenger',
  'Light Luggage',
  'Great Conversationalist',
  'Fair Split',
];

export const RateReviewModal: React.FC<RateReviewModalProps> = ({
  isOpen,
  onClose,
  targetStudent,
  trip,
  reviewerRole = 'rider',
}) => {
  const { currentStudent, addReview } = useCarpool();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['Safe Driver', 'Punctual']);
  const [comment, setComment] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const isReviewingDriver = reviewerRole === 'rider';
  const availableTraits = isReviewingDriver ? DRIVER_TRAITS : RIDER_TRAITS;

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    );
  };

  const getRatingDescriptor = (val: number) => {
    switch (val) {
      case 1:
        return 'Difficult / Needs Improvement';
      case 2:
        return 'Fair / Minor Issues';
      case 3:
        return 'Good / Met Expectations';
      case 4:
        return 'Very Good / Reliable & Friendly';
      case 5:
        return 'Outstanding / Safe & Seamless';
      default:
        return 'Select a rating';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    addReview({
      targetStudentId: targetStudent.id,
      reviewerId: currentStudent.id,
      reviewerRole,
      tripId: trip?.id,
      tripRouteTitle: trip ? `${trip.originCampus} → ${trip.destinationCity}` : 'Campus Carpool',
      rating,
      comment: comment.trim() || (rating >= 4 ? 'Great carpool experience, highly recommended for fellow campus students!' : 'Carpool completed.'),
      tags: selectedTraits,
      isAnonymous,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 leading-tight">
                Rate & Review Experience
              </h2>
              <p className="text-xs text-slate-500">
                {isReviewingDriver ? 'Reviewing Driver' : 'Reviewing Passenger'} · Stanford Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Anonymous Feedback Submitted!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm">
              Thank you for keeping our college carpool community accountable and trustworthy. Your anonymous feedback has been updated on {targetStudent.name.split(' ')[0]}&apos;s profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Target Student Identity Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={targetStudent.avatarUrl}
                  alt={targetStudent.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-900">{targetStudent.name}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified .edu
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {targetStudent.major} · Class of {targetStudent.gradYear}
                  </div>
                </div>
              </div>

              {trip && (
                <div className="text-right border-l border-slate-200 pl-3">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Carpool Route
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {trip.destinationCity}
                  </div>
                </div>
              )}
            </div>

            {/* Star Rating Section */}
            <div className="text-center py-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Overall Experience Rating
              </label>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-115 focus:outline-hidden"
                      aria-label={`${starVal} star rating`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-200 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-medium text-amber-700 min-h-[1.25rem]">
                {getRatingDescriptor(hoverRating || rating)}
              </div>
            </div>

            {/* Trait Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                What went well? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTraits.map((trait) => {
                  const isSelected = selectedTraits.includes(trait);
                  return (
                    <button
                      type="button"
                      key={trait}
                      onClick={() => toggleTrait(trait)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Anonymous Student Review Notes
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={
                  isReviewingDriver
                    ? 'e.g. Alex drove super smoothly on Highway 50, stopped for bathroom breaks, and was very easy to coordinate with at Wilbur Hall...'
                    : 'e.g. Maya arrived right on time, had compact luggage, and sent her gas share via Venmo immediately...'
                }
                className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
              />
              <p className="text-[11px] text-slate-400">
                Keep feedback constructive and helpful for fellow students planning upcoming holiday and weekend carpools.
              </p>
            </div>

            {/* Anonymity Controls */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 space-y-2">
              <div className="flex items-start gap-3">
                <input
                  id="anonymous-toggle"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <label htmlFor="anonymous-toggle" className="text-xs font-semibold text-indigo-950 flex items-center gap-1.5 cursor-pointer">
                    <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                    Submit Review Anonymously (Recommended)
                  </label>
                  <p className="text-[11px] text-indigo-700/80 mt-0.5">
                    Your real name, profile photo, and @stanford.edu address will be completely hidden.
                    Display label will read: <span className="font-semibold text-indigo-900">&ldquo;Anonymous Verified {reviewerRole === 'driver' ? 'Driver' : 'Rider'}&rdquo;</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Submit Anonymous Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
