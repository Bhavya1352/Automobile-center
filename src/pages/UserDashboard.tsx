import React, { useState } from 'react';
import {
    Car, Wrench, Clock, ShieldCheck, FileText, Settings,
    LayoutDashboard, CalendarCheck, AlertTriangle, CheckCircle2,
    Circle, Plus, Download, Star, TrendingUp, Bell, MessageSquare,
    Fuel, Gauge, MapPin, ChevronRight, BadgeCheck, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────── */

const tabs = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Car, label: 'My Vehicles' },
    { icon: Wrench, label: 'Service History' },
    { icon: CalendarCheck, label: 'Appointments' },
    { icon: FileText, label: 'Invoices' },
    { icon: Settings, label: 'Settings' },
];

const serviceSteps = [
    { label: 'Vehicle Check-In', done: true, date: 'Mar 1, 2026' },
    { label: 'Diagnostic Scan', done: true, date: 'Mar 1, 2026' },
    { label: 'ECU Performance Tune', done: false, date: 'In Progress' },
    { label: 'Quality Road Test', done: false, date: 'Pending' },
];

const appointments = [
    { id: 'SRV-9201', service: 'ECU Remap & Tune', date: 'Today, 14:30', tech: 'Amit D.', bay: 'Bay 3', status: 'In Progress', color: 'text-primary' },
    { id: 'SRV-8842', service: 'Brake System Overhaul', date: 'Mar 8, 2026', tech: 'Suresh P.', bay: 'Bay 1', status: 'Scheduled', color: 'text-yellow-400' },
    { id: 'SRV-8701', service: 'Full Service Audit', date: 'Mar 15, 2026', tech: 'Rajan K.', bay: 'TBD', status: 'Scheduled', color: 'text-yellow-400' },
    { id: 'SRV-8600', service: 'Tyre Rotation & Balancing', date: 'Mar 20, 2026', tech: 'Karan M.', bay: 'TBD', status: 'Pending', color: 'text-white/40' },
];

const invoices = [
    { id: 'INV-441', service: 'Nano Ceramic Coating', date: 'Feb 20, 2026', amount: '₹24,500', status: 'Paid', method: 'Card' },
    { id: 'INV-398', service: 'Transmission Service', date: 'Jan 10, 2026', amount: '₹11,200', status: 'Paid', method: 'UPI' },
    { id: 'INV-362', service: 'Engine Diagnostics', date: 'Dec 5, 2025', amount: '₹3,800', status: 'Paid', method: 'Cash' },
    { id: 'INV-310', service: 'Brake Pad Replacement', date: 'Nov 12, 2025', amount: '₹6,500', status: 'Paid', method: 'Card' },
    { id: 'INV-280', service: 'Oil & Filter Change', date: 'Oct 1, 2025', amount: '₹2,100', status: 'Paid', method: 'UPI' },
];

const serviceHistory = [
    { id: 'SRV-9001', service: 'Nano Ceramic Coating', date: 'Feb 20, 2026', tech: 'Rajan K.', cost: '₹24,500', status: 'Completed', rating: 5 },
    { id: 'SRV-8760', service: 'Transmission Service', date: 'Jan 10, 2026', tech: 'Amit D.', cost: '₹11,200', status: 'Completed', rating: 5 },
    { id: 'SRV-8520', service: 'Engine Diagnostics', date: 'Dec 5, 2025', tech: 'Suresh P.', cost: '₹3,800', status: 'Completed', rating: 4 },
    { id: 'SRV-8200', service: 'Brake Pad Replacement', date: 'Nov 12, 2025', tech: 'Karan M.', cost: '₹6,500', status: 'Completed', rating: 5 },
    { id: 'SRV-7980', service: 'Wheel Alignment & Balancing', date: 'Sep 8, 2025', tech: 'Deepak S.', cost: '₹2,800', status: 'Completed', rating: 4 },
    { id: 'SRV-7650', service: 'AC System Service', date: 'Jul 20, 2025', tech: 'Suresh P.', cost: '₹4,200', status: 'Completed', rating: 5 },
];

const vehicles = [
    {
        name: 'Porsche 911 GT3', reg: 'MH 01 AB 9201', year: '2024', fuel: 'Petrol',
        km: '12,450 km', warranty: 'Valid till 2028', status: 'In Service',
        nextService: '15,000 km', lastService: 'Dec 5, 2025', insurance: 'Valid till Mar 2027',
    },
    {
        name: 'BMW M4 Competition', reg: 'MH 01 XY 4420', year: '2022', fuel: 'Petrol',
        km: '28,100 km', warranty: 'Expired', status: 'At Home',
        nextService: '30,000 km', lastService: 'Jan 10, 2026', insurance: 'Valid till Nov 2026',
    },
];

const alerts = [
    { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-500/20', title: 'Tyre Rotation Due Soon', desc: 'Due at 15,000 km · Current: 12,450 km', action: 'Schedule' },
    { icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/20', title: 'BMW M4 Warranty Expired', desc: 'Extended warranty options available from AutoSphere', action: 'View Options' },
    { icon: Bell, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', title: 'Service Reminder', desc: 'Full audit for 911 GT3 due in 2 weeks', action: 'Book Now' },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

/* ─── Component ─────────────────────────────────────────── */

const UserDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const renderContent = () => {
        switch (activeTab) {

            case 'Dashboard':
                return (
                    <motion.div key="dashboard" {...fade} className="space-y-6">
                        {/* Welcome Banner */}
                        <div className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(10,10,15,0.8) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Premium Member</span>
                                    <span className="text-xs text-white/30">• Active</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white">Welcome back, Arjun 👋</h1>
                                <p className="text-white/40 text-sm mt-1">Porsche 911 GT3 is in Bay 3. Est. completion: 16:00 today.</p>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                                <button className="btn-primary px-5 py-2 text-sm">Book Service</button>
                                <button className="btn-secondary px-5 py-2 text-sm">View History</button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: Wrench, label: 'Services Done', value: '16', sub: '+2 this month' },
                                { icon: Clock, label: 'Next Service', value: '2,550 km', sub: 'Oil change due' },
                                { icon: Car, label: 'Active Vehicles', value: '2', sub: '1 in service now' },
                                { icon: ShieldCheck, label: 'Warranty', value: 'Active', sub: 'Until Dec 2028' },
                            ].map((s) => (
                                <div key={s.label} className="glass-card p-5 border-white/5 hover:border-primary/20 transition-colors">
                                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                                        <s.icon size={17} className="text-primary" />
                                    </div>
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</div>
                                    <div className="text-xs text-primary/80 mt-1">{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Progress + Vehicle */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 glass-card p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="font-bold text-white">Current Service Progress</h2>
                                        <p className="text-xs text-white/30 mt-0.5">SRV-9201 · ECU Remap & Tune · Bay 3 · Technician: Amit D.</p>
                                    </div>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">65% Complete</span>
                                </div>
                                <div className="space-y-4 mb-5">
                                    {serviceSteps.map((step, i) => (
                                        <div key={step.label} className="flex items-center gap-4">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-primary' : 'bg-white/5'}`}>
                                                {step.done ? <CheckCircle2 size={14} className="text-secondary" /> : <Circle size={14} className="text-white/20" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-sm font-medium ${step.done ? 'text-white' : 'text-white/40'}`}>{step.label}</div>
                                                <div className="text-xs text-white/20">{step.date}</div>
                                            </div>
                                            {i === 2 && <span className="text-xs text-primary font-bold animate-pulse">In Progress</span>}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-white/30 mb-1"><span>Overall Progress</span><span>65%</span></div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full" />
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <p className="text-xs text-white/30">Estimated completion: <span className="text-white/60 font-medium">Today, 16:00</span></p>
                                    <button className="text-xs text-primary hover:underline flex items-center gap-1">Track Live <ChevronRight size={12} /></button>
                                </div>
                            </div>

                            <div className="glass-card p-6 border-primary/20 relative overflow-hidden">
                                <Car size={100} className="absolute -right-6 -bottom-6 text-primary opacity-5" />
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-white">Primary Vehicle</h2>
                                    <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full font-bold">In Service</span>
                                </div>
                                <div className="text-xl font-bold text-white">Porsche 911</div>
                                <div className="text-sm text-primary mb-4">GT3 · 2024 · Petrol</div>
                                <div className="space-y-2.5 pt-4 border-t border-white/5 text-sm">
                                    {[
                                        { l: 'Reg.', v: 'MH 01 AB 9201' },
                                        { l: 'Odometer', v: '12,450 km' },
                                        { l: 'Next Service', v: '15,000 km' },
                                        { l: 'Warranty', v: 'Until 2028', g: true },
                                    ].map(r => (
                                        <div key={r.l} className="flex justify-between">
                                            <span className="text-white/30">{r.l}</span>
                                            <span className={r.g ? 'text-primary font-semibold' : 'text-white'}>{r.v}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full btn-secondary py-2 mt-4 text-sm">View Full Specs →</button>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div className="space-y-3">
                            {alerts.map((a, i) => (
                                <div key={i} className={`glass-card p-4 ${a.border} flex items-center gap-4`}>
                                    <div className={`w-9 h-9 ${a.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <a.icon size={18} className={a.color} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-semibold text-sm">{a.title}</div>
                                        <div className="text-white/40 text-xs mt-0.5">{a.desc}</div>
                                    </div>
                                    <button className="btn-secondary text-xs px-4 py-2 flex-shrink-0">{a.action}</button>
                                </div>
                            ))}
                        </div>

                        {/* ── Infographics Row ── */}
                        <div className="grid sm:grid-cols-3 gap-5">
                            {/* Donut — Service Mix */}
                            <div className="glass-card p-6 flex flex-col items-center">
                                <h3 className="text-white font-bold text-sm mb-4 self-start">Service Mix</h3>
                                <svg viewBox="0 0 120 120" className="w-28 h-28" style={{ transform: 'rotate(-90deg)' }}>
                                    {/* bg circle */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                                    {/* Performance 45% */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="14"
                                        strokeDasharray={`${45 * 2.827} ${Math.round((100 - 45) * 2.827)}`}
                                        strokeLinecap="round" />
                                    {/* Maintenance 33% */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="14"
                                        strokeDasharray={`${33 * 2.827} ${Math.round((100 - 33) * 2.827)}`}
                                        strokeDashoffset={`-${45 * 2.827}`}
                                        strokeLinecap="round" />
                                    {/* Detailing 22% */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="14"
                                        strokeDasharray={`${22 * 2.827} ${Math.round((100 - 22) * 2.827)}`}
                                        strokeDashoffset={`-${(45 + 33) * 2.827}`}
                                        strokeLinecap="round" />
                                </svg>
                                <div className="space-y-1.5 w-full mt-3">
                                    {[{ c: 'bg-primary', l: 'Performance', v: '45%' }, { c: 'bg-primary/35', l: 'Maintenance', v: '33%' }, { c: 'bg-primary/15', l: 'Detailing', v: '22%' }].map(d => (
                                        <div key={d.l} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${d.c}`} /><span className="text-white/40">{d.l}</span></div>
                                            <span className="text-white/60 font-bold">{d.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sparkline — Monthly Spend */}
                            <div className="glass-card p-6">
                                <h3 className="text-white font-bold text-sm mb-1">Monthly Spend</h3>
                                <p className="text-xs text-white/30 mb-4">Last 6 months</p>
                                <svg viewBox="0 0 200 70" className="w-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,60 L33,48 L66,54 L100,30 L133,38 L166,12 L200,6" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M0,60 L33,48 L66,54 L100,30 L133,38 L166,12 L200,6 L200,70 L0,70 Z" fill="url(#sparkGrad)" />
                                    {[[0, 60], [33, 48], [66, 54], [100, 30], [133, 38], [166, 12], [200, 6]].map(([x, y], i) => (
                                        <circle key={i} cx={x} cy={y} r="3" fill="#10b981" />
                                    ))}
                                </svg>
                                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => <span key={m}>{m}</span>)}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="text-xl font-bold text-primary">₹24.5k</div>
                                    <div className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">↑ Mar high</div>
                                </div>
                            </div>

                            {/* Health Gauges */}
                            <div className="glass-card p-6">
                                <h3 className="text-white font-bold text-sm mb-5">Vehicle Health</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Engine', pct: 91, color: '#10b981' },
                                        { label: 'Brakes', pct: 74, color: '#10b981' },
                                        { label: 'Tyres', pct: 62, color: '#f59e0b' },
                                        { label: 'Battery', pct: 88, color: '#10b981' },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white/50">{item.label}</span>
                                                <span className="font-bold" style={{ color: item.color }}>{item.pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.pct}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Loyalty + Spending */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="glass-card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Star size={16} className="text-primary" />
                                    </div>
                                    <h3 className="text-white font-bold">Loyalty Points</h3>
                                </div>
                                <div className="text-4xl font-black text-primary mb-1">2,840 <span className="text-lg text-white/30 font-normal">pts</span></div>
                                <p className="text-xs text-white/30 mb-4">Redeem at next service · 1,000 pts = ₹500</p>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                                    <div className="h-full w-[71%] bg-gradient-to-r from-primary/60 to-primary rounded-full" />
                                </div>
                                <p className="text-xs text-white/20">1,160 pts to next reward tier</p>
                            </div>
                            <div className="glass-card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <TrendingUp size={16} className="text-primary" />
                                    </div>
                                    <h3 className="text-white font-bold">Total Spent (2025–26)</h3>
                                </div>
                                <div className="text-4xl font-black text-white mb-1">₹48,100</div>
                                <p className="text-xs text-white/30 mb-4">Across 6 service visits</p>
                                <div className="space-y-1.5">
                                    {[
                                        { label: 'Performance', pct: 60 },
                                        { label: 'Maintenance', pct: 28 },
                                        { label: 'Detailing', pct: 12 },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center gap-3 text-xs">
                                            <span className="text-white/30 w-24">{item.label}</span>
                                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                                            </div>
                                            <span className="text-white/40 w-8 text-right">{item.pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'My Vehicles':
                return (
                    <motion.div key="vehicles" {...fade} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">My Garage</h2>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><Plus size={14} />Add Vehicle</button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {vehicles.map((v) => (
                                <div key={v.reg} className="glass-card p-6 border-white/5 hover:border-primary/30 transition-colors relative overflow-hidden">
                                    <Car size={80} className="absolute -right-4 -bottom-4 text-primary opacity-5" />
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <div className="text-lg font-bold text-white">{v.name}</div>
                                            <div className="text-sm text-primary">{v.year} · {v.fuel}</div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.status === 'In Service' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-primary/10 text-primary'}`}>{v.status}</span>
                                    </div>
                                    <div className="space-y-2.5 pt-4 border-t border-white/5 text-sm">
                                        {[
                                            { l: 'Reg. Number', v2: v.reg },
                                            { l: 'Mileage', v2: v.km },
                                            { l: 'Next Service', v2: v.nextService },
                                            { l: 'Last Service', v2: v.lastService },
                                            { l: 'Insurance', v2: v.insurance },
                                            { l: 'Warranty', v2: v.warranty },
                                        ].map(r => (
                                            <div key={r.l} className="flex justify-between">
                                                <span className="text-white/30">{r.l}</span>
                                                <span className={`${r.v2 === 'Expired' ? 'text-red-400' : 'text-white'} font-medium`}>{r.v2}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Health Bar */}
                                    <div className="mt-5 pt-4 border-t border-white/5">
                                        <div className="flex justify-between text-xs text-white/30 mb-1.5">
                                            <span>Vehicle Health Score</span>
                                            <span className="text-primary font-bold">{v.status === 'In Service' ? '87%' : '72%'}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full bg-gradient-to-r from-primary/60 to-primary`} style={{ width: v.status === 'In Service' ? '87%' : '72%' }} />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 btn-secondary py-2 text-xs">View Details</button>
                                        <button className="flex-1 btn-primary py-2 text-xs">Book Service</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vehicle Health Tips */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <BadgeCheck size={16} className="text-primary" /> AutoSphere Recommendations
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { icon: Gauge, label: 'Tyre Pressure Check', sub: 'Free of charge · Walk-in welcome' },
                                    { icon: Fuel, label: 'Fuel System Flush', sub: 'Recommended at 30,000 km for M4' },
                                    { icon: ShieldCheck, label: 'Extended Warranty', sub: 'Available for BMW M4 (expired)' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 hover:bg-primary/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <item.icon size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-medium">{item.label}</div>
                                            <div className="text-white/30 text-xs mt-0.5">{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Service History':
                return (
                    <motion.div key="history" {...fade} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Service History</h2>
                                <p className="text-xs text-white/30 mt-0.5">6 completed services · Total spent: ₹54,800</p>
                            </div>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"><Download size={14} />Download All</button>
                        </div>

                        {/* Summary Bar */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Total Services', value: '16' },
                                { label: 'Avg. Rating Given', value: '4.8 ★' },
                                { label: 'Amount Spent', value: '₹54,800' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-5 text-center">
                                    <div className="text-2xl font-bold text-primary">{s.value}</div>
                                    <div className="text-xs text-white/30 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card p-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                    <th className="text-left pb-3">Service ID</th>
                                    <th className="text-left pb-3">Service</th>
                                    <th className="text-left pb-3">Date</th>
                                    <th className="text-left pb-3">Technician</th>
                                    <th className="text-right pb-3">Cost</th>
                                    <th className="text-center pb-3">Rating</th>
                                    <th className="text-right pb-3">Action</th>
                                </tr></thead>
                                <tbody>
                                    {serviceHistory.map(s => (
                                        <tr key={s.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                            <td className="py-3 text-primary font-mono text-xs">{s.id}</td>
                                            <td className="py-3 text-white font-medium">{s.service}</td>
                                            <td className="py-3 text-white/50">{s.date}</td>
                                            <td className="py-3 text-white/50">{s.tech}</td>
                                            <td className="py-3 text-white font-semibold text-right">{s.cost}</td>
                                            <td className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    {Array.from({ length: s.rating }).map((_, i) => (
                                                        <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 text-right">
                                                <button className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary text-white/50 transition-colors">Receipt</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );

            case 'Appointments':
                return (
                    <motion.div key="appointments" {...fade} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">My Appointments</h2>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><Plus size={14} />Book New</button>
                        </div>

                        <div className="space-y-4">
                            {appointments.map(apt => (
                                <div key={apt.id} className="glass-card p-6 hover:border-primary/20 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Wrench size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">{apt.service}</div>
                                                <div className="text-xs text-white/30 mt-0.5">{apt.id} · {apt.date}</div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                                        <MapPin size={10} className="text-primary" /> {apt.bay}
                                                    </span>
                                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                                        <BadgeCheck size={10} className="text-primary" /> {apt.tech}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-bold ${apt.color}`}>{apt.status}</span>
                                            <button className="btn-secondary px-4 py-2 text-xs">Details</button>
                                            {apt.status === 'Scheduled' && <button className="text-xs text-red-400 hover:underline">Cancel</button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Book */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-white mb-4">Quick Book a Service</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { icon: Wrench, label: 'Oil Change' },
                                    { icon: Gauge, label: 'Tyre Service' },
                                    { icon: ShieldCheck, label: 'Full Audit' },
                                    { icon: TrendingUp, label: 'Performance' },
                                ].map(item => (
                                    <button key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/3 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all group">
                                        <item.icon size={20} className="text-white/30 group-hover:text-primary transition-colors" />
                                        <span className="text-xs text-white/40 group-hover:text-white">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Invoices':
                return (
                    <motion.div key="invoices" {...fade} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Invoices</h2>
                                <p className="text-xs text-white/30 mt-0.5">5 invoices · All paid</p>
                            </div>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"><Download size={14} />Export All</button>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: CreditCard, label: 'Total Paid', value: '₹48,100' },
                                { icon: FileText, label: 'Invoices', value: '5' },
                                { icon: CheckCircle2, label: 'Outstanding', value: '₹0' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <s.icon size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{s.value}</div>
                                        <div className="text-xs text-white/30">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card p-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                    <th className="text-left pb-3">Invoice ID</th>
                                    <th className="text-left pb-3">Service</th>
                                    <th className="text-left pb-3">Date</th>
                                    <th className="text-left pb-3">Method</th>
                                    <th className="text-right pb-3">Amount</th>
                                    <th className="text-right pb-3">Status</th>
                                </tr></thead>
                                <tbody>
                                    {invoices.map(inv => (
                                        <tr key={inv.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                            <td className="py-3 text-primary font-mono text-xs">{inv.id}</td>
                                            <td className="py-3 text-white font-medium">{inv.service}</td>
                                            <td className="py-3 text-white/50">{inv.date}</td>
                                            <td className="py-3">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{inv.method}</span>
                                            </td>
                                            <td className="py-3 text-white font-bold text-right">{inv.amount}</td>
                                            <td className="py-3 text-right">
                                                <span className="text-xs text-primary font-bold">● {inv.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs text-white/20">5 invoices · FY 2025–26</span>
                                <span className="text-sm font-bold text-white">Total: <span className="text-primary">₹48,100</span></span>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Settings':
                return (
                    <motion.div key="settings" {...fade} className="space-y-5 max-w-2xl">
                        <h2 className="text-xl font-bold text-white">Account Settings</h2>

                        <div className="glass-card p-6 space-y-5">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { l: 'Full Name', v: 'Arjun Mehta' },
                                    { l: 'Phone Number', v: '+91 98765 43210' },
                                    { l: 'Email', v: 'arjun@example.com' },
                                    { l: 'City', v: 'Mumbai' },
                                ].map(f => (
                                    <div key={f.l}>
                                        <label className="text-xs text-white/40 mb-1.5 block">{f.l}</label>
                                        <input defaultValue={f.v} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <button className="btn-primary px-6 py-2 text-sm">Save Changes</button>
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Notifications</h3>
                            {[
                                'Service reminders via SMS',
                                'Invoice receipts via email',
                                'Appointment confirmations',
                                'Promotional offers & deals',
                            ].map(n => (
                                <label key={n} className="flex items-center justify-between cursor-pointer py-0.5">
                                    <span className="text-white/60 text-sm">{n}</span>
                                    <div className="w-10 h-5 bg-primary/30 rounded-full relative">
                                        <div className="w-4 h-4 bg-primary rounded-full absolute top-0.5 right-0.5" />
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Membership</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-bold">Premium Plan</div>
                                    <div className="text-xs text-white/30 mt-0.5">Renews Apr 1, 2027 · ₹4,999 / year</div>
                                </div>
                                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Active</span>
                            </div>
                            <button className="btn-secondary px-5 py-2 text-sm">Manage Plan</button>
                        </div>

                        <div className="glass-card p-6 border-red-500/20">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3 mb-4">Danger Zone</h3>
                            <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Delete Account</button>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-secondary">
            {/* Tab Bar */}
            <div className="border-b border-white/5 bg-secondary/95 backdrop-blur-sm sticky top-[96px] z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.label ? 'border-primary text-primary' : 'border-transparent text-white/40 hover:text-white'}`}
                            >
                                <tab.icon size={15} />
                                {tab.label}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center gap-3 py-2 pl-4 flex-shrink-0">
                            <button className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5">
                                <Plus size={12} /> Book Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserDashboard;
