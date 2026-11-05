import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  TripPost,
  TripThread,
  ChatMessage,
  SettlementRecord,
  RosterPassenger,
  RiderRecommendation,
  AppNotification,
  PushNotificationSettings,
  NotificationCategory,
} from '../types/carpool';
import {
  INITIAL_STUDENTS,
  INITIAL_TRIPS,
  INITIAL_THREADS,
  INITIAL_SETTLEMENTS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../data/seedData';

interface CarpoolContextType {
  currentStudent: StudentProfile;
  students: StudentProfile[];
  trips: TripPost[];
  threads: TripThread[];
  settlements: SettlementRecord[];
  switchStudent: (studentId: string) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  createTrip: (newTrip: Omit<TripPost, 'id' | 'authorId' | 'roster' | 'createdAt' | 'availableSeats'>) => void;
  deleteTrip: (tripId: string) => void;
  requestSeat: (tripId: string, seats: number, pickupNote: string) => void;
  cancelSeatRequest: (tripId: string) => void;
  handleRosterDecision: (tripId: string, studentId: string, decision: 'accepted' | 'declined') => void;
  sendMessage: (tripId: string, content: string) => void;
  toggleSettlement: (settlementId: string, method?: string) => void;
  createSettlementForTrip: (tripId: string, passengerId: string, amount: number) => void;
  combinePosts: (driverTripId: string, riderTripId: string) => void;
  uncombinePosts: (driverTripId: string, riderTripId: string) => void;
  getRiderRecommendations: (driverTripId?: string) => RiderRecommendation[];
  getStudentById: (studentId: string) => StudentProfile | undefined;
  getDisplayContact: (target: StudentProfile, tripId?: string) => {
    isUnlocked: boolean;
    displayName: string;
    phone: string;
    venmo?: string;
    zelle?: string;
    cashapp?: string;
  };
  notifications: AppNotification[];
  unreadNotificationCount: number;
  pushSettings: PushNotificationSettings;
  browserPushPermission: NotificationPermission | 'unsupported';
  requestPushPermission: () => Promise<boolean>;
  updatePushSettings: (newSettings: Partial<PushNotificationSettings>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  sendPushNotification: (
    category: NotificationCategory,
    title: string,
    message: string,
    tripId?: string,
    actionType?: 'view_trip' | 'view_split' | 'view_chat'
  ) => void;
  triggerTestReminder: (type: 'departure' | 'payment' | 'upcoming') => void;
  activePushToast: AppNotification | null;
  dismissPushToast: () => void;
  resetAllData: () => void;
}

const CarpoolContext = createContext<CarpoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'campusride_current_user_id_v1',
  STUDENTS: 'campusride_students_v1',
  TRIPS: 'campusride_trips_v1',
  THREADS: 'campusride_threads_v1',
  SETTLEMENTS: 'campusride_settlements_v1',
  NOTIFICATIONS: 'campusride_notifications_v1',
  PUSH_SETTINGS: 'campusride_push_settings_v1',
};

export const CarpoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'student-maya';
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_STUDENTS;
  });

  const [trips, setTrips] = useState<TripPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_TRIPS;
  });

  const [threads, setThreads] = useState<TripThread[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THREADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_THREADS;
  });

  const [settlements, setSettlements] = useState<SettlementRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_SETTLEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [pushSettings, setPushSettings] = useState<PushNotificationSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PUSH_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  const [browserPushPermission, setBrowserPushPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [activePushToast, setActivePushToast] = useState<AppNotification | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PUSH_SETTINGS, JSON.stringify(pushSettings));
  }, [pushSettings]);

  // Auto dismiss push toast after 6 seconds
  useEffect(() => {
    if (activePushToast) {
      const timer = setTimeout(() => {
        setActivePushToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activePushToast]);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const getStudentById = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  const switchStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, ...updated } : s))
    );
  };

  const createTrip = (
    newTripData: Omit<TripPost, 'id' | 'authorId' | 'roster' | 'createdAt' | 'availableSeats'>
  ) => {
    const tripId = `trip-${Date.now()}`;
    const newTrip: TripPost = {
      ...newTripData,
      id: tripId,
      authorId: currentStudent.id,
      availableSeats: newTripData.totalSeats,
      roster: [],
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [newTrip, ...prev]);

    // Create a matching thread
    const newThread: TripThread = {
      tripId,
      tripTitle: `${newTrip.originCampus} to ${newTrip.destinationCity}`,
      messages: [
        {
          id: `msg-sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'CampusRide Safety Bot',
          content: `Trip thread created by ${currentStudent.name}. Confirmed passengers will be able to coordinate pickup, luggage, and music here!`,
          timestamp: new Date().toISOString(),
          isSystemNotice: true,
        },
      ],
    };
    setThreads((prev) => [...prev, newThread]);
  };

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    setSettlements((prev) => prev.filter((s) => s.tripId !== tripId));
  };

  const requestSeat = (tripId: string, requestedSeats: number, pickupNote: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const existing = t.roster.find((r) => r.studentId === currentStudent.id);
        if (existing) {
          return {
            ...t,
            roster: t.roster.map((r) =>
              r.studentId === currentStudent.id
                ? { ...r, requestedSeats, pickupNote, status: 'pending' as const }
                : r
            ),
          };
        }
        const newRosterItem: RosterPassenger = {
          studentId: currentStudent.id,
          status: 'pending',
          requestedSeats,
          pickupNote,
          joinedAt: new Date().toISOString(),
        };
        return {
          ...t,
          roster: [...t.roster, newRosterItem],
        };
      })
    );

    // Send note into the thread
    sendMessage(
      tripId,
      `Requested ${requestedSeats} seat(s). Pickup note: "${pickupNote || 'Any standard campus hub'}"`
    );
  };

  const cancelSeatRequest = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const item = t.roster.find((r) => r.studentId === currentStudent.id);
        const seatsToFree = item && item.status === 'accepted' ? item.requestedSeats : 0;
        return {
          ...t,
          availableSeats: Math.min(t.totalSeats, t.availableSeats + seatsToFree),
          roster: t.roster.filter((r) => r.studentId !== currentStudent.id),
        };
      })
    );

    // Remove settlement if unconfirmed
    setSettlements((prev) =>
      prev.filter((s) => !(s.tripId === tripId && s.passengerId === currentStudent.id))
    );
  };

  const handleRosterDecision = (
    tripId: string,
    studentId: string,
    decision: 'accepted' | 'declined'
  ) => {
    let acceptedPassenger: RosterPassenger | undefined;
    let targetTrip: TripPost | undefined;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        targetTrip = t;
        let newAvailable = t.availableSeats;
        const updatedRoster = t.roster.map((r) => {
          if (r.studentId === studentId) {
            acceptedPassenger = r;
            if (decision === 'accepted' && r.status !== 'accepted') {
              newAvailable = Math.max(0, newAvailable - r.requestedSeats);
            } else if (decision === 'declined' && r.status === 'accepted') {
              newAvailable = Math.min(t.totalSeats, newAvailable + r.requestedSeats);
            }
            return { ...r, status: decision };
          }
          return r;
        });
        return {
          ...t,
          availableSeats: newAvailable,
          roster: updatedRoster,
        };
      })
    );

    const passengerProfile = getStudentById(studentId);
    const passengerName = passengerProfile ? passengerProfile.name : 'Student';

    if (decision === 'accepted') {
      // Add settlement record if not already created
      setSettlements((prev) => {
        const exists = prev.some((s) => s.tripId === tripId && s.passengerId === studentId);
        if (exists) return prev;
        const amount = targetTrip?.suggestedSplitPerSeat || 15.00;
        return [
          ...prev,
          {
            id: `settle-${Date.now()}`,
            tripId,
            passengerId: studentId,
            amount: amount * (acceptedPassenger?.requestedSeats || 1),
            isSettled: false,
            note: 'Estimated gas & toll fair share',
          },
        ];
      });

      // System message
      sendMessage(
        tripId,
        `✓ ${currentStudent.name} accepted ${passengerName}'s request for ${acceptedPassenger?.requestedSeats || 1} seat(s)! Contact info & payment handles are now unlocked.`
      );
    } else {
      sendMessage(
        tripId,
        `✕ ${currentStudent.name} declined the seat request for ${passengerName}.`
      );
    }
  };

  const sendMessage = (tripId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderId: currentStudent.id,
      senderName: currentStudent.name,
      content,
      timestamp: new Date().toISOString(),
    };

    setThreads((prev) => {
      const threadExists = prev.some((th) => th.tripId === tripId);
      if (!threadExists) {
        const trip = trips.find((t) => t.id === tripId);
        return [
          ...prev,
          {
            tripId,
            tripTitle: trip
              ? `${trip.originCampus} to ${trip.destinationCity}`
              : 'Trip Coordination',
            messages: [newMessage],
          },
        ];
      }
      return prev.map((th) => {
        if (th.tripId !== tripId) return th;
        return {
          ...th,
          messages: [...th.messages, newMessage],
        };
      });
    });
  };

  const toggleSettlement = (settlementId: string, method?: string) => {
    setSettlements((prev) =>
      prev.map((s) => {
        if (s.id !== settlementId) return s;
        const nowSettled = !s.isSettled;
        return {
          ...s,
          isSettled: nowSettled,
          settledAt: nowSettled ? new Date().toISOString() : undefined,
          paymentMethodUsed: nowSettled ? method || 'Venmo' : undefined,
        };
      })
    );
  };

  const createSettlementForTrip = (tripId: string, passengerId: string, amount: number) => {
    setSettlements((prev) => [
      ...prev,
      {
        id: `settle-${Date.now()}`,
        tripId,
        passengerId,
        amount,
        isSettled: false,
        note: 'Manual expense split adjustment',
      },
    ]);
  };

  const combinePosts = (driverTripId: string, riderTripId: string) => {
    const driverTrip = trips.find((t) => t.id === driverTripId);
    const riderTrip = trips.find((t) => t.id === riderTripId);
    if (!driverTrip || !riderTrip) return;

    const riderStudent = getStudentById(riderTrip.authorId);
    const driverStudent = getStudentById(driverTrip.authorId);
    const riderName = riderStudent ? riderStudent.name : 'Student Rider';
    const driverName = driverStudent ? driverStudent.name : 'Driver';

    const requestedSeats = riderTrip.totalSeats || 1;
    const newAvailable = Math.max(0, driverTrip.availableSeats - requestedSeats);

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === driverTripId) {
          const existingRoster = t.roster.filter((r) => r.studentId !== riderTrip.authorId);
          const newRosterItem: RosterPassenger = {
            studentId: riderTrip.authorId,
            status: 'accepted',
            requestedSeats,
            pickupNote: riderTrip.notes || `Meeting at ${riderTrip.originHub}`,
            joinedAt: new Date().toISOString(),
          };
          const existingCombinedIds = t.combinedRiderRequestIds || [];
          return {
            ...t,
            availableSeats: newAvailable,
            roster: [...existingRoster, newRosterItem],
            combinedRiderRequestIds: Array.from(new Set([...existingCombinedIds, riderTripId])),
            combinedSummary: `Combined with ${riderName}'s request to ${riderTrip.destinationCity}`,
          };
        }
        if (t.id === riderTripId) {
          return {
            ...t,
            isCombined: true,
            combinedIntoTripId: driverTripId,
            combinedSummary: `Combined into ${driverName}'s carpool to ${driverTrip.destinationCity}`,
          };
        }
        return t;
      })
    );

    // Add settlement record for rider
    setSettlements((prev) => {
      const exists = prev.some((s) => s.tripId === driverTripId && s.passengerId === riderTrip.authorId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: `settle-${Date.now()}`,
          tripId: driverTripId,
          passengerId: riderTrip.authorId,
          amount: (driverTrip.suggestedSplitPerSeat || 15) * requestedSeats,
          isSettled: false,
          note: `Combined carpool fuel & toll share (${requestedSeats} seat)`,
        },
      ];
    });

    // Send notification into the trip thread
    sendMessage(
      driverTripId,
      `🔀 Combined Carpool! ${riderName}'s ride request to ${riderTrip.destinationCity} was combined with this carpool! 1 seat reserved, fare split updated, and contact details unlocked.`
    );
  };

  const uncombinePosts = (driverTripId: string, riderTripId: string) => {
    const riderTrip = trips.find((t) => t.id === riderTripId);
    const seatsToRestore = riderTrip?.totalSeats || 1;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === driverTripId) {
          return {
            ...t,
            availableSeats: Math.min(t.totalSeats, t.availableSeats + seatsToRestore),
            roster: t.roster.filter((r) => r.studentId !== riderTrip?.authorId),
            combinedRiderRequestIds: (t.combinedRiderRequestIds || []).filter((id) => id !== riderTripId),
            combinedSummary: undefined,
          };
        }
        if (t.id === riderTripId) {
          return {
            ...t,
            isCombined: false,
            combinedIntoTripId: undefined,
            combinedSummary: undefined,
          };
        }
        return t;
      })
    );

    setSettlements((prev) =>
      prev.filter((s) => !(s.tripId === driverTripId && s.passengerId === riderTrip?.authorId))
    );

    sendMessage(
      driverTripId,
      `Separated combined carpool post with ${riderTrip?.destinationCity}.`
    );
  };

  const getRiderRecommendations = (driverTripId?: string): RiderRecommendation[] => {
    const driverTripsToMatch = driverTripId
      ? trips.filter((t) => t.id === driverTripId)
      : trips.filter((t) => t.authorId === currentStudent.id && t.postType === 'driver_offer');

    if (driverTripsToMatch.length === 0) return [];

    const riderRequests = trips.filter(
      (t) => t.postType === 'rider_request' && !t.isCombined && t.authorId !== currentStudent.id
    );

    const recommendations: RiderRecommendation[] = [];

    for (const driverTrip of driverTripsToMatch) {
      if (driverTrip.availableSeats <= 0) continue;

      for (const riderTrip of riderRequests) {
        const rider = getStudentById(riderTrip.authorId);
        if (!rider) continue;

        const dCity = driverTrip.destinationCity.toLowerCase();
        const rCity = riderTrip.destinationCity.toLowerCase();
        const dWords = dCity.split(/[\s,]+/);
        const rWords = rCity.split(/[\s,]+/);

        const cityMatch =
          dWords.some((w) => w.length > 2 && rCity.includes(w)) ||
          rWords.some((w) => w.length > 2 && dCity.includes(w)) ||
          dCity.includes(rCity) ||
          rCity.includes(dCity);

        const sameDate = driverTrip.departureDate === riderTrip.departureDate;
        const sameBreak = driverTrip.breakCategory === riderTrip.breakCategory;

        let score = 55;
        const reasons: string[] = [];

        if (cityMatch) {
          score += 35;
          reasons.push(`Destination corridor match (${riderTrip.destinationCity})`);
        }

        if (sameDate) {
          score += 15;
          reasons.push(`Same departure date (${riderTrip.departureDate})`);
        } else if (sameBreak) {
          score += 10;
          reasons.push(`Same travel period (${riderTrip.breakCategory.replace('_', ' ')})`);
        }

        if (rider.preferences.luggageSize !== 'large' || currentStudent.vehicleInfo?.make === 'Subaru') {
          score += 5;
          reasons.push(`Luggage (${rider.preferences.luggageSize}) fits your vehicle space`);
        }

        if (score >= 65 || cityMatch || sameBreak) {
          recommendations.push({
            riderTrip,
            rider,
            matchScore: Math.min(98, score),
            matchReasons: reasons.length > 0 ? reasons : ['Heading along your regional travel route'],
            driverTrip,
          });
        }
      }
    }

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  };

  /**
   * Helper that checks whether the current viewing student has unlocked
   * sensitive personal (phone) and financial (payment handle) details of target.
   */
  const getDisplayContact = (target: StudentProfile, tripId?: string) => {
    // If viewing oneself, always unlocked
    if (target.id === currentStudent.id) {
      return {
        isUnlocked: true,
        displayName: target.name,
        phone: target.phone,
        venmo: target.paymentHandles.venmo,
        zelle: target.paymentHandles.zelle,
        cashapp: target.paymentHandles.cashapp,
      };
    }

    // Check if target and viewer share any accepted carpool
    let isAcceptedCompanion = false;
    if (tripId) {
      const trip = trips.find((t) => t.id === tripId);
      if (trip) {
        // Target is driver, viewer is accepted passenger
        if (trip.authorId === target.id) {
          const rider = trip.roster.find((r) => r.studentId === currentStudent.id);
          if (rider && rider.status === 'accepted') isAcceptedCompanion = true;
        }
        // Viewer is driver, target is accepted passenger
        if (trip.authorId === currentStudent.id) {
          const rider = trip.roster.find((r) => r.studentId === target.id);
          if (rider && rider.status === 'accepted') isAcceptedCompanion = true;
        }
        // Both are accepted passengers in the same carpool
        const viewerRoster = trip.roster.find((r) => r.studentId === currentStudent.id);
        const targetRoster = trip.roster.find((r) => r.studentId === target.id);
        if (viewerRoster?.status === 'accepted' && targetRoster?.status === 'accepted') {
          isAcceptedCompanion = true;
        }
      }
    } else {
      // Check across all trips
      for (const trip of trips) {
        if (
          trip.authorId === target.id &&
          trip.roster.some((r) => r.studentId === currentStudent.id && r.status === 'accepted')
        ) {
          isAcceptedCompanion = true;
          break;
        }
        if (
          trip.authorId === currentStudent.id &&
          trip.roster.some((r) => r.studentId === target.id && r.status === 'accepted')
        ) {
          isAcceptedCompanion = true;
          break;
        }
      }
    }

    // Name formatting with privacy
    let displayName = target.name;
    if (target.privacySettings.maskLastName && !isAcceptedCompanion) {
      const parts = target.name.trim().split(' ');
      if (parts.length > 1) {
        displayName = `${parts[0]} ${parts[parts.length - 1][0]}.`;
      }
    }

    if (isAcceptedCompanion) {
      return {
        isUnlocked: true,
        displayName,
        phone: target.phone,
        venmo: target.paymentHandles.venmo,
        zelle: target.paymentHandles.zelle,
        cashapp: target.paymentHandles.cashapp,
      };
    }

    // Masked for privacy
    const rawDigits = target.phone.replace(/\D/g, '');
    const last4 = rawDigits.slice(-4) || '••••';
    const maskedPhone = `(•••) •••-${last4}`;

    const maskHandle = (handle?: string) => {
      if (!handle) return undefined;
      const prefix = handle.startsWith('@') || handle.startsWith('$') ? handle[0] : '';
      const body = prefix ? handle.slice(1) : handle;
      const visible = body.slice(-2);
      return `${prefix}••••${visible}`;
    };

    return {
      isUnlocked: false,
      displayName,
      phone: maskedPhone,
      venmo: maskHandle(target.paymentHandles.venmo),
      zelle: target.paymentHandles.zelle ? '•••@••••.edu' : undefined,
      cashapp: maskHandle(target.paymentHandles.cashapp),
    };
  };

  const unreadNotificationCount = notifications.filter(
    (n) => n.recipientId === currentStudent.id && !n.isRead
  ).length;

  const requestPushPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBrowserPushPermission('unsupported');
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      setBrowserPushPermission(res);
      if (res === 'granted') {
        sendPushNotification(
          'carpool_update',
          '🔔 Push Notifications Activated',
          'You will now receive departure alerts, trip reminders, and cost split updates directly.'
        );
        return true;
      }
    } catch (err) {
      console.warn('Push permission error:', err);
    }
    return false;
  };

  const updatePushSettings = (newSettings: Partial<PushNotificationSettings>) => {
    setPushSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientId === currentStudent.id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const sendPushNotification = (
    category: NotificationCategory,
    title: string,
    message: string,
    tripId?: string,
    actionType?: 'view_trip' | 'view_split' | 'view_chat'
  ) => {
    if (!pushSettings.enablePush) return;
    if (category === 'departure_reminder' && !pushSettings.departureReminders) return;
    if (category === 'payment_reminder' && !pushSettings.paymentReminders) return;
    if (category === 'upcoming_trip' && !pushSettings.upcomingTrips) return;
    if (category === 'carpool_update' && !pushSettings.combinedCarpoolAlerts) return;

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipientId: currentStudent.id,
      category,
      title,
      message,
      timestamp: new Date().toISOString(),
      tripId,
      isRead: false,
      actionType,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActivePushToast(newNotif);

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback to in-app toast
      }
    }
  };

  const triggerTestReminder = (type: 'departure' | 'payment' | 'upcoming') => {
    if (type === 'departure') {
      sendPushNotification(
        'departure_reminder',
        '🚗 Departure in 30 Mins: Lake Tahoe Ski Carpool',
        `Alex Rivera is picking up at Tressider Lot. Meeting at 3:30 PM. Don't forget your snowboard bag!`,
        'trip-tahoe-ski',
        'view_trip'
      );
    } else if (type === 'payment') {
      sendPushNotification(
        'payment_reminder',
        '💵 Fair Cost Share Reminder: $18.00 Gas & Tolls',
        `Trip completed! Please reimburse Alex Rivera $18.00 via Venmo (@Alex-Rivera-Outback).`,
        'trip-tahoe-ski',
        'view_split'
      );
    } else if (type === 'upcoming') {
      sendPushNotification(
        'upcoming_trip',
        '📅 Upcoming Holiday Trip: Thanksgiving LA Carpool',
        `Your carpool to Los Angeles departs Wednesday Nov 25 at 8:00 AM from Wilbur Hall. Check with your driver for luggage limits.`,
        'trip-thanksgiving-la',
        'view_trip'
      );
    }
  };

  const dismissPushToast = () => {
    setActivePushToast(null);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.TRIPS);
    localStorage.removeItem(STORAGE_KEYS.THREADS);
    localStorage.removeItem(STORAGE_KEYS.SETTLEMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PUSH_SETTINGS);
    setCurrentStudentId('student-maya');
    setStudents(INITIAL_STUDENTS);
    setTrips(INITIAL_TRIPS);
    setThreads(INITIAL_THREADS);
    setSettlements(INITIAL_SETTLEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPushSettings(DEFAULT_NOTIFICATION_SETTINGS);
  };

  return (
    <CarpoolContext.Provider
      value={{
        currentStudent,
        students,
        trips,
        threads,
        settlements,
        switchStudent,
        updateProfile,
        createTrip,
        deleteTrip,
        requestSeat,
        cancelSeatRequest,
        handleRosterDecision,
        sendMessage,
        toggleSettlement,
        createSettlementForTrip,
        combinePosts,
        uncombinePosts,
        getRiderRecommendations,
        getStudentById,
        getDisplayContact,
        notifications,
        unreadNotificationCount,
        pushSettings,
        browserPushPermission,
        requestPushPermission,
        updatePushSettings,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        sendPushNotification,
        triggerTestReminder,
        activePushToast,
        dismissPushToast,
        resetAllData,
      }}
    >
      {children}
    </CarpoolContext.Provider>
  );
};

export const useCarpool = () => {
  const context = useContext(CarpoolContext);
  if (!context) {
    throw new Error('useCarpool must be used within a CarpoolProvider');
  }
  return context;
};
