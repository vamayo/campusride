export type BreakCategory = 
  | 'all'
  | 'weekend'
  | 'thanksgiving'
  | 'winter_break'
  | 'spring_break'
  | 'airport_run';

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlateMasked: string;
  totalSeats: number;
}

export interface TravelPreferences {
  luggageSize: 'backpack' | 'carryon' | 'large';
  musicVibe: string;
  petFriendly: boolean;
  chatty: 'quiet' | 'friendly' | 'talkative';
}

export interface PrivacySettings {
  hidePhoneUntilAccepted: boolean;
  hidePaymentUntilAccepted: boolean;
  maskLastName: boolean;
  allowDirectMessages: boolean;
}

export interface PaymentHandles {
  venmo?: string;
  zelle?: string;
  cashapp?: string;
}

export type NotificationCategory =
  | 'departure_reminder'
  | 'payment_reminder'
  | 'upcoming_trip'
  | 'carpool_update';

export interface PushNotificationSettings {
  enablePush: boolean;
  upcomingTrips: boolean;
  departureReminders: boolean;
  paymentReminders: boolean;
  combinedCarpoolAlerts: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  tripId?: string;
  isRead: boolean;
  actionType?: 'view_trip' | 'view_split' | 'view_chat';
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  gradYear: number;
  major: string;
  campusHub: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  isDriver: boolean;
  vehicleInfo?: VehicleInfo;
  preferences: TravelPreferences;
  privacySettings: PrivacySettings;
  paymentHandles: PaymentHandles;
  notificationSettings?: PushNotificationSettings;
  phone: string;
}

export interface RosterPassenger {
  studentId: string;
  status: 'pending' | 'accepted' | 'declined';
  requestedSeats: number;
  pickupNote: string;
  joinedAt: string;
}

export interface TripPost {
  id: string;
  authorId: string;
  postType: 'driver_offer' | 'rider_request';
  originCampus: string;
  originHub: string;
  destinationCity: string;
  destinationDropoff: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // e.g. "04:30 PM"
  returnDate?: string;
  breakCategory: 'weekend' | 'thanksgiving' | 'winter_break' | 'spring_break' | 'airport_run';
  totalSeats: number;
  availableSeats: number;
  estimatedDistanceMiles: number;
  suggestedSplitPerSeat: number;
  totalEstimatedCost: number;
  fuelCostEst: number;
  tollsCostEst: number;
  notes: string;
  roster: RosterPassenger[];
  createdAt: string;
  isCombined?: boolean;
  combinedIntoTripId?: string;
  combinedRiderRequestIds?: string[];
  combinedSummary?: string;
}

export interface RiderRecommendation {
  riderTrip: TripPost;
  rider: StudentProfile;
  matchScore: number;
  matchReasons: string[];
  driverTrip: TripPost;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface TripThread {
  tripId: string;
  tripTitle: string;
  messages: ChatMessage[];
}

export interface SettlementRecord {
  id: string;
  tripId: string;
  passengerId: string;
  amount: number;
  isSettled: boolean;
  settledAt?: string;
  paymentMethodUsed?: string;
  note?: string;
}

export interface ReviewRecord {
  id: string;
  targetStudentId: string;
  reviewerId: string;
  reviewerRole: 'driver' | 'rider';
  tripId?: string;
  tripRouteTitle?: string;
  rating: number; // 1 to 5
  comment: string;
  tags: string[];
  isAnonymous: boolean;
  authorLabel: string;
  createdAt: string;
}
