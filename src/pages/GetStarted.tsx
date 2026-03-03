import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, Shield, Zap, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const features = [
    {
        icon: Wrench,
        title: 'Guided Vehicle Onboarding',
        desc: 'Automated profile setup, service history import, and maintenance scheduling — ready in minutes.',
    },
    {
        icon: Shield,
        title: 'Warranty & Protection Tracking',
        desc: 'Track coverage, manage claims, and get alerts before your warranty expires.',
    },
    {
        icon: Zap,
        title: 'Real-Time Diagnostics',
        desc: 'Live engine telemetry, fault code alerts, and performance benchmarks from your dashboard.',
    },
];

const GetStarted: React.FC = () => {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({ name: '', company: '', email: '', password: '', confirm: '', agree: false });

    const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-primary/60 transition-colors";

    return (
        <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-16">
            {/* Two-card Container */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(16,185,129,0.15)' }}
            >
                {/* LEFT — Form Card */}
                <div className="flex-1 bg-[#0d1117] p-8 lg:p-10">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-6 justify-center">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                            <Car size={20} className="text-secondary" />
                        </div>
                        <span className="text-lg font-bold text-white">Auto<span className="text-primary">Sphere</span></span>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold text-white">Create an account</h1>
                        <p className="text-sm text-white/40 mt-1">Start your automotive journey with AutoSphere.</p>
                    </div>

                    <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-3">
                            <input name="name" value={form.name} onChange={handle} placeholder="Full Name" className={inputClass} />
                            <input name="company" value={form.company} onChange={handle} placeholder="Vehicle (e.g. Porsche 911)" className={inputClass} />
                        </div>

                        {/* Email */}
                        <input name="email" type="email" value={form.email} onChange={handle} placeholder="Work Email" className={inputClass} />

                        {/* Passwords */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Password" className={`${inputClass} pr-9`} />
                                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            <div className="relative">
                                <input name="confirm" type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={handle} placeholder="Confirm Password" className={`${inputClass} pr-9`} />
                                <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Tips */}
                        <div className="p-3 rounded-lg bg-white/3 border border-white/5">
                            <div className="text-xs text-white/30 font-semibold mb-2">Password tips</div>
                            <div className="grid grid-cols-2 gap-1.5 text-xs text-white/30">
                                <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className={form.password.length >= 12 ? 'text-primary' : 'text-white/15'} />Use 12+ characters</div>
                                <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className={/[A-Z]/.test(form.password) ? 'text-primary' : 'text-white/15'} />Mix upper & lower case</div>
                                <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className={/[0-9]/.test(form.password) ? 'text-primary' : 'text-white/15'} />Add a number</div>
                                <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className={/[^A-Za-z0-9]/.test(form.password) ? 'text-primary' : 'text-white/15'} />Add a symbol</div>
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" name="agree" checked={form.agree} onChange={handle} className="mt-0.5 accent-primary" />
                            <span className="text-xs text-white/30 leading-relaxed">
                                By creating an account, you agree to our{' '}
                                <span className="text-primary hover:underline cursor-pointer">Terms</span>
                                {' '}and{' '}
                                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                            </span>
                        </label>

                        {/* CTA */}
                        <button
                            type="submit"
                            disabled={!form.agree}
                            className="w-full py-2.5 rounded-lg font-bold text-sm text-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: form.agree ? '#10b981' : 'rgba(16,185,129,0.3)' }}
                        >
                            Create Account
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/8" />
                            <span className="text-xs text-white/20">Or sign up with</span>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/3 hover:bg-white/8 text-white/50 hover:text-white text-sm transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/3 hover:bg-white/8 text-white/50 hover:text-white text-sm transition-all">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.25.68 2.94.68.74 0 1.83-.8 3.34-.69 1.48.06 2.76.65 3.54 1.77-3.06 1.76-2.58 5.86.37 7.04-.68 1.69-1.45 3.36-2.19 4.17zm-3.32-15.01c-.13-3.17 2.51-5.59 5.5-5.27.35 3.19-2.74 5.76-5.5 5.27z" />
                                </svg>
                                Apple
                            </button>
                        </div>

                        <p className="text-center text-xs text-white/25">
                            Already have an account?{' '}
                            <a href="/user-dashboard" className="text-primary hover:underline font-medium">Log in</a>
                        </p>
                    </form>
                </div>

                {/* RIGHT — Features Card */}
                <div
                    className="lg:w-72 p-8 flex flex-col justify-between relative overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #0d2b1e 0%, #081510 100%)' }}
                >
                    {/* Glow */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-4">Built for Drivers</div>
                        <h2 className="text-2xl font-bold text-white leading-snug mb-6">
                            Service your vehicle<br />
                            <span className="text-primary">in minutes.</span>
                        </h2>

                        <div className="space-y-5">
                            {features.map((f) => (
                                <div key={f.title} className="flex items-start gap-3">
                                    <div className="w-7 h-7 bg-primary/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <f.icon size={14} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-semibold">{f.title}</div>
                                        <div className="text-white/35 text-xs mt-0.5 leading-relaxed">{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trial badge */}
                    <div
                        className="relative z-10 mt-6 p-4 rounded-xl"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                        <div className="text-xs font-bold text-primary mb-1">Included in free trial</div>
                        <div className="text-xs text-white/35 leading-relaxed">
                            Unlimited vehicle profiles for 30 days, full diagnostics access, and priority concierge support.
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GetStarted;
