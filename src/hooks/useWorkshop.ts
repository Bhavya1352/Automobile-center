import { useContext, useMemo } from 'react';
import { WorkshopContext } from '../context/workshopContext';
import { CANCELLABLE_STATUSES } from '../types/workshop';
import type { Booking, OwnedVehicle, ServiceRecord } from '../types/workshop';

/** Access the workshop's vehicles, bookings and completed work. */
export function useWorkshop() {
    const ctx = useContext(WorkshopContext);
    if (!ctx) throw new Error('useWorkshop must be used within a WorkshopProvider');
    return ctx;
}

export interface CustomerView {
    vehicles: OwnedVehicle[];
    /** Pending, Confirmed or In Service, soonest first. */
    upcoming: Booking[];
    /** Completed and Cancelled, most recent first. */
    pastBookings: Booking[];
    /** Completed work, most recent first. */
    records: ServiceRecord[];
    totalSpend: number;
    visits: number;
    /** Mean of the ratings actually given, or null if none were. */
    averageRating: number | null;
    lastVisitOn: string | null;
}

const ACTIVE_STATUSES = new Set([...CANCELLABLE_STATUSES, 'In Service']);

/**
 * Everything one customer's dashboard — or the admin's detail modal —
 * needs, derived in one place so the two views cannot disagree about
 * what "upcoming" or "total spent" means.
 */
export function useCustomerView(customerId: string | null): CustomerView {
    const { vehicles, bookings, records } = useWorkshop();

    return useMemo(() => {
        if (!customerId) {
            return {
                vehicles: [], upcoming: [], pastBookings: [], records: [],
                totalSpend: 0, visits: 0, averageRating: null, lastVisitOn: null,
            };
        }

        const mine = vehicles.filter(v => v.ownerId === customerId);
        const myBookings = bookings.filter(b => b.customerId === customerId);
        const myRecords = records
            .filter(r => r.customerId === customerId)
            .sort((a, b) => b.completedOn.localeCompare(a.completedOn));

        const rated = myRecords.filter(r => r.rating !== null);

        return {
            vehicles: mine,
            upcoming: myBookings
                .filter(b => ACTIVE_STATUSES.has(b.status))
                .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)),
            pastBookings: myBookings
                .filter(b => !ACTIVE_STATUSES.has(b.status))
                .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor)),
            records: myRecords,
            totalSpend: myRecords.reduce((sum, r) => sum + r.cost, 0),
            visits: myRecords.length,
            averageRating: rated.length
                ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
                : null,
            lastVisitOn: myRecords[0]?.completedOn ?? null,
        };
    }, [customerId, vehicles, bookings, records]);
}

/** Label a vehicle the way the whole product refers to it. */
export const vehicleLabel = (v: OwnedVehicle | undefined) =>
    v ? `${v.make} ${v.model} ${v.year}` : 'Unknown vehicle';
