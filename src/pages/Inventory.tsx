import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, ArrowRightLeft, Star, LayoutGrid, List, ChevronDown, ArrowRight } from 'lucide-react';
import { fetchFilteredCars } from '../services/carService';
import type { Car } from '../data/carsData';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useFilterParams } from '../hooks/useFilterParams';

const TYPES = ['All', 'Coupe', 'Sedan', 'SUV', 'Convertible', 'Hypercar'];

const Inventory: React.FC = () => {
    const navigate = useNavigate();
    const { wishlist, toggleWishlist, compareList, toggleCompare } = useInventory();
    const { showToast } = useToast();

    // ── URL-synced filters (shareable links like Amazon/Flipkart) ──
    const { filters, setFilter, resetFilters } = useFilterParams();
    const [searchInput, setSearchInput] = useState(filters.search);
    const debouncedSearch = useDebounce(searchInput, 300);

    // ── API fetch state ──
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Sync debounced search → URL
    useEffect(() => {
        setFilter('q', debouncedSearch);
    }, [debouncedSearch, setFilter]);

    // ── Async data fetching (simulates real API call) ──
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        fetchFilteredCars({
            search: filters.search,
            type: filters.type,
            maxPrice: filters.maxPrice,
            sort: filters.sort as 'price-asc' | 'price-desc' | 'hp-desc',
        })
            .then(data => {
                if (!cancelled) {
                    setCars(data);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError('Failed to load inventory. Please try again.');
                    setIsLoading(false);
                    console.error('[Inventory] Fetch error:', err);
                }
            });

        return () => { cancelled = true; }; // Cleanup on re-fetch
    }, [filters.search, filters.type, filters.maxPrice, filters.sort]);

    // ── Wishlist & Compare with Toast feedback ──
    const handleWishlist = useCallback((car: Car) => {
        toggleWishlist(car.id);
        const isAdding = !wishlist.includes(car.id);
        showToast(
            isAdding ? `${car.name} added to wishlist ❤️` : `${car.name} removed from wishlist`,
            isAdding ? 'success' : 'info'
        );
    }, [wishlist, toggleWishlist, showToast]);

    const handleCompare = useCallback((car: Car) => {
        const isAdding = !compareList.includes(car.id);
        toggleCompare(car.id);
        if (isAdding && compareList.length < 3) {
            showToast(`${car.name} added to comparison ⚡`, 'success');
        } else if (!isAdding) {
            showToast(`${car.name} removed from comparison`, 'info');
        }
    }, [compareList, toggleCompare, showToast]);

    return (
        <div className="pt-24 min-h-screen bg-secondary">
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/5 py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Performance Inventory</h1>
                    <p className="text-white/40 max-w-2xl">Browse our curated collection of high-performance vehicles. Every machine is verified to factory specifications.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 space-y-8">
                        <div className="glass-card p-6 border-white/10 sticky top-24">
                            <div className="flex items-center gap-2 text-white font-bold mb-6">
                                <SlidersHorizontal size={18} className="text-primary" />
                                <span>Filters</span>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label htmlFor="car-search" className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                    <input
                                        id="car-search"
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Model or Brand..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div className="mb-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Body Style</label>
                                <div className="space-y-2">
                                    {TYPES.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setFilter('type', t)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.type === t ? 'bg-primary/20 text-primary' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="price-range" className="text-[10px] font-black uppercase tracking-widest text-white/30">Max Price</label>
                                    <span className="text-primary text-xs font-bold">${(filters.maxPrice / 1000).toFixed(0)}k</span>
                                </div>
                                <input
                                    id="price-range"
                                    type="range"
                                    min="50000"
                                    max="400000"
                                    step="10000"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilter('maxPrice', e.target.value)}
                                    className="w-full accent-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                    <span>$50k</span>
                                    <span>$400k</span>
                                </div>
                            </div>

                            {/* Reset */}
                            <button
                                onClick={() => { resetFilters(); setSearchInput(''); }}
                                className="w-full py-2.5 text-xs font-bold text-white/30 uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5 hover:text-white/60 transition-all"
                            >
                                Reset All Filters
                            </button>

                            {/* Compare Widget */}
                            {compareList.length > 0 && (
                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Compare ({compareList.length}/3)</span>
                                        <button
                                            onClick={() => navigate('/compare')}
                                            className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                                        >
                                            View →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Sort & View Controls */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex bg-white/5 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-secondary' : 'text-white/40 hover:text-white'}`}
                                        aria-label="Grid view"
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-secondary' : 'text-white/40 hover:text-white'}`}
                                        aria-label="List view"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                                <span className="text-sm text-white/30">
                                    {isLoading ? 'Loading...' : `Showing ${cars.length} models`}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hidden sm:block">Sort By</span>
                                <div className="relative">
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilter('sort', e.target.value)}
                                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50 pr-10 cursor-pointer"
                                        aria-label="Sort vehicles"
                                    >
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="hp-desc">Power: Max HP</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="glass-card p-8 text-center border-red-500/20 mb-8">
                                <p className="text-red-400 font-bold mb-2">{error}</p>
                                <button onClick={() => window.location.reload()} className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Loading Skeleton */}
                        {isLoading ? (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="glass-card border-white/5 overflow-hidden">
                                        <div className="h-48 bg-white/5 animate-pulse" />
                                        <div className="p-6 space-y-3">
                                            <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
                                            <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                                            <div className="h-8 w-full bg-white/5 rounded animate-pulse mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : cars.length > 0 ? (
                            <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                                <AnimatePresence mode="popLayout">
                                    {cars.map((car) => (
                                        <motion.div
                                            key={car.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            className={`glass-card group overflow-hidden border-white/10 hover:border-primary/40 transition-all duration-500 flex ${viewMode === 'list' ? 'flex-row h-48' : 'flex-col'}`}
                                        >
                                            {/* Image */}
                                            <div className={`relative overflow-hidden cursor-pointer ${viewMode === 'list' ? 'w-1/3' : 'h-48'}`} onClick={() => navigate(`/car-details/${car.id}`)}>
                                                <img src={car.image} alt={`${car.brand} ${car.name}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60" />
                                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                    <span className="bg-primary/90 text-secondary text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">{car.brand}</span>
                                                    {car.price > 300000 && (
                                                        <span className="bg-amber-500/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Ultra Luxury</span>
                                                    )}
                                                </div>
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleWishlist(car); }}
                                                        className={`p-2 rounded-xl backdrop-blur-md border ${wishlist.includes(car.id) ? 'bg-primary border-primary text-secondary' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                                                        aria-label={`Add ${car.name} to wishlist`}
                                                    >
                                                        <Heart size={16} fill={wishlist.includes(car.id) ? 'currentColor' : 'none'} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCompare(car); }}
                                                        className={`p-2 rounded-xl backdrop-blur-md border ${compareList.includes(car.id) ? 'bg-primary border-primary text-secondary' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                                                        aria-label={`Add ${car.name} to comparison`}
                                                    >
                                                        <ArrowRightLeft size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex flex-col justify-between flex-1">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold text-white tracking-tight">{car.name}</h3>
                                                        <div className="text-primary font-bold">${(car.price / 1000).toFixed(0)}k</div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-4">
                                                        <span className="flex items-center gap-1"><Star size={10} className="text-amber-500" /> {car.type}</span>
                                                        <span>{car.hp} HP</span>
                                                        <span>{car.acceleration}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <button
                                                        onClick={() => navigate(`/car-details/${car.id}`)}
                                                        className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                                    >
                                                        View Full Spec <ArrowRight size={14} />
                                                    </button>
                                                    <div className="text-[10px] text-white/20 font-mono tracking-tighter">REF_{car.id.slice(0, 4).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Search size={32} className="text-white/20" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No cars found.</h3>
                                <p className="text-white/30 text-sm max-w-xs">Adjust your filters or try searching for a different model.</p>
                                <button
                                    onClick={() => { resetFilters(); setSearchInput(''); }}
                                    className="mt-6 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
