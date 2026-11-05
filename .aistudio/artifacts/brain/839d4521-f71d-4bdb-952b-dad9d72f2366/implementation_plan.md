# CampusRide: College Carpool & Weekend Rideshare Platform

A trusted, privacy-first peer rideshare and carpooling platform tailored for college students traveling home, to airports, and across cities for weekend getaways and academic holiday breaks.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during Phase 1 clarification and form the foundation of the design:

- **Campus Scope & Verification**: Campus-specific hub structure requiring verified institutional student email (`.edu`) credentials, campus affiliation badges, and trusted dorm/campus pickup hubs to prevent non-student access.
- **Cost-Splitting & Financial Privacy**: Built-in distance/gas/toll fare calculator with suggested equal splits. Financial privacy is strictly preserved by using masked peer payment handles (e.g., Venmo, Zelle, Cash App) that are revealed **only** to confirmed members of an accepted carpool, completely avoiding third-party banking fees, public exposure, or credit card storage vulnerabilities.
- **Trip Discovery & Board Structure**: Dual-feed board separating **"Driver Offers"** (available seats) from **"Rider Requests"** (students looking for a ride), with rich filtering for academic break periods, destination cities, departure hubs, baggage space, and seat availability.

---

## 1. Overview & Core Concept

### What It Does
**CampusRide** enables verified university students to coordinate safe, affordable, and collegial carpools for weekend trips and scheduled academic breaks (e.g., Thanksgiving, Winter Break, Spring Break, and long holiday weekends). Students can create a profile with academic credentials and comfort preferences, publish trips or ride requests to a campus-wide discussion board, communicate in private direct and group trip threads, manage carpool rosters, and transparently calculate and settle shared travel costs.

### Target Audience & Persona
- **Student Drivers**: College car owners who want to offset surging fuel and toll costs while finding friendly classmates heading in the same direction.
- **Student Riders**: Students without vehicles seeking affordable, direct, and comfortable transportation compared to overcrowded long-distance buses, multi-leg trains, or expensive ride-hailing services.
- **Campus Communities**: Universities fostering sustainable student mobility, commuter safety, and reduced campus parking congestion.

### Key Value & Privacy Guarantees
- **Verified Student Peer Network**: Access and carpool rosters are restricted to students with verified `.edu` credentials and recognized campus residences.
- **Privacy Shield for Personal & Financial Data**: Phone numbers, exact dormitory room numbers, and financial payment IDs remain strictly masked from public discussion boards, revealed only when both parties mutually accept a carpool booking.
- **Fair-Share Trip Economics**: Transparent gas and toll estimations prevent commercial price gouging and ensure students contribute only their exact fair share.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ FLOW 1: DISCOVER & FILTER RIDES ]
Browse Board (Drivers / Riders) ──> Filter by Break / City ──> Inspect Trip Details & Driver Bio

[ FLOW 2: POSTING A TRIP / REQUEST ]
Select "Driving" or "Need Ride" ──> Enter Route & Date ──> Use Fare Calculator ──> Publish Post

[ FLOW 3: JOINING & ROSTER APPROVAL ]
Request Seat + Pickup Note ──> Driver Reviews Profile ──> Driver Accepts ──> Seat Reserved

[ FLOW 4: PRIVATE COORDINATION & EXPENSE SETTLEMENT ]
Unlock Private Chat ──> View Masked Payment Handles ──> Track Fuel/Tolls ──> Mark Cost Settled
```

1. **Student Onboarding & Profile Setup**:
   - Students register with university name, graduation year, major, and verified `.edu` email badge.
   - Profiles feature travel preferences (music playlist vibe, luggage size allowance, pet friendliness, conversation openness) and vehicle details for drivers (make, model, color, available seats).
   - **Privacy Shield Settings**: Students configure whether phone number and payment handles (Venmo / Zelle / Cash App) are hidden by default, visible only to confirmed carpool companions.

2. **Dual-Feed Discussion & Trip Board**:
   - **Drivers Offering Seats**: Cards display destination, departure date/time, pickup campus hub, seats remaining, estimated cost per seat, and driver verification badge.
   - **Riders Seeking Rides**: Cards display student destination request, target departure window, preferred pickup spot, and baggage needs.
   - **Filter & Search Bar**: Quick filters for Academic Breaks ("Thanksgiving Break", "Spring Recess", "Weekend Getaway", "Airport Shuttles"), destination search, seat count, and departure dates.

3. **Trip Inspector & Booking Drawer**:
   - Selecting any ride opens a comprehensive itinerary drawer showing route details, estimated driving duration, intermediate rest stop plans, car model, and mutual student reviews.
   - One-click "Request Seat" with an optional note (e.g., "Have one medium duffle, can meet at North Quad").
   - Instant roster preview showing accepted passengers and remaining open spots.

4. **Direct & Group Trip Messaging**:
   - Dedicated message thread for each carpool automatically updates when new passengers are accepted.
   - Enables seamless coordination of pickup landmarks, luggage checks, snack stops, and weather updates.

5. **Cost-Splitting Calculator & Settlement Hub**:
   - **Trip Fare Calculator**: Input estimated trip miles, vehicle MPG, current average gas price, and toll estimates.
   - **Split Ledger**: Automatically computes the exact cost per seat based on confirmed passenger count.
   - **Private Settlement Cards**: Confirmed carpoolers view copyable payment handles (Venmo, Zelle, Cash App) with an amount-owed badge and a one-click "Mark Paid / Confirmed" toggle.

---

### Visual Identity & Theme

- **Aesthetic Direction**: High-trust collegiate modern. Clean, airy layout combining academic prestige with ergonomic mobility. Restrained, intentional surfaces that eliminate generic AI tropes.
- **Color Palette & Discipline (60-30-10 Rule)**:
  - *60% Dominant Neutral Canvas*: Clean, distraction-free porcelain background (`#F8FAFC` light / `#0B0F17` dark).
  - *30% Structural Surfaces*: Subtle off-white and slate card surfaces with hairline 1px borders (`border-slate-200 dark:border-slate-800`), avoiding nested card sandwiches.
  - *10% Intentional Accents*: Deep collegiate navy (`#1E3A8A` / `#1E293B`) for primary navigation and brand authority, balanced with fresh campus emerald (`#059669` / `#10B981`) for confirmed seats, verified badges, and positive settlement balances.
- **Typography & Scale**:
  - *Brand & Display Headings*: `Plus Jakarta Sans` with tight tracking (`tracking-tight`) and balanced line wraps (`text-wrap: balance`).
  - *Body Prose & Controls*: `Plus Jakarta Sans` (14px–16px) for crisp readability.
  - *Metrics & Calculations*: Strict tabular figures (`font-mono tabular-nums`) for departure times, seat counts, mileage, and dollar amounts to eliminate visual jitter.
- **Ergonomics & Viewport Presence**:
  - Desktop: Full 1440px-optimized two-column workspace with a central dual-feed explorer and a sticky trip detail / fare calculator panel.
  - Mobile: Ergonomic touch-first bottom navigation bar ($44\text{px}+$ touch targets) with quick-access tabs: *Board*, *Post Ride*, *My Trips*, *Messages*, and *Profile*.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Privacy Architecture & Data Minimization
- **Chosen Approach**: Tiered privacy disclosure. On public feeds and discussion boards, students are identified only by first name, university affiliation, verification badge, and general campus zone (e.g., "Maya S. · Stanford University · West Campus"). Sensitive data (phone number, WhatsApp, dorm room number, Venmo/Zelle payment IDs) is strictly gated and rendered only inside confirmed carpool group threads.
- **Why**: Protects students from unwanted soliciting, external harassment, and identity scraping while preserving full operational utility for confirmed drivers and riders.
- **Alternatives Considered**: Completely open contact information (critical safety and privacy hazard for college campuses) vs. in-app escrow payment processing (adds heavy financial transaction fees, KYC regulatory burden, and banking liabilities unsuited for informal peer student cost-sharing).

### Decision 2: Dual-Feed Board with Role-Specific Cards
- **Chosen Approach**: Explicit top-level segmented toggle between "Drivers Offering Seats" and "Riders Seeking Carpools", combined with unified search and break filters.
- **Why**: Drivers and riders have fundamentally different criteria: drivers search for reliable companions along their planned path to offset gas; riders search for available seats with specific baggage allowances and departure times. Separating them prevents cluttered feeds and reduces coordination friction.
- **Alternatives Considered**: A single chronological stream of posts (leads to confusion over who is offering vs. requesting rides).

### Decision 3: Client-Side Persistent State with Rich Initial Campus Dataset
- **Chosen Approach**: Robust client-side reactive state store backed by `localStorage` with initial seeding of realistic university routes (e.g., campus to international airport, major metro areas for Thanksgiving, ski weekend shuttles), real student profiles, active carpools, and sample messages.
- **Why**: Ensures the application is immediately testable, interactive, and functional out of the box with zero setup hurdles, while allowing full CRUD operations (creating posts, requesting seats, sending messages, recalculating fares, and toggling privacy settings) that persist seamlessly across page refreshes.
- **Alternatives Considered**: Pure empty state (forces the user to manually create 4–5 profiles and trips before seeing how carpooling and messaging work).

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CampusRide Web Application                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
┌───────────────────────────────┐         ┌───────────────────────────────┐
│     Global App Layout         │         │     Modal & Drawer System     │
│  - Top Bar (Brand + Campus)   │         │  - New Trip / Request Modal   │
│  - Desktop Nav / Mobile Tabs  │         │  - Trip Itinerary Drawer      │
│  - Active User Switcher       │         │  - Privacy Settings Modal     │
└──────────────┬────────────────┘         └──────────────┬────────────────┘
               │                                         │
       ┌───────┴─────────────────────────────────────────┴───────┐
       ▼                                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          Core View Controllers                         │
│                                                                        │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
│  │  Dual-Feed Board   │ │   Trip Details &   │ │  Fare Calculator   │  │
│  │  - Driver Offers   │ │   Roster Manager   │ │  & Cost Splitter   │  │
│  │  - Rider Requests  │ │  - Seat Requests   │ │  - Mileage / Gas   │  │
│  │  - Break Filters   │ │  - Driver Approval │ │  - Masked Handles  │  │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘  │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
│  │ In-Trip Messaging  │ │  Student Profile   │ │  Privacy Shield    │  │
│  │ - Direct / Group   │ │  - .edu Badge      │ │  - Gated Disclosure│  │
│  │ - Coordinate Stops │ │  - Car Specs & Bio │ │  - Role Access     │  │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Reactive State & Storage Layer                     │
│  - UserProfiles (Active student, peer profiles, privacy settings)      │
│  - TripPosts (Route, origin hub, destination, dates, seats, pricing)   │
│  - CarpoolBookings (Roster status: pending, approved, declined)        │
│  - MessageThreads (Direct student chats & trip-specific group threads) │
│  - ExpenseLedger (Itemized fuel/toll expenses, per-passenger splits)   │
│  - LocalStorage Persistence Engine (with fallback demo seeder)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Core Data Entities

1. **`StudentProfile`**:
   - `id`: string
   - `name`: string
   - `email`: string (e.g., `maya.chen@stanford.edu`)
   - `university`: string
   - `gradYear`: number
   - `major`: string
   - `campusHub`: string (e.g., "West Campus - FloMo Quad")
   - `bio`: string
   - `avatarUrl`: string
   - `isDriver`: boolean
   - `vehicleInfo` (optional): `{ make: string, model: string, color: string, plateNumberMasked: string, totalSeats: number }`
   - `preferences`: `{ luggageSize: 'backpack' | 'carryon' | 'large', musicVibe: string, petFriendly: boolean, chatty: boolean }`
   - `privacySettings`: `{ hidePhoneUntilApproved: boolean, hidePaymentHandleUntilApproved: boolean, maskLastName: boolean }`
   - `paymentHandles`: `{ venmo?: string, zelle?: string, cashapp?: string }`
   - `phoneNumber`: string

2. **`TripPost`**:
   - `id`: string
   - `authorId`: string
   - `postType`: `'driver_offer'` | `'rider_request'`
   - `originCampus`: string
   - `destinationCity`: string
   - `destinationDetails`: string (e.g., "SFO International Airport Terminal 2" or "Downtown Portland")
   - `departureDate`: string (ISO date)
   - `departureTime`: string (e.g., "03:30 PM")
   - `returnDate` (optional): string
   - `breakCategory`: `'weekend'` | `'thanksgiving'` | `'winter_break'` | `'spring_recess'` | `'airport_run'`
   - `totalSeats`: number
   - `availableSeats`: number
   - `estimatedDistanceMiles`: number
   - `suggestedSplitPerSeat`: number
   - `totalEstimatedCost`: number
   - `notes`: string
   - `roster`: Array<`{ studentId: string, status: 'pending' | 'accepted' | 'declined', requestedSeats: number, pickupNote: string }`>
   - `createdAt`: string

3. **`Message` & `TripThread`**:
   - `threadId`: string
   - `tripId`: string
   - `participantIds`: string[]
   - `messages`: Array<`{ id: string, senderId: string, content: string, timestamp: string, isSystemNotice?: boolean }`>

4. **`CostSplitSummary`**:
   - `tripId`: string
   - `fuelExpense`: number
   - `tollsExpense`: number
   - `totalExpense`: number
   - `perSeatOwed`: number
   - `settlements`: Array<`{ studentId: string, amount: number, isPaid: boolean, paidAt?: string }`>

---

### Step-by-Step Implementation Sequence (Turn 3 Onward)

1. **Phase 1: Project Scaffolding & Design System Tokens**:
   - Update `metadata.json` with official name ("CampusRide: Student Carpool & Rideshare") and description.
   - Sync `index.html` title and metadata.
   - Configure Tailwind typography and colors in `src/index.css`.
2. **Phase 2: Types, Mock Seed Data & Persistence Store**:
   - Define all TypeScript interfaces in `src/types/carpool.ts`.
   - Implement realistic student profiles across campus colleges, multi-stop holiday trips, message histories, and expenses in `src/data/seedData.ts`.
   - Build reactive state hook (`useCarpoolState.ts`) managing localStorage sync, active user switching, trip creation, seat requests, and chat.
3. **Phase 3: Top Navigation, Student Switcher & Filter Controls**:
   - Build sticky header adhering to the Top Bar Contract (Wordmark, campus selector, filter tags, student profile trigger).
   - Implement dual-feed toggle (`Driver Offers` vs `Rider Requests`) and academic holiday break filter tabs.
4. **Phase 4: Discussion Board & Trip Cards**:
   - Construct responsive card grid featuring route badges, seats remaining, driver verification indicators, and unboxed metadata.
   - Implement empty and filtered states.
5. **Phase 5: Trip Creation Modal & Fare Calculator**:
   - Multi-step modal for posting a ride or request with automatic mileage/gas/toll estimation.
6. **Phase 6: Itinerary Drawer, Seat Request & Roster Approvals**:
   - Side drawer detailing route, passenger roster, seat request triggers, driver accept/decline actions, and seat count updates.
7. **Phase 7: Privacy-Preserving Messaging & Cost Split Hub**:
   - Group trip messaging panel with instant sending and system notifications.
   - Expense split view with masked payment handles (Venmo/Zelle) unlocked only for confirmed riders, and one-click "Mark as Settled".
8. **Phase 8: Student Profile & Privacy Shield Manager**:
   - Profile editor with privacy toggle previews (visualizing what public users see vs what approved carpoolers see).
9. **Phase 9: Verification & Lint Audit**:
   - Run `compile_applet` and `lint_applet` to ensure zero type errors or missing dependencies.
