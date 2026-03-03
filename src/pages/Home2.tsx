import Hero, { DotTitle } from '../components/Hero';
import { ShieldCheck, History, Award, Users, Heart, Camera, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const heritageFeatures = [
    { icon: History, title: '25 Years of Expertise', desc: 'A legacy built on mechanical perfection and generational knowledge.' },
    { icon: ShieldCheck, title: 'Certified Master Techs', desc: 'Our team holds the highest industry certifications and OEM training.' },
    { icon: Award, title: 'Award Winning Service', desc: 'Recognized as the region’s premier independent automotive facility.' },
];

const Home2: React.FC = () => {
    return (
        <div className="space-y-16">
            <Hero
                title={<><DotTitle>Trusted Heritage</DotTitle><br /><span className="text-primary">Automotive Service <DotTitle>Mastery</DotTitle></span></>}
                subtitle="Since 1998, we've treated every vehicle as a masterpiece. Combining old-world craftsmanship with modern precision."
                primaryCTA="Our Story"
                secondaryCTA="Schedule Visit"
                badge="ESTABLISHED 1998"
            />

            <section className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-12">
                    {heritageFeatures.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <f.icon size={32} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{f.title}</h3>
                            <p className="text-white/40 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Restoration Mastery */}
            <section className="py-16 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 grid grid-cols-2 gap-4 h-[400px]">
                        <div className="glass-card bg-white/5 w-full h-full rounded-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-end p-4">
                                <span className="text-xs uppercase font-bold tracking-widest text-primary">Pre-1990 Classics</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="glass-card bg-white/5 w-full h-[192px] rounded-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-end p-4">
                                    <span className="text-xs uppercase font-bold tracking-widest text-white">Chassis Rehab</span>
                                </div>
                            </div>
                            <div className="glass-card bg-white/5 w-full h-[192px] rounded-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-end p-4">
                                    <span className="text-xs uppercase font-bold tracking-widest text-white">Engine Prep</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold tracking-widest uppercase">Restoration Division</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Breathing Life into Legends.</h2>
                        <p className="text-white/60 leading-relaxed text-lg">
                            Our heritage division specializes in full frame-off restorations for European and Japanese classics. We don't just rebuild; we respect the original engineering philosophy while introducing modern reliability.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {['Period-correct component sourcing', 'OEM paint matching and application', 'Powertrain modernization'].map(item => (
                                <li key={item} className="flex items-center space-x-3 text-white/40">
                                    <CheckCircle2 size={16} className="text-primary" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Legacy Timeline */}
            <section className="max-w-7xl mx-auto px-4 py-16 mt-16">
                <div className="text-center space-y-4 mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Our Journey</h2>
                    <p className="text-white/40">Three decades of mechanical evolution.</p>
                </div>
                <div className="relative border-l border-white/5 ml-4 md:ml-0 md:border-l-0 md:flex md:justify-center overflow-x-hidden">
                    <div className="md:grid md:grid-cols-4 md:gap-8 w-full">
                        {[
                            { year: '1998', title: 'Foundation', desc: 'AutoSphere opens its first performance bay in the heart of the tech district.' },
                            { year: '2008', title: 'Masters Hub', desc: 'Named Regional Master Service Center for elite European manufacturing partners.' },
                            { year: '2018', title: 'Digital Shift', desc: 'Integration of real-time cloud diagnostics and racing-grade telemetry labs.' },
                            { year: '2025', title: 'Emerald Era', desc: 'Sustainable high-performance EV engineering initiative launched globally.' },
                        ].map((event, i) => (
                            <motion.div
                                key={event.year}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="relative pl-8 md:pl-0 mb-12 md:mb-0 md:text-center group"
                            >
                                <div className="absolute left-[-5px] top-2 md:relative md:left-auto md:top-auto w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20 mb-6 mx-auto group-hover:scale-150 transition-transform" />
                                <div className="text-primary font-bold text-xl mb-2">{event.year}</div>
                                <h3 className="text-white font-bold text-lg mb-1">{event.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{event.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Exotic Showcase (Using CSS grids for layout) */}
            <section className="py-16 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-primary font-bold uppercase tracking-tighter text-sm">
                                <Camera size={16} />
                                <span>Portfolio Archive</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white">The Exotic Showcase</h2>
                        </div>
                        <p className="text-white/40 max-w-sm mb-2">A small selection of the high-performance vehicles maintained by our master technicians.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 aspect-square sm:aspect-video md:aspect-[2/1]">
                        <div className="col-span-2 md:row-span-2 glass-card bg-white/5 relative overflow-hidden group min-h-[150px]">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                                <span className="text-secondary font-bold uppercase tracking-widest text-xs py-2 px-4 bg-white rounded-full text-center">Ferrari F8 Tributo</span>
                            </div>
                            <div className="uppercase text-[8px] tracking-[.5em] text-white/10 absolute top-12 left-12 rotate-90 origin-left">Archive_001</div>
                        </div>
                        <div className="glass-card bg-white/5 group relative overflow-hidden min-h-[150px]">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white text-secondary text-[10px] p-2 rounded-lg">911 GT3</span>
                            </div>
                        </div>
                        <div className="glass-card bg-white/5 group relative overflow-hidden min-h-[150px]">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white text-secondary text-[10px] p-2 rounded-lg">AMG GTR</span>
                            </div>
                        </div>
                        <div className="col-span-2 glass-card bg-white/5 group relative overflow-hidden min-h-[150px] p-4 text-center">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">Showcase Continuous Performance</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="glass-card !bg-primary/[0.02] py-16 border-x-0">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                    <Heart size={48} className="mx-auto text-primary animate-pulse" />
                    <h2 className="text-3xl md:text-5xl font-outfit font-medium text-white italic leading-tight">
                        "Automotive service is not just about fixing machines; it's about preserving the art of motion and the trust of those who drive them."
                    </h2>
                    <div className="text-primary font-bold tracking-widest uppercase">— Founder, AutoSphere</div>
                </div>
            </section>

            {/* Concierge Services */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="glass-card border-white/10 bg-secondary p-8 md:p-16 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={200} /></div>
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold text-white">The Executive Concierge</h2>
                        <p className="text-white/60 text-lg">
                            We value your time as much as your vehicle. Our exclusive concierge program ensures a seamless service experience from retrieval to delivery.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <h4 className="text-white font-bold flex items-center space-x-2"><ChevronRight size={16} className="text-primary" /> Flatbed Transport</h4>
                                <p className="text-white/40 text-sm pl-6">Climate-controlled enclosed pickup and delivery within a 100-mile radius.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-bold flex items-center space-x-2"><ChevronRight size={16} className="text-primary" /> Loaner Fleet</h4>
                                <p className="text-white/40 text-sm pl-6">Access to our curated fleet of luxury sedans and performance SUVs while your car is in the bay.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-bold text-white mb-4">The Master Technicians</h2>
                        <p className="text-white/40">Our team consists of specialists with over a decade of experience in European and high-performance engineering.</p>
                    </div>
                    <button className="btn-secondary">Meet the Team</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { n: 'Master Tech. Erik', s: 'Lead Diagnostic' },
                        { n: 'Mech. Sarah L.', s: 'Brake Specialist' },
                        { n: 'Eng. Marcus T.', s: 'ECU Calibration' },
                        { n: 'Mech. Dave C.', s: 'Exotic Alignment' },
                    ].map((tech, i) => (
                        <div key={i} className="aspect-square glass-card overflow-hidden group border-white/5">
                            <div className="h-full w-full bg-white/5 group-hover:bg-primary/10 transition-colors duration-500 relative flex items-center justify-center">
                                <Users size={32} className="text-white/20 group-hover:text-primary transition-colors" />
                                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform bg-primary p-4">
                                    <div className="text-sm font-bold text-secondary uppercase tracking-tighter">{tech.n}</div>
                                    <div className="text-[10px] text-secondary/60 font-bold uppercase">{tech.s}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partner Marquee */}
                <div className="mt-16 pt-16 border-t border-white/5">
                    <div className="text-[10px] text-white/20 uppercase font-bold tracking-[.3em] text-center mb-8">Certified Partner Network</div>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {['BOSCH', 'BREMBO', 'MOTUL', 'MICHELIN', 'OHLINS', 'BILSTEIN'].map(partner => (
                            <div key={partner} className="text-2xl font-black font-outfit tracking-tighter text-white">{partner}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-primary">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-4xl md:text-7xl font-bold text-secondary tracking-tighter">READY TO UPGRADE YOUR JOURNEY?</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button className="bg-secondary text-white px-12 py-5 rounded-full font-bold flex items-center space-x-3 group animate-pulse">
                            <span>Secure a Service Bay</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center space-x-3 text-secondary/60 font-bold uppercase text-xs">
                            <CheckCircle2 size={18} />
                            <span>Next Bay Available in 45m</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home2;
