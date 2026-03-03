import Hero, { DotTitle } from '../components/Hero';
import { Settings, Zap, Shield, Cpu, Gauge, PenTool, Activity, ChevronDown, Check, Star, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    { icon: Cpu, name: 'Precision Diagnostics', desc: 'Advanced telemetry and engine analysis using OEM-grade specialized hardware.' },
    { icon: Zap, name: 'Performance Tuning', desc: 'ECU remapping and hardware optimizations for maximum octane efficiency.' },
    { icon: Gauge, name: 'Full Service Audit', desc: 'Comprehensive 150-point inspection covering every mechanical component.' },
    { icon: Shield, name: 'Elite Protection', desc: 'Nano-ceramic coatings and armor-grade paint protection systems.' },
    { icon: PenTool, name: 'Brake Optimization', desc: 'High-performance braking systems installation and systematic calibration.' },
    { icon: Settings, name: 'Transmission Tech', desc: 'Specialized gearbox maintenance and performance shift-pattern tuning.' },
];

const Home1: React.FC = () => {
    return (
        <div className="space-y-12">
            <Hero
                title={
                    <>
                        Precision Engineering <br />
                        <DotTitle><span className="text-primary">Performance Service</span></DotTitle>
                    </>
                }
                subtitle="Experience the pinnacle of automotive engineering. Our elite technicians fuse racing-grade telemetry with unparalleled craftsmanship to push your machine beyond its limits."
                primaryCTA="Book Service"
                secondaryCTA="View Performance Lab"
                badge="PRECISION TECH V2.0"
            />

            {/* Featured Publications Marquee */}
            <section className="py-8 border-y border-white/5 bg-white/[0.01] overflow-hidden">
                <div className="flex space-x-12 animate-marquee opacity-40 grayscale items-center">
                    {[...Array(2)].map((_, j) => (
                        <div key={j} className="flex space-x-12 items-center min-w-max">
                            {['MOTOR TREND', 'CAR & DRIVER', 'TOP GEAR', 'EVO MAGAZINE', 'SPEEDHUNTERS', 'ROAD & TRACK'].map(pub => (
                                <div key={pub} className="text-xl font-bold font-outfit tracking-widest text-white px-8">{pub}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 pb-12 mt-12">
                <div className="text-center space-y-4 mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Advanced Services</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">Digitally managed maintenance for high-performance vehicles.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 group hover:border-primary/30"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                                <service.icon size={28} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Digital Diagnostics Section */}
            <section className="max-w-7xl mx-auto px-4 py-12 relative overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                            <Activity size={14} />
                            <span>Real-time Telemetry</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            Digital Brain for your <span className="text-primary italic">Machine</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed">
                            Every vehicle that enters our facility is synchronized with our cloud-diagnostics lab. We monitor over 4,000 data points in real-time to predict failures before they happen.
                        </p>
                        <div className="space-y-4">
                            {[
                                'Proprietary AI failure prediction algorithms',
                                'Full ECU data mapping & optimization',
                                'Live performance metrics tracking',
                                'Direct-to-mobile health reports'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 text-white/60">
                                    <Check size={18} className="text-primary" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="glass-card p-4 md:p-8 border-white/10 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-secondary/80 rounded-xl overflow-hidden border border-white/5 p-6 space-y-6">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/20">
                                <span>Diagnostic Lab v4.0</span>
                                <span className="text-primary animate-pulse">● System Active</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-32 bg-white/5 rounded-lg flex flex-col justify-end p-4">
                                        <div className="text-2xl font-bold text-primary">98.4%</div>
                                        <div className="text-[10px] text-white/40 uppercase">Engine Health</div>
                                    </div>
                                    <div className="h-24 bg-white/5 rounded-lg flex flex-col justify-end p-4">
                                        <div className="text-xl font-bold text-white">45m Avg.</div>
                                        <div className="text-[10px] text-white/40 uppercase">Service Time</div>
                                    </div>
                                </div>
                                <div className="h-full bg-white/5 rounded-lg border border-primary/10 flex items-center justify-center relative overflow-hidden">
                                    <Activity size={64} className="text-primary/20 absolute" />
                                    <motion.div
                                        animate={{ height: ['20%', '60%', '40%', '80%', '30%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="w-full bg-primary/10 bottom-0 absolute"
                                    />
                                    <div className="relative font-mono text-[10px] text-primary space-y-1">
                                        <div>0x4F: SYNC_OK</div>
                                        <div>0x92: FUEL_CALIB</div>
                                        <div>0x1A: SYS_READY</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The AutoSphere Process */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center space-y-4 mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">The Engineering Process</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">A systematic approach to automotive perfection.</p>
                </div>
                <div className="grid md:grid-cols-4 gap-6 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                    {[
                        { step: '01', title: 'Consultation', desc: 'Initial discussion of performance goals and vehicle history.' },
                        { step: '02', title: 'Telemetry Audit', desc: 'Deep dive into ECU logs and mechanical tolerances.' },
                        { step: '03', title: 'Action Plan', desc: 'Determining the optimal path for tuning and hardware.' },
                        { step: '04', title: 'Execution', desc: 'Precision implementation by master technicians.' },
                    ].map((s) => (
                        <div key={s.step} className="relative z-10 glass-card p-6 bg-secondary text-center group hover:border-primary/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-secondary transition-all">{s.step}</div>
                            <h3 className="text-white font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                            <p className="text-white/40 text-sm">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Service Tiers */}
            <section className="bg-white/[0.02] py-12 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center space-y-4 mb-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Service Packages</h2>
                        <p className="text-white/40 max-w-2xl mx-auto">Tailored maintenance for every level of performance.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Essential', price: '299', features: ['Oil & Filter Change', '150-Point Inspection', 'Level 1 Diagnostics', 'Fluid Top-off'], active: false },
                            { name: 'Performance', price: '899', features: ['All Essential Features', 'ECU Calibration', 'Brake Optimization', 'Drive Data Analysis', 'Priority Bay Access'], active: true },
                            { name: 'Elite Track', price: '2,499', features: ['All Performance Tech', 'Full Aero Alignment', 'Race-Fluid Systems', '24/7 Trackside Support', 'Dyno-Precision Tuning'], active: false },
                        ].map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`glass-card p-10 flex flex-col space-y-8 relative overflow-hidden ${tier.active ? 'border-primary shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/10'}`}
                            >
                                {tier.active && (
                                    <div className="absolute top-0 right-0 bg-primary px-4 py-1 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Best Technical Value</div>
                                )}
                                <div>
                                    <div className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{tier.name}</div>
                                    <div className="text-5xl font-bold text-white"><span className="text-xl font-normal text-white/40">$</span>{tier.price}</div>
                                </div>
                                <div className="space-y-4 flex-grow">
                                    {tier.features.map(f => (
                                        <div key={f} className="flex items-center space-x-3 text-sm text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${tier.active ? 'bg-primary text-secondary hover:bg-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                    Select Package
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Performance Software & Parts */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="glass-card bg-primary/5 border-primary/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl overflow-hidden relative">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="max-w-xl relative z-10 space-y-6">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">Parts & Tuning</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">OEM & Beyond</h2>
                        <p className="text-white/60 leading-relaxed">
                            We deploy stage 1-3 ECU maps using industry-leading software. Combined with high-flow downpipes, forged internals, and aerospace-grade carbon intakes, your machine reaches true dynamic superiority.
                        </p>
                        <button className="btn-primary flex items-center space-x-2 px-6 py-2">
                            <span>Explore Catalog</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10 w-full md:w-auto">
                        <div className="glass-card p-4 text-center border-white/10 bg-secondary/80">
                            <div className="text-3xl font-bold text-white mb-1"><span className="text-primary">+</span>85</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">Avg HP Gain</div>
                        </div>
                        <div className="glass-card p-4 text-center border-white/10 bg-secondary/80">
                            <div className="text-3xl font-bold text-white mb-1">Tier 1</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">Component Grade</div>
                        </div>
                        <div className="glass-card p-4 text-center border-white/10 bg-secondary/80 col-span-2">
                            <div className="text-xl font-bold text-white mb-1">Dyno-Verified</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">Calibration Standard</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Marquee */}
            <section className="py-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                    <h2 className="text-4xl font-bold text-white">Owner Experiences</h2>
                </div>
                <div className="flex space-x-8 animate-marquee">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card p-8 min-w-[300px] space-y-6 flex-shrink-0">
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-white/60 italic leading-relaxed text-sm">
                                "The level of technical precision at AutoSphere is unmatched. My GT3 feels sharper, more responsive, and better tuned than the day I bought it."
                            </p>
                            <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">JD</div>
                                <div>
                                    <div className="text-white font-bold text-sm">James D.</div>
                                    <div className="text-xs text-white/40">Porsche GT3 RS (2024)</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto px-4 py-12 mb-12">
                <div className="text-center space-y-4 mb-10">
                    <HelpCircle size={48} className="mx-auto text-primary" />
                    <h2 className="text-4xl font-bold text-white">Service Intelligence</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { q: "How often should I undergo digital diagnostics?", a: "For high-performance vehicles, we recommend a full telemetry sync every 5,000 km or before any track-day events to ensure peak efficiency." },
                        { q: "Do you use OEM or competition-grade parts?", a: "We stock both. Depending on your service tier, we offer OEM replacements for warranty compliance or competition-grade components for performance gains." },
                        { q: "Can I monitor my service progress remotely?", a: "Yes, our client portal (User Dashboard) provides near real-time progress updates including diagnostic outputs and technician notes." },
                        { q: "Are your technicians certified for EV performance?", a: "Absolutely. Our 'Electric Emerald' initiative ensures all master techs are dual-certified in internal combustion and high-voltage EV engineering." }
                    ].map((faq, i) => (
                        <div key={i} className="glass-card p-6 border-white/5 cursor-pointer group hover:border-primary/20">
                            <div className="flex justify-between items-center bg-transparent border-none w-full text-left rtl:text-right">
                                <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">{faq.q}</span>
                                <ChevronDown size={20} className="text-white/20 group-hover:text-primary transition-transform duration-300" />
                            </div>
                            <div className="mt-4 text-white/40 text-sm leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Counter (Moved down) */}
            <section className="bg-primary py-12 mb-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 text-secondary text-center">
                    <div className="space-y-2">
                        <div className="text-5xl font-extrabold font-outfit tracking-tighter">15k+</div>
                        <div className="text-sm font-bold uppercase opacity-60">Engine Rebuilds</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-extrabold font-outfit tracking-tighter">99%</div>
                        <div className="text-sm font-bold uppercase opacity-60">Service Efficiency</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-extrabold font-outfit tracking-tighter">24hr</div>
                        <div className="text-sm font-bold uppercase opacity-60">Rapid Turnaround</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-extrabold font-outfit tracking-tighter">Elite</div>
                        <div className="text-sm font-bold uppercase opacity-60">Technician Rank</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home1;
