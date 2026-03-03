import React, { useState } from 'react';
import { Car, Wrench, Clock, ShieldCheck, FileText, Settings, LayoutDashboard, CalendarCheck, AlertTriangle, CheckCircle2, Circle, Plus, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { id: 'SRV-9201', service: 'ECU Remap & Tune', date: 'Today, 14:30', status: 'In Progress', color: 'text-primary' },
    { id: 'SRV-8842', service: 'Brake System Overhaul', date: 'Mar 8, 2026', status: 'Scheduled', color: 'text-yellow-400' },
    { id: 'SRV-8701', service: 'Full Service Audit', date: 'Mar 15, 2026', status: 'Scheduled', color: 'text-yellow-400' },
    { id: 'SRV-8600', service: 'Tyre Rotation', date: 'Mar 20, 2026', status: 'Pending', color: 'text-white/40' },
];

const invoices = [
    { id: 'INV-441', service: 'Nano Ceramic Coating', date: 'Feb 20, 2026', amount: '₹24,500', status: 'Paid' },
    { id: 'INV-398', service: 'Transmission Service', date: 'Jan 10, 2026', amount: '₹11,200', status: 'Paid' },
    { id: 'INV-362', service: 'Engine Diagnostics', date: 'Dec 5, 2025', amount: '₹3,800', status: 'Paid' },
    { id: 'INV-310', service: 'Brake Pad Replacement', date: 'Nov 12, 2025', amount: '₹6,500', status: 'Paid' },
    { id: 'INV-280', service: 'Oil & Filter Change', date: 'Oct 1, 2025', amount: '₹2,100', status: 'Paid' },
];

const serviceHistory = [
    { id: 'SRV-9001', service: 'Nano Ceramic Coating', date: 'Feb 20, 2026', tech: 'Rajan K.', cost: '₹24,500', status: 'Completed' },
    { id: 'SRV-8760', service: 'Transmission Service', date: 'Jan 10, 2026', tech: 'Amit D.', cost: '₹11,200', status: 'Completed' },
    { id: 'SRV-8520', service: 'Engine Diagnostics', date: 'Dec 5, 2025', tech: 'Suresh P.', cost: '₹3,800', status: 'Completed' },
    { id: 'SRV-8200', service: 'Brake Pad Replacement', date: 'Nov 12, 2025', tech: 'Karan M.', cost: '₹6,500', status: 'Completed' },
];

const vehicles = [
    { name: 'Porsche 911 GT3', reg: 'MH 01 AB 9201', year: '2024', fuel: 'Petrol', km: '12,450 km', warranty: 'Valid till 2028', status: 'In Service' },
    { name: 'BMW M4 Competition', reg: 'MH 01 XY 4420', year: '2022', fuel: 'Petrol', km: '28,100 km', warranty: 'Expired', status: 'At Home' },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

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
                                { icon: Wrench, label: 'Services Done', value: '14', sub: '+2 this month' },
                                { icon: Clock, label: 'Next Oil Change', value: '4,200 km', sub: 'Due in 3 weeks' },
                                { icon: Car, label: 'Active Vehicles', value: '2', sub: '1 in service' },
                                { icon: ShieldCheck, label: 'Warranty', value: 'Active', sub: 'Until Dec 2028' },
                            ].map((s) => (
                                <div key={s.label} className="glass-card p-4 border-white/5">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                                        <s.icon size={16} className="text-primary" />
                                    </div>
                                    <div className="text-xl font-bold text-white">{s.value}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</div>
                                    <div className="text-xs text-white/20 mt-1">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                        {/* Progress + Vehicle */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 glass-card p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div><h2 className="font-bold text-white">Current Service Progress</h2><p className="text-xs text-white/30 mt-0.5">SRV-9201 · ECU Remap & Tune · Bay 3</p></div>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">65% Complete</span>
                                </div>
                                <div className="space-y-4">
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
                                <div className="mt-5">
                                    <div className="flex justify-between text-xs text-white/30 mb-1"><span>Progress</span><span>65%</span></div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-6 border-primary/20 relative overflow-hidden">
                                <Car size={100} className="absolute -right-6 -bottom-6 text-primary opacity-5" />
                                <h2 className="font-bold text-white mb-3">Primary Vehicle</h2>
                                <div className="text-xl font-bold text-white">Porsche 911</div>
                                <div className="text-sm text-primary mb-4">GT3 · 2024</div>
                                <div className="space-y-2 pt-4 border-t border-white/5 text-sm">
                                    {[{ l: 'Reg.', v: 'MH 01 AB 9201' }, { l: 'Odometer', v: '12,450 km' }, { l: 'Warranty', v: 'Valid till 2028', g: true }].map(r => (
                                        <div key={r.l} className="flex justify-between"><span className="text-white/30">{r.l}</span><span className={r.g ? 'text-primary font-semibold' : 'text-white'}>{r.v}</span></div>
                                    ))}
                                </div>
                                <button className="w-full btn-secondary py-2 mt-4 text-sm">View Full Specs →</button>
                            </div>
                        </div>
                        {/* Alert */}
                        <div className="glass-card p-4 border-yellow-500/20 flex items-center gap-4">
                            <div className="w-9 h-9 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0"><AlertTriangle size={18} className="text-yellow-400" /></div>
                            <div className="flex-1"><div className="text-white font-semibold text-sm">Tyre Rotation Due Soon</div><div className="text-white/40 text-xs mt-0.5">Due at 15,000 km · Current: 12,450 km</div></div>
                            <button className="btn-secondary text-xs px-4 py-2 flex-shrink-0">Schedule</button>
                        </div>
                    </motion.div>
                );

            case 'My Vehicles':
                return (
                    <motion.div key="vehicles" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">My Garage</h2>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><Plus size={14} />Add Vehicle</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-5">
                            {vehicles.map((v) => (
                                <div key={v.reg} className="glass-card p-6 border-white/5 hover:border-primary/30 transition-colors relative overflow-hidden">
                                    <Car size={80} className="absolute -right-4 -bottom-4 text-primary opacity-5" />
                                    <div className="flex items-center justify-between mb-4">
                                        <div><div className="text-lg font-bold text-white">{v.name}</div><div className="text-sm text-primary">{v.year} · {v.fuel}</div></div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.status === 'In Service' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-primary/10 text-primary'}`}>{v.status}</span>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-white/5 text-sm">
                                        {[{ l: 'Reg. Number', v2: v.reg }, { l: 'Odometer', v2: v.km }, { l: 'Warranty', v2: v.warranty }].map(r => (
                                            <div key={r.l} className="flex justify-between"><span className="text-white/30">{r.l}</span><span className="text-white">{r.v2}</span></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 btn-secondary py-2 text-xs">View Details</button>
                                        <button className="flex-1 btn-primary py-2 text-xs">Book Service</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'Service History':
                return (
                    <motion.div key="history" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Service History</h2>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"><Download size={14} />Download All</button>
                        </div>
                        <div className="glass-card p-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                    <th className="text-left pb-3">Service ID</th><th className="text-left pb-3">Service</th><th className="text-left pb-3">Date</th><th className="text-left pb-3">Technician</th><th className="text-left pb-3">Cost</th><th className="text-left pb-3">Status</th>
                                </tr></thead>
                                <tbody>
                                    {serviceHistory.map(s => (
                                        <tr key={s.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                            <td className="py-3 text-primary font-mono text-xs">{s.id}</td>
                                            <td className="py-3 text-white font-medium">{s.service}</td>
                                            <td className="py-3 text-white/50">{s.date}</td>
                                            <td className="py-3 text-white/50">{s.tech}</td>
                                            <td className="py-3 text-white font-semibold">{s.cost}</td>
                                            <td className="py-3"><span className="text-xs text-primary font-bold">● {s.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );

            case 'Appointments':
                return (
                    <motion.div key="appointments" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">My Appointments</h2>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><Plus size={14} />Book New</button>
                        </div>
                        <div className="space-y-3">
                            {appointments.map(apt => (
                                <div key={apt.id} className="glass-card p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Wrench size={18} className="text-primary" /></div>
                                        <div>
                                            <div className="text-white font-semibold">{apt.service}</div>
                                            <div className="text-xs text-white/30 mt-0.5">{apt.id} · {apt.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-sm font-bold ${apt.color}`}>{apt.status}</span>
                                        <button className="btn-secondary px-3 py-1.5 text-xs">Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'Invoices':
                return (
                    <motion.div key="invoices" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Invoices</h2>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"><Download size={14} />Export All</button>
                        </div>
                        <div className="glass-card p-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                    <th className="text-left pb-3">Invoice ID</th><th className="text-left pb-3">Service</th><th className="text-left pb-3">Date</th><th className="text-right pb-3">Amount</th><th className="text-right pb-3">Status</th>
                                </tr></thead>
                                <tbody>
                                    {invoices.map(inv => (
                                        <tr key={inv.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                            <td className="py-3 text-primary font-mono text-xs">{inv.id}</td>
                                            <td className="py-3 text-white font-medium">{inv.service}</td>
                                            <td className="py-3 text-white/50">{inv.date}</td>
                                            <td className="py-3 text-white font-bold text-right">{inv.amount}</td>
                                            <td className="py-3 text-right"><span className="text-xs text-primary font-bold">● {inv.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs text-white/20">5 invoices shown</span>
                                <span className="text-sm font-bold text-white">Total: <span className="text-primary">₹48,100</span></span>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Settings':
                return (
                    <motion.div key="settings" {...fade} className="space-y-4 max-w-2xl">
                        <h2 className="text-xl font-bold text-white">Account Settings</h2>
                        <div className="glass-card p-6 space-y-5">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[{ l: 'Full Name', v: 'Arjun Mehta' }, { l: 'Phone Number', v: '+91 98765 43210' }, { l: 'Email', v: 'arjun@example.com' }, { l: 'City', v: 'Mumbai' }].map(f => (
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
                            {['Service reminders via SMS', 'Invoice receipts via email', 'Promotional offers'].map(n => (
                                <label key={n} className="flex items-center justify-between cursor-pointer">
                                    <span className="text-white/60 text-sm">{n}</span>
                                    <div className="w-10 h-5 bg-primary/30 rounded-full relative"><div className="w-4 h-4 bg-primary rounded-full absolute top-0.5 right-0.5" /></div>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-secondary min-h-screen">
            {/* Tab Bar */}
            <div className="border-b border-white/5 bg-secondary/95 backdrop-blur-sm sticky top-20 z-10">
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
                            <button className="btn-primary px-4 py-2 text-xs">Book Service</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 pb-10">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserDashboard;
