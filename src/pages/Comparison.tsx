import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CARS } from '../data/carsData';
import type { Car } from '../data/carsData';
import { useInventory } from '../context/InventoryContext';
import { ArrowLeft, Trash2, Zap, Gauge, Clock, Calendar, CheckSquare, Plus, Sparkles, ArrowRightLeft } from 'lucide-react';

const Comparison: React.FC = () => {
    const navigate = useNavigate();
    const { compareList, removeFromCompare } = useInventory();

    const selectedCars = CARS.filter(car => compareList.includes(car.id));

    if (selectedCars.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-secondary flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ArrowRightLeft size={32} className="text-white/20" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Compare Selection Empty</h1>
                <p className="text-white/30 text-center max-w-sm mb-8">Add vehicles from the inventory to see their technical specifications side by side.</p>
                <button onClick={() => navigate('/inventory')} className="btn-primary px-8 py-3">Browse Inventory</button>
            </div>
        );
    }

    const comparisonRows = [
        { label: 'Brand', key: 'brand' as keyof Car, icon: Sparkles },
        { label: 'Price', key: 'price' as keyof Car, icon: Zap, format: (val: number) => `$${(val / 1000).toFixed(0)}k` },
        { label: 'Power', key: 'hp' as keyof Car, icon: Zap, format: (val: number) => `${val} HP` },
        { label: '0-100 km/h', key: 'acceleration' as keyof Car, icon: Clock },
        { label: 'Top Speed', key: 'topSpeed' as keyof Car, icon: Gauge, format: (val: number) => `${val} km/h` },
        { label: 'Engine', key: 'engine' as keyof Car, icon: Calendar },
        { label: 'Body Style', key: 'type' as keyof Car, icon: CheckSquare },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-secondary">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <button onClick={() => navigate('/inventory')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group mb-6">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Inventory</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                            Side-by-Side Analysis
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">Direct Performance Comparison</h1>
                    </div>
                    {selectedCars.length < 3 && (
                        <button
                            onClick={() => navigate('/inventory')}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <Plus size={16} /> Add Another Model
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="glass-card overflow-hidden border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-8 w-64 bg-white/[0.01]">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Metric</div>
                                    </th>
                                    {selectedCars.map(car => (
                                        <th key={car.id} className="p-8 relative min-w-[250px] border-l border-white/5 group">
                                            <div className="relative h-40 rounded-2xl overflow-hidden mb-6">
                                                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                                                <button
                                                    onClick={() => removeFromCompare(car.id)}
                                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="text-xs text-primary font-black uppercase tracking-widest mb-1">{car.brand}</div>
                                            <div className="text-xl font-bold text-white">{car.name}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row) => (
                                    <tr key={row.key} className="border-b border-white/5 group hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6 bg-white/[0.01]">
                                            <div className="flex items-center gap-3 text-white/40 font-bold text-sm">
                                                <row.icon size={16} className="text-primary/40 group-hover:text-primary transition-colors" />
                                                {row.label}
                                            </div>
                                        </td>
                                        {selectedCars.map(car => {
                                            const val = car[row.key];
                                            return (
                                                <td key={`${car.id}-${row.key}`} className="p-6 border-l border-white/5 font-semibold text-white">
                                                    {row.format && typeof val === 'number' ? row.format(val) : String(val)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr>
                                    <td className="p-6 bg-white/[0.01]">
                                        <div className="text-white/40 font-bold text-sm">Action</div>
                                    </td>
                                    {selectedCars.map(car => (
                                        <td key={`${car.id}-action`} className="p-6 border-l border-white/5">
                                            <button
                                                onClick={() => navigate(`/car-details/${car.id}`)}
                                                className="w-full btn-primary text-xs py-3"
                                            >
                                                Full Spec
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-3xl bg-white/[0.015] border border-white/5 text-center">
                    <p className="text-white/30 text-sm italic">
                        Technical data is sourced directly from OEM telemetry benchmarks and is subject to verification upon physical inspection.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comparison;
