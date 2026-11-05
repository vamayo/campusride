import React, { useState } from 'react';
import { CarpoolProvider, useCarpool } from './context/CarpoolContext';
import { Navbar } from './components/Navbar';
import { DiscussionBoardView } from './components/DiscussionBoardView';
import { MyTripsView } from './components/MyTripsView';
import { MessagesView } from './components/MessagesView';
import { CostSplitView } from './components/CostSplitView';
import { TripDetailDrawer } from './components/TripDetailDrawer';
import { PostTripModal } from './components/PostTripModal';
import { FareCalculatorModal } from './components/FareCalculatorModal';
import { ProfileModal } from './components/ProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationCenterDrawer } from './components/NotificationCenterDrawer';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { TripPost } from './types/carpool';
import { ShieldCheck, RefreshCw, Car } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentStudent, trips, resetAllData } = useCarpool();

  const [currentTab, setCurrentTab] = useState<'board' | 'my-trips' | 'messages' | 'splits'>('board');
  const [selectedTrip, setSelectedTrip] = useState<TripPost | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [activeChatTripId, setActiveChatTripId] = useState<string | undefined>(undefined);

  const [calcInitialData, setCalcInitialData] = useState<{
    distanceMiles: number;
    fuelCost: number;
    tollsCost: number;
    totalCost: number;
    splitPerSeat: number;
    seats: number;
  } | null>(null);

  const handleApplyCalcToPost = (data: {
    distanceMiles: number;
    fuelCost: number;
    tollsCost: number;
    totalCost: number;
    splitPerSeat: number;
    seats: number;
  }) => {
    setCalcInitialData(data);
    setIsPostModalOpen(true);
  };

  const handleOpenChatForTrip = (tripId: string) => {
    setActiveChatTripId(tripId);
    setCurrentTab('messages');
  };

  const handleOpenSplitForTrip = (tripId: string) => {
    setCurrentTab('splits');
  };

  // Keep selectedTrip synchronized with trips state in case roster changes
  const activeSelectedTrip = selectedTrip
    ? trips.find((t) => t.id === selectedTrip.id) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 md:pb-6">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPostModal={() => {
          setCalcInitialData(null);
          setIsPostModalOpen(true);
        }}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {currentTab === 'board' && (
          <DiscussionBoardView
            onSelectTrip={(trip) => setSelectedTrip(trip)}
            onOpenPostModal={() => {
              setCalcInitialData(null);
              setIsPostModalOpen(true);
            }}
            onOpenCalculator={() => setIsCalculatorModalOpen(true)}
          />
        )}

        {currentTab === 'my-trips' && (
          <MyTripsView
            onSelectTrip={(trip) => setSelectedTrip(trip)}
            onOpenPostModal={() => {
              setCalcInitialData(null);
              setIsPostModalOpen(true);
            }}
            onOpenChat={handleOpenChatForTrip}
            onOpenSplit={handleOpenSplitForTrip}
            onExploreBoard={() => setCurrentTab('board')}
          />
        )}

        {currentTab === 'messages' && (
          <MessagesView
            selectedTripId={activeChatTripId}
            onSelectTrip={(tripId) => setActiveChatTripId(tripId)}
            onExploreBoard={() => setCurrentTab('board')}
          />
        )}

        {currentTab === 'splits' && (
          <CostSplitView
            onOpenCalculator={() => setIsCalculatorModalOpen(true)}
            onExploreBoard={() => setCurrentTab('board')}
          />
        )}
      </main>

      {/* Trip Detail Inspector Drawer */}
      <TripDetailDrawer
        trip={activeSelectedTrip}
        onClose={() => setSelectedTrip(null)}
        onOpenChat={handleOpenChatForTrip}
        onOpenSplit={handleOpenSplitForTrip}
      />

      {/* Post Trip Modal */}
      <PostTripModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        initialCalculatedData={calcInitialData}
      />

      {/* Fare & Split Calculator Modal */}
      <FareCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onApplyToPost={handleApplyCalcToPost}
      />

      {/* Profile & Privacy Shield Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
      />

      {/* Push Notification Center Drawer */}
      <NotificationCenterDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenSettings={() => setIsNotificationSettingsOpen(true)}
        onOpenTrip={(tripId) => {
          const t = trips.find((trip) => trip.id === tripId);
          if (t) setSelectedTrip(t);
        }}
        onOpenSplit={() => setCurrentTab('splits')}
      />

      {/* Push Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />

      {/* Floating Push Notification Toast */}
      <PushNotificationToast
        onOpenTrip={(tripId) => {
          const t = trips.find((trip) => trip.id === tripId);
          if (t) setSelectedTrip(t);
        }}
        onOpenSplit={() => setCurrentTab('splits')}
      />

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPostModal={() => {
          setCalcInitialData(null);
          setIsPostModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Quiet University Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">CampusRide</span>
            <span>·</span>
            <span>Non-commercial peer transit & break carpooling</span>
            <span>·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Shield Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset demo data to initial campus state?')) {
                  resetAllData();
                }
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
              title="Reset initial carpools & students"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
            <span>·</span>
            <span>© 2026 Campus Network</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <CarpoolProvider>
      <MainLayout />
    </CarpoolProvider>
  );
}
