import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Car, Zap, Eye, EyeOff, CheckCircle2,
    Lock, Mail, User, ArrowRight, ArrowLeft, Star, Award, ShieldCheck
} from 'lucide-react';

const FEATURES = [
    {
        icon: Zap,
        title: 'Instant Calibration',
        desc: 'Automated telemetry profiles for high-performance engines.',
        color: 'text-primary'
    },
    {
        icon: ShieldCheck,
        title: 'Guardian Protocol',
        desc: 'Advanced warranty tracking and predictive maintenance.',
        color: 'text-primary'
    },
    {
        icon: Award,
        title: 'Master Access',
        desc: 'Direct line to European certified master technicians.',
        color: 'text-primary'
    },
];

const GetStarted: React.FC = () => {
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ name: '', vehicle: '', email: '', password: '', confirm: '', agree: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const inputClass = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-11 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300";

    const passwordStrength = () => {
        let score = 0;
        if (form.password.length >= 8) score++;
        if (/[A-Z]/.test(form.password)) score++;
        if (/[0-9]/.test(form.password)) score++;
        if (/[^A-Za-z0-9]/.test(form.password)) score++;
        return score;
    };

    return (
        <div className="min-h-screen bg-secondary relative overflow-hidden flex items-center justify-center px-4 py-20">
            {/* Back to Home Navigation */}
            <div className="absolute top-8 left-8 z-50">
                <a href="/" className="flex items-center gap-2 text-white/30 hover:text-primary transition-all font-bold uppercase tracking-widest text-[10px] group">
                    <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    Back to Laboratory
                </a>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl grid lg:grid-cols-[1fr_400px] glass-card shadow-2xl overflow-hidden border-white/5"
            >
                {/* ── LEFT: FORM PANEL ─────────────────────────────── */}
                <div className="p-8 lg:p-14 bg-gradient-to-b from-white/[0.01] to-transparent">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Car size={22} className="text-secondary" />
                        </div>
                        <span className="text-xl font-outfit font-bold tracking-tight text-white">Auto<span className="text-primary">Sphere</span></span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Create your account.</h1>
                        <p className="text-white/40 mt-2">Join the elite circle of performance enthusiasts.</p>
                    </div>

                    <form className="space-y-5" onSubmit={e => { e.preventDefault(); setIsSubmitting(true); setTimeout(() => setIsSubmitting(false), 2000); }}>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                <input name="name" value={form.name} onChange={handle} placeholder="Full Name" className={inputClass} />
                            </div>
                            <div className="relative group">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                <input name="vehicle" value={form.vehicle} onChange={handle} placeholder="Vehicle Model" className={inputClass} />
                            </div>
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                            <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address" className={inputClass} />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                            <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Password" className={inputClass} />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {form.password && (
                            <div className="space-y-2 px-1">
                                <div className="flex gap-1.5 h-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength() >= step ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/5'}`}
                                        />
                                    ))}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
                                    Strength: <span className={passwordStrength() >= 3 ? 'text-primary' : 'text-white/40'}>
                                        {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength() - 1] || 'None'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <label className="flex items-start gap-3 cursor-pointer group mt-2">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${form.agree ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-white/20'}`}>
                                {form.agree && <CheckCircle2 size={12} className="text-secondary" />}
                            </div>
                            <input type="checkbox" name="agree" checked={form.agree} onChange={handle} className="hidden" />
                            <span className="text-xs text-white/30 leading-relaxed font-medium">
                                I accept the <span className="text-white/60 hover:text-primary hover:underline transition-all">Service Protocols</span> and <span className="text-white/60 hover:text-primary hover:underline transition-all">Privacy Terms</span>.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={!form.agree || isSubmitting}
                            className="btn-primary w-full py-4 text-sm uppercase tracking-[0.2em] font-black group relative overflow-hidden disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary animate-spin rounded-full" />
                                ) : (
                                    <>Initiate Onboarding <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </span>
                        </button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10">Synchronize with</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: 'Google', icon: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' },
                                { name: 'Apple', icon: 'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.25.68 2.94.68.74 0 1.83-.8 3.34-.69 1.48.06 2.76.65 3.54 1.77-3.06 1.76-2.58 5.86.37 7.04-.68 1.69-1.45 3.36-2.19 4.17' }
                            ].map((s) => (
                                <button key={s.name} type="button" className="flex items-center justify-center gap-2 py-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-white/50 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={s.icon} /></svg>
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-xs text-white/20 mt-4">
                            Member already? <a href="/user-dashboard" className="text-primary font-bold hover:underline">Log in to Terminal</a>
                        </p>
                    </form>
                </div>

                {/* ── RIGHT: INFO PANEL ────────────────────────────── */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-[#020617] border-l border-white/5 relative">
                    {/* Visual embellishment */}
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Award size={140} className="text-primary" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-1 h-5 bg-primary rounded-full" />
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-primary">Priority Program</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                            The Future of <span className="text-primary">Performance Monitoring.</span>
                        </h2>

                        <div className="space-y-8">
                            {FEATURES.map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="flex gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group hover:scale-110 transition-transform">
                                        <f.icon className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm mb-1">{f.title}</div>
                                        <div className="text-white/30 text-xs leading-relaxed">{f.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border border-secondary bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Join 4.2k+ Owners</div>
                            </div>
                            <div className="flex items-center gap-1 text-primary mb-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                            </div>
                            <p className="text-[11px] italic text-white/30">"The only platform that truly understands my vehicle's heartbeat."</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GetStarted;
