/**
 * siteData.ts — Single source of truth for all shared business data.
 */

/* The same four figures the homepage hero states, so the two surfaces
   cannot drift apart. Replaces an unmeasured "98.4% Satisfaction Rate"
   and a "0% Error Tolerance" that asserted nothing. */
export const SITE_STATS = [
    { value: '1998', label: 'Trading since' },
    { value: '10,400+', label: 'Vehicles serviced' },
    { value: '36 hrs', label: 'Average turnaround' },
    { value: '24 mo', label: 'Workmanship warranty' },
];

/* An Andheri service centre's floor. Two entries previously carried
   the names of a real comedian and a real baseball player, and the
   roles described a race team rather than the six service lines. */
export const TEAM = [
    { name: 'Rohan Deshpande', role: 'Lead diagnostic technician', exp: '15 years', spec: 'Live-data diagnostics, engine management' },
    { name: 'Farida Qureshi', role: 'Brake & suspension specialist', exp: '12 years', spec: 'Brake systems, geometry setup' },
    { name: 'Vikram Nair', role: 'Engine technician', exp: '20 years', spec: 'Timing, head work, oil-leak tracing' },
    { name: 'Anjali Menon', role: 'AC & cooling technician', exp: '10 years', spec: 'Climate systems, radiator and pump work' },
    { name: 'Imran Shaikh', role: 'Auto electrician', exp: '14 years', spec: 'Wiring, charging systems, retrofits' },
    { name: 'Priya Iyer', role: 'Quality and handover', exp: '9 years', spec: 'Road test, final inspection, detailing' },
];

export const PARTNERS = [
    { name: 'BOSCH', label: 'Bosch Authorized Service' },
    { name: 'BREMBO', label: 'Brembo Master Partner' },
    { name: 'MICHELIN', label: 'Michelin Certified Dealer' },
    { name: 'OHLINS', label: 'Ohlins Suspension Center' },
    { name: 'MOTUL', label: 'Motul Pro Service' },
    { name: 'BILSTEIN', label: 'Bilstein Certified Center' },
];

