import React from 'react';
import PageHero from '../components/PageHero';
import { Award, ShieldCheck, CheckCircle2, BadgeCheck, FileCheck, RefreshCcw, Globe2, Microscope, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { PARTNERS } from '../data/siteData';

/* ─── Data ───────────────────────────────────────────────── */

const CERT_CATEGORIES = [
    {
        icon: ShieldCheck,
        title: 'Safety & Compliance',
        items: ['ISO 9001:2015 Quality Management', 'HSE Workplace Safety Compliance', 'Fire Safety Level 3 Certification', 'COSHH Chemical Handling Certification'],
    },
    {
        icon: Microscope,
        title: 'Technical Diagnostics',
        items: ['ASE Master Technician (All 8 Areas)', 'OBD-II & CAN Bus Advanced Diagnostics', 'Hybrid & EV High-Voltage Safety (IMI)', 'Bosch ESI[tronic] Diagnostic Suite'],
    },
    {
        icon: Globe2,
        title: 'OEM Manufacturer Programmes',
        items: ['BMW Group Technical Partnership', 'Mercedes-Benz Dealer Approved Service', 'Volkswagen Group Factory Training', 'Toyota Hybrid Specialist Programme'],
    },
    {
        icon: FileCheck,
        title: 'Environmental',
        items: ['ISO 14001 Environmental Management', 'Waste Carrier Licence (Upper Tier)', 'Refrigerant Handling (F-Gas)', 'Green Garage Eco Accreditation'],
    },
    {
        icon: BookOpen,
        title: 'Training & Education',
        items: ['City & Guilds Level 3 Light Vehicle', 'IMI Advanced Automotive Technology', 'Approved NVQ Assessment Centre', 'IRTEC Licensed Programme'],
    },
    {
        icon: RefreshCcw,
        title: 'Annual Renewal',
        items: ['MOT Approved Test Station', 'DVSA Compliance Audit Passed', 'Annual Calibration of All Tools', 'Independent Audit by Bureau Veritas'],
    },
];

const CERT_PROCESS = [
    { step: '01', title: 'Application & Audit', desc: 'Each certification begins with a thorough audit of our facility, processes, and team competency by the issuing body.' },
    { step: '02', title: 'Technical Examination', desc: 'Our technicians sit both written and practical exams, assessed against live vehicle scenarios by certified examiners.' },
    { step: '03', title: 'Facility Inspection', desc: 'The workshop, tools, storage, and waste procedures are physically inspected and documented on-site.' },
    { step: '04', title: 'Annual Revalidation', desc: 'Certifications are not permanent — we revalidate every 12 months to ensure standards are maintained or exceeded.' },
];

/* ─── Component ──────────────────────────────────────────── */

const Certifications: React.FC = () => {
    return (
        <div className="pb-32">
            <PageHero
                badge="OEM+ Compliant"
                title={<>Global Industry<br /><span className="text-primary">Certifications.</span></>}
                subtitle="We operate at the highest standards of automotive engineering, holding certifications from the world's most prestigious organizations."
                breadcrumb={['Home', 'Certifications']}
            />

            <section className="max-w-7xl mx-auto px-4">

                {/* ASE Highlight */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-28">
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-bold text-white">ASE Blue Seal of Excellence</h2>
                        <p className="text-white/40 leading-relaxed text-lg">
                            AutoSphere is proud to hold the ASE Blue Seal — one of the most rigorous and prestigious designations
                            in the automotive service industry. This certification requires that at least 75% of our technicians
                            are ASE certified across all service areas, and that every department is covered by a certified professional.
                        </p>
                        <p className="text-white/40 leading-relaxed">
                            Less than 5% of independent shops nationwide hold this distinction.
                            We've maintained it continuously since 2004 — every year, without exception.
                        </p>
                        <div className="flex items-center gap-4 text-primary font-bold">
                            <ShieldCheck size={24} />
                            <span>Verified Facility #8892-ALPHA</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/40 text-sm">
                            <BadgeCheck size={18} className="text-primary" />
                            <span>Last revalidated: January 2025</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card p-12 flex flex-col items-center justify-center relative overflow-hidden border-primary/20 gap-6"
                    >
                        <div className="absolute inset-0 bg-primary/5" />
                        <Award size={100} className="text-primary relative z-10" />
                        <div className="relative z-10 text-center">
                            <div className="text-white font-bold text-xl">ASE Blue Seal</div>
                            <div className="text-primary text-sm mt-1">Facility of Excellence</div>
                            <div className="text-white/30 text-xs mt-3 font-mono">Cert. valid through Dec 2025</div>
                        </div>
                    </motion.div>
                </div>

                {/* Certification Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Full Certification Catalogue</h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Across safety, technical, environmental, and training standards — we hold over 25 active certifications.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
                    {CERT_CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-7 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <cat.icon size={20} className="text-primary" />
                                </div>
                                <h3 className="text-white font-bold">{cat.title}</h3>
                            </div>
                            <ul className="space-y-2">
                                {cat.items.map(item => (
                                    <li key={item} className="flex items-start gap-2 text-white/40 text-sm">
                                        <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* How We Certify */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">How Our Certification Process Works</h2>
                    <p className="text-white/40 max-w-xl mx-auto">We earn every credential. No self-assessment — only independent third-party verification.</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
                    {CERT_PROCESS.map((step, i) => (
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

                {/* Partner Endorsements */}
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold text-white">Partner Endorsements</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Recognised and endorsed by the industry's leading brands.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PARTNERS.map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 flex items-center space-x-4 border-white/5 hover:border-primary/30 transition-colors"
                        >
                            <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                            <span className="text-white font-medium">{p.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Certifications;
