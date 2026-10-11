import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchWorkshop, persistChange } from '../services/workshopService';
import { findService } from '../data/workshopData';
import { readJson, writeJson } from '../lib/storage';
import type {
    Booking, BookingDraft, BookingStatus, Customer, CustomerDraft, OwnedVehicle,
    ServiceRecord, VehicleDraft, WorkshopContextValue, WorkshopStatus,
} from '../types/workshop';
import { WorkshopContext } from './workshopContext';

/**
 * The workshop's working state: the garage, the booking book, and the
 * completed-work ledger.
 *
 * One provider serves both dashboards because they are two views of the
 * same workshop — an advisor moving a job to "In Service" is a change
 * the owner should see on their own page, and duplicating the booking
 * list in two places would guarantee they eventually disagree.
 *
 * It is mounted per dashboard route rather than around the whole app,
 * so visitors who never open a dashboard never pay for the fetch.
 */

/** Bumped whenever the persisted shape changes, so an older snapshot is
 *  discarded rather than read with missing fields. */
const SNAPSHOT_KEY = 'autosphere.workshop.v1';

interface PersistedSnapshot {
    customers: Customer[];
    vehicles: OwnedVehicle[];
    bookings: Booking[];
}

/** Completed records are read-only in this build — work that has been
 *  invoiced is not something a dashboard edits — so the ledger is
 *  always taken fresh and only the three mutable collections persist. */
const isPersistable = (value: unknown): value is PersistedSnapshot =>
    typeof value === 'object' && value !== null
    && Array.isArray((value as PersistedSnapshot).customers)
    && Array.isArray((value as PersistedSnapshot).vehicles)
    && Array.isArray((value as PersistedSnapshot).bookings);

/** Monotonic enough for mock data: the next free SRV number. */
function nextBookingId(bookings: Booking[]): string {
    const highest = bookings.reduce((max, b) => {
        const n = Number(b.id.replace(/\D/g, ''));
        return Number.isFinite(n) && n > max ? n : max;
    }, 9200);
    return `SRV-${highest + 1}`;
}

/** Registrations are compared with spacing and case ignored, so
 *  "mh12qr4821" is recognised as the plate already in the garage. */
const plateKey = (registration: string) =>
    registration.replace(/\s+/g, '').toUpperCase();

/** A new vehicle's service interval: the next 15,000 km milestone past
 *  the odometer reading the owner entered. */
const SERVICE_INTERVAL_KM = 15000;
const nextServiceFrom = (odometerKm: number) =>
    (Math.floor(odometerKm / SERVICE_INTERVAL_KM) + 1) * SERVICE_INTERVAL_KM;

function vehicleFromDraft(draft: VehicleDraft, ownerId: string, id: string): OwnedVehicle {
    const odometerKm = Number(draft.odometerKm.replace(/[^\d]/g, ''));
    return {
        id,
        ownerId,
        make: draft.make.trim(),
        model: draft.model.trim(),
        variant: draft.variant.trim() || undefined,
        year: Number(draft.year),
        registration: draft.registration.trim().toUpperCase(),
        fuel: draft.fuel as OwnedVehicle['fuel'],
        odometerKm,
        status: 'At Home',
        lastServiceOn: null,
        nextServiceKm: nextServiceFrom(odometerKm),
        insuranceValidTill: draft.insuranceValidTill || null,
        warrantyValidTill: null,
        // A car we have never inspected gets no invented score. 75 is
        // the neutral mid-point the UI labels "not yet assessed".
        healthScore: 75,
    };
}

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<WorkshopStatus>('loading');
    const [error, setError] = useState<string | null>(null);
    const [nonce, setNonce] = useState(0);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [vehicles, setVehicles] = useState<OwnedVehicle[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [records, setRecords] = useState<ServiceRecord[]>([]);

    /** Guards against a slow first load overwriting a fast retry. */
    const generation = useRef(0);
    /** Nothing is written back until the first load has settled, so a
     *  failed load cannot persist an empty garage over real data. */
    const hydrated = useRef(false);
    /** Set by the first mutation. Until then the snapshot is left alone:
     *  the fixtures are dated relative to today, and persisting them on
     *  a passive visit would freeze "tomorrow" as a date that goes stale
     *  by the next one. */
    const dirty = useRef(false);

    /** Acknowledge a write, and mark the snapshot worth persisting. */
    const commit = useCallback(async () => {
        await persistChange();
        dirty.current = true;
    }, []);

    useEffect(() => {
        const run = ++generation.current;
        hydrated.current = false;

        // No setState in the effect body: the reload and reset controls
        // put the provider back into its loading state before bumping
        // the nonce, so the only writes here are in the callbacks.
        fetchWorkshop()
            .then(snapshot => {
                if (run !== generation.current) return;
                const persisted = readJson<unknown>(SNAPSHOT_KEY, null);

                setRecords(snapshot.records);
                if (isPersistable(persisted)) {
                    setCustomers(persisted.customers);
                    setVehicles(persisted.vehicles);
                    setBookings(persisted.bookings);
                } else {
                    setCustomers(snapshot.customers);
                    setVehicles(snapshot.vehicles);
                    setBookings(snapshot.bookings);
                }
                hydrated.current = true;
                setStatus('success');
            })
            .catch((err: unknown) => {
                if (run !== generation.current) return;
                setError(err instanceof Error
                    ? err.message
                    : 'Could not load the workshop. Please try again.');
                setStatus('error');
            });
    }, [nonce]);

    useEffect(() => {
        if (!hydrated.current || !dirty.current) return;
        writeJson(SNAPSHOT_KEY, { customers, vehicles, bookings } satisfies PersistedSnapshot);
    }, [customers, vehicles, bookings]);

    const reload = useCallback(() => {
        setStatus('loading');
        setError(null);
        setNonce(n => n + 1);
    }, []);

    /** Discards local edits and re-seeds from the service layer. The
     *  settings tab offers this because a browser-persisted demo with no
     *  way back to its starting state is a trap. */
    const resetWorkshop = useCallback(() => {
        writeJson(SNAPSHOT_KEY, null);
        dirty.current = false;
        reload();
    }, [reload]);

    /* ── Garage ───────────────────────────────────────────────── */

    const addVehicle = useCallback(async (draft: VehicleDraft, ownerId: string) => {
        // Validated before the write, as a server would: the form's
        // field rules cannot know what is already in the garage.
        const key = plateKey(draft.registration);
        if (vehicles.some(v => plateKey(v.registration) === key)) {
            throw new Error(`${draft.registration.toUpperCase()} is already in your garage.`);
        }

        await commit();
        const vehicle = vehicleFromDraft(draft, ownerId, `veh-${Date.now().toString(36)}`);
        setVehicles(prev => [...prev, vehicle]);
        return vehicle;
    }, [vehicles, commit]);

    const updateVehicle = useCallback(async (id: string, draft: VehicleDraft) => {
        const key = plateKey(draft.registration);
        if (vehicles.some(v => v.id !== id && plateKey(v.registration) === key)) {
            throw new Error(`${draft.registration.toUpperCase()} belongs to another vehicle in your garage.`);
        }

        await commit();
        setVehicles(prev => prev.map(v => {
            if (v.id !== id) return v;
            const odometerKm = Number(draft.odometerKm.replace(/[^\d]/g, ''));
            return {
                ...v,
                make: draft.make.trim(),
                model: draft.model.trim(),
                variant: draft.variant.trim() || undefined,
                year: Number(draft.year),
                registration: draft.registration.trim().toUpperCase(),
                fuel: draft.fuel as OwnedVehicle['fuel'],
                odometerKm,
                // An owner correcting the odometer upward moves the next
                // service with it; an existing interval still ahead of
                // the reading is left alone.
                nextServiceKm: odometerKm >= v.nextServiceKm ? nextServiceFrom(odometerKm) : v.nextServiceKm,
                insuranceValidTill: draft.insuranceValidTill || null,
            };
        }));
    }, [vehicles, commit]);

    const removeVehicle = useCallback(async (id: string) => {
        await commit();
        setVehicles(prev => prev.filter(v => v.id !== id));
        // Open jobs against a vehicle that has left the garage are
        // cancelled rather than orphaned.
        setBookings(prev => prev.map(b =>
            b.vehicleId === id && (b.status === 'Pending' || b.status === 'Confirmed')
                ? { ...b, status: 'Cancelled' as BookingStatus }
                : b,
        ));
    }, [commit]);

    /* ── Booking book ─────────────────────────────────────────── */

    const createBooking = useCallback(async (draft: BookingDraft) => {
        const service = findService(draft.serviceSlug);
        if (!service) throw new Error('That service is no longer offered. Please pick another.');

        await commit();
        const booking: Booking = {
            id: nextBookingId(bookings),
            customerId: draft.customerId,
            vehicleId: draft.vehicleId,
            serviceSlug: service.slug,
            serviceName: service.name,
            scheduledFor: draft.scheduledFor,
            slot: draft.slot,
            // A new request waits for an advisor to assign the bay and
            // technician — the dashboard says so rather than inventing one.
            bay: null,
            technician: null,
            status: 'Pending',
            estimate: service.fromPrice,
            notes: draft.notes.trim() || undefined,
        };
        setBookings(prev => [booking, ...prev]);
        return booking;
    }, [bookings, commit]);

    const setBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
        const booking = bookings.find(b => b.id === id);
        await commit();
        setBookings(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));

        // A job moving in or out of the workshop changes where the owner
        // believes their car is, so the vehicle follows the booking.
        if (!booking) return;
        setVehicles(prev => prev.map(v => {
            if (v.id !== booking.vehicleId) return v;
            if (status === 'In Service') return { ...v, status: 'In Service' };
            if (status === 'Completed') return { ...v, status: 'Ready for Pickup' };
            if (status === 'Cancelled' && v.status === 'In Service') return { ...v, status: 'At Home' };
            return v;
        }));
    }, [bookings, commit]);

    const cancelBooking = useCallback(async (id: string) => {
        await setBookingStatus(id, 'Cancelled');
    }, [setBookingStatus]);

    const assignBooking = useCallback(async (
        id: string,
        patch: { bay?: string | null; technician?: string | null },
    ) => {
        await commit();
        setBookings(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
    }, [commit]);

    /* ── Customer records ─────────────────────────────────────── */

    const addCustomer = useCallback(async (draft: CustomerDraft) => {
        const email = draft.email.trim().toLowerCase();
        if (customers.some(c => c.email.toLowerCase() === email)) {
            throw new Error(`${draft.email.trim()} is already on another customer record.`);
        }

        await commit();
        const customer: Customer = {
            id: `cust-${Date.now().toString(36)}`,
            name: draft.name.trim(),
            email,
            phone: draft.phone.trim(),
            city: draft.city.trim(),
            plan: draft.plan as Customer['plan'],
            status: 'Active',
            joinedOn: new Date().toISOString().slice(0, 10),
        };
        setCustomers(prev => [customer, ...prev]);
        return customer;
    }, [customers, commit]);

    const updateCustomer = useCallback(async (id: string, draft: CustomerDraft) => {
        const email = draft.email.trim().toLowerCase();
        if (customers.some(c => c.id !== id && c.email.toLowerCase() === email)) {
            throw new Error(`${draft.email.trim()} is already on another customer record.`);
        }

        await commit();
        setCustomers(prev => prev.map(c => (c.id === id ? {
            ...c,
            name: draft.name.trim(),
            email,
            phone: draft.phone.trim(),
            city: draft.city.trim(),
            plan: draft.plan as Customer['plan'],
        } : c)));
    }, [customers, commit]);

    const removeCustomer = useCallback(async (id: string) => {
        await commit();
        setCustomers(prev => prev.filter(c => c.id !== id));
        setVehicles(prev => prev.filter(v => v.ownerId !== id));
        setBookings(prev => prev.map(b =>
            b.customerId === id && (b.status === 'Pending' || b.status === 'Confirmed')
                ? { ...b, status: 'Cancelled' as BookingStatus }
                : b,
        ));
    }, [commit]);

    const value = useMemo<WorkshopContextValue>(() => ({
        status, error, reload,
        customers, vehicles, bookings, records,
        addVehicle, updateVehicle, removeVehicle,
        createBooking, cancelBooking, setBookingStatus, assignBooking,
        addCustomer, updateCustomer, removeCustomer, resetWorkshop,
    }), [status, error, reload, customers, vehicles, bookings, records,
        addVehicle, updateVehicle, removeVehicle,
        createBooking, cancelBooking, setBookingStatus, assignBooking,
        addCustomer, updateCustomer, removeCustomer, resetWorkshop]);

    return (
        <WorkshopContext.Provider value={value}>
            {children}
        </WorkshopContext.Provider>
    );
};
