import React from 'react';
import Hero, { DotTitle } from '../components/Hero';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
    return (
        <div className="space-y-32">
            <Hero
                title={<><DotTitle>Get in Touch</DotTitle><br /><span className="text-primary">Precision Support <DotTitle>Request</DotTitle></span></>}
                subtitle="Our technical advisors are ready to assist you with performance upgrades, routine maintenance, or emergency diagnostics."
                primaryCTA="Call Now"
                secondaryCTA="Send Email"
                badge="24/7 TECHNICAL SUPPORT"
            />

            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">Connect with the Lab</h2>
                            <p className="text-white/40 leading-relaxed">
                                Reach out to our specialized service coordinators to schedule your next performance optimization or routine check.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="text-primary" size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold mb-1">Direct Line</div>
                                    <div className="text-white/40">+1 (555) 012-3456</div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="text-primary" size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold mb-1">Email Support</div>
                                    <div className="text-white/40">service@autosphere.tech</div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="text-primary" size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold mb-1">Our Garage</div>
                                    <div className="text-white/40">123 Performance Way, Sector 7, Gear City</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 glass-card border-primary/20 bg-primary/5">
                            <div className="flex items-center space-x-4 mb-4">
                                <Clock className="text-primary" size={24} />
                                <h3 className="text-xl font-bold text-white">Service Hours</h3>
                            </div>
                            <div className="space-y-2 text-sm text-white/60">
                                <div className="flex justify-between"><span>Mon - Fri:</span> <span>08:00 AM - 08:00 PM</span></div>
                                <div className="flex justify-between"><span>Saturday:</span> <span>09:00 AM - 05:00 PM</span></div>
                                <div className="flex justify-between text-primary font-bold"><span>Sunday:</span> <span>Emergency Only</span></div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass-card p-10 border-white/5"
                    >
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 px-1">Full Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" placeholder="John Doe" id="contact-name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 px-1">Email Address</label>
                                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" placeholder="john@example.com" id="contact-email" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 px-1">Service Type</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors appearance-none" id="contact-service">
                                    <option className="bg-secondary">Diagnostic Scan</option>
                                    <option className="bg-secondary">Performance Tuning</option>
                                    <option className="bg-secondary">Routine Maintenance</option>
                                    <option className="bg-secondary">Other Technical Inquiry</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 px-1">Message</label>
                                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" placeholder="Describe your service needs..." id="contact-message"></textarea>
                            </div>

                            <button className="btn-primary w-full flex items-center justify-center space-x-2 py-4">
                                <span>Send Request</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
