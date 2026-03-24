import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCarById, fetchAllCars } from '../services/carService';
import type { Car } from '../data/carsData';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../context/ToastContext';
import { Zap, Gauge, Shield, Cpu, ArrowLeft, Heart, ArrowRightLeft, Star, Clock, Flame, CheckCircle2, Loader2 } from 'lucide-react';

const CarDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { wishlist, toggleWishlist, compareList, toggleCompare } = useInventory();
    const { showToast } = useToast();

    const [car, setCar] = useState<Car | null>(null);
    const [similar, setSimilar] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── Async fetch car data (simulates GET /api/vehicles/:id) ──
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        Promise.all([
            fetchCarById(id || ''),
            fetchAllCars()
        ]).then(([carData, allCars]) => {
            if (!cancelled) {
                setCar(carData);
                // Dynamic page title — real-world SEO pattern
                if (carData) {
                    document.title = `${carData.brand} ${carData.name} | AutoSphere`;
                    setSimilar(
                        allCars.filter(c => c.id !== carData.id && (c.type === carData.type || c.brand === carData.brand)).slice(0, 3)
                    );
                } else {
                    document.title = 'Vehicle Not Found | AutoSphere';
                }
                setIsLoading(false);
            }
        });

        return () => {
            cancelled = true;
            document.title = 'AutoSphere | Premium Automotive Service';
        };
    }, [id]);

    const handleWishlist = () => {
        if (!car) return;
        const adding = !wishlist.includes(car.id);
        toggleWishlist(car.id);
        showToast(adding ? `${car.name} saved to wishlist ❤️` : `${car.name} removed from wishlist`, adding ? 'success' : 'info');
    };

    const handleCompare = () => {
        if (!car) return;
        const adding = !compareList.includes(car.id);
        toggleCompare(car.id);
        if (adding && compareList.length < 3) {
            showToast(`${car.name} added to comparison ⚡`, 'success');
        } else if (!adding) {
            showToast(`${car.name} removed from comparison`, 'info');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <span className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">Loading Vehicle Data</span>
                </div>
            </div>
        );
    }

    // 404 state
    if (!car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-secondary">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Flame size={32} className="text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Model Not Found</h1>
                <p className="text-white/30 text-center max-w-sm mb-8">The performance machine you are looking for has already left the bay.</p>
                <button onClick={() => navigate('/inventory')} className="btn-primary px-8 py-3">Back to Inventory</button>
            </div>
        );
    }

    const isWishlisted = wishlist.includes(car.id);
    const isCompared = compareList.includes(car.id);

    const stats = [
        { label: 'Torque', value: '750 Nm', icon: Zap },
        { label: 'Top Speed', value: `${car.topSpeed} km/h`, icon: Gauge },
        { label: 'Acc. (0-100)', value: car.acceleration, icon: Clock },
        { label: 'Engine', value: car.engine, icon: Cpu },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-secondary">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 mb-10 flex items-center justify-between">
                <button onClick={() => navigate('/inventory')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Inventory</span>
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCompare}
                        className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${isCompared ? 'bg-primary border-primary text-secondary' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                        title="Compare"
                    >
                        <ArrowRightLeft size={18} />
                    </button>
                    <button
                        onClick={handleWishlist}
                        className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${isWishlisted ? 'bg-primary border-primary text-secondary' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                        title="Wishlist"
                    >
                        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
                {/* Left: Visuals */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-3xl overflow-hidden glass-card border-white/10 aspect-[4/3]"
                    >
                        <img src={car.image} alt={`${car.brand} ${car.name}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8">
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Premium Build No_{car.id.slice(0, 4).toUpperCase()}</span>
                            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">{car.name}</h1>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-center"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <s.icon size={16} className="text-primary" />
                                </div>
                                <div className="text-white font-bold text-sm">{s.value}</div>
                                <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">{car.brand}</div>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{car.type}</div>
                            <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">{car.year} Model</div>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6">Mastering the <span className="text-primary">Art of Motion.</span></h2>
                        <p className="text-white/50 text-lg leading-relaxed">{car.description}</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] mb-1">MSRP Starting From</div>
                                <div className="text-5xl font-bold text-white tracking-tighter">${(car.price / 1000).toFixed(0)}k<span className="text-lg text-white/20 ml-1">.00</span></div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                                </div>
                                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Verified Specs</div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            {car.features.map(f => (
                                <div key={f} className="flex items-center gap-3 text-white/70">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <CheckCircle2 size={12} className="text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{f}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <button className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                                Reserve Today <ArrowLeft size={16} className="rotate-180" />
                            </button>
                            <button className="w-full btn-secondary py-4 backdrop-blur-lg">Request Test Drive</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {similar.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 mt-28">
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-bold text-white mb-2">Similar Engineering.</h2>
                        <p className="text-white/40">Explore other machines with comparable power profiles.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                        {similar.map(rec => (
                            <div
                                key={rec.id}
                                onClick={() => { navigate(`/car-details/${rec.id}`); window.scrollTo(0, 0); }}
                                className="glass-card p-6 border-white/10 hover:border-primary/20 cursor-pointer transition-all"
                            >
                                <img src={rec.image} className="w-full h-32 object-cover rounded-xl mb-4" alt={`${rec.brand} ${rec.name}`} loading="lazy" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold text-sm">{rec.name}</span>
                                    <span className="text-primary text-xs font-bold">${(rec.price / 1000).toFixed(0)}k</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default CarDetails;
