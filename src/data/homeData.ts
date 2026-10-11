/**
 * homeData.ts — Content for the homepage.
 *
 * Copy here is deliberately concrete: named intervals, real part
 * names, actual turnaround times. Where we could not state a real
 * number we state a range, rather than reaching for a superlative.
 */

/* ── Photography ───────────────────────────────────────────────
   One place to manage image sources. Every URL below has been
   checked to resolve; `img()` keeps sizing/quality consistent. */
const u = (id: string, w: number) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;

export const PHOTOS = {
    hero: u('1771340012319-0b4fca008b54', 1400),
    diagnostics: u('1727893380169-4dda123e19f7', 900),
    engine: u('1711396113768-9fff6660043b', 700),
    brakes: u('1760317890314-e964ffd7e6a6', 700),
    belts: u('1486262715619-67b85e0b08d3', 700),
    wheel: u('1656232976683-7b688560e427', 700),
    detailing: u('1544636331-e26879cd4d9b', 700),
    hands: u('1619642751034-765dfdf7c58e', 1000),
    suspension: u('1760317890359-4e6bb111e501', 800),
};

/* ── Hero ──────────────────────────────────────────────────── */

export const HERO_FACTS = [
    { label: 'Established', value: '1998' },
    { label: 'Vehicles serviced', value: '10,400+' },
    { label: 'Avg. turnaround', value: '36 hrs' },
    { label: 'Workmanship warranty', value: '24 mo' },
];

/* ── Services ──────────────────────────────────────────────────
   One featured service carries the section; the rest are listed
   at varying weights. Not six identical cards. */

export interface Service {
    slug: string;
    name: string;
    summary: string;
    detail: string;
    from: string;
    duration: string;
    image: string;
    includes?: string[];
}

export const FEATURED_SERVICE: Service = {
    slug: 'diagnostics',
    name: 'Diagnostics',
    summary:
        'A fault code tells you which sensor complained — not why. We read live data across the drivetrain, reproduce the fault on the road, and show you the evidence before quoting a repair.',
    detail:
        'Full OBD-II and manufacturer-protocol scan, live parameter logging under load, and a road test with the logger attached.',
    from: '₹1,800',
    duration: '60–90 min',
    image: PHOTOS.diagnostics,
    includes: [
        'Manufacturer-protocol scan, not generic OBD',
        'Live data logged during a road test',
        'Written findings with the actual readings',
        'Fee waived if you proceed with the repair',
    ],
};

export const SERVICES: Service[] = [
    {
        slug: 'performance-ecu',
        name: 'Performance & ECU',
        summary:
            'Dyno-verified remapping for petrol and diesel. We log before and after, and hand you both sheets.',
        detail: 'Stage 1–2 mapping, DPF and EGR diagnostics, induction and exhaust work.',
        from: '₹14,500',
        duration: '1–2 days',
        image: PHOTOS.engine,
    },
    {
        slug: 'brake-service',
        name: 'Brake Service',
        summary:
            'Pads, discs, fluid and calipers. Rotors measured against manufacturer minimum thickness, not judged by eye.',
        detail: 'Disc skimming, caliper rebuild, DOT 4 fluid exchange, bed-in procedure included.',
        from: '₹4,200',
        duration: '3–4 hrs',
        image: PHOTOS.brakes,
    },
    {
        slug: 'ac-cooling',
        name: 'AC & Cooling',
        summary:
            'Regas, leak tracing with UV dye, condenser and radiator work, and cabin filter replacement.',
        detail: 'R134a and R1234yf handling, thermostat and water pump replacement.',
        from: '₹2,600',
        duration: '2–3 hrs',
        image: PHOTOS.belts,
    },
    {
        slug: 'periodic-maintenance',
        name: 'Periodic Maintenance',
        summary:
            'Scheduled servicing to the manufacturer interval, with a written record that protects your warranty.',
        detail: 'Oil and filters, brake inspection, suspension check, 42-point report.',
        from: '₹3,400',
        duration: '4–6 hrs',
        image: PHOTOS.wheel,
    },
    {
        slug: 'detailing',
        name: 'Detailing',
        summary:
            'Paint correction and ceramic coating, done over days rather than hours, because curing takes time.',
        detail: 'Machine polishing, two-stage correction, 5-year ceramic systems.',
        from: '₹9,000',
        duration: '2–4 days',
        image: PHOTOS.detailing,
    },
];

/* ── How it works ──────────────────────────────────────────── */

export const STEPS = [
    {
        num: '01',
        title: 'Tell us what it is doing',
        desc: 'Book online in about two minutes, or describe the symptom to the AI vehicle check and let it suggest the service. A service advisor confirms the same working day.',
    },
    {
        num: '02',
        title: 'Drop off, or we collect',
        desc: 'Bring the car in, or we collect within 25 km at no charge. You get the technician\'s name and the bay it is assigned to.',
    },
    {
        num: '03',
        title: 'We quote before we work',
        desc: 'Findings, photographs and a priced estimate reach you before anything is dismantled. Nothing proceeds without your approval.',
    },
    {
        num: '04',
        title: 'Collect with the record',
        desc: 'Itemised invoice, parts replaced, readings taken, and the next service interval — kept in your account and exportable as a PDF.',
    },
];

/* ── AI vehicle check — the worked example shown in the UI ─── */

export const AI_EXAMPLE = {
    vehicle: 'BMW 320d · 2019 · 64,280 km',
    question: 'My car vibrates when I brake at high speed.',
    answer:
        'That pattern usually points to brake rotor imbalance or uneven pad wear — most often on the front axle. Vibration felt through the steering wheel rather than the pedal supports this.',
    basis: [
        'Front pads last replaced 31,400 km ago',
        'No brake work recorded since 2022',
        'Common on this platform above 60,000 km',
    ],
    urgency: 'Service soon — safe to drive, avoid hard braking',
    nextStep: 'Schedule a brake inspection',
    nextStepMeta: 'Brake Service · from ₹4,200 · 3–4 hrs',
};

/* ── Vehicle health — the example record shown in the UI ───── */

export const HEALTH_EXAMPLE = {
    vehicle: 'BMW 320d M Sport',
    plate: 'MH 12 QR 4821',
    year: '2019',
    odometer: '64,280',
    lastService: '14 Mar 2026',
    lastServiceType: 'Periodic maintenance · 42-point',
    nextDue: '72,000 km or Mar 2027',
    systems: [
        { name: 'Engine & drivetrain', state: 'good' as const, note: 'Oil changed 2,100 km ago' },
        { name: 'Brakes', state: 'attention' as const, note: 'Front pads at 3.1 mm — replace by 68,000 km' },
        { name: 'Tyres', state: 'good' as const, note: 'Even wear, 5.4 mm average' },
        { name: 'Battery & electrical', state: 'good' as const, note: 'Cranking voltage 12.6 V' },
        { name: 'Suspension', state: 'watch' as const, note: 'Slight play, front-right drop link' },
        { name: 'Cooling & AC', state: 'good' as const, note: 'Regassed Mar 2026' },
    ],
    upcoming: [
        { task: 'Front brake pads', due: 'Within 3,700 km', priority: 'high' as const },
        { task: 'Front-right drop link', due: 'Next service', priority: 'medium' as const },
        { task: 'Cabin filter', due: 'Mar 2027', priority: 'low' as const },
    ],
};

/* ── Trust ─────────────────────────────────────────────────── */

export const TRUST_SIGNALS = [
    {
        title: 'Technicians, not fitters',
        body: 'Eleven full-time technicians, all Bosch-certified, six of them also qualified on high-voltage EV systems. The person who diagnoses your car is the person who repairs it.',
    },
    {
        title: 'Genuine and OE-equivalent parts',
        body: 'We fit OEM parts by default. Where a quality aftermarket equivalent makes sense, we say so, show you the price difference, and let you choose.',
    },
    {
        title: 'Priced before we start',
        body: 'An itemised estimate separating parts from labour reaches you before work begins. If we find something else, we stop and call — we do not add it to the bill.',
    },
    {
        title: '24-month workmanship warranty',
        body: 'Two years or 30,000 km on our labour, in addition to the manufacturer warranty on parts. Claims are handled at the same centre that did the work.',
    },
    {
        title: 'Your records stay yours',
        body: 'Every reading, photograph and invoice is kept in your account and exports as a PDF — which is what a buyer will want to see when you sell the car.',
    },
];

/* ── Packages ──────────────────────────────────────────────── */

export const PACKAGES = [
    {
        name: 'Essential',
        price: '3,400',
        cadence: 'per service',
        desc: 'Scheduled maintenance for a car under warranty.',
        features: [
            'Engine oil and filter',
            '42-point inspection report',
            'Brake and tyre measurement',
            'Fluid top-up and battery test',
            'Digital service record',
        ],
        recommended: false,
        cta: 'Book Essential',
    },
    {
        name: 'Comprehensive',
        price: '7,900',
        cadence: 'per service',
        desc: 'Our most-booked service. Suits most cars past 50,000 km.',
        features: [
            'Everything in Essential',
            'Full diagnostic scan with live logging',
            'Brake fluid and coolant exchange',
            'AC performance check and cabin filter',
            'Suspension and steering inspection',
            'Collection and delivery within 25 km',
        ],
        recommended: true,
        cta: 'Book Comprehensive',
    },
    {
        name: 'Performance',
        price: '18,500',
        cadence: 'per service',
        desc: 'For tuned, track-used or high-mileage performance cars.',
        features: [
            'Everything in Comprehensive',
            'Dyno run, before and after',
            'ECU calibration review',
            'Geometry and corner-weight check',
            'Performance fluids throughout',
            'Priority bay, 24-hour turnaround',
        ],
        recommended: false,
        cta: 'Book Performance',
    },
];

/* ── Testimonials ──────────────────────────────────────────── */

export const TESTIMONIALS = [
    {
        name: 'Priya Menon',
        vehicle: 'BMW 3 Series · 2019',
        service: 'Brake service',
        quote:
            'They measured the discs and showed me the readings instead of just telling me to replace everything. Only the front pads actually needed doing, which cost less than I had been quoted elsewhere.',
    },
    {
        name: 'Rahul Shetty',
        vehicle: 'Volkswagen Polo GT · 2021',
        service: 'Diagnostics & ECU',
        quote:
            'An intermittent misfire two other garages could not reproduce. They logged it on a road test, found a failing coil pack, and had it sorted the same day.',
    },
    {
        name: 'Ananya Rao',
        vehicle: 'Hyundai Creta · 2022',
        service: 'Periodic maintenance',
        quote:
            'Dropped the car at nine, had the estimate on my phone by eleven, collected it after work. The service record is in the app, which made selling my last car far easier.',
    },
];

/* ── FAQ ───────────────────────────────────────────────────── */

export const FAQS = [
    {
        q: 'Will servicing here void my manufacturer warranty?',
        a: 'No. Under the Motor Vehicles Act, a manufacturer cannot require you to service at their dealer to keep the warranty valid, provided the work follows the specified schedule and uses parts of matching quality. We service to the manufacturer schedule and give you a written record proving it.',
    },
    {
        q: 'How accurate is the AI vehicle check?',
        a: 'It is a triage tool, not a diagnosis. It compares what you describe against your service history and common faults for your model, then suggests which service is likely relevant. It is often right about the general area and sometimes wrong about the specific cause — a technician confirms it on the car before any work is quoted.',
    },
    {
        q: 'Do you work on electric and hybrid vehicles?',
        a: 'Yes. Six of our technicians hold high-voltage qualifications. We handle servicing, brake and suspension work, thermal management and 12 V systems. We do not currently repair traction battery packs — those go back to the manufacturer.',
    },
    {
        q: 'What happens if you find something not in the estimate?',
        a: 'We stop and call you with photographs and a price. Nothing additional is carried out without your approval. If you decline, we reassemble and you pay only for the agreed work.',
    },
    {
        q: 'Can I see what is happening to my car while it is in?',
        a: 'Your account shows the current stage, the assigned technician, photographs the technician uploads, and the estimated collection time. You get a notification at each stage change.',
    },
];

/* ── Partner marques ───────────────────────────────────────── */

export const ACCREDITATIONS = [
    'BOSCH CAR SERVICE',
    'BREMBO',
    'MICHELIN',
    'CASTROL',
    'MOTUL',
    'BILSTEIN',
    'MAHLE',
    'DENSO',
];
