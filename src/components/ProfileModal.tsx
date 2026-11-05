import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Unlock,
  Car,
  Eye,
  EyeOff,
  Phone,
  DollarSign,
  Luggage,
  Music,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCarpool } from '../context/CarpoolContext';
import { StudentProfile } from '../types/carpool';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNotificationSettings?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenNotificationSettings,
}) => {
  const { currentStudent, updateProfile } = useCarpool();

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'vehicle'>('profile');

  // Form states
  const [name, setName] = useState(currentStudent.name);
  const [major, setMajor] = useState(currentStudent.major);
  const [gradYear, setGradYear] = useState(currentStudent.gradYear);
  const [campusHub, setCampusHub] = useState(currentStudent.campusHub);
  const [bio, setBio] = useState(currentStudent.bio);
  const [phone, setPhone] = useState(currentStudent.phone);

  // Payment handles
  const [venmo, setVenmo] = useState(currentStudent.paymentHandles.venmo || '');
  const [zelle, setZelle] = useState(currentStudent.paymentHandles.zelle || '');
  const [cashapp, setCashapp] = useState(currentStudent.paymentHandles.cashapp || '');

  // Privacy toggles
  const [hidePhone, setHidePhone] = useState(
    currentStudent.privacySettings.hidePhoneUntilAccepted
  );
  const [hidePayment, setHidePayment] = useState(
    currentStudent.privacySettings.hidePaymentUntilAccepted
  );
  const [maskLastName, setMaskLastName] = useState(
    currentStudent.privacySettings.maskLastName
  );

  // Vehicle
  const [isDriver, setIsDriver] = useState(currentStudent.isDriver);
  const [carMake, setCarMake] = useState(currentStudent.vehicleInfo?.make || 'Subaru');
  const [carModel, setCarModel] = useState(currentStudent.vehicleInfo?.model || 'Outback');
  const [carYear, setCarYear] = useState(currentStudent.vehicleInfo?.year || 2023);
  const [carColor, setCarColor] = useState(currentStudent.vehicleInfo?.color || 'Blue');
  const [carSeats, setCarSeats] = useState(currentStudent.vehicleInfo?.totalSeats || 4);

  // Preferences
  const [luggageSize, setLuggageSize] = useState(currentStudent.preferences.luggageSize);
  const [musicVibe, setMusicVibe] = useState(currentStudent.preferences.musicVibe);
  const [petFriendly, setPetFriendly] = useState(currentStudent.preferences.petFriendly);
  const [chatty, setChatty] = useState(currentStudent.preferences.chatty);

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      major,
      gradYear,
      campusHub,
      bio,
      phone,
      isDriver,
      paymentHandles: {
        venmo: venmo.trim() || undefined,
        zelle: zelle.trim() || undefined,
        cashapp: cashapp.trim() || undefined,
      },
      privacySettings: {
        ...currentStudent.privacySettings,
        hidePhoneUntilAccepted: hidePhone,
        hidePaymentUntilAccepted: hidePayment,
        maskLastName,
      },
      preferences: {
        luggageSize,
        musicVibe,
        petFriendly,
        chatty,
      },
      vehicleInfo: isDriver
        ? {
            make: carMake,
            model: carModel,
            year: carYear,
            color: carColor,
            licensePlateMasked: currentStudent.vehicleInfo?.licensePlateMasked || '7XYZ•••',
            totalSeats: carSeats,
          }
        : undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  // Masked values for live privacy preview
  const previewLastName = maskLastName
    ? `${name.split(' ')[0]} ${name.split(' ')[1]?.[0] || ''}.`
    : name;

  const rawDigits = phone.replace(/\D/g, '');
  const last4 = rawDigits.slice(-4) || '••••';
  const previewMaskedPhone = `(•••) •••-${last4}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Student Profile & Privacy Shield
                </h3>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  .edu Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentStudent.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Academic & Travel Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Privacy Shield Controls</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vehicle')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'vehicle'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Driver & Vehicle Info
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: Profile & Travel */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Primary Campus Hub / Residence
                  </label>
                  <input
                    type="text"
                    value={campusHub}
                    onChange={(e) => setCampusHub(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student Bio & Travel Style
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Preferences */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Carpool Comfort & Vibe Preferences
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Typical Luggage Allowance
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['backpack', 'carryon', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setLuggageSize(size)}
                          className={`py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${
                            luggageSize === size
                              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Conversation Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['quiet', 'friendly', 'talkative'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setChatty(style)}
                          className={`py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${
                            chatty === style
                              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Favorite Road-Trip Music / Podcasts
                  </label>
                  <input
                    type="text"
                    value={musicVibe}
                    onChange={(e) => setMusicVibe(e.target.value)}
                    placeholder="e.g. Indie pop, podcasts, chill lofi, Taylor Swift"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Privacy Shield Controls & Live Inspector */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    Active Privacy Safeguards
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                  These toggles determine what information is visible on public campus discussion boards vs. what is strictly unlocked for approved carpool companions.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Mask Phone Number on Public Posts
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Shows (•••) •••-{last4} until a ride request is officially accepted.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hidePhone}
                    onChange={(e) => setHidePhone(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Protect Financial Handles (Venmo / Zelle)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Hides payment IDs from public scrapers; visible only to confirmed riders for splitting costs.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hidePayment}
                    onChange={(e) => setHidePayment(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Mask Last Name on Public Board
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Renders as "{previewLastName}" on public trip cards.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maskLastName}
                    onChange={(e) => setMaskLastName(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* Push Notifications Configuration Shortcut */}
                {onOpenNotificationSettings && (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Push Notifications & Departure Reminders
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Manage departure alerts, payment reminders, and upcoming holiday trip notices.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenNotificationSettings();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Configure Alerts
                    </button>
                  </div>
                )}

              </div>

              {/* Contact Values Input */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Contact & Payment Identifiers
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Venmo Handle
                    </label>
                    <input
                      type="text"
                      value={venmo}
                      onChange={(e) => setVenmo(e.target.value)}
                      placeholder="@Your-Venmo"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Zelle (Email or Phone)
                    </label>
                    <input
                      type="text"
                      value={zelle}
                      onChange={(e) => setZelle(e.target.value)}
                      placeholder="student@stanford.edu"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Cash App (Optional)
                    </label>
                    <input
                      type="text"
                      value={cashapp}
                      onChange={(e) => setCashapp(e.target.value)}
                      placeholder="$cashtag"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Side-by-Side Live Privacy Inspector Card */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Live Privacy Preview Inspector
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Public Board View */}
                  <div className="p-3.5 bg-slate-100/70 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Public Campus View</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {previewLastName}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      Phone: {hidePhone ? previewMaskedPhone : phone}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      Venmo: {hidePayment && venmo ? `@••••${venmo.slice(-2)}` : venmo || 'Not set'}
                    </p>
                  </div>

                  {/* Confirmed Carpooler View */}
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Confirmed Carpooler View</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      Phone: {phone}
                    </p>
                    <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      Venmo: {venmo || 'Not set'}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Vehicle Information */}
          {activeTab === 'vehicle' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    I Have a Car on Campus (Driver Status)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Enable this if you have a registered car and want to offer seats to offset costs.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isDriver}
                  onChange={(e) => setIsDriver(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {isDriver && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Car Make
                    </label>
                    <input
                      type="text"
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      placeholder="e.g. Subaru, Honda, Toyota"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Car Model
                    </label>
                    <input
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. Outback, Civic, Prius"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Year & Color
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={carYear}
                        onChange={(e) => setCarYear(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                      <input
                        type="text"
                        value={carColor}
                        onChange={(e) => setCarColor(e.target.value)}
                        placeholder="Color"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Passenger Seats Available
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={carSeats}
                      onChange={(e) => setCarSeats(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
