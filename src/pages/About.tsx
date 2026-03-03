import React from 'react';
import Hero, { DotTitle } from '../components/Hero';
import { Shield, Zap, Target, Clock, Award, Wrench, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    return (
        <div className="pb-24">
            <Hero
                title={<><DotTitle>Our Garage, Our Legacy</DotTitle><br /><DotTitle><span className="text-primary">Precision Matters</span></DotTitle></>}
                subtitle="AutoSphere was founded with a single mission — to deliver the highest level of technical expertise and customer trust in the automotive industry."
                primaryCTA="Book a Service"
                secondaryCTA="Call Us Now"
                badge="ABOUT AUTOSPHERE"
            />

            {/* Who We Are */}
            <section className="max-w-5xl mx-auto px-4 py-20 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
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
                    {[
                        { value: '25+', label: 'Years of Service' },
                        { value: '10k+', label: 'Vehicles Serviced' },
                        { value: '98.4%', label: 'Satisfaction Rate' },
                        { value: '0%', label: 'Error Tolerance' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 text-center"
                        >
                            <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                            <div className="text-white/40 text-sm uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* What We Stand For */}
            <section className="max-w-6xl mx-auto px-4 pb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white text-center mb-10"
                >
                    What We Stand For
                </motion.h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                        { icon: Shield, title: 'OEM+ Quality', desc: 'Every bolt and scan meets or exceeds manufacturer standards.' },
                        { icon: Zap, title: 'Advanced Diagnostics', desc: 'Forensic-grade tools that spot issues before they become failures.' },
                        { icon: Target, title: 'Precision Tuning', desc: 'ECU remapping and performance upgrades measured in microns.' },
                        { icon: Clock, title: '30-Min Fast Track', desc: 'Rapid service scheduling so your time is never wasted.' },
                        { icon: Award, title: 'ASE Certified', desc: 'Our technicians hold the highest industry certifications.' },
                        { icon: Wrench, title: 'Lifetime Warranty', desc: 'All services backed by a comprehensive parts & labour warranty.' },
                    ].map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-5 flex gap-4 items-start hover:border-primary/30 transition-colors"
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

            {/* Visit Us */}
            <section className="max-w-4xl mx-auto px-4 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 border-primary/20"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={32} className="text-primary" />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-1">Visit Our Facility</h3>
                        <p className="text-white/50 text-sm">AutoSphere Service Center · Open Mon–Sat, 8am–7pm</p>
                        <p className="text-primary text-sm mt-1 font-medium">123 Performance Drive, Motorway District</p>
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
