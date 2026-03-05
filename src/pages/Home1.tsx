/**
 * HOME1 — "Performance Technology Hub"
 * Theme: What we do — services, diagnostics tech, pricing packages, FAQ
 * Design: Feature cards + split diagnostic mockup + pricing tiers + testimonials marquee
 */
import React, { useState } from 'react';
import Hero, { DotTitle } from '../components/Hero';
import { Cpu, Zap, Gauge, Shield, PenTool, Settings, Activity, Check, Star, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PUBLICATIONS, BANNER_STATS } from '../data/siteData';


const SERVICES = [
    {
        icon: Cpu,
        name: 'AI-Powered Diagnostics',
        desc: 'Over 4,000 data points scanned in seconds using next-gen OEM-grade diagnostic hardware.',
        tag: 'Most Popular',
        img: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=500&q=70&auto=format&fit=crop',
    },
    {
        icon: Zap,
        name: 'ECU Performance Tuning',
        desc: 'Stage 1–3 ECU remapping with dyno-verified results. HP gains guaranteed or money back.',
        tag: null,
        img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&q=70&auto=format&fit=crop',
    },
    {
        icon: Gauge,
        name: '150-Point Inspection',
        desc: 'Comprehensive full-vehicle audit — every bolt, sensor, and seal verified to factory spec.',
        tag: null,
        img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=70&auto=format&fit=crop',
    },
    {
        icon: Shield,
        name: 'Ceramic Armour Coat',
        desc: 'Nano-ceramic and graphene paint protection. UV-resistant, hydrophobic, scratch-proof.',
        tag: 'Premium',
        img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=70&auto=format&fit=crop',
    },
    {
        icon: PenTool,
        name: 'Carbon Brake Systems',
        desc: 'Track-grade carbon-ceramic brake installation with full bleeding and bed-in procedure.',
        tag: null,
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop',
    },
    {
        icon: Settings,
        name: 'Transmission Rebuild',
        desc: 'Gearbox strip-and-rebuild with precision shift calibration and performance fluid systems.',
        tag: null,
        img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=70&auto=format&fit=crop',
    },
];

const PACKAGES = [
    {
        name: 'Essential',
        price: '299',
        desc: 'Perfect for routine upkeep.',
        features: ['Oil & Filter Change', '50-Point Inspection', 'Level 1 Diagnostics', 'Fluid Top-off', 'Tyre Pressure Check'],
        hot: false,
    },
    {
        name: 'Performance',
        price: '899',
        desc: 'Most chosen by enthusiasts.',
        features: ['All Essential Features', 'ECU Calibration', 'Brake Optimization', 'Drive Data Analysis', 'Priority Bay Access', '24-hr Turnaround'],
        hot: true,
    },
    {
        name: 'Elite Track',
        price: '2,499',
        desc: 'Race-ready from first visit.',
        features: ['All Performance Features', 'Full Aero Alignment', 'Race-Fluid Systems', '24/7 Trackside Support', 'Dyno-Precision Tuning', 'Carbon Brake Service'],
        hot: false,
    },
];

const FAQS = [
    { q: 'How often should I run a full diagnostic scan?', a: 'For performance vehicles, we recommend a full telemetry sync every 5,000 km or before any track events to ensure peak efficiency and prevent unexpected failures.' },
    { q: 'Do you offer OEM or competition-grade parts?', a: 'Both. Depending on your service tier, we source OEM replacement parts for warranty compliance or competition-grade components for maximum performance gains.' },
    { q: 'Can I monitor my service in real time?', a: 'Yes — your AutoSphere client portal (User Dashboard) shows near-real-time progress including diagnostic outputs, tech notes, and estimated completion time.' },
    { q: 'Are your technicians EV-certified?', a: 'Absolutely. Our EV Emerald programme ensures all master techs are dual-certified in internal combustion and high-voltage EV engineering.' },
];

const TESTIMONIALS = [
    { name: 'James D.', car: 'Porsche 911 GT3 RS (2024)', text: 'The level of technical precision at AutoSphere is unmatched. My GT3 feels sharper and better tuned than the day I bought it.', stars: 5 },
    { name: 'Priya M.', car: 'BMW M4 Competition (2023)', text: 'Brought my M4 in for an ECU remap — the before/after dyno sheet speaks for itself. Gained 47 hp. Insane result.', stars: 5 },
    { name: 'Chris L.', car: 'Ferrari SF90 (2022)', text: 'They handled my SF90 like it was their own. Flawless ceramic coat and the diagnostics caught a sensor issue I had no idea about.', stars: 5 },
    { name: 'Ayana R.', car: 'Lamborghini Huracán EVO', text: 'Professional, fast, and honest. The 150-point inspection saved me from a nasty gearbox failure. Worth every rupee.', stars: 5 },
    { name: 'Rahul S.', car: 'Mercedes AMG GTR (2023)', text: 'Stage 2 tune done in one day. The car pulls harder than ever and the ride is still perfectly street-legal.', stars: 5 },
];

const Home1: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div>
            {/* ── HERO ────────────────────────────────────────────── */}
            <Hero
                title={<>Precision Engineering<br /><DotTitle><span className="text-primary">Performance Service</span></DotTitle></>}
                subtitle="Experience the pinnacle of automotive engineering. Our elite technicians fuse racing-grade telemetry with unparalleled craftsmanship to push your machine beyond its limits."
                primaryCTA="Book Service"
                secondaryCTA="View Performance Lab"
                badge="PRECISION TECH V2.0"
            />

            {/* ── PUBLICATIONS MARQUEE ───────────────────────────── */}
            <section className="py-8 border-y border-white/5 bg-white/[0.01] overflow-hidden">
                <div className="flex space-x-16 animate-marquee opacity-30 grayscale items-center">
                    {[...Array(2)].map((_, j) => (
                        <div key={j} className="flex space-x-16 items-center min-w-max">
                            {PUBLICATIONS.map(pub => (
                                <span key={pub} className="text-lg font-black font-outfit tracking-[0.25em] text-white px-6 uppercase">{pub}</span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICES GRID ──────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                        <Sparkles size={12} /> What We Offer
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Advanced Service Menu</h2>
                    <p className="text-white/40 mt-3 max-w-xl mx-auto">Digitally managed, dyno-verified maintenance for high-performance machines.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((svc, i) => (
                        <motion.div
                            key={svc.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="glass-card overflow-hidden group hover:border-primary/40 transition-all duration-500"
                        >
                            {/* Service image */}
                            <div className="h-44 relative overflow-hidden">
                                <img
                                    src={svc.img}
                                    alt={svc.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
                                {svc.tag && (
                                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-secondary px-2.5 py-1 rounded-full">
                                        {svc.tag}
                                    </span>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <svc.icon size={20} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{svc.name}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{svc.desc}</p>
                                <button className="mt-4 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider hover:gap-2.5 transition-all">
                                    Learn More <ArrowRight size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── SPLIT DIAGNOSTICS SECTION ──────────────────────── */}
            <section className="bg-white/[0.015] border-y border-white/5 py-20">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                            <Activity size={12} /> Real-time Telemetry
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Digital Brain<br />for your <span className="text-primary italic">Machine.</span>
                        </h2>
                        <p className="text-white/50 text-lg leading-relaxed">
                            Every vehicle entering our facility is synced with our cloud-diagnostics lab. We monitor over 4,000 data points live to predict failures before they happen.
                        </p>
                        <div className="space-y-3 pt-2">
                            {[
                                'Proprietary AI failure-prediction algorithms',
                                'Full ECU data mapping & optimisation',
                                'Live performance metrics dashboard',
                                'Direct-to-mobile health reports',
                            ].map(item => (
                                <div key={item} className="flex items-center gap-3 text-white/70">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Check size={11} className="text-primary" />
                                    </div>
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary flex items-center gap-2 px-7 py-3 mt-4">
                            Explore Diagnostics <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Live dashboard mockup */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-3xl" />
                        <div className="relative glass-card p-6 border-primary/20">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/20 mb-5">
                                <span>Diagnostic Lab v4.0</span>
                                <span className="text-primary animate-pulse">● Live</span>
                            </div>
                            {/* Metrics row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                {[
                                    { label: 'Engine Health', value: '98.4%', color: 'text-primary' },
                                    { label: 'Boost PSI', value: '14.7', color: 'text-white' },
                                    { label: 'Oil Temp', value: '91°C', color: 'text-yellow-400' },
                                ].map(m => (
                                    <div key={m.label} className="bg-white/5 rounded-xl p-4 text-center">
                                        <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                                        <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{m.label}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Animated bar */}
                            <div className="bg-white/5 rounded-xl p-4 mb-4 relative overflow-hidden">
                                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">RPM Telemetry</div>
                                <div className="flex items-end gap-1 h-12">
                                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 78].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 bg-primary/60 rounded-t"
                                            animate={{ height: [`${h}%`, `${Math.min(h + 20, 100)}%`, `${h}%`] }}
                                            transition={{ duration: 2, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Log lines */}
                            <div className="space-y-1.5 font-mono text-[10px] text-primary/60">
                                {['0x4F: SYNC_OK', '0x92: FUEL_CALIB_PASS', '0x1A: SYS_READY', '0x3B: KNOCK_NOMINAL'].map(l => (
                                    <div key={l} className="flex items-center gap-2">
                                        <span className="text-primary/40">›</span>{l}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── INNOVATION STACK section (New) ─────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">Our Core Engine</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">The Innovation Stack.</h2>
                        </div>
                        <p className="text-white/40 leading-relaxed text-lg">
                            We don't just use tools; we build ecosystems. Our facility is powered by the same hardware used by Formula 1 teams and Tier-1 manufacturers.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { t: 'Bosch Master Hub', d: 'Cloud-synced ECU diagnostics with 99.8% accuracy.' },
                                { t: 'Hunter Elite Alignment', d: 'Laser-guided 3D chassis and suspension geometry.' },
                                { t: 'Hahn Dyno System', d: 'Simulated real-world load testing up to 2,000 HP.' },
                                { t: 'Carbon Hydro-Clean', d: 'Molecular-level engine decarbonisation technology.' },
                            ].map(stack => (
                                <div key={stack.t} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors">
                                    <div className="text-white font-bold mb-1 text-sm">{stack.t}</div>
                                    <div className="text-white/30 text-xs leading-relaxed">{stack.d}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-md">
                        {/* CSS-based "Tech Stack" visual */}
                        <div className="relative aspect-square">
                            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
                            <div className="relative grid grid-cols-2 gap-4 p-4">
                                {[1, 2, 3, 4].map(idx => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="aspect-square glass-card flex flex-col items-center justify-center p-6 border-white/10 group overflow-hidden"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Cpu size={24} className="text-primary" />
                                        </div>
                                        <div className="text-[10px] text-white/20 uppercase tracking-widest font-black">MODULE_{idx}</div>
                                        {/* Abstract geometric lines */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICE MATRIX (New Comparison Section) ────────── */}
            <section className="bg-white/[0.01] border-y border-white/5 py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Precision over Protocol.</h2>
                        <p className="text-white/40">Why our 'Service' is fundamentally different from a regular workshop.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Standard Service */}
                        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Standard Dealership</div>
                            <div className="space-y-4">
                                {['Visual only inspections', 'Generic multi-brand fluids', 'Book-value labor timings', 'Paper-based reports'].map(txt => (
                                    <div key={txt} className="flex items-center gap-3 text-white/40 text-sm">
                                        <div className="w-4 h-4 rounded-full border border-white/10" />
                                        {txt}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* AutoSphere Service */}
                        <div className="p-10 rounded-3xl bg-secondary border border-primary/40 space-y-6 shadow-[0_0_80px_rgba(16,185,129,0.1)] relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
                            <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] relative z-10">AutoSphere Precision</div>
                            <div className="space-y-4 relative z-10">
                                {[
                                    'Full digital telemetry audit',
                                    'Racing-grade performance fluids',
                                    'Engineering-led diagnosis',
                                    'Real-time technician dashboard'
                                ].map(txt => (
                                    <div key={txt} className="flex items-center gap-3 text-white text-sm font-medium">
                                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                            <Check size={10} className="text-secondary" />
                                        </div>
                                        {txt}
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 relative z-10 leading-relaxed text-xs text-white/40 italic">
                                * Average performance gain of 4-6% detected after service due to friction optimisation.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GLOBAL LAB section (New) ───────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Zap size={32} className="text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The Global Engineering Lab.</h2>
                    <p className="text-white/50 text-lg leading-relaxed">
                        Precision has no borders. We maintain direct data links with master engineers across Stuttgart, Modena, and Tokyo to verify complex performance mappings.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-6 grayscale opacity-30">
                        {['Stuttgart', 'Modena', 'Tokyo', 'Silverstone', 'Hockenheim'].map(loc => (
                            <div key={loc} className="text-xl font-outfit font-black tracking-[0.3em] text-white underline decoration-primary decoration-2 underline-offset-8">
                                {loc}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS BANNER ───────────────────────────────────── */}
            <section className="bg-primary py-14">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {BANNER_STATS.map(s => (
                        <div key={s.label}>
                            <div className="text-5xl font-extrabold text-secondary font-outfit tracking-tighter">{s.value}</div>
                            <div className="text-secondary/60 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PRICING PACKAGES ───────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                        💰 Simple Pricing
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Service Packages</h2>
                    <p className="text-white/40 mt-3 max-w-xl mx-auto">Tailored maintenance for every level of performance need.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {PACKAGES.map((pkg, i) => (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass-card p-8 flex flex-col relative overflow-hidden ${pkg.hot ? 'border-primary shadow-[0_0_50px_rgba(16,185,129,0.12)]' : 'border-white/10'}`}
                        >
                            {pkg.hot && (
                                <div className="absolute top-0 right-0 bg-primary text-secondary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                                    Best Value
                                </div>
                            )}
                            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{pkg.name}</div>
                            <div className="flex items-end gap-1 mb-1">
                                <span className="text-white/40 text-lg">$</span>
                                <span className="text-5xl font-bold text-white">{pkg.price}</span>
                            </div>
                            <p className="text-white/30 text-sm mb-6">{pkg.desc}</p>
                            <div className="space-y-3 flex-grow mb-8">
                                {pkg.features.map(f => (
                                    <div key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Check size={9} className="text-primary" />
                                        </div>
                                        {f}
                                    </div>
                                ))}
                            </div>
                            <button className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${pkg.hot ? 'bg-primary text-secondary hover:bg-emerald-400' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS MARQUEE ───────────────────────────── */}
            <section className="py-16 bg-white/[0.015] border-y border-white/5 overflow-hidden">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-white">Owner Experiences</h2>
                    <p className="text-white/40 mt-2">Heard from the drivers who've pushed us to our limits.</p>
                </div>
                <div className="flex space-x-6 animate-marquee">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div key={i} className="glass-card p-7 min-w-[320px] max-w-[320px] flex-shrink-0 border-white/5 hover:border-primary/30 transition-colors">
                            <div className="flex text-primary mb-4">
                                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                            </div>
                            <p className="text-white/60 italic text-sm leading-relaxed mb-5">"{t.text}"</p>
                            <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                                <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{t.name}</div>
                                    <div className="text-white/30 text-[11px]">{t.car}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ SECTION ────────────────────────────────────── */}
            <section className="max-w-3xl mx-auto px-4 py-20 pb-28">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white">Frequently Asked</h2>
                    <p className="text-white/40 mt-2">Common questions from our high-performance clientele.</p>
                </div>
                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <div key={i} className={`glass-card border transition-colors ${openFaq === i ? 'border-primary/30' : 'border-white/5'}`}>
                            <button
                                className="w-full flex items-center justify-between p-5 text-left"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span className={`font-semibold text-sm ${openFaq === i ? 'text-primary' : 'text-white'}`}>{faq.q}</span>
                                <ChevronDown size={18} className={`text-white/30 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home1;
