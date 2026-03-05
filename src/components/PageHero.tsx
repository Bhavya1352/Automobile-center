import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
    badge: string;
    title: React.ReactNode;
    subtitle: string;
    icon?: React.ReactNode;
    breadcrumb?: string[];
}

const PageHero: React.FC<PageHeroProps> = ({ badge, title, subtitle, icon, breadcrumb }) => {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 flex items-center justify-center text-center">
            {/* Background glow orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Subtle grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-6">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
                >
                    {icon && <span>{icon}</span>}
                    {badge}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
                >
                    {title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                >
                    {subtitle}
                </motion.p>

                {/* Breadcrumb */}
                {breadcrumb && breadcrumb.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="flex items-center justify-center gap-2 text-sm text-white/30 font-medium"
                    >
                        {breadcrumb.map((crumb, i) => (
                            <React.Fragment key={crumb}>
                                {i > 0 && <span className="text-primary/50">›</span>}
                                <span className={i === breadcrumb.length - 1 ? 'text-primary' : ''}>{crumb}</span>
                            </React.Fragment>
                        ))}
                    </motion.div>
                )}

                {/* Accent line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-16 h-0.5 bg-primary mx-auto rounded-full"
                />
            </div>
        </section>
    );
};

export default PageHero;
