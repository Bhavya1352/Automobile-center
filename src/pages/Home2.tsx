/**
 * HOME2 — "Drive-In Experience & Heritage"
 * Theme: How to book, why choose us, fleet showcase, loyalty, classic restoration legacy
 * Design: Step-by-step booking flow + gallery grid + loyalty card + partner logos + CTA
 * Completely different sections from Home1 — no repeating content.
 */
import React, { useState } from 'react';
import { DotTitle } from '../components/Hero';
import {
    CalendarCheck, MapPin, Phone, Headphones, Star, Heart, ShieldCheck,
    History, Award, Camera, ChevronRight, CheckCircle2, Gift, Users, Flame, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PARTNERS, TEAM } from '../data/siteData';

// ── Why Choose Us pillars (unique to Home2) ────────────────────────────────
const WHY_US = [
    {
        icon: History,
        title: '25 Years of Mastery',
        desc: 'Since 1998 we have refined our craft across over 10,000 vehicles — from daily drivers to trophy-grade exotics.',
    },
    {
        icon: ShieldCheck,
        title: 'Lifetime Service Warranty',
        desc: 'Every job we perform is backed by a comprehensive lifetime parts and labour guarantee. No asterisks.',
    },
    {
        icon: Award,
        title: '6 Industry Awards',
        desc: 'Voted Best Independent Service Centre three years running by Motor Trend and Car & Driver readers.',
    },
    {
        icon: Headphones,
        title: '24/7 Concierge Line',
        desc: 'A dedicated service advisor is always one call away — whether it is track-day prep or emergency roadside support.',
    },
];

// ── How We Work steps ─────────────────────────────────────────────────────
const STEPS = [
    {
        num: '01',
        icon: Phone,
        title: 'Book Online or Call',
        desc: 'Schedule in under 2 minutes via our portal or call our concierge. We confirm within the hour.',
        color: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
        num: '02',
        icon: MapPin,
        title: 'Drop Off or We Collect',
        desc: 'Drive to us or use our flatbed transport service — climate-controlled, enclosed, free within 50 km.',
        color: 'from-blue-500/20 to-blue-500/5',
    },
    {
        num: '03',
        icon: CalendarCheck,
        title: 'Live Progress Updates',
        desc: 'Track every step of your service live from the dashboard. Photos and technician notes included.',
        color: 'from-purple-500/20 to-purple-500/5',
    },
    {
        num: '04',
        icon: CheckCircle2,
        title: 'Quality Delivery',
        desc: 'Comprehensive final inspection, dyno check, and detailed service report delivered with your car.',
        color: 'from-yellow-500/20 to-yellow-500/5',
    },
];

// ── Exotic Gallery cars ────────────────────────────────────────────────────
const GALLERY = [
    { label: 'Ferrari F8 Tributo', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&q=75&auto=format&fit=crop', span: 'md:col-span-2 md:row-span-2' },
    { label: 'Porsche 911 GT3', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=70&auto=format&fit=crop', span: '' },
    { label: 'Mercedes AMG GTR', img: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=500&q=70&auto=format&fit=crop', span: '' },
    { label: 'Lamborghini Urus', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=70&auto=format&fit=crop', span: '' },
    { label: 'BMW M3 Competition', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=70&auto=format&fit=crop', span: '' },
];

// ── Loyalty tiers ─────────────────────────────────────────────────────────
const LOYALTY = [
    { tier: 'Silver', spend: '₹0 – ₹50k', perks: ['Priority booking', '10% parts discount', 'Free tyre rotation'] },
    { tier: 'Gold', spend: '₹50k – ₹2L', perks: ['Dedicated advisor', '15% all-service discount', 'Free pickup & drop'] },
    { tier: 'Platinum', spend: '₹2L+', perks: ['VIP bay reserved', '20% all-service discount', 'Trackday invites', 'Loaner hypercar'] },
];

// Only show 4 team members as preview
const TEAM_PREVIEW = TEAM.slice(0, 4);
const TEAM_PHOTOS = [
    'https://i.pravatar.cc/300?img=11',
    'https://i.pravatar.cc/300?img=47',
    'https://i.pravatar.cc/300?img=14',
    'https://i.pravatar.cc/300?img=52',
];

const Home2: React.FC = () => {
    const [activeTier, setActiveTier] = useState('Gold');

    return (
        <div>
            {/* ── HERITAGE HERO ──────────────────────────────────── */}
            <section dir="ltr" className="relative overflow-hidden py-28 md:py-36">
                {/* BG image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=70&auto=format&fit=crop"
                        alt="Classic workshop"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-7"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest">
                            <Flame size={12} className="text-primary" /> Established 1998
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                            <DotTitle>Trusted Heritage</DotTitle><br />
                            <span className="text-primary">Automotive Service <DotTitle>Mastery</DotTitle></span>
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                            Since 1998, we've treated every vehicle as a masterpiece. Old-world craftsmanship meets modern precision — the AutoSphere promise.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <a href="/get-started" className="btn-primary px-8 py-3 flex items-center gap-2">
                                Book a Service <ChevronRight size={16} />
                            </a>
                            <a href="/about" className="btn-secondary px-8 py-3">Our Story</a>
                        </div>
                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                            {[['10k+', 'Cars Serviced'], ['4.9★', 'Google Rating'], ['6×', 'Industry Awards']].map(([v, l]) => (
                                <div key={l}>
                                    <div className="text-xl font-bold text-primary">{v}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-widest">{l}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ──────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Why AutoSphere?</h2>
                    <p className="text-white/40 mt-3 max-w-xl mx-auto">Four reasons the best machines in the city choose us over anyone else.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WHY_US.map((w, i) => (
                        <motion.div
                            key={w.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-7 text-center border-white/5 hover:border-primary/30 transition-all group"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                                <w.icon size={28} className="text-primary" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{w.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{w.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── HOW WE WORK — 4-STEP BOOKING PROCESS ──────────── */}
            <section className="bg-white/[0.015] border-y border-white/5 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            <CalendarCheck size={12} /> Effortless Booking
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">From Call to Collection</h2>
                        <p className="text-white/40 mt-3 max-w-xl mx-auto">Four simple steps. Zero hassle. Your car back better than ever.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Connector line */}
                        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-white/5" />
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className={`glass-card p-7 relative bg-gradient-to-br ${step.color} border-white/5 hover:border-primary/30 transition-all text-center group`}
                            >
                                <div className="w-12 h-12 rounded-full bg-secondary border border-white/10 flex items-center justify-center mx-auto mb-5 relative z-10 group-hover:border-primary/50 transition-colors">
                                    <step.icon size={22} className="text-primary" />
                                </div>
                                <div className="text-primary/30 font-black text-4xl absolute top-4 right-5 font-outfit leading-none">{step.num}</div>
                                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <a href="/get-started" className="btn-primary px-10 py-3 inline-flex items-center gap-2">
                            Book Now — Takes 2 Minutes <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── EXOTIC CAR GALLERY ─────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-3">
                            <Camera size={16} /> Portfolio Archive
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Vehicles We've Mastered</h2>
                    </div>
                    <p className="text-white/40 max-w-sm text-sm leading-relaxed">A curated showcase of the exotic and high-performance machines that have passed through our bays.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
                    {GALLERY.map((car, i) => (
                        <motion.div
                            key={car.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${car.span}`}
                        >
                            <img
                                src={car.img}
                                alt={car.label}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                                <span className="text-white font-bold text-sm tracking-wide">{car.label}</span>
                            </div>
                            <div className="absolute inset-0 border border-white/0 group-hover:border-primary/40 rounded-2xl transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── RESTORATION HERITAGE SPLIT ─────────────────────── */}
            <section className="bg-white/[0.015] border-y border-white/5 py-20">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-3xl" />
                        <div className="grid grid-cols-2 gap-3 h-[420px] relative">
                            <img
                                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=75&auto=format&fit=crop"
                                alt="Classic car restoration"
                                className="col-span-2 rounded-2xl object-cover w-full h-64"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=70&auto=format&fit=crop"
                                alt="Engine bay detail"
                                className="rounded-2xl object-cover w-full h-full"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=70&auto=format&fit=crop"
                                alt="Workshop detail"
                                className="rounded-2xl object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-widest">
                            Heritage Division
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Breathing Life into Legends.</h2>
                        <p className="text-white/60 leading-relaxed text-lg">
                            Our heritage division specialises in full frame-off restorations for European and Japanese classics — respecting the original engineering philosophy while introducing modern reliability.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {['Period-correct component sourcing', 'OEM paint matching & application', 'Powertrain modernisation with EV options', 'Custom interior upholstery & bespoke trim'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-white/50 text-sm">
                                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <a href="/contact" className="btn-primary inline-flex items-center gap-2 px-7 py-3 mt-2">
                            Enquire About Restoration <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── CHRONICLES OF CRAFT (New) ──────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">Legacy Showcase</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Chronicles of Craft.</h2>
                </div>
                <div className="glass-card overflow-hidden grid lg:grid-cols-2 border-white/5">
                    <div className="h-[400px] lg:h-auto relative">
                        <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&q=70&auto=format&fit=crop"
                            alt="1965 911 Restoration"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-transparent to-transparent lg:hidden" />
                    </div>
                    <div className="p-10 lg:p-16 flex flex-col justify-center space-y-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <History size={24} className="text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">The 1965 Restoration Project</h3>
                        <p className="text-white/40 leading-relaxed">
                            A four-month "frame-off" restoration of a rare 1965 early-production chassis. We sourced period-correct materials from across three continents to ensure every stitch, bolt, and gasket matched the original factory manifest.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                                <div className="text-white font-bold">1,400+</div>
                                <div className="text-white/30 text-xs uppercase tracking-widest">Hours of Labour</div>
                            </div>
                            <div>
                                <div className="text-white font-bold">Modena, IT</div>
                                <div className="text-white/30 text-xs uppercase tracking-widest">Part Sourcing</div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest pt-4 hover:gap-4 transition-all">
                            Read the Story <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── COLLECTOR'S CONCIERGE (New) ────────────────────── */}
            <section className="bg-white/[0.01] border-y border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">Concierge Services</div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">The Collector's Vault.</h2>
                            </div>
                            <p className="text-white/40 leading-relaxed text-lg italic">
                                "More than a garage — we are the custodians of your legacy."
                            </p>
                            <div className="space-y-6">
                                {[
                                    { t: 'Climate-Controlled Storage', d: 'Secure, boutique storage with 24/7 telemetry monitoring.' },
                                    { t: 'Auction Preparation', d: 'Concours-level detailing and mechanical certification for high-value sales.' },
                                    { t: 'Fleet Management', d: 'Regular maintenance cycles for multi-vehicle collections.' },
                                ].map(c => (
                                    <div key={c.t} className="flex gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold mb-1">{c.t}</div>
                                            <div className="text-white/40 text-sm leading-relaxed">{c.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=70&auto=format&fit=crop" alt="The Vault" className="w-full aspect-[4/5] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10">
                                    <div className="text-primary text-xs font-black uppercase tracking-widest mb-2">Location: Zone A</div>
                                    <div className="text-white text-3xl font-bold">Secure Storage</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LEGACY EVENTS (New) ────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">Community Hub</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Legacy Events.</h2>
                    </div>
                    <p className="text-white/40 max-w-sm text-sm">Join the elite circle of AutoSphere owners at our private track days and heritage runs.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { date: 'APR 14', name: 'Monaco Heritage Run', type: 'Vintage Tour' },
                        { date: 'MAY 02', name: 'Turbo-Thursday Trackday', type: 'Performance' },
                        { date: 'JUN 22', name: 'Concours in the Garage', type: 'Design Showcase' },
                    ].map(ev => (
                        <div key={ev.name} className="glass-card p-8 border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
                            <div className="text-2xl font-black text-primary font-outfit mb-2">{ev.date}</div>
                            <div className="text-white font-bold text-xl mb-4 group-hover:text-primary transition-colors">{ev.name}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/20 text-xs font-bold uppercase tracking-widest">{ev.type}</span>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                    <ChevronRight size={16} className="text-white group-hover:text-secondary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── LOYALTY PROGRAMME ──────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                        <Gift size={12} /> Loyalty Rewards
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">AutoSphere Privilege Club</h2>
                    <p className="text-white/40 mt-3 max-w-xl mx-auto">The more you trust us with your vehicle, the more we reward you back. Three tiers, real perks.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {LOYALTY.map(t => (
                        <button
                            key={t.tier}
                            onClick={() => setActiveTier(t.tier)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTier === t.tier ? 'bg-primary text-secondary' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                            {t.tier}
                        </button>
                    ))}
                </div>

                {LOYALTY.filter(t => t.tier === activeTier).map(t => (
                    <motion.div
                        key={t.tier}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-10 border-primary/20 max-w-2xl mx-auto text-center"
                    >
                        <div className="text-3xl font-bold text-white mb-1">{t.tier} Tier</div>
                        <div className="text-primary text-sm font-bold mb-6">{t.spend} annual spend</div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {t.perks.map(p => (
                                <div key={p} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 text-left">
                                    <Star size={14} className="text-primary fill-primary flex-shrink-0" />
                                    <span className="text-white/70 text-sm">{p}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary px-8 py-3 mt-8">Join Privilege Club</button>
                    </motion.div>
                ))}
            </section>

            {/* ── TEAM PREVIEW ───────────────────────────────────── */}
            <section className="bg-white/[0.015] border-y border-white/5 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">The Master Technicians</h2>
                            <p className="text-white/40 max-w-lg">Specialists with over a decade of European and high-performance engineering experience.</p>
                        </div>
                        <a href="/technicians" className="btn-secondary flex items-center gap-2">
                            Meet the Full Team <ChevronRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {TEAM_PREVIEW.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card overflow-hidden group border-white/5 hover:border-primary/30 transition-all"
                            >
                                <div className="aspect-square relative overflow-hidden">
                                    <img
                                        src={TEAM_PHOTOS[i]}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
                                </div>
                                <div className="p-4">
                                    <div className="text-white font-bold text-sm">{member.name}</div>
                                    <div className="text-primary text-[11px] font-bold uppercase tracking-widest mt-0.5">{member.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PARTNER MARQUEE ────────────────────────────────── */}
            <section className="py-14 border-b border-white/5">
                <div className="text-center mb-8">
                    <div className="text-[10px] text-white/20 uppercase font-bold tracking-[0.35em]">Certified Partner Network</div>
                    <a href="/certifications" className="text-xs text-primary hover:underline mt-1 inline-block">View All Certifications →</a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-700 px-4">
                    {PARTNERS.map(p => (
                        <div key={p.name} className="text-2xl font-black font-outfit tracking-tighter text-white">{p.name}</div>
                    ))}
                </div>
            </section>

            {/* ── TRUST QUOTE ────────────────────────────────────── */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                    <Heart size={44} className="mx-auto text-primary animate-pulse" />
                    <blockquote className="text-3xl md:text-5xl font-outfit font-medium text-white italic leading-tight">
                        "Automotive service is not just about fixing machines; it's about preserving the art of motion and the trust of those who drive them."
                    </blockquote>
                    <div className="text-primary font-bold tracking-widest uppercase text-sm">— Founder, AutoSphere</div>
                </div>
            </section>

            {/* ── FINAL CTA ──────────────────────────────────────── */}
            <section className="bg-primary py-20 mb-0 px-4">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest">
                        <Users size={12} /> 10,000+ Happy Drivers
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-secondary tracking-tighter">READY TO UPGRADE<br />YOUR JOURNEY?</h2>
                    <p className="text-secondary/70 max-w-xl mx-auto">Join thousands of performance enthusiasts who trust AutoSphere for every kilometre.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/get-started" className="bg-secondary text-white px-12 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-secondary/90 transition-colors">
                            <span>Secure a Service Bay</span>
                            <ChevronRight size={18} />
                        </a>
                        <a href="/contact" className="text-secondary/60 font-bold text-sm flex items-center gap-2 hover:text-secondary transition-colors">
                            <Phone size={14} /> Call Our Concierge
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-secondary/50 text-xs">
                        <CheckCircle2 size={14} /> Next Bay Available in 45 minutes
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home2;
