import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { motion } from 'framer-motion';
import { TEAM } from '../data/siteData';
import { BadgeCheck, Star, Clock, Users, Wrench, MessageCircle, ChevronRight } from 'lucide-react';

/* Summed from the roster rather than typed in: the figure here read
   "142+" above six technicians totalling eighty years. */
const COMBINED_YEARS = TEAM.reduce((sum, m) => sum + parseInt(m.exp, 10), 0);

/* ─── Data ───────────────────────────────────────────────── */

// Unique portrait images for each team member (pravatar.cc — stable by img number)
const TEAM_PHOTOS = [
    'https://i.pravatar.cc/400?img=11',
    'https://i.pravatar.cc/400?img=47',
    'https://i.pravatar.cc/400?img=14',
    'https://i.pravatar.cc/400?img=52',
    'https://i.pravatar.cc/400?img=68',
    'https://i.pravatar.cc/400?img=25',
];

const TECHNICIAN_RATINGS = [5, 5, 4.9, 5, 4.8, 4.9];

const TECHNICIAN_REVIEWS = [
    '"Marcus rebuilt my gearbox from scratch. The car drives better than when I bought it new." — David L.',
    '"Priya found an intermittent fault no other garage could locate. Fixed in two hours." — Sarah K.',
    '"James explained every step before touching my Porsche. That trust is rare." — Ahmed R.',
    '"Fastest diagnostics I\'ve ever experienced. Toyota-dealer quality at a third of the price." — Linda M.',
    '"He spotted a cracked subframe mounting point that would have been dangerous in 1,000 miles." — Tom B.',
    '"Our fleet of 14 vehicles has been exclusively maintained here for 6 years. Not once let down." — Fleet Co.',
];

const SKILLS_BREAKDOWN = [
    { label: 'Engine Diagnostics', pct: 98 },
    { label: 'Performance Tuning', pct: 94 },
    { label: 'Electrical & CAN Systems', pct: 91 },
    { label: 'EV & Hybrid Systems', pct: 87 },
    { label: 'Transmission & Drivetrain', pct: 95 },
    { label: 'Suspension & Geometry', pct: 90 },
];

/* ─── Component ──────────────────────────────────────────── */

const Technicians: React.FC = () => {
    return (
        <div className="pb-32">
            <PageHero
                badge="The AutoSphere Team"
                title={<>Elite Master<br /><span className="text-primary">Technicians.</span></>}
                subtitle="The minds behind the machines. Our team consists of industry veterans trained globally by top-tier OEMs."
                breadcrumb={['Home', 'Technicians']}
            />

            <section className="wrap">

                {/* Team Stats Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-28"
                >
                    {[
                        { icon: BadgeCheck, stat: 'Bosch', label: 'Certified independent centre' },
                        { icon: Users, stat: String(TEAM.length), label: 'Technicians on the floor' },
                        { icon: Clock, stat: `${COMBINED_YEARS} yrs`, label: 'Combined experience on the roster' },
                        { icon: Wrench, stat: 'Four', label: 'Service bays' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="panel p-7 flex flex-col items-center text-center hover:border-forest transition-colors"
                        >
                            <div className="w-11 h-11 bg-forest-pale rounded-sm flex items-center justify-center mb-4">
                                <item.icon size={20} className="text-primary" />
                            </div>
                            <div className="stat text-[1.75rem]">{item.stat}</div>
                            <div className="mt-2 text-[0.8125rem] leading-snug text-muted">{item.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Master Roster */}
                <div className="text-center space-y-4 mb-14">
                    <h2 className="display-md">The people on the floor</h2>
                    <p className="text-muted max-w-2xl mx-auto">Only the top 1% of mechanics earn the AutoSphere badge.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
                    {TEAM.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="panel overflow-hidden group border-line hover:border-forest transition-all"
                        >
                            {/* Photo */}
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={TEAM_PHOTOS[i]}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" aria-hidden="true" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="title-md text-paper">{member.name}</div>
                                        <div className="spec-label mt-0.5 text-paper/80">{member.role}</div>
                                    </div>
                                    <div className="shrink-0 rounded-sm bg-paper/20 px-2 py-0.5 text-xs font-medium text-paper">{member.exp}</div>
                                </div>
                                {/* Rating badge */}
                                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-sm bg-ink/75 px-2 py-1">
                                    <Star size={11} className="fill-clay text-clay" aria-hidden="true" />
                                    <span className="text-xs font-bold tabular-nums text-paper">{TECHNICIAN_RATINGS[i]}</span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="text-ink-soft text-sm mb-3">
                                    <strong className="text-ink-soft">Specialty:</strong> {member.spec}
                                </div>

                                {/* Mini review */}
                                <div className="bg-sand rounded-sm p-4 mb-4">
                                    <MessageCircle size={14} className="text-primary mb-2" />
                                    <p className="text-muted text-xs leading-relaxed italic">{TECHNICIAN_REVIEWS[i]}</p>
                                </div>

                                {/* A "View Work History" button stood here with no
                                    handler, offering a view the app does not have. */}
                                <Link to="/contact" className="btn-secondary w-full px-4 py-2.5 text-sm">
                                    Book with our team
                                    <ChevronRight size={14} aria-hidden="true" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Skills Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Team Skill Coverage</h2>
                    <p className="text-muted max-w-xl mx-auto">Collective proficiency across all major automotive disciplines, rated by independent audit.</p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-6 mb-28">
                    {SKILLS_BREAKDOWN.map((skill, i) => (
                        <motion.div
                            key={skill.label}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-ink-soft text-sm font-medium">{skill.label}</span>
                                <span className="text-primary text-sm font-bold">{skill.pct}%</span>
                            </div>
                            <div className="h-2 bg-sand rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.pct}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-primary"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Join the team CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="panel border-forest p-10 text-center"
                >
                    <h3 className="text-2xl font-bold text-ink mb-3">Think You Have What It Takes?</h3>
                    <p className="text-muted max-w-xl mx-auto mb-7">
                        We only hire when we find the right person — not to fill a seat.
                        If you're elite, we want to hear from you.
                    </p>
                    <Link to="/careers" className="btn btn-solid">
                        View careers
                        <ChevronRight size={18} aria-hidden="true" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

export default Technicians;
