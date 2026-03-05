import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import {
    Mail, Phone, MapPin, Send, Clock,
    ChevronDown, ChevronUp, MessageSquare, Headphones,
    AlertTriangle, CheckCircle, Car, Wrench, Zap, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ───────────────────────────────────────────────── */

const CONTACT_CHANNELS = [
    {
        icon: Phone,
        title: 'Direct Line',
        value: '+1 (555) 012-3456',
        sub: 'Mon – Sat, 8am – 7pm',
        cta: 'Call Now',
        href: 'tel:+15550123456',
    },
    {
        icon: Mail,
        title: 'Email Support',
        value: 'service@autosphere.tech',
        sub: 'Response within 2 hours',
        cta: 'Send Email',
        href: 'mailto:service@autosphere.tech',
    },
    {
        icon: MessageSquare,
        title: 'Live Chat',
        value: 'Chat with a Technician',
        sub: 'Available Mon – Fri, 9am – 6pm',
        cta: 'Open Chat',
        href: '#',
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        value: '123 Performance Drive',
        sub: 'Motorway District, Gear City',
        cta: 'Get Directions',
        href: '#',
    },
];

const RESPONSE_STATS = [
    { icon: Headphones, stat: '< 2 hrs', label: 'Email response time' },
    { icon: CheckCircle, stat: '98.4%', label: 'First-contact resolution rate' },
    { icon: Car, stat: 'Same day', label: 'Appointment availability (urgent)' },
    { icon: Clock, stat: '6 days', label: 'Service centre open per week' },
];

const SERVICE_OPTIONS = [
    'Diagnostic Scan',
    'Performance Tuning / ECU Remap',
    'Routine Maintenance & Service',
    'EV / Hybrid Specialist Check',
    'Suspension & Geometry Setup',
    'Pre-Purchase Vehicle Inspection',
    'Fleet Service Enquiry',
    'Emergency Breakdown Recovery',
    'Other Technical Inquiry',
];

const FAQS = [
    {
        q: 'How quickly can I get a booking?',
        a: 'For standard services, most slots are available within 2–3 working days. Urgent diagnostics and emergency work are accommodated same-day where possible — call our direct line to arrange.',
    },
    {
        q: 'Do you work on all vehicle makes and brands?',
        a: 'Yes. AutoSphere is a multi-brand facility with OEM-level scan tools for over 60 manufacturers, including European, Japanese, American, and electric vehicle brands.',
    },
    {
        q: 'What happens after I submit the contact form?',
        a: 'A service coordinator will review your request and contact you within 2 working hours (Mon–Sat) to confirm your booking details, provide a preliminary quote, and answer any questions.',
    },
    {
        q: 'Do you offer fleet or corporate service agreements?',
        a: 'Absolutely. We manage fleets of all sizes under bespoke service contracts — including scheduled maintenance, priority booking, and dedicated account management. Contact us to discuss your requirements.',
    },
    {
        q: 'Is there a warranty on repairs and services?',
        a: 'Yes. All work carried out at AutoSphere is covered by a comprehensive warranty on both parts and labour. Specific terms vary by service type — ask your coordinator for details.',
    },
    {
        q: 'Can I wait at the facility during my service?',
        a: 'Of course. Our client lounge offers high-speed Wi-Fi, specialty coffee, and live workshop display screens so you can stay connected and informed while we work.',
    },
];

/* ─── FAQ Item ───────────────────────────────────────────── */

const FAQItem: React.FC<{ q: string; a: string; index: number }> = ({ q, a, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
            className={`glass-card overflow-hidden transition-all ${open ? 'border-primary/30' : 'border-white/5'}`}
        >
            <button
                className="w-full flex items-center justify-between p-6 text-left gap-4"
                onClick={() => setOpen(o => !o)}
            >
                <span className="text-white font-semibold leading-snug">{q}</span>
                {open
                    ? <ChevronUp size={18} className="text-primary flex-shrink-0" />
                    : <ChevronDown size={18} className="text-white/30 flex-shrink-0" />}
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                    >
                        <p className="px-6 pb-6 text-white/40 text-sm leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ─── Main Component ─────────────────────────────────────── */

const Contact: React.FC = () => {
    return (
        <div className="pb-32">
            <PageHero
                badge="24/7 Technical Support"
                title={<>Get in <span className="text-primary">Touch.</span></>}
                subtitle="Our technical advisors are ready to assist you with performance upgrades, routine maintenance, or emergency diagnostics."
                breadcrumb={['Home', 'Contact']}
            />

            {/* ── Emergency Banner ── */}
            <section className="max-w-7xl mx-auto px-4 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-center gap-6 glass-card border-yellow-500/30 bg-yellow-500/5 p-6 rounded-2xl"
                >
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={24} className="text-yellow-400" />
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="text-white font-bold mb-1">Breakdown or Emergency?</div>
                        <p className="text-white/50 text-sm">We offer out-of-hours emergency recovery and diagnostics. Call our priority line and we'll get you moving.</p>
                    </div>
                    <a
                        href="tel:+15550129999"
                        className="btn-primary px-6 py-2.5 text-sm sm:ml-auto flex-shrink-0"
                    >
                        Emergency Line: +1 (555) 012-9999
                    </a>
                </motion.div>
            </section>

            {/* ── Contact Channels ── */}
            <section className="max-w-7xl mx-auto px-4 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ways to Reach Us</h2>
                    <p className="text-white/40 max-w-xl mx-auto">Pick the channel that works best for you. We're always available.</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {CONTACT_CHANNELS.map((ch, i) => (
                        <motion.div
                            key={ch.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-7 flex flex-col items-center text-center hover:border-primary/30 transition-all hover:-translate-y-1 duration-300 group"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                <ch.icon size={26} className="text-primary" />
                            </div>
                            <div className="text-white font-bold mb-1">{ch.title}</div>
                            <div className="text-primary text-sm font-medium mb-1">{ch.value}</div>
                            <div className="text-white/30 text-xs mb-6">{ch.sub}</div>
                            <a
                                href={ch.href}
                                className="btn-secondary text-xs px-5 py-2 mt-auto"
                            >
                                {ch.cta}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Response Stats ── */}
            <section className="max-w-7xl mx-auto px-4 mb-24">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {RESPONSE_STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-card p-6 flex flex-col items-center text-center"
                        >
                            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                <s.icon size={20} className="text-primary" />
                            </div>
                            <div className="text-2xl font-black text-primary mb-1">{s.stat}</div>
                            <div className="text-white/40 text-xs">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Form + Hours ── */}
            <section className="max-w-7xl mx-auto px-4 mb-24">
                <div className="grid lg:grid-cols-2 gap-14">

                    {/* Left — hours + quick services */}
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect with the Lab</h2>
                            <p className="text-white/40 leading-relaxed">
                                Reach out to our specialist service coordinators to schedule your next performance
                                optimisation, routine check, or urgent diagnostic. Every enquiry is handled by a
                                real technician — not a call centre.
                            </p>
                        </motion.div>

                        {/* Hours card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-8 border-primary/20 bg-primary/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-primary" size={22} />
                                <h3 className="text-xl font-bold text-white">Service Hours</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                {[
                                    { day: 'Monday – Friday', hours: '08:00 AM – 08:00 PM', highlight: false },
                                    { day: 'Saturday', hours: '09:00 AM – 05:00 PM', highlight: false },
                                    { day: 'Sunday', hours: 'Emergency Only', highlight: true },
                                ].map(row => (
                                    <div key={row.day} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-white/60">{row.day}</span>
                                        <span className={row.highlight ? 'text-primary font-bold' : 'text-white/80 font-medium'}>{row.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Services */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                        >
                            <h3 className="text-lg font-bold text-white mb-5">Most Requested Services</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Wrench, label: 'Routine Service' },
                                    { icon: Zap, label: 'Performance Tune' },
                                    { icon: Shield, label: 'Diagnostic Scan' },
                                    { icon: Car, label: 'Pre-Purchase Check' },
                                ].map(item => (
                                    <div key={item.label} className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
                                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <item.icon size={16} className="text-primary" />
                                        </div>
                                        <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card p-10 border-white/5"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">Send a Request</h3>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 px-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="contact-name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-white/20"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 px-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-white/20"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 px-1">Phone Number <span className="text-white/30">(optional)</span></label>
                                <input
                                    type="tel"
                                    id="contact-phone"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-white/20"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 px-1">Vehicle Make & Model</label>
                                <input
                                    type="text"
                                    id="contact-vehicle"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-white/20"
                                    placeholder="e.g. BMW M3 2022"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 px-1">Service Type</label>
                                <select
                                    id="contact-service"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors appearance-none text-white"
                                >
                                    {SERVICE_OPTIONS.map(opt => (
                                        <option key={opt} className="bg-secondary">{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 px-1">Message</label>
                                <textarea
                                    rows={4}
                                    id="contact-message"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-white/20 resize-none"
                                    placeholder="Describe your service needs or symptoms you've noticed..."
                                />
                            </div>

                            <button className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                                <span>Send Request</span>
                                <Send size={18} />
                            </button>

                            <p className="text-center text-white/20 text-xs">
                                We'll respond within 2 working hours · Mon – Sat
                            </p>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Quick answers to common questions. Can't find what you need? Just ask us directly.
                    </p>
                </motion.div>

                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Contact;
