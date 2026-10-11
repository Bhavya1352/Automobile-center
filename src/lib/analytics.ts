/**
 * Derivations behind the dashboard figures.
 *
 * Every number both dashboards display is computed from the same
 * records here, rather than typed into the view: a revenue total that
 * disagrees with the invoices under it is the fastest way to make a
 * dashboard look decorative.
 */

import type { Booking, ServiceRecord } from '../types/workshop';

export interface MonthBucket {
    /** `yyyy-mm`, used to match ISO dates. */
    key: string;
    /** "Mar" — for an axis. */
    label: string;
    total: number;
    count: number;
}

/** The trailing `count` months, oldest first, including this one. */
export function monthlyTotals(records: ServiceRecord[], count = 6): MonthBucket[] {
    const now = new Date();
    const buckets: MonthBucket[] = [];

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            label: date.toLocaleString('en-IN', { month: 'short' }),
            total: 0,
            count: 0,
        });
    }

    for (const record of records) {
        const bucket = buckets.find(b => record.completedOn.startsWith(b.key));
        if (!bucket) continue;
        bucket.total += record.cost;
        bucket.count += 1;
    }

    return buckets;
}

export interface Share {
    name: string;
    total: number;
    count: number;
    /** Percentage of the whole, rounded. */
    pct: number;
}

/** Spend grouped by service, largest first. `limit` groups the tail
 *  into "Other" rather than drawing a legend nobody can read. */
export function shareByService(records: ServiceRecord[], limit = 3): Share[] {
    const totals = new Map<string, { total: number; count: number }>();
    for (const record of records) {
        const entry = totals.get(record.serviceName) ?? { total: 0, count: 0 };
        entry.total += record.cost;
        entry.count += 1;
        totals.set(record.serviceName, entry);
    }

    const sum = [...totals.values()].reduce((acc, e) => acc + e.total, 0);
    if (sum === 0) return [];

    const sorted = [...totals.entries()]
        .map(([name, e]) => ({ name, ...e, pct: Math.round((e.total / sum) * 100) }))
        .sort((a, b) => b.total - a.total);

    if (sorted.length <= limit) return sorted;

    const head = sorted.slice(0, limit);
    const tail = sorted.slice(limit);
    return [...head, {
        name: 'Other',
        total: tail.reduce((acc, e) => acc + e.total, 0),
        count: tail.reduce((acc, e) => acc + e.count, 0),
        pct: Math.max(0, 100 - head.reduce((acc, e) => acc + e.pct, 0)),
    }];
}

/** Jobs completed per technician, from the invoice ledger, busiest
 *  first. `pct` is relative to the busiest, which is what a workload
 *  bar is actually comparing. */
export function technicianWorkload(records: ServiceRecord[], bookings: Booking[]) {
    const counts = new Map<string, { completed: number; active: number }>();

    for (const record of records) {
        const entry = counts.get(record.technician) ?? { completed: 0, active: 0 };
        entry.completed += 1;
        counts.set(record.technician, entry);
    }
    for (const booking of bookings) {
        if (!booking.technician) continue;
        if (booking.status === 'Completed' || booking.status === 'Cancelled') continue;
        const entry = counts.get(booking.technician) ?? { completed: 0, active: 0 };
        entry.active += 1;
        counts.set(booking.technician, entry);
    }

    const rows = [...counts.entries()]
        .map(([name, e]) => ({ name, ...e }))
        .sort((a, b) => (b.completed + b.active) - (a.completed + a.active));

    const busiest = rows[0] ? rows[0].completed + rows[0].active : 0;
    return rows.map(row => ({
        ...row,
        pct: busiest === 0 ? 0 : Math.round(((row.completed + row.active) / busiest) * 100),
    }));
}

/** An SVG polyline through a series, fitted to the given box. A flat
 *  series is drawn along the middle rather than at the floor, which is
 *  what dividing by a zero range would otherwise produce. */
export function sparklinePath(
    values: number[],
    width = 200,
    height = 70,
    padding = 6,
): { line: string; area: string; points: [number, number][] } {
    if (values.length === 0) return { line: '', area: '', points: [] };

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    const usable = height - padding * 2;

    const points = values.map((value, i): [number, number] => [
        values.length === 1 ? width / 2 : (i / (values.length - 1)) * width,
        range === 0 ? height / 2 : padding + (1 - (value - min) / range) * usable,
    ]);

    const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;
    return { line, area, points };
}

/** Circumference of the donut arcs, for stroke-dasharray maths. */
export const DONUT_RADIUS = 45;
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
