import React from 'react';
import Hero, { DotTitle } from '../components/Hero';
import { ArrowRight, Wrench, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Careers: React.FC = () => {
    const openings = [
        { title: 'Master Diagnostic Technician', type: 'Full-time', location: 'HQ Garage', dept: 'Engineering', icon: Wrench },
        { title: 'Aerodynamics Specialist', type: 'Full-time', location: 'Track Lab', dept: 'Performance', icon: Zap },
        { title: 'Automotive Security Expert', type: 'Contract', location: 'Remote/On-site', dept: 'Cyber Systems', icon: Shield },
    ];

    return (
        <div className="space-y-32">
            <Hero
                title={<>Join the<br /><span className="text-primary">Automotive <DotTitle>Elite</DotTitle></span></>}
                subtitle="We don't just fix cars. We re-engineer the boundaries of mechanical performance. Bring your expertise to AutoSphere."
                primaryCTA="View Open Positions"
                secondaryCTA="Our Culture"
                badge="CAREERS AT AUTOSPHERE"
            />

            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-4xl font-bold text-white">Current Opportunities</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">Step into the future of high-performance automotive maintenance.</p>
                </div>

                <div className="space-y-6 max-w-4xl mx-auto">
                    {openings.map((job, i) => (
                        <motion.div
                            key={job.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center space-x-6 mb-6 md:mb-0">
                                <div className="hidden sm:flex w-16 h-16 bg-white/5 rounded-2xl items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <job.icon size={28} className="text-white/40 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex items-center space-x-4 text-sm mb-4 md:mb-0 text-white/40">
                                        <span className="font-mono text-primary">{job.dept}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center space-x-2 text-white hover:text-primary transition-colors focus:outline-none">
                                <span className="font-bold uppercase tracking-wider text-xs">Apply Now</span>
                                <ArrowRight size={16} className="group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Careers;
