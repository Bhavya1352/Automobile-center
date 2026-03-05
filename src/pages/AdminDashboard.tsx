import React, { useState } from 'react';
import {
    Users, LayoutDashboard, Settings, Wrench, BarChart3, Bell,
    Search, UserPlus, Download, FileText, Car, AlertTriangle,
    CheckCircle2, Star, Package, MessageSquare,
    Shield, ChevronRight, Zap, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────── */

const tabs = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Users, label: 'Customers' },
    { icon: Wrench, label: 'Technicians' },
    { icon: BarChart3, label: 'Revenue' },
    { icon: Car, label: 'Vehicles' },
    { icon: Settings, label: 'Settings' },
];

const serviceQueue = [
    { id: 'SRV-9201', customer: 'Arjun Mehta', service: 'ECU Remap & Tune', bay: 'Bay 3', tech: 'Amit D.', status: 'In Progress', eta: '16:00' },
    { id: 'SRV-9194', customer: 'Priya Sharma', service: 'Full 150-pt Audit', bay: 'Bay 1', tech: 'Rajan K.', status: 'Awaiting Parts', eta: 'Mar 5' },
    { id: 'SRV-9188', customer: 'Vikram Singh', service: 'Brake Optimisation', bay: 'Bay 5', tech: 'Suresh P.', status: 'In Progress', eta: '18:00' },
    { id: 'SRV-9176', customer: 'Neha Kapoor', service: 'Oil & Filter Change', bay: 'Bay 2', tech: 'Deepak S.', status: 'Completed', eta: 'Done' },
    { id: 'SRV-9165', customer: 'Rohit Verma', service: 'Suspension Geometry', bay: 'Bay 4', tech: 'Karan M.', status: 'In Progress', eta: '17:30' },
];

const allCustomers = [
    { name: 'Arjun Mehta', vehicle: 'Porsche 911 GT3', date: 'Mar 3, 2026', visits: 14, plan: 'Premium', status: 'Active', spent: '₹1.8L' },
    { name: 'Priya Sharma', vehicle: 'BMW M4 Competition', date: 'Mar 2, 2026', visits: 9, plan: 'Basic', status: 'Active', spent: '₹82k' },
    { name: 'Vikram Singh', vehicle: 'Mercedes AMG C63', date: 'Mar 1, 2026', visits: 6, plan: 'Premium', status: 'Active', spent: '₹1.1L' },
    { name: 'Neha Kapoor', vehicle: 'Audi RS5 Sportback', date: 'Feb 28, 2026', visits: 3, plan: 'Basic', status: 'Completed', spent: '₹34k' },
    { name: 'Rohit Verma', vehicle: 'Toyota Supra GR', date: 'Feb 21, 2026', visits: 11, plan: 'Premium', status: 'Active', spent: '₹2.4L' },
    { name: 'Anjali Das', vehicle: 'Ford Mustang GT', date: 'Feb 15, 2026', visits: 2, plan: 'Basic', status: 'Inactive', spent: '₹18k' },
];

const technicians = [
    { name: 'Rajan Kumar', role: 'Senior Mechanic', specialty: 'Engine & Diagnostics', status: 'On Duty', services: 142, rating: 4.9, currentJob: 'SRV-9194' },
    { name: 'Suresh Patil', role: 'Mechanic', specialty: 'Transmission & Brakes', status: 'On Duty', services: 98, rating: 4.7, currentJob: 'SRV-9188' },
    { name: 'Amit Desai', role: 'ECU Specialist', specialty: 'Performance Tuning', status: 'On Duty', services: 87, rating: 4.9, currentJob: 'SRV-9201' },
    { name: 'Karan Mehta', role: 'Detailing Expert', specialty: 'Ceramic & Paint', status: 'On Break', services: 114, rating: 4.8, currentJob: 'SRV-9165' },
    { name: 'Pooja Sharma', role: 'Service Advisor', specialty: 'Customer & Billing', status: 'On Duty', services: 203, rating: 5.0, currentJob: 'Front Desk' },
    { name: 'Deepak Singh', role: 'Junior Mechanic', specialty: 'General Maintenance', status: 'Off Today', services: 45, rating: 4.5, currentJob: '—' },
];

const revenueMonths = [
    { month: 'Oct', revenue: '₹5.2L', jobs: 51, growth: null },
    { month: 'Nov', revenue: '₹6.1L', jobs: 58, growth: '+17%' },
    { month: 'Dec', revenue: '₹7.0L', jobs: 64, growth: '+15%' },
    { month: 'Jan', revenue: '₹6.8L', jobs: 62, growth: '-3%' },
    { month: 'Feb', revenue: '₹7.9L', jobs: 71, growth: '+16%' },
    { month: 'Mar', revenue: '₹8.4L', jobs: 48, growth: '+6% ↑' },
];

const workshopVehicles = [
    { reg: 'MH 01 AB 9201', name: 'Porsche 911 GT3', owner: 'Arjun Mehta', bay: 'Bay 3', status: 'In Service', eta: '16:00 Today', service: 'ECU Remap' },
    { reg: 'MH 05 CD 4420', name: 'BMW M4 Competition', owner: 'Priya Sharma', bay: 'Bay 1', status: 'Awaiting Parts', eta: 'Mar 5, 2026', service: 'Full Audit' },
    { reg: 'DL 08 FG 7711', name: 'Mercedes AMG C63', owner: 'Vikram Singh', bay: 'Bay 5', status: 'In Service', eta: '18:00 Today', service: 'Brake Optimisation' },
    { reg: 'KA 02 HJ 3390', name: 'Audi RS5 Sportback', owner: 'Neha Kapoor', bay: 'Bay 2', status: 'Ready for Pickup', eta: 'Now', service: 'Oil & Filter' },
    { reg: 'MH 12 PQ 6620', name: 'Toyota Supra GR', owner: 'Rohit Verma', bay: 'Bay 4', status: 'In Service', eta: '17:30 Today', service: 'Suspension Setup' },
];

const activityLog = [
    { icon: UserPlus, text: 'New booking — Arjun Mehta (SRV-9201)', time: '4 min ago', type: 'info' },
    { icon: CheckCircle2, text: 'SRV-9176 completed — Neha Kapoor · Oil & Filter', time: '22 min ago', type: 'success' },
    { icon: AlertTriangle, text: 'Bay 6 flagged for equipment maintenance', time: '1h ago', type: 'warn' },
    { icon: Bell, text: 'Monthly revenue target 84% achieved', time: '3h ago', type: 'info' },
    { icon: Package, text: 'Parts order placed — Brembo Callipers (SRV-9194)', time: '4h ago', type: 'info' },
    { icon: Star, text: '5-star review received from Rohit Verma', time: '6h ago', type: 'success' },
];

const topServices = [
    { name: 'ECU Remap & Performance Tune', count: 38, revenue: '₹2.1L', pct: 100 },
    { name: 'Full 150-Point Service Audit', count: 31, revenue: '₹1.7L', pct: 82 },
    { name: 'Ceramic Coating & Detailing', count: 27, revenue: '₹1.3L', pct: 71 },
    { name: 'Brake System Overhaul', count: 22, revenue: '₹88k', pct: 58 },
    { name: 'Transmission Service', count: 18, revenue: '₹72k', pct: 47 },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

/* ─── Component ─────────────────────────────────────────── */

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [search, setSearch] = useState('');

    const renderContent = () => {
        switch (activeTab) {

            case 'Overview':
                return (
                    <motion.div key="overview" {...fade} className="space-y-6">
                        {/* Welcome */}
                        <div className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(180,30,30,0.08) 100%)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">Admin Access</span>
                                    <span className="text-xs text-white/30">• Workshop Command · Thu 5 Mar, 2026</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white">Welcome, Administrator 🔧</h1>
                                <p className="text-white/40 text-sm mt-1">5 vehicles in workshop · 9 technicians on duty · Revenue target 84% achieved.</p>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                                <button className="btn-primary px-5 py-2 text-sm flex items-center gap-2"><UserPlus size={14} />Add Booking</button>
                                <button className="btn-secondary px-5 py-2 text-sm flex items-center gap-2"><Download size={14} />Export</button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: BarChart3, label: 'Monthly Revenue', value: '₹8.4L', sub: '+8.2% vs last month', col: 'text-primary' },
                                { icon: Bell, label: 'Active Bookings', value: '48', sub: '12 live today', col: 'text-yellow-400' },
                                { icon: Wrench, label: 'Technicians On Duty', value: '9', sub: '2 on break · 1 off', col: 'text-primary' },
                                { icon: Users, label: 'Satisfaction Score', value: '97%', sub: '↑ from 94% last month', col: 'text-primary' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-5 border-white/5 hover:border-primary/20 transition-colors">
                                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-3"><s.icon size={17} className="text-primary" /></div>
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</div>
                                    <div className={`text-xs ${s.col} mt-1`}>{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Queue + Activity */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 glass-card p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-bold text-white">Live Service Queue</h2>
                                    <button className="text-xs text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
                                </div>
                                <div className="space-y-3">
                                    {serviceQueue.map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'Completed' ? 'bg-primary' : s.status === 'In Progress' ? 'bg-yellow-400' : 'bg-white/20'}`} />
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-white truncate">{s.customer}</div>
                                                    <div className="text-xs text-white/30 truncate">{s.id} · {s.service} · {s.tech}</div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-xs text-white/50">{s.bay} · ETA {s.eta}</div>
                                                <div className={`text-xs font-bold ${s.status === 'Completed' ? 'text-primary' : s.status === 'In Progress' ? 'text-yellow-400' : 'text-white/40'}`}>{s.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-white">Activity Log</h2>
                                    <button className="text-xs text-primary hover:underline">View all →</button>
                                </div>
                                <div className="space-y-4">
                                    {activityLog.map((a, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${a.type === 'success' ? 'bg-primary/10' : a.type === 'warn' ? 'bg-yellow-400/10' : 'bg-white/5'}`}>
                                                <a.icon size={12} className={a.type === 'success' ? 'text-primary' : a.type === 'warn' ? 'text-yellow-400' : 'text-white/40'} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-white/70 leading-snug">{a.text}</div>
                                                <div className="text-[10px] text-white/25 mt-0.5">{a.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bay Status + Quick Actions + System Health */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="glass-card p-6">
                                <h2 className="font-bold text-white mb-4">Bay Status</h2>
                                <div className="space-y-2.5">
                                    {[
                                        { l: 'Bay 1 — Rajan K.', c: 'text-yellow-400', s: 'Occupied' },
                                        { l: 'Bay 2 — Suresh P.', c: 'text-yellow-400', s: 'Occupied' },
                                        { l: 'Bay 3 — Amit D.', c: 'text-yellow-400', s: 'Occupied' },
                                        { l: 'Bay 4 — Karan M.', c: 'text-yellow-400', s: 'Occupied' },
                                        { l: 'Bay 5 — Deepak S.', c: 'text-yellow-400', s: 'Occupied' },
                                        { l: 'Bay 6 — Maintenance', c: 'text-red-400', s: 'Offline' },
                                        { l: 'Bay 7 — Empty', c: 'text-primary', s: 'Free' },
                                    ].map(item => (
                                        <div key={item.l} className="flex justify-between text-sm">
                                            <span className="text-white/50">{item.l}</span>
                                            <span className={`text-xs font-bold ${item.c}`}>{item.s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h2 className="font-bold text-white mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { icon: UserPlus, label: 'Add Customer' },
                                        { icon: FileText, label: 'Reports' },
                                        { icon: Package, label: 'Inventory' },
                                        { icon: Bell, label: 'Alerts' },
                                        { icon: MessageSquare, label: 'Messages' },
                                        { icon: Settings, label: 'Settings' },
                                    ].map(a => (
                                        <button key={a.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/3 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all group">
                                            <a.icon size={18} className="text-white/30 group-hover:text-primary transition-colors" />
                                            <span className="text-xs text-white/40 group-hover:text-white">{a.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-white">System Health</h2>
                                    <span className="text-xs text-primary font-bold">Mostly Operational</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { l: 'Diagnostic Network', s: '99.98%', ok: true },
                                        { l: 'Booking Database', s: '99.97%', ok: true },
                                        { l: 'Payment Gateway', s: '100%', ok: true },
                                        { l: 'Client Portal', s: '100%', ok: true },
                                        { l: 'Bay 6 Equipment', s: 'Degraded', ok: false },
                                        { l: 'CCTV System', s: 'Operational', ok: true },
                                    ].map(s => (
                                        <div key={s.l} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-primary' : 'bg-yellow-400'}`} />
                                                <span className="text-white/50">{s.l}</span>
                                            </div>
                                            <span className={`text-xs font-bold ${s.ok ? 'text-primary' : 'text-yellow-400'}`}>{s.s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Infographics Row ── */}
                        <div className="grid sm:grid-cols-3 gap-5">

                            {/* Donut — Revenue Source */}
                            <div className="glass-card p-6 flex flex-col items-center">
                                <h3 className="text-white font-bold text-sm mb-4 self-start">Revenue by Source</h3>
                                <svg viewBox="0 0 120 120" className="w-28 h-28" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                                    {/* ECU/Performance 40% */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="14"
                                        strokeDasharray={`${40 * 2.827} ${Math.round((100 - 40) * 2.827)}`} strokeLinecap="round" />
                                    {/* Maintenance 35% */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="14"
                                        strokeDasharray={`${35 * 2.827} ${Math.round((100 - 35) * 2.827)}`}
                                        strokeDashoffset={`-${40 * 2.827}`} strokeLinecap="round" />
                                    {/* Detailing 25% */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="14"
                                        strokeDasharray={`${25 * 2.827} ${Math.round((100 - 25) * 2.827)}`}
                                        strokeDashoffset={`-${(40 + 35) * 2.827}`} strokeLinecap="round" />
                                </svg>
                                <div className="space-y-1.5 w-full mt-3">
                                    {[
                                        { c: 'bg-primary', l: 'ECU / Performance', v: '40%' },
                                        { c: 'bg-primary/40', l: 'Maintenance', v: '35%' },
                                        { c: 'bg-primary/15', l: 'Detailing', v: '25%' },
                                    ].map(d => (
                                        <div key={d.l} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${d.c}`} /><span className="text-white/40">{d.l}</span></div>
                                            <span className="text-white/60 font-bold">{d.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sparkline — Revenue Trend */}
                            <div className="glass-card p-6">
                                <h3 className="text-white font-bold text-sm mb-1">Revenue Trend</h3>
                                <p className="text-xs text-white/30 mb-4">Oct 2025 – Mar 2026</p>
                                <svg viewBox="0 0 200 70" className="w-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="adminSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,62 L40,52 L80,40 L120,44 L160,20 L200,8"
                                        fill="none" stroke="#10b981" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M0,62 L40,52 L80,40 L120,44 L160,20 L200,8 L200,70 L0,70 Z"
                                        fill="url(#adminSparkGrad)" />
                                    {[[0, 62], [40, 52], [80, 40], [120, 44], [160, 20], [200, 8]].map(([x, y], i) => (
                                        <circle key={i} cx={x} cy={y} r="3.5" fill="#10b981" />
                                    ))}
                                </svg>
                                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => <span key={m}>{m}</span>)}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="text-xl font-bold text-primary">₹8.4L</div>
                                    <div className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">↑ Record month</div>
                                </div>
                            </div>

                            {/* Technician Workload */}
                            <div className="glass-card p-6">
                                <h3 className="text-white font-bold text-sm mb-5">Technician Workload</h3>
                                <div className="space-y-3.5">
                                    {[
                                        { name: 'Rajan K.', pct: 95 },
                                        { name: 'Suresh P.', pct: 82 },
                                        { name: 'Amit D.', pct: 78 },
                                        { name: 'Karan M.', pct: 60 },
                                        { name: 'Pooja S.', pct: 100 },
                                    ].map(t => (
                                        <div key={t.name}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white/50">{t.name}</span>
                                                <span className={`font-bold ${t.pct >= 90 ? 'text-yellow-400' : 'text-primary'}`}>{t.pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${t.pct}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className={`h-full rounded-full ${t.pct >= 90 ? 'bg-yellow-400' : 'bg-primary'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Services */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-white">Top Services This Month</h2>
                                <span className="text-xs text-white/30">Mar 2026</span>
                            </div>
                            <div className="space-y-4">
                                {topServices.map(svc => (
                                    <div key={svc.name}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-white/70 text-sm">{svc.name}</span>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="text-white/30">{svc.count} jobs</span>
                                                <span className="text-primary font-bold">{svc.revenue}</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${svc.pct}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Customers':
                return (
                    <motion.div key="customers" {...fade} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Customer Management</h2>
                                <p className="text-xs text-white/30 mt-0.5">6 customers shown · 4 active</p>
                            </div>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><UserPlus size={14} />Add Customer</button>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Total Customers', value: '214' },
                                { label: 'Active This Month', value: '48' },
                                { label: 'Premium Members', value: '91' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-5 text-center">
                                    <div className="text-2xl font-bold text-primary">{s.value}</div>
                                    <div className="text-xs text-white/30 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10 flex-1 max-w-xs">
                                    <Search size={14} className="text-white/30" />
                                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/20" />
                                </div>
                                <button className="btn-secondary px-4 py-2 text-xs flex items-center gap-1"><Download size={12} />Export</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                        <th className="text-left pb-3">Customer</th>
                                        <th className="text-left pb-3">Vehicle</th>
                                        <th className="text-left pb-3">Last Visit</th>
                                        <th className="text-center pb-3">Visits</th>
                                        <th className="text-right pb-3">Total Spent</th>
                                        <th className="text-left pb-3">Plan</th>
                                        <th className="text-left pb-3">Status</th>
                                        <th className="text-right pb-3">Action</th>
                                    </tr></thead>
                                    <tbody>
                                        {allCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                                            <tr key={c.name} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                                <td className="py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{c.name[0]}</div><span className="text-white font-medium">{c.name}</span></div></td>
                                                <td className="py-3 text-white/50">{c.vehicle}</td>
                                                <td className="py-3 text-white/50">{c.date}</td>
                                                <td className="py-3 text-center text-white/60 font-mono">{c.visits}</td>
                                                <td className="py-3 text-right text-primary font-semibold">{c.spent}</td>
                                                <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.plan === 'Premium' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'}`}>{c.plan}</span></td>
                                                <td className="py-3"><span className={`text-xs font-bold ${c.status === 'Active' ? 'text-primary' : c.status === 'Inactive' ? 'text-red-400' : 'text-white/30'}`}>● {c.status}</span></td>
                                                <td className="py-3 text-right">
                                                    <button className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary text-white/50 transition-colors mr-1">Edit</button>
                                                    <button className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/50 transition-colors">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Technicians':
                return (
                    <motion.div key="technicians" {...fade} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Technician Management</h2>
                                <p className="text-xs text-white/30 mt-0.5">6 technicians · 4 on duty today</p>
                            </div>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><UserPlus size={14} />Add Technician</button>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'On Duty', value: '4' },
                                { label: 'On Break', value: '1' },
                                { label: 'Off Today', value: '1' },
                                { label: 'Avg. Rating', value: '4.8★' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-4 text-center">
                                    <div className="text-xl font-bold text-primary">{s.value}</div>
                                    <div className="text-xs text-white/30 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {technicians.map(t => (
                                <div key={t.name} className="glass-card p-5 border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">{t.name[0]}</div>
                                            <div>
                                                <div className="text-white font-semibold text-sm">{t.name}</div>
                                                <div className="text-xs text-primary">{t.role}</div>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.status === 'On Duty' ? 'bg-primary/10 text-primary' : t.status === 'On Break' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-white/5 text-white/30'}`}>{t.status}</span>
                                    </div>
                                    <div className="text-xs text-white/40 mb-3">{t.specialty}</div>
                                    <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
                                        <div className="flex justify-between"><span className="text-white/30">Services completed</span><span className="text-white font-bold">{t.services}</span></div>
                                        <div className="flex justify-between"><span className="text-white/30">Rating</span>
                                            <span className="text-yellow-400 font-bold flex items-center gap-1"><Star size={10} className="fill-yellow-400" />{t.rating}</span>
                                        </div>
                                        <div className="flex justify-between"><span className="text-white/30">Current job</span><span className="text-primary font-mono">{t.currentJob}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'Revenue':
                return (
                    <motion.div key="revenue" {...fade} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                                <p className="text-xs text-white/30 mt-0.5">Financial year Oct 2025 – Mar 2026</p>
                            </div>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"><Download size={14} />Export Report</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Revenue (6M)', value: '₹41.4L', up: true },
                                { label: 'This Month', value: '₹8.4L', up: true },
                                { label: 'Avg. Per Job', value: '₹17,500', up: null },
                                { label: 'Outstanding', value: '₹0', up: null },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-5">
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-xs text-white/30 mt-1">{s.label}</div>
                                    {s.up && <div className="text-xs text-primary font-bold mt-2">↑ Growing</div>}
                                </div>
                            ))}
                        </div>

                        {/* Bar Chart Visual */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-white mb-6">Monthly Revenue Bar</h3>
                            <div className="flex items-end gap-4 h-40">
                                {revenueMonths.map((m, i) => {
                                    const vals = [5.2, 6.1, 7.0, 6.8, 7.9, 8.4];
                                    const maxV = Math.max(...vals);
                                    const hPct = (vals[i] / maxV) * 100;
                                    return (
                                        <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="text-xs text-primary font-bold">{m.revenue}</div>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${hPct}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                                className={`w-full rounded-t-lg ${i === revenueMonths.length - 1 ? 'bg-primary' : 'bg-primary/30'}`}
                                            />
                                            <div className="text-xs text-white/30">{m.month}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-bold text-white mb-5">Monthly Breakdown</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                        <th className="text-left pb-3">Month</th>
                                        <th className="text-right pb-3">Revenue</th>
                                        <th className="text-right pb-3">Jobs</th>
                                        <th className="text-right pb-3">Avg/Job</th>
                                        <th className="text-right pb-3">Growth</th>
                                    </tr></thead>
                                    <tbody>
                                        {revenueMonths.map((m) => (
                                            <tr key={m.month} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                                <td className="py-3 text-white font-medium">{m.month} 2026</td>
                                                <td className="py-3 text-primary font-bold text-right">{m.revenue}</td>
                                                <td className="py-3 text-white/50 text-right">{m.jobs} jobs</td>
                                                <td className="py-3 text-white/40 text-right font-mono text-xs">
                                                    {`₹${Math.round((parseFloat(m.revenue.replace('₹', '').replace('L', '')) * 100000) / m.jobs / 1000)}k`}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className={`text-xs font-bold ${m.growth?.startsWith('-') ? 'text-red-400' : m.growth ? 'text-primary' : 'text-white/30'}`}>
                                                        {m.growth ?? '—'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Vehicles':
                return (
                    <motion.div key="ws-vehicles" {...fade} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Vehicles in Workshop</h2>
                                <p className="text-xs text-white/30 mt-0.5">{workshopVehicles.length} active vehicles · 1 ready for pickup</p>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{workshopVehicles.length} Active</span>
                        </div>

                        {/* Status Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'In Service', value: '3', color: 'text-yellow-400' },
                                { label: 'Awaiting Parts', value: '1', color: 'text-red-400' },
                                { label: 'Ready for Pickup', value: '1', color: 'text-primary' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-5 text-center">
                                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                    <div className="text-xs text-white/30 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {workshopVehicles.map(v => (
                                <div key={v.reg} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Car size={22} className="text-primary" /></div>
                                        <div>
                                            <div className="text-white font-semibold">{v.name}</div>
                                            <div className="text-xs text-white/30 mt-0.5">{v.reg} · Owner: {v.owner}</div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-white/20">{v.bay}</span>
                                                <span className="text-xs text-white/20">·</span>
                                                <span className="text-xs text-primary">{v.service}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`text-xs font-bold ${v.status === 'Ready for Pickup' ? 'text-primary' : v.status === 'In Service' ? 'text-yellow-400' : 'text-red-400'}`}>{v.status}</div>
                                            <div className="text-xs text-white/30 mt-0.5">ETA: {v.eta}</div>
                                        </div>
                                        <button className="btn-secondary text-xs px-4 py-2">Update</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'Settings':
                return (
                    <motion.div key="admin-settings" {...fade} className="space-y-5 max-w-2xl">
                        <h2 className="text-xl font-bold text-white">System Settings</h2>

                        <div className="glass-card p-6 space-y-5">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Workshop Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { l: 'Workshop Name', v: 'AutoSphere HQ' },
                                    { l: 'Contact Number', v: '+91 22 1234 5678' },
                                    { l: 'Email', v: 'admin@autosphere.in' },
                                    { l: 'City', v: 'Mumbai' },
                                    { l: 'Total Bays', v: '7' },
                                    { l: 'Working Hours', v: '8:00 AM – 8:00 PM' },
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
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">System Alerts</h3>
                            {[
                                'Email alerts for new bookings',
                                'SMS when bay status changes',
                                'Daily revenue summary report',
                                'Low inventory notifications',
                                'Technician shift reminders',
                            ].map(n => (
                                <label key={n} className="flex items-center justify-between cursor-pointer py-0.5">
                                    <span className="text-white/60 text-sm">{n}</span>
                                    <div className="w-10 h-5 bg-primary/30 rounded-full relative"><div className="w-4 h-4 bg-primary rounded-full absolute top-0.5 right-0.5" /></div>
                                </label>
                            ))}
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Integrations</h3>
                            {[
                                { icon: Cpu, label: 'Bosch ESI Diagnostic Suite', status: 'Connected' },
                                { icon: Shield, label: 'CRM & Customer Portal', status: 'Connected' },
                                { icon: Zap, label: 'Inventory Management System', status: 'Pending' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <item.icon size={14} className="text-primary" />
                                        </div>
                                        <span className="text-white/60 text-sm">{item.label}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${item.status === 'Connected' ? 'text-primary' : 'text-yellow-400'}`}>{item.status}</span>
                                </div>
                            ))}
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
                            <button className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"><UserPlus size={13} />Add Booking</button>
                            <button className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5"><Download size={13} />Export</button>
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

export default AdminDashboard;
