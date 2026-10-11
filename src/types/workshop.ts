/**
 * Workshop domain types — the service-centre side of the product.
 *
 * Deliberately separate from types/vehicle.ts: that file describes the
 * showroom catalogue (price, horsepower, top speed), which has nothing
 * to say about a car that is booked in for a brake inspection. A
 * vehicle *owned and serviced* needs an odometer reading, an insurance
 * expiry and a next-service interval instead.
 */

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric';

export const FUEL_TYPES: readonly FuelType[] = [
    'Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric',
];

/** Where the car physically is, from the owner's point of view. */
export type VehicleStatus =
    | 'At Home'
    | 'In Service'
    | 'Awaiting Parts'
    | 'Ready for Pickup';

export interface OwnedVehicle {
    id: string;
    ownerId: string;
    /** Manufacturer, e.g. "BMW". */
    make: string;
    /** Model line, e.g. "3 Series". */
    model: string;
    /** Trim or variant, e.g. "320d M Sport". Optional — not every car has one. */
    variant?: string;
    year: number;
    /** Indian plate, stored spaced: "MH 12 QR 4821". */
    registration: string;
    fuel: FuelType;
    odometerKm: number;
    status: VehicleStatus;
    /** ISO date, or null for a car that has never been serviced here. */
    lastServiceOn: string | null;
    /** Odometer reading at which the next service falls due. */
    nextServiceKm: number;
    /** ISO dates; null when the owner has not supplied one. */
    insuranceValidTill: string | null;
    warrantyValidTill: string | null;
    /** 0–100, as reported by the last inspection. */
    healthScore: number;
}

/** The fields an owner fills in — everything else is derived. */
export interface VehicleDraft {
    make: string;
    model: string;
    variant: string;
    year: string;
    registration: string;
    fuel: string;
    odometerKm: string;
    insuranceValidTill: string;
}

export type BookingStatus =
    | 'Pending'
    | 'Confirmed'
    | 'In Service'
    | 'Completed'
    | 'Cancelled';

/** Ordered as a job actually progresses, which is also the order the
 *  admin status control offers them in. */
export const BOOKING_STATUSES: readonly BookingStatus[] = [
    'Pending', 'Confirmed', 'In Service', 'Completed', 'Cancelled',
];

/** A booking the owner can still call off. */
export const CANCELLABLE_STATUSES: readonly BookingStatus[] = ['Pending', 'Confirmed'];

export interface Booking {
    id: string;
    customerId: string;
    vehicleId: string;
    serviceSlug: string;
    serviceName: string;
    /** ISO date — the day the car is expected in. */
    scheduledFor: string;
    /** Slot label, e.g. "09:00". */
    slot: string;
    bay: string | null;
    technician: string | null;
    status: BookingStatus;
    /** INR, whole rupees. */
    estimate: number;
    /** What the owner wrote when booking. */
    notes?: string;
}

/** The fields the booking form collects. The customer is part of the
 *  draft rather than a separate argument, because an advisor booking on
 *  someone's behalf chooses it in the same form. */
export interface BookingDraft {
    customerId: string;
    vehicleId: string;
    serviceSlug: string;
    scheduledFor: string;
    slot: string;
    notes: string;
}

export interface ServiceRecord {
    id: string;
    customerId: string;
    vehicleId: string;
    serviceName: string;
    /** ISO date. */
    completedOn: string;
    technician: string;
    odometerKm: number;
    /** INR, whole rupees. */
    cost: number;
    /** 1–5, or null if the owner never rated the visit. */
    rating: number | null;
    invoiceId: string;
    /** Line items as they appear on the invoice. */
    workDone: string[];
}

/** The fields an advisor fills in when adding or editing a customer. */
export interface CustomerDraft {
    name: string;
    email: string;
    phone: string;
    city: string;
    plan: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    plan: 'Basic' | 'Premium';
    status: 'Active' | 'Inactive';
    /** ISO date. */
    joinedOn: string;
}

/** A bookable service, flattened from the marketing catalogue. */
export interface ServiceOption {
    slug: string;
    name: string;
    /** Lowest realistic price, INR whole rupees. */
    fromPrice: number;
    duration: string;
    summary: string;
}

/** Output of the AI vehicle check — mirrors the worked example on the
 *  homepage, so the tool and its advertisement agree. */
export interface VehicleCheckResult {
    /** Echo of what the owner described. */
    symptom: string;
    vehicleLabel: string;
    likelyCause: string;
    /** The records and facts the assessment leaned on. */
    basis: string[];
    urgency: 'Monitor' | 'Service soon' | 'Urgent';
    urgencyNote: string;
    /** Slug of the service to book next. */
    recommendedSlug: string;
    recommendedName: string;
    recommendedMeta: string;
}

/* ── Shared state contract ─────────────────────────────────────
   Implemented by WorkshopProvider and read through useWorkshop.
   Mutations are async and resolve once the (simulated) write has
   been acknowledged, so a form can keep its submitting state until
   the change is real rather than flickering to success instantly. */

export type WorkshopStatus = 'loading' | 'success' | 'error';

export interface WorkshopContextValue {
    status: WorkshopStatus;
    /** Populated only when status is 'error'. */
    error: string | null;
    /** Re-run the initial load — wired to the Retry control. */
    reload: () => void;

    customers: Customer[];
    vehicles: OwnedVehicle[];
    bookings: Booking[];
    records: ServiceRecord[];

    /** Rejects when the registration already exists in the garage. */
    addVehicle: (draft: VehicleDraft, ownerId: string) => Promise<OwnedVehicle>;
    updateVehicle: (id: string, draft: VehicleDraft) => Promise<void>;
    /** Also cancels any open booking against the vehicle. */
    removeVehicle: (id: string) => Promise<void>;

    createBooking: (draft: BookingDraft) => Promise<Booking>;
    cancelBooking: (id: string) => Promise<void>;
    setBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
    /** Admin-side assignment; either field may be cleared with null. */
    assignBooking: (id: string, patch: { bay?: string | null; technician?: string | null }) => Promise<void>;

    /** Rejects when the email is already on another customer record. */
    addCustomer: (draft: CustomerDraft) => Promise<Customer>;
    updateCustomer: (id: string, draft: CustomerDraft) => Promise<void>;
    /** Also removes the customer's vehicles and cancels their open jobs. */
    removeCustomer: (id: string) => Promise<void>;

    /** Clears the persisted snapshot and reloads the seeded data. */
    resetWorkshop: () => void;
}
