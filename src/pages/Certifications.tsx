import React from 'react';
import Hero, { DotTitle } from '../components/Hero';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Certifications: React.FC = () => {
    return (
        <div className="space-y-32">
            <Hero
                title={<>Global Industry<br /><DotTitle><span className="text-primary">Certifications</span></DotTitle></>}
                subtitle="We operate at the highest standards of automotive engineering, holding certifications from the world's most prestigious organizations."
                primaryCTA="Verify Status"
                secondaryCTA="About Us"
                badge="OEM+ COMPLIANT"
            />

            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold text-white">ASE Blue Seal of Excellence</h2>
                        <p className="text-white/40 leading-relaxed text-lg">
                            AutoSphere is proud to be an ASE Blue Seal facility. This means at least 75% of our technicians are ASE certified, and every area of service is covered by a certified professional.
                        </p>
                        <div className="flex items-center space-x-4 text-primary font-bold">
                            <ShieldCheck size={24} />
                            <span>Verified Facility #8892-ALPHA</span>
                        </div>
                    </div>
                    <div className="glass-card p-12 flex items-center justify-center relative overflow-hidden border-primary/20">
                        <div className="absolute inset-0 bg-primary/5"></div>
                        <Award size={120} className="text-primary relative z-10" />
                    </div>
                </div>

                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold text-white">Partner Endorsements</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Bosch Authorized Service', 'Brembo Master Partner', 'Michelin Certified Dealer', 'Ohlins Suspension Center', 'Liqui Moly Pro Service', 'Hunter Alignment Expert'].map((cert, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 flex items-center space-x-4 border-white/5"
                        >
                            <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                            <span className="text-white font-medium">{cert}</span>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Certifications;
