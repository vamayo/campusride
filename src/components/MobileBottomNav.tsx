import React from 'react';
import {
  Car,
  Compass,
  MessageSquare,
  DollarSign,
  User,
  PlusCircle,
  Calendar,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';

interface MobileBottomNavProps {
  currentTab: 'board' | 'my-trips' | 'messages' | 'splits';
  onSelectTab: (tab: 'board' | 'my-trips' | 'messages' | 'splits') => void;
  onOpenPostModal: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenPostModal,
  onOpenProfile,
}) => {
  const { currentStudent } = useCarpool();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="grid grid-cols-5 items-center h-16 px-2">
        
        {/* Tab 1: Board */}
        <button
          onClick={() => onSelectTab('board')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'board'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px] mt-1">Board</span>
        </button>

        {/* Tab 2: My Trips */}
        <button
          onClick={() => onSelectTab('my-trips')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'my-trips'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Carpools</span>
        </button>

        {/* Tab 3: Post Action Button */}
        <button
          onClick={onOpenPostModal}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-emerald-600 dark:text-emerald-400 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shadow-md">
            <PlusCircle className="w-5 h-5" />
          </div>
        </button>

        {/* Tab 4: Messages */}
        <button
          onClick={() => onSelectTab('messages')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'messages'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1">Messages</span>
        </button>

        {/* Tab 5: Profile / Splits */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-400 hover:text-slate-600"
        >
          <img
            src={currentStudent.avatarUrl}
            alt={currentStudent.name}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300"
          />
          <span className="text-[10px] mt-1">Profile</span>
        </button>

      </div>
    </div>
  );
};
