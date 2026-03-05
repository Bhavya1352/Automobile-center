import React from 'react';
import PageHero from '../components/PageHero';
import {
    ArrowRight, Wrench, Shield, Zap, Heart, TrendingUp,
    Users, Star, Coffee, Laptop, GraduationCap, Gift
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Data ───────────────────────────────────────────────── */

const openings = [
    {
        title: 'Master Diagnostic Technician',
        type: 'Full-time',
        location: 'HQ Garage',
        dept: 'Engineering',
        icon: Wrench,
        salary: '£45,000 – £58,000',
        tags: ['OBD-II', 'Oscilloscope', 'EV Ready'],
        description: 'Lead complex diagnostic sessions across multi-brand vehicles. You\'ll supervise junior technicians, own the diagnostic bay, and set the standard for first-time fix rate.',
    },
    {
        title: 'Aerodynamics Specialist',
        type: 'Full-time',
        location: 'Track Lab',
        dept: 'Performance',
        icon: Zap,
        salary: '£48,000 – £65,000',
        tags: ['CFD', 'Suspension', 'Motorsport'],
        description: 'Work alongside our performance division to optimise airflow, downforce, and suspension geometry for both track clients and road vehicles seeking the ultimate setup.',
    },
    {
        title: 'Automotive Cyber Systems Expert',
        type: 'Contract',
        location: 'Remote / On-site',
        dept: 'Cyber Systems',
        icon: Shield,
        salary: '£550 – £750 / day',
        tags: ['CAN Bus', 'OTA Security', 'Firmware'],
        description: 'Modern vehicles are rolling computers — and we need someone who can protect them. You\'ll audit ECU firmware, secure keyless entry systems, and test OTA update integrity.',
    },
    {
        title: 'EV Conversion Engineer',
        type: 'Full-time',
        location: 'HQ Garage',
        dept: 'EV Division',
        icon: TrendingUp,
        salary: '£50,000 – £68,000',
        tags: ['Battery Systems', 'HV Safety', 'CAD'],
        description: 'Design and execute full electric powertrain conversions for classic and modern vehicles. Work with battery management, motor controllers, and custom chassis integration.',
    },
    {
        title: 'Workshop Apprentice',
        type: 'Apprenticeship',
        location: 'HQ Garage',
        dept: 'Training',
        icon: GraduationCap,
        salary: 'Funded by AutoSphere',
        tags: ['Level 3', 'NVQ', 'Mentored'],
        description: 'Launch your automotive career the right way. Our structured 2-year programme gives you hands-on training alongside ASE-certified master technicians, with a guaranteed review role upon completion.',
    },
    {
        title: 'Client Experience Manager',
        type: 'Full-time',
        location: 'Front of House',
        dept: 'Customer Success',
        icon: Users,
        salary: '£30,000 – £38,000',
        tags: ['CRM', 'Automotive', 'Communication'],
        description: 'The first and last person our clients interact with. You\'ll manage appointments, translate technical work into plain language, and ensure every customer leaves more confident than they arrived.',
    },
];

const PERKS = [
    { icon: Heart, title: 'Health & Wellbeing', desc: 'Private medical, dental, and mental health support for you and your family.' },
    { icon: Coffee, title: 'On-Site Facilities', desc: 'Fully stocked café, rest zones, and an ergonomic workshop setup.' },
    { icon: Laptop, title: 'Tech Stipend', desc: '£800 / year for personal tools, learning subscriptions, and equipment.' },
    { icon: Star, title: 'Performance Bonuses', desc: 'Quarterly bonuses tied to quality metrics — not just volume.' },
    { icon: Gift, title: 'Loyalty Rewards', desc: 'Long-service awards, additional leave, and pension uplift after 3 years.' },
    { icon: GraduationCap, title: 'Training Funded', desc: 'All re-certifications, OEM courses, and trade conferences fully covered.' },
];

const PROCESS_STEPS = [
    { step: '01', title: 'Apply Online', desc: 'Submit your CV and one paragraph on why AutoSphere is the right move. No cover letter jargon needed.' },
    { step: '02', title: 'Skills Call', desc: 'A 20-minute video call with the team lead to discuss your experience and technical background.' },
    { step: '03', title: 'Workshop Day', desc: 'Spend half a day in the garage working on real jobs alongside potential colleagues. No trick questions.' },
    { step: '04', title: 'Offer & Onboarding', desc: 'Conditional offer within 48 hours. Your first two weeks are fully structured induction at full pay.' },
];

/* ─── Component ──────────────────────────────────────────── */

const Careers: React.FC = () => {
    return (
        <div className="pb-32">
            <PageHero
                badge="Careers at AutoSphere"
                title={<>Join the<br /><span className="text-primary">Automotive Elite.</span></>}
                subtitle="We don't just fix cars. We re-engineer the boundaries of mechanical performance. Bring your expertise to AutoSphere."
                breadcrumb={['Home', 'Careers']}
            />

            <section className="max-w-7xl mx-auto px-4">

                {/* Culture Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card border-primary/20 p-10 md:p-14 mb-28 relative overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-3xl">
                        <span className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4 block">Why AutoSphere</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            We invest in people the same way we invest in tools — <span className="text-primary">without compromise.</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed">
                            The automotive world moves fast. Our team stays ahead through continuous training, access to cutting-edge equipment,
                            and a culture that rewards mastery over mediocrity. If you're the best at what you do — or you intend to be — this is your place.
                        </p>
                    </div>
                </motion.div>

                {/* Current Opportunities */}
                <div className="text-center space-y-4 mb-14">
                    <h2 className="text-4xl font-bold text-white">Current Opportunities</h2>
                    <p className="text-white/40 max-w-2xl mx-auto">Step into the future of high-performance automotive maintenance.</p>
                </div>

                <div className="space-y-6 mb-28">
                    {openings.map((job, i) => (
                        <motion.div
                            key={job.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-6 md:p-8 group hover:border-primary/50 transition-colors cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex items-start gap-6">
                                    <div className="hidden sm:flex w-14 h-14 bg-white/5 rounded-2xl items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                        <job.icon size={26} className="text-white/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40 mb-3">
                                            <span className="font-mono text-primary">{job.dept}</span>
                                            <span>•</span>
                                            <span>{job.type}</span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span className="text-white/60 font-medium">{job.salary}</span>
                                        </div>
                                        <p className="text-white/40 text-sm leading-relaxed max-w-2xl mb-4">{job.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.tags.map(tag => (
                                                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button className="flex items-center gap-2 text-white hover:text-primary transition-colors focus:outline-none self-start md:self-center flex-shrink-0">
                                    <span className="font-bold uppercase tracking-wider text-xs">Apply Now</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Perks */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What You Get</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Exceptional talent deserves exceptional conditions.</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
                    {PERKS.map((perk, i) => (
                        <motion.div
                            key={perk.title}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-7 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                                <perk.icon size={22} className="text-primary" />
                            </div>
                            <h3 className="text-white font-bold mb-2">{perk.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{perk.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Hiring Process */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">Our Hiring Process</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Transparent, fast, and respectful of your time.</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PROCESS_STEPS.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-7 text-center hover:border-primary/30 transition-colors"
                        >
                            <div className="text-5xl font-black text-primary/20 mb-4">{step.step}</div>
                            <h3 className="text-white font-bold mb-3">{step.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Careers;
