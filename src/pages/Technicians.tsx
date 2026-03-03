import React from 'react';
import Hero, { DotTitle } from '../components/Hero';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Technicians: React.FC = () => {
    const team = [
        { name: 'Erik Von', role: 'Lead Diagnostic Tech', exp: '15 Years', spec: 'European ECU, Hybrid Systems' },
        { name: 'Sarah Lin', role: 'Brake & Chassis Specialist', exp: '12 Years', spec: 'Carbon-Ceramic Systems, Track Prep' },
        { name: 'Marcus Truth', role: 'Engine Builder', exp: '20 Years', spec: 'V8 Performance, Exotic Rebuilds' },
        { name: 'Dave Chappelle', role: 'Aero Dynamics Expert', exp: '10 Years', spec: 'Suspension Tuning, Downforce' },
        { name: 'Alex Rodriguez', role: 'Electrical System Engineer', exp: '14 Years', spec: 'Wiring Harnesses, Data Logging' },
        { name: 'Mia Khalifa', role: 'Quality Assurance Control', exp: '9 Years', spec: 'Final Dyno Prep, Detail Inspection' }
    ];

    return (
        <div className="space-y-32">
            <Hero
                title={<>Elite Master<br /><DotTitle><span className="text-primary">Technicians</span></DotTitle></>}
                subtitle="The minds behind the machines. Our team consists of industry veterans trained globally by top tier OEMs."
                primaryCTA="Join the Team"
                secondaryCTA="View Certifications"
                badge="THE AUTOSPHERE TEAM"
            />

            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-4xl font-bold text-white">Our Master Rosters</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">Only the top 1% of mechanics earn the AutoSphere badge.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card overflow-hidden group border-white/5"
                        >
                            <div className="aspect-video bg-white/5 flex items-center justify-center relative overflow-hidden">
                                <Users size={48} className="text-white/10 group-hover:text-primary transition-colors duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div>
                                        <div className="text-xl font-bold text-white">{member.name}</div>
                                        <div className="text-primary text-xs font-bold uppercase tracking-widest">{member.role}</div>
                                    </div>
                                    <div className="text-white/40 text-xs font-mono">{member.exp}</div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-white/60 text-sm mb-4">
                                    <strong className="text-white/80">Specialty:</strong> {member.spec}
                                </div>
                                <button className="w-full btn-secondary text-sm">View Work History</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Technicians;
