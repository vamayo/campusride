import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Users,
  AlertCircle,
  Car,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';

interface MessagesViewProps {
  selectedTripId?: string;
  onSelectTrip: (tripId: string) => void;
  onExploreBoard: () => void;
}

const QUICK_REPLIES = [
  'I am at the campus pickup hub now!',
  'Have 1 duffle bag + backpack with me.',
  'What time are we stopping for food/gas?',
  'Running about 5 minutes behind!',
  'Thanks for driving! Great playlist.',
];

export const MessagesView: React.FC<MessagesViewProps> = ({
  selectedTripId,
  onSelectTrip,
  onExploreBoard,
}) => {
  const { currentStudent, trips, threads, sendMessage, getStudentById, getDisplayContact } =
    useCarpool();

  // Find trips the current student is part of (as author or rostered passenger)
  const myTrips = trips.filter(
    (t) =>
      t.authorId === currentStudent.id ||
      t.roster.some((r) => r.studentId === currentStudent.id)
  );

  const activeTripId = selectedTripId || (myTrips[0]?.id ?? trips[0]?.id);
  const activeTrip = trips.find((t) => t.id === activeTripId);
  const activeThread = threads.find((th) => th.tripId === activeTripId);

  const [messageInput, setMessageInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeTripId) return;
    sendMessage(activeTripId, messageInput.trim());
    setMessageInput('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeTripId) return;
    sendMessage(activeTripId, text);
  };

  if (trips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Trip Conversations Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Join a carpool or post your own trip to start coordinating pickup spots and trip details.
        </p>
        <button
          onClick={onExploreBoard}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-sm"
        >
          Browse Discussion Board
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Trip Messages & Coordination
        </h1>
        <p className="text-xs text-slate-500">
          Private, end-to-end trip thread for confirmed carpoolers
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Sidebar: Trip Threads */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Carpool Threads
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {trips.map((t) => {
              const isSelected = t.id === activeTripId;
              const isAuthor = t.authorId === currentStudent.id;
              const isRosterPassenger = t.roster.some((r) => r.studentId === currentStudent.id);
              const thread = threads.find((th) => th.tripId === t.id);
              const lastMsg = thread?.messages[thread.messages.length - 1];

              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTrip(t.id)}
                  className={`w-full p-3.5 text-left transition-all flex flex-col gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-sm border-l-4 border-l-slate-900 dark:border-l-white'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {t.destinationCity}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0">
                      {t.departureDate.slice(5)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate">
                    {t.originCampus.split(' ')[0]} → {t.destinationCity}
                  </p>

                  {lastMsg && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      {lastMsg.senderName.split(' ')[0]}: {lastMsg.content}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {isAuthor ? 'Your Trip (Driver)' : isRosterPassenger ? 'Joined Passenger' : 'Campus Board'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Thread Chat View */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
          
          {/* Thread Header */}
          {activeTrip && (
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeTrip.originCampus.split(' ')[0]} → {activeTrip.destinationCity}
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    ${activeTrip.suggestedSplitPerSeat} / seat
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Pickup: {activeTrip.originHub}</span>
                  <span>·</span>
                  <span>{activeTrip.departureDate} at {activeTrip.departureTime}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-medium text-slate-500">
                  {activeTrip.roster.filter((r) => r.status === 'accepted').length + 1} students in car
                </span>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {(!activeThread || activeThread.messages.length === 0) ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No messages yet. Send a note to discuss pickup location or music!
              </div>
            ) : (
              activeThread.messages.map((msg) => {
                const isMe = msg.senderId === currentStudent.id;
                const isSystem = msg.isSystemNotice || msg.senderId === 'system';
                const sender = getStudentById(msg.senderId);

                if (isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="text-center my-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 max-w-md mx-auto"
                    >
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[80%] ${
                      isMe ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    {sender ? (
                      <img
                        src={sender.avatarUrl}
                        alt={sender.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                        {msg.senderName[0]}
                      </div>
                    )}

                    <div>
                      <div
                        className={`flex items-baseline gap-2 mb-0.5 ${
                          isMe ? 'justify-end' : ''
                        }`}
                      >
                        <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/80'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Replies Strip */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
              Quick:
            </span>
            {QUICK_REPLIES.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickReply(reply)}
                className="px-2.5 py-1 text-[11px] rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 hover:text-slate-900 transition-colors shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Composer Form */}
          <form
            onSubmit={handleSend}
            className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message fellow carpoolers about pickup, luggage, or stops...`}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
