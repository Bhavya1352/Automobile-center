import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/** Wraps any ReactNode title so the terminal period moves to the front in RTL mode. */
export const DotTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { direction } = useLanguage();
    return (
        <>
            {direction === 'rtl' && <span className="text-primary">.</span>}
            {children}
            {direction === 'ltr' && <span className="text-primary">.</span>}
        </>
    );
};

interface HeroProps {
    title: React.ReactNode;
    subtitle: string;
    primaryCTA: string;
    secondaryCTA: string;
    image?: string;
    badge?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, primaryCTA, secondaryCTA, badge }) => {
    return (
        <section dir="ltr" className="relative min-h-[85vh] flex items-center pt-10 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {badge && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 glass-card !rounded-full text-primary font-medium text-sm"
                        >
                            <Star size={14} className="fill-primary" />
                            <span>{badge}</span>
                        </motion.div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                        {typeof title === 'string' ? title.split(' ').map((word, i) => (
                            <span key={i} className={word === 'Performance' || word === 'Service' ? 'text-primary block md:inline' : ''}>
                                {word}{' '}
                            </span>
                        )) : title}
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
                        {subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse rtl:sm:space-x-reverse pt-4">
                        <button className="btn-primary w-full sm:w-auto px-8 py-3 flex items-center justify-center space-x-2 rtl:space-x-reverse group">
                            <span>{primaryCTA}</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button className="btn-secondary w-full sm:w-auto px-8 py-3">
                            {secondaryCTA}
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-8 rtl:space-x-reverse pt-8 border-t border-white/10">
                        <div className="flex -space-x-3 rtl:space-x-reverse flex-shrink-0">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/100?img=${i * 10}`}
                                    alt={`User Avatar ${i}`}
                                    className="w-10 h-10 rounded-full border-2 border-secondary object-cover bg-white/10"
                                />
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center space-x-1 rtl:space-x-reverse text-primary">
                                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className="fill-current" />)}
                            </div>
                            <div className="text-xs sm:text-sm text-white/40 mt-1">Trusted by 10k+ automotive enthusiasts</div>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image / Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative lg:h-[600px] flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full scale-75" />
                    <div className="relative glass-card !bg-transparent border-white/10 w-full min-h-[350px] sm:aspect-video lg:aspect-square overflow-hidden mt-8 lg:mt-0">
                        {/* Hero Car Image */}
                        <img
                            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80&auto=format&fit=crop"
                            alt="High-performance sports car"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />

                        {/* Floating UI Elements */}
                        <div className="absolute top-4 right-4 sm:top-10 sm:right-10 glass-card p-3 sm:p-4 neon-glow border-primary/20 backdrop-blur-md z-20">
                            <div className="text-[8px] sm:text-xs text-white/40 uppercase mb-0.5 sm:mb-1 font-semibold">Engine Health</div>
                            <div className="text-base sm:text-xl font-bold text-primary">98.4%</div>
                        </div>

                        <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 glass-card p-3 sm:p-4 border-white/10 backdrop-blur-md z-20">
                            <div className="text-[8px] sm:text-xs text-white/40 uppercase mb-0.5 sm:mb-1 font-semibold">Service Time</div>
                            <div className="text-base sm:text-xl font-bold text-white">45m Avg.</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
