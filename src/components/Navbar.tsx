import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  Calculator,
  MessageSquare,
  Users,
  ChevronDown,
  Sparkles,
  Bell,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';

interface NavbarProps {
  currentTab: 'board' | 'my-trips' | 'messages' | 'splits';
  onSelectTab: (tab: 'board' | 'my-trips' | 'messages' | 'splits') => void;
  onOpenPostModal: () => void;
  onOpenCalculator: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPostModal,
  onOpenCalculator,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const { currentStudent, students, switchStudent, unreadNotificationCount } = useCarpool();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand & Campus Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('board')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                    CampusRide
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    .edu Verified
                  </span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate max-w-[150px] sm:max-w-none">
                  {currentStudent.university}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('board')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'board'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Discussion Board
            </button>
            <button
              onClick={() => onSelectTab('my-trips')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'my-trips'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Carpools
            </button>
            <button
              onClick={() => onSelectTab('messages')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'messages'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Trip Messages
            </button>
            <button
              onClick={() => onSelectTab('splits')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'splits'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Split Expenses
            </button>
          </nav>

          {/* Zone 3: Actions & Active Student Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenCalculator}
              title="Estimate fuel, tolls, and fair split"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Fare Calc</span>
            </button>

            <button
              onClick={onOpenPostModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post to Board</span>
            </button>

            {/* Notification Bell with Unread Badge */}
            <button
              onClick={onOpenNotifications}
              title="Push Notifications & Reminders"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Persona Switcher Dropdown (Crucial for testing both driver & rider roles) */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                title="Switch active student persona"
              >
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {currentStudent.name}
                    </span>
                    <ShieldCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {currentStudent.isDriver ? 'Driver' : 'Rider'} · {currentStudent.gradYear}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Demo Student Switcher
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Switch roles to test driver approvals, rider requests, and messaging.
                    </p>
                  </div>

                  <div className="py-1">
                    {students.map((student) => {
                      const isSelected = student.id === currentStudent.id;
                      return (
                        <button
                          key={student.id}
                          onClick={() => {
                            switchStudent(student.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                            isSelected ? 'bg-emerald-50/60 dark:bg-emerald-950/30' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-xs font-medium text-slate-900 dark:text-white flex items-center gap-1">
                                {student.name}
                                {isSelected && (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                    (Active)
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {student.isDriver
                                  ? `Driver (${student.vehicleInfo?.make || 'Car'})`
                                  : 'Student Rider'}{' '}
                                · {student.major.split('&')[0]}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800 px-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfile();
                      }}
                      className="w-full text-center px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      View & Edit Profile & Privacy
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
