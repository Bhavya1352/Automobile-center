import React, { useState } from 'react';
import { Users, LayoutDashboard, Settings, Wrench, BarChart3, Bell, Search, UserPlus, Download, FileText, Car, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Users, label: 'Customers' },
    { icon: Wrench, label: 'Technicians' },
    { icon: BarChart3, label: 'Revenue' },
    { icon: Car, label: 'Vehicles' },
    { icon: Settings, label: 'Settings' },
];

const serviceQueue = [
    { id: 'SRV-9201', customer: 'Arjun Mehta', service: 'ECU Remap & Tune', bay: 'Bay 3', status: 'In Progress' },
    { id: 'SRV-9194', customer: 'Priya Sharma', service: 'Full 150-pt Audit', bay: 'Bay 1', status: 'Awaiting Parts' },
    { id: 'SRV-9188', customer: 'Vikram Singh', service: 'Brake Optimisation', bay: 'Bay 5', status: 'In Progress' },
    { id: 'SRV-9176', customer: 'Neha Kapoor', service: 'Oil & Filter Change', bay: 'Bay 2', status: 'Completed' },
];

const allCustomers = [
    { name: 'Arjun Mehta', vehicle: 'Porsche 911 GT3', date: 'Mar 3, 2026', plan: 'Premium', status: 'Active' },
    { name: 'Priya Sharma', vehicle: 'BMW M4 Competition', date: 'Mar 2, 2026', plan: 'Basic', status: 'Active' },
    { name: 'Vikram Singh', vehicle: 'Mercedes AMG C63', date: 'Mar 1, 2026', plan: 'Premium', status: 'Active' },
    { name: 'Neha Kapoor', vehicle: 'Audi RS5 Sportback', date: 'Feb 28, 2026', plan: 'Basic', status: 'Completed' },
    { name: 'Rohit Verma', vehicle: 'Toyota Supra GR', date: 'Feb 21, 2026', plan: 'Premium', status: 'Active' },
    { name: 'Anjali Das', vehicle: 'Ford Mustang GT', date: 'Feb 15, 2026', plan: 'Basic', status: 'Inactive' },
];

const technicians = [
    { name: 'Rajan Kumar', role: 'Senior Mechanic', specialty: 'Engine & Diagnostics', status: 'On Duty', services: 142 },
    { name: 'Suresh Patil', role: 'Mechanic', specialty: 'Transmission & Brakes', status: 'On Duty', services: 98 },
    { name: 'Amit Desai', role: 'ECU Specialist', specialty: 'Performance Tuning', status: 'On Duty', services: 87 },
    { name: 'Karan Mehta', role: 'Detailing Expert', specialty: 'Ceramic & Paint', status: 'On Break', services: 114 },
    { name: 'Pooja Sharma', role: 'Service Advisor', specialty: 'Customer & Billing', status: 'On Duty', services: 203 },
    { name: 'Deepak Singh', role: 'Junior Mechanic', specialty: 'General Maintenance', status: 'Off Today', services: 45 },
];

const revenueMonths = [
    { month: 'Oct', revenue: '₹5.2L', jobs: 51 },
    { month: 'Nov', revenue: '₹6.1L', jobs: 58 },
    { month: 'Dec', revenue: '₹7.0L', jobs: 64 },
    { month: 'Jan', revenue: '₹6.8L', jobs: 62 },
    { month: 'Feb', revenue: '₹7.9L', jobs: 71 },
    { month: 'Mar', revenue: '₹8.4L', jobs: 48 },
];

const workshopVehicles = [
    { reg: 'MH 01 AB 9201', name: 'Porsche 911 GT3', owner: 'Arjun Mehta', bay: 'Bay 3', status: 'In Service', eta: '16:00 Today' },
    { reg: 'MH 05 CD 4420', name: 'BMW M4 Competition', owner: 'Priya Sharma', bay: 'Bay 1', status: 'Awaiting Parts', eta: 'Mar 5, 2026' },
    { reg: 'DL 08 FG 7711', name: 'Mercedes AMG C63', owner: 'Vikram Singh', bay: 'Bay 5', status: 'In Service', eta: '18:00 Today' },
    { reg: 'KA 02 HJ 3390', name: 'Audi RS5 Sportback', owner: 'Neha Kapoor', bay: 'Bay 2', status: 'Ready for Pickup', eta: 'Now' },
];

const activityLog = [
    { icon: UserPlus, text: 'New booking — Arjun Mehta (SRV-9201)', time: '4 min ago' },
    { icon: CheckCircle2, text: 'SRV-9176 completed — Neha Kapoor', time: '22 min ago' },
    { icon: AlertTriangle, text: 'Bay 6 flagged for equipment maintenance', time: '1h ago' },
    { icon: Bell, text: 'Monthly revenue target 84% achieved', time: '3h ago' },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

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
                                    <span className="text-xs text-white/30">• Workshop Command</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white">Welcome, Administrator 🔧</h1>
                                <p className="text-white/40 text-sm mt-1">Monitor workshop health, manage service bays, and track all technician activity.</p>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                                <button className="btn-primary px-5 py-2 text-sm flex items-center gap-2"><UserPlus size={14} />Add Booking</button>
                                <button className="btn-secondary px-5 py-2 text-sm flex items-center gap-2"><Download size={14} />Export</button>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: BarChart3, label: 'Monthly Revenue', value: '₹8.4L', sub: '+8.2%' },
                                { icon: Bell, label: 'Active Bookings', value: '48', sub: '12 live today' },
                                { icon: Wrench, label: 'Technicians On Duty', value: '9', sub: '2 on break' },
                                { icon: Users, label: 'Customer Satisfaction', value: '97%', sub: '↑ from 94%' },
                            ].map(s => (
                                <div key={s.label} className="glass-card p-4 border-white/5">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3"><s.icon size={16} className="text-primary" /></div>
                                    <div className="text-xl font-bold text-white">{s.value}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</div>
                                    <div className="text-xs text-primary mt-1">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                        {/* Queue + Activity */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 glass-card p-6">
                                <div className="flex items-center justify-between mb-5"><h2 className="font-bold text-white">Live Service Queue</h2><button className="text-xs text-primary hover:underline">View all →</button></div>
                                <div className="space-y-3">
                                    {serviceQueue.map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'Completed' ? 'bg-primary' : s.status === 'In Progress' ? 'bg-yellow-400' : 'bg-white/20'}`} />
                                                <div className="min-w-0"><div className="text-sm font-medium text-white truncate">{s.customer}</div><div className="text-xs text-white/30 truncate">{s.id} · {s.service}</div></div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-xs text-white/50">{s.bay}</div>
                                                <div className={`text-xs font-bold ${s.status === 'Completed' ? 'text-primary' : s.status === 'In Progress' ? 'text-yellow-400' : 'text-white/40'}`}>{s.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-white">Activity Log</h2><button className="text-xs text-primary hover:underline">View all →</button></div>
                                <div className="space-y-4">
                                    {activityLog.map((a, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><a.icon size={12} className="text-primary" /></div>
                                            <div><div className="text-xs text-white/70 leading-snug">{a.text}</div><div className="text-[10px] text-white/25 mt-0.5">{a.time}</div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* System Status */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {[
                                { title: 'Bay Status', items: [{ l: 'Bay 1 — Rajan K.', c: 'text-yellow-400', s: 'Occupied' }, { l: 'Bay 2 — Suresh P.', c: 'text-yellow-400', s: 'Occupied' }, { l: 'Bay 3 — Amit D.', c: 'text-yellow-400', s: 'Occupied' }, { l: 'Bay 4 — Empty', c: 'text-primary', s: 'Free' }, { l: 'Bay 5 — Karan M.', c: 'text-yellow-400', s: 'Occupied' }, { l: 'Bay 6 — Maintenance', c: 'text-red-400', s: 'Offline' }] },
                            ].map(section => (
                                <div key={section.title} className="glass-card p-6">
                                    <h2 className="font-bold text-white mb-4">{section.title}</h2>
                                    <div className="space-y-2.5">
                                        {section.items.map(item => (
                                            <div key={item.l} className="flex justify-between text-sm"><span className="text-white/50">{item.l}</span><span className={`text-xs font-bold ${item.c}`}>{item.s}</span></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="glass-card p-6">
                                <h2 className="font-bold text-white mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {[{ icon: UserPlus, label: 'Add Customer' }, { icon: FileText, label: 'Reports' }, { icon: Settings, label: 'Settings' }, { icon: Bell, label: 'Alerts' }].map(a => (
                                        <button key={a.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/3 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all group">
                                            <a.icon size={18} className="text-white/30 group-hover:text-primary transition-colors" />
                                            <span className="text-xs text-white/40 group-hover:text-white">{a.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-white">System Health</h2><span className="text-xs text-primary font-bold">All Operational</span></div>
                                <div className="space-y-3">
                                    {[{ l: 'Diagnostic Network', s: '99.98%', ok: true }, { l: 'Booking Database', s: '99.97%', ok: true }, { l: 'Payment Gateway', s: '100%', ok: true }, { l: 'Bay 6 Equipment', s: 'Degraded', ok: false }].map(s => (
                                        <div key={s.l} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-primary' : 'bg-yellow-400'}`} /><span className="text-white/50">{s.l}</span></div>
                                            <span className={`text-xs font-bold ${s.ok ? 'text-primary' : 'text-yellow-400'}`}>{s.s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'Customers':
                return (
                    <motion.div key="customers" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Customer Management</h2>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><UserPlus size={14} />Add Customer</button>
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
                                        <th className="text-left pb-3">Customer</th><th className="text-left pb-3">Vehicle</th><th className="text-left pb-3">Last Visit</th><th className="text-left pb-3">Plan</th><th className="text-left pb-3">Status</th><th className="text-right pb-3">Action</th>
                                    </tr></thead>
                                    <tbody>
                                        {allCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                                            <tr key={c.name} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                                <td className="py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{c.name[0]}</div><span className="text-white font-medium">{c.name}</span></div></td>
                                                <td className="py-3 text-white/50">{c.vehicle}</td>
                                                <td className="py-3 text-white/50">{c.date}</td>
                                                <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.plan === 'Premium' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'}`}>{c.plan}</span></td>
                                                <td className="py-3"><span className={`text-xs font-bold ${c.status === 'Active' ? 'text-primary' : c.status === 'Inactive' ? 'text-red-400' : 'text-white/30'}`}>● {c.status}</span></td>
                                                <td className="py-3 text-right"><button className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary text-white/50 transition-colors mr-1">Edit</button><button className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/50 transition-colors">Remove</button></td>
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
                    <motion.div key="technicians" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Technician Management</h2>
                            <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2"><UserPlus size={14} />Add Technician</button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {technicians.map(t => (
                                <div key={t.name} className="glass-card p-5 border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{t.name[0]}</div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.status === 'On Duty' ? 'bg-primary/10 text-primary' : t.status === 'On Break' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-white/5 text-white/30'}`}>{t.status}</span>
                                    </div>
                                    <div className="text-white font-semibold">{t.name}</div>
                                    <div className="text-xs text-primary mt-0.5">{t.role}</div>
                                    <div className="text-xs text-white/40 mt-1">{t.specialty}</div>
                                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs">
                                        <span className="text-white/30">Services completed</span>
                                        <span className="text-white font-bold">{t.services}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'Revenue':
                return (
                    <motion.div key="revenue" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                            <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"><Download size={14} />Export Report</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[{ label: 'Total Revenue (YTD)', value: '₹41.4L', up: true }, { label: 'This Month', value: '₹8.4L', up: true }, { label: 'Avg. Per Job', value: '₹17,500', up: null }].map(s => (
                                <div key={s.label} className="glass-card p-5">
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-xs text-white/30 mt-1">{s.label}</div>
                                    {s.up && <div className="text-xs text-primary font-bold mt-2">↑ Growing</div>}
                                </div>
                            ))}
                        </div>
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-white mb-5">Monthly Breakdown</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                                        <th className="text-left pb-3">Month</th><th className="text-right pb-3">Revenue</th><th className="text-right pb-3">Jobs</th><th className="text-right pb-3">Growth</th>
                                    </tr></thead>
                                    <tbody>
                                        {revenueMonths.map((m, i) => (
                                            <tr key={m.month} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                                <td className="py-3 text-white font-medium">{m.month} 2026</td>
                                                <td className="py-3 text-primary font-bold text-right">{m.revenue}</td>
                                                <td className="py-3 text-white/50 text-right">{m.jobs} jobs</td>
                                                <td className="py-3 text-right"><span className={`text-xs font-bold ${i > 0 ? 'text-primary' : 'text-white/30'}`}>{i > 0 ? '↑ Growing' : '—'}</span></td>
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
                    <motion.div key="ws-vehicles" {...fade} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Vehicles in Workshop</h2>
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{workshopVehicles.length} Active</span>
                        </div>
                        <div className="space-y-3">
                            {workshopVehicles.map(v => (
                                <div key={v.reg} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Car size={20} className="text-primary" /></div>
                                        <div>
                                            <div className="text-white font-semibold">{v.name}</div>
                                            <div className="text-xs text-white/30 mt-0.5">{v.reg} · Owner: {v.owner} · {v.bay}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`text-xs font-bold ${v.status === 'Ready for Pickup' ? 'text-primary' : v.status === 'In Service' ? 'text-yellow-400' : 'text-white/40'}`}>{v.status}</div>
                                            <div className="text-xs text-white/30 mt-0.5">ETA: {v.eta}</div>
                                        </div>
                                        <button className="btn-secondary text-xs px-3 py-1.5">Update</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'Settings':
                return (
                    <motion.div key="admin-settings" {...fade} className="space-y-4 max-w-2xl">
                        <h2 className="text-xl font-bold text-white">System Settings</h2>
                        <div className="glass-card p-6 space-y-5">
                            <h3 className="text-white font-semibold border-b border-white/5 pb-3">Workshop Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[{ l: 'Workshop Name', v: 'AutoSphere HQ' }, { l: 'Contact Number', v: '+91 22 1234 5678' }, { l: 'Email', v: 'admin@autosphere.in' }, { l: 'City', v: 'Mumbai' }].map(f => (
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
                            {['Email alerts for new bookings', 'SMS when bay status changes', 'Daily revenue summary report'].map(n => (
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
                            <button className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"><UserPlus size={13} />Add Booking</button>
                            <button className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5"><Download size={13} />Export</button>
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

export default AdminDashboard;
