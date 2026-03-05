import React from 'react';
import PageHero from '../components/PageHero';
import {
    Shield, Zap, Target, Clock, Award, Wrench,
    MapPin, Users, Flame, TrendingUp, Globe, HeartHandshake,
    Cpu, CheckCircle, Star, Building2, Leaf, Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SITE_STATS } from '../data/siteData';

/* ─── Data ─────────────────────────────────────────────── */

const VALUES = [
    { icon: Shield, title: 'OEM+ Quality', desc: 'Every bolt and scan meets or exceeds manufacturer standards — no shortcuts, ever.' },
    { icon: Zap, title: 'Advanced Diagnostics', desc: 'Forensic-grade tools that surface hidden issues long before they become failures.' },
    { icon: Target, title: 'Precision Tuning', desc: 'ECU remapping and performance upgrades measured in microns, not approximations.' },
    { icon: Clock, title: '30-Min Fast Track', desc: 'Rapid service scheduling so your time is respected as much as your vehicle.' },
    { icon: Award, title: 'ASE Certified', desc: 'Our technicians carry the highest industry certification. No exceptions.' },
    { icon: Wrench, title: 'Lifetime Warranty', desc: 'All services backed by a comprehensive parts & labour warranty you can count on.' },
];

const TIMELINE = [
    {
        year: '1998',
        title: 'Founded in a Two-Bay Garage',
        desc: 'AutoSphere started as a 2-bay independent shop with one mandate: fix it right the first time. The first week saw 3 cars. The second, 11.',
    },
    {
        year: '2004',
        title: 'First ASE Blue Seal Awarded',
        desc: 'Six years in, AutoSphere became one of the first independent shops in the region to earn the ASE Blue Seal of Excellence — a standard we\'ve never dropped.',
    },
    {
        year: '2010',
        title: 'Diagnostic Lab Expansion',
        desc: 'We invested in a full-scale diagnostic facility with OEM-level scan tools, oscilloscopes, and a chassis dynamometer for real-world performance testing.',
    },
    {
        year: '2016',
        title: 'Performance Division Launched',
        desc: 'AutoSphere Performance was born: a dedicated wing for ECU remapping, forced induction, suspension geometry, and track-day prep.',
    },
    {
        year: '2020',
        title: 'Digital Workshop Integration',
        desc: 'We went fully paperless — digital job cards, cloud-based vehicle history, and live customer updates via the AutoSphere client portal.',
    },
    {
        year: '2024',
        title: 'EV & Hybrid Certification',
        desc: 'With EVs reshaping the market, AutoSphere became one of the few independent shops fully certified for high-voltage EV and hybrid service.',
    },
];

const FACILITY_HIGHLIGHTS = [
    {
        icon: Cpu,
        title: 'OEM Diagnostic Suite',
        desc: '12 dedicated bays each equipped with brand-specific scan tools covering over 60 vehicle manufacturers.',
    },
    {
        icon: TrendingUp,
        title: 'Live Chassis Dyno',
        desc: 'Our in-house rolling road measures power, torque, and heat management under real-world load conditions.',
    },
    {
        icon: Globe,
        title: 'Climate-Controlled Storage',
        desc: 'Secured, temperature-regulated vault for seasonal storage of collector and track vehicles.',
    },
    {
        icon: Building2,
        title: '18,000 sq ft Workshop',
        desc: 'One of the largest independent automotive facilities in the region, built for volume without sacrificing quality.',
    },
    {
        icon: Leaf,
        title: 'Eco Waste Programme',
        desc: 'All fluids, tyres, and parts are recycled or disposed of through certified environmental partners.',
    },
    {
        icon: Star,
        title: 'Client Lounge',
        desc: 'High-speed Wi-Fi, specialty coffee, live workshop feed displays — because waiting doesn\'t have to be wasted time.',
    },
];

const LEADERSHIP = [
    {
        name: 'Marcus Reid',
        role: 'Founder & CEO',
        quote: '"If it leaves our garage, it leaves perfect."',
        bio: '25+ years in automotive engineering. Former chief mechanic for a European touring car circuit. Founded AutoSphere with his savings and a borrowed toolbox.',
        photo: 'https://i.pravatar.cc/300?img=33',
    },
    {
        name: 'Priya Nair',
        role: 'Head of Diagnostics',
        quote: '"Every fault code tells a story. We read them all."',
        bio: 'MSc in Automotive Systems Engineering. Worked with four OEM manufacturers before joining AutoSphere to build the diagnostic division from scratch.',
        photo: 'https://i.pravatar.cc/300?img=47',
    },
    {
        name: 'James Okafor',
        role: 'Director of Operations',
        quote: '"Speed and precision are not opposites. We prove that every day."',
        bio: 'Operations expert with a background in motorsport logistics. Redesigned AutoSphere\'s workflow, halving average turnaround time without a single quality compromise.',
        photo: 'https://i.pravatar.cc/300?img=57',
    },
];

const COMMUNITY = [
    { icon: HeartHandshake, stat: '500+', label: 'Free inspections for low-income families annually' },
    { icon: Trophy, stat: '18', label: 'Regional apprenticeships launched since 2010' },
    { icon: Flame, stat: '£120k', label: 'Donated to road-safety charities over 5 years' },
    { icon: Users, stat: '3,200+', label: 'Students educated through our School Outreach programme' },
];

/* ─── Component ─────────────────────────────────────────── */

const About: React.FC = () => {
    return (
        <div className="pb-24">
            <PageHero
                badge="About AutoSphere"
                title={<>Our Garage,<br /><span className="text-primary">Our Legacy.</span></>}
                subtitle="AutoSphere was founded with a single mission — to deliver the highest level of technical expertise and customer trust in the automotive industry."
                breadcrumb={['Home', 'About']}
            />

            {/* ── Who We Are ── */}
            <section className="max-w-5xl mx-auto px-4 pb-24 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Who We Are</h2>
                    <p className="text-white/50 text-lg leading-relaxed max-w-3xl mx-auto">
                        AutoSphere is a premium automotive service center established in 1998.
                        We specialise in precision diagnostics, performance tuning, and full vehicle maintenance —
                        combining race-grade technology with genuine craftsmanship.
                        Over 10,000 vehicles serviced. Zero tolerance for mediocrity.
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
                    {SITE_STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 text-center"
                        >
                            <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                            <div className="text-white/40 text-sm uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Our Philosophy ── */}
            <section className="max-w-7xl mx-auto px-4 pb-28">
                <div className="glass-card border-primary/20 p-10 md:p-16 relative overflow-hidden">
                    {/* decorative accent */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-4xl"
                    >
                        <span className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4 block">Our Philosophy</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
                            "We don't just service vehicles.<br />
                            <span className="text-primary">We restore confidence."</span>
                        </h2>
                        <p className="text-white/50 text-lg leading-relaxed mb-6">
                            The automotive industry has long operated on opacity — vague estimates, unnecessary upsells,
                            and a culture that keeps customers in the dark. AutoSphere was built as a direct response to that.
                        </p>
                        <p className="text-white/50 text-lg leading-relaxed mb-6">
                            From day one, our model has been radical transparency: you see every diagnostic reading,
                            every part replaced, every torque spec hit. We share the data because we have nothing to hide —
                            and because an informed customer is a loyal customer.
                        </p>
                        <p className="text-white/50 text-lg leading-relaxed">
                            Technical excellence is a given here. What sets AutoSphere apart is the belief that a service centre
                            should feel like a trusted partner, not a transaction.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── History Timeline ── */}
            <section className="max-w-5xl mx-auto px-4 pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">A Quarter-Century of Progress</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Every milestone was earned, not given. Here's how we got here.</p>
                </motion.div>

                <div className="relative">
                    {/* vertical line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />

                    <div className="space-y-12">
                        {TIMELINE.map((item, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-start md:items-center`}
                                >
                                    {/* dot */}
                                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary md:-translate-x-1/2 mt-1 md:mt-0 ring-4 ring-primary/20" />

                                    {/* year label */}
                                    <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
                                        <span className="text-4xl font-black text-white/10 select-none">{item.year}</span>
                                    </div>

                                    {/* card */}
                                    <div className={`ml-12 md:ml-0 w-full md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                                        <div className="glass-card p-6 hover:border-primary/30 transition-colors">
                                            <div className="text-primary text-xs font-bold uppercase tracking-wider mb-2 md:hidden">{item.year}</div>
                                            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                            <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── What We Stand For ── */}
            <section className="max-w-6xl mx-auto px-4 pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Stand For</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Six commitments that define every job we touch.</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {VALUES.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-6 flex gap-4 items-start hover:border-primary/30 transition-colors"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <v.icon size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">{v.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Facility Highlights ── */}
            <section className="max-w-7xl mx-auto px-4 pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Inside the Workshop</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">
                        Our facility is engineered to the same standard we hold our technicians — the best available.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FACILITY_HIGHLIGHTS.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-7 group hover:border-primary/30 transition-all hover:-translate-y-1 duration-300"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                <f.icon size={22} className="text-primary" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Leadership ── */}
            <section className="max-w-6xl mx-auto px-4 pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Minds Behind AutoSphere</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Leadership built on decades of engineering conviction and zero tolerance for average.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {LEADERSHIP.map((person, i) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className="glass-card overflow-hidden group hover:border-primary/30 transition-all"
                        >
                            {/* photo */}
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={person.photo}
                                    alt={person.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <div className="text-lg font-bold text-white">{person.name}</div>
                                    <div className="text-primary text-xs font-bold uppercase tracking-widest">{person.role}</div>
                                </div>
                            </div>

                            {/* body */}
                            <div className="p-6">
                                <p className="text-primary/80 text-sm italic mb-4 leading-relaxed">{person.quote}</p>
                                <p className="text-white/40 text-sm leading-relaxed">{person.bio}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Community Impact ── */}
            <section className="max-w-6xl mx-auto px-4 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Beyond the Workshop</h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        AutoSphere believes that technical excellence carries a social responsibility.
                        Here's how we give back.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {COMMUNITY.map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-7 flex flex-col items-center text-center hover:border-primary/30 transition-colors"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <c.icon size={22} className="text-primary" />
                            </div>
                            <div className="text-3xl font-black text-primary mb-2">{c.stat}</div>
                            <p className="text-white/40 text-xs leading-relaxed">{c.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Visit Us ── */}
            <section className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 border-primary/20"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={32} className="text-primary" />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-1">Visit Our Facility</h3>
                        <p className="text-white/50 text-sm">AutoSphere Service Center · Open Mon–Sat, 8am–7pm</p>
                        <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <CheckCircle size={12} className="text-primary" /> Free parking
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <CheckCircle size={12} className="text-primary" /> Accessible entrance
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <CheckCircle size={12} className="text-primary" /> EV charging on-site
                            </span>
                        </div>
                        <p className="text-primary text-sm mt-2 font-medium">123 Performance Drive, Motorway District</p>
                    </div>
                    <div className="md:ml-auto flex gap-3">
                        <button className="btn-primary px-6 py-2 text-sm">Get Directions</button>
                        <button className="btn-secondary px-6 py-2 text-sm">Call Now</button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
