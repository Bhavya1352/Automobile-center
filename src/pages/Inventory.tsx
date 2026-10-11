import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, ArrowRightLeft, LayoutGrid, List, ChevronDown, ArrowRight } from 'lucide-react';
import type { Car } from '../services/carService';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useFilterParams } from '../hooks/useFilterParams';
import { useVehicles } from '../hooks/useVehicles';
import { MAX_COMPARE } from '../types/inventory';

/* Body styles the dataset actually contains. 'Hypercar' sat here and
   matched nothing, so that filter always showed the empty state. */
const TYPES = ['All', 'Coupe', 'Sedan', 'Estate', 'SUV', 'Convertible'];

const Inventory: React.FC = () => {
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist, compareList, isCompared, toggleCompare } = useInventory();
    const { showToast } = useToast();

    // ── URL-synced filters (shareable links like Amazon/Flipkart) ──
    const { filters, setFilter, resetFilters } = useFilterParams();
    const [searchInput, setSearchInput] = useState(filters.search);
    const debouncedSearch = useDebounce(searchInput, 300);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Sync debounced search → URL
    useEffect(() => {
        setFilter('q', debouncedSearch);
    }, [debouncedSearch, setFilter]);

    // Data access lives in the hook; this component only renders states.
    const { state, reload } = useVehicles({
        search: filters.search,
        type: filters.type,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
    });
    const cars = state.data ?? [];
    const isLoading = state.status === 'loading';
    const error = state.error;

    // ── Wishlist & Compare with Toast feedback ──
    const handleWishlist = useCallback((car: Car) => {
        const added = toggleWishlist(car.id);
        showToast(
            added ? `${car.name} saved to your shortlist` : `${car.name} removed from your shortlist`,
            added ? 'success' : 'info'
        );
    }, [toggleWishlist, showToast]);

    const handleCompare = useCallback((car: Car) => {
        const result = toggleCompare(car.id);
        if (result === 'added') showToast(`${car.name} added to comparison`, 'success');
        else if (result === 'removed') showToast(`${car.name} removed from comparison`, 'info');
        else showToast(`You can compare up to ${MAX_COMPARE} vehicles at a time`, 'error');
    }, [toggleCompare, showToast]);

    return (
        <div className="bg-paper">
            {/* Masthead — on the page grid and in the house type, like
                every other interior page. */}
            <div className="mb-8 border-b border-line bg-sand py-12">
                <div className="wrap">
                    <p className="spec-label">Home&nbsp;&nbsp;/&nbsp;&nbsp;Vehicle showcase</p>
                    <h1 className="display-lg mt-3">Vehicle showcase</h1>
                    <p className="lede mt-4 max-w-[52ch]">
                        Cars we have had through the workshop and kept a record of.
                        A reference catalogue — browsing only, nothing here is for sale.
                    </p>
                </div>
            </div>

            <div className="wrap pb-20">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Filters Sidebar */}
                    <aside className="w-full space-y-8 lg:w-64">
                        {/* Sticky only once it is a side rail: below lg this is a
                            full-width block above the results, and pinning it
                            covered them. */}
                        <div className="panel border-line p-6 lg:sticky lg:top-[88px]">
                            <div className="title-sm mb-6 flex items-center gap-2">
                                <SlidersHorizontal size={18} className="text-forest" aria-hidden="true" />
                                <span>Filters</span>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label htmlFor="car-search" className="spec-label mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" size={16} />
                                    <input
                                        id="car-search"
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Model or Brand..."
                                        className="w-full bg-sand border border-line rounded-sm py-2.5 pl-10 pr-4 text-sm text-ink focus:border-forest transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div className="mb-6">
                                <h2 id="body-style-label" className="spec-label mb-2 block">Body style</h2>
                                <div className="space-y-2" role="group" aria-labelledby="body-style-label">
                                    {TYPES.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setFilter('type', t)}
                                            aria-pressed={filters.type === t}
                                            className={`w-full rounded-sm px-3 py-2 text-left text-sm transition-colors ${filters.type === t ? 'bg-forest-pale font-semibold text-forest' : 'text-muted hover:bg-sand hover:text-ink'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="price-range" className="spec-label">Max price</label>
                                    <span className="spec-value text-[0.8125rem] text-forest">USD {(filters.maxPrice / 1000).toFixed(0)}k</span>
                                </div>
                                <input
                                    id="price-range"
                                    type="range"
                                    min="50000"
                                    max="400000"
                                    step="10000"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilter('maxPrice', e.target.value)}
                                    className="w-full accent-primary h-1.5 bg-sand-deep rounded-sm appearance-none cursor-pointer"
                                />
                                <div className="meta mt-2 flex justify-between text-[0.75rem] text-faint">
                                    <span>USD 50k</span>
                                    <span>USD 400k</span>
                                </div>
                            </div>

                            {/* Reset */}
                            <button
                                onClick={() => { resetFilters(); setSearchInput(''); }}
                                className="btn-secondary w-full px-4 py-2.5 text-xs"
                            >
                                Reset all filters
                            </button>

                            {/* Compare Widget */}
                            {compareList.length > 0 && (
                                <div className="pt-6 mt-6 border-t border-line">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="spec-label">Compare ({compareList.length}/{MAX_COMPARE})</span>
                                        <button
                                            onClick={() => navigate('/compare')}
                                            className="text-[0.8125rem] font-semibold text-forest underline decoration-line-strong underline-offset-4 hover:decoration-forest"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort & View Controls */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
                            <div className="flex items-center gap-4">
                                <div className="flex bg-sand rounded-sm p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-sm p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-forest text-paper' : 'text-muted hover:text-ink'}`}
                                        aria-label="Grid view"
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`rounded-sm p-1.5 transition-colors ${viewMode === 'list' ? 'bg-forest text-paper' : 'text-muted hover:text-ink'}`}
                                        aria-label="List view"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                                <span className="meta">
                                    {isLoading ? 'Loading…' : `${cars.length} vehicle${cars.length === 1 ? '' : 's'}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="spec-label hidden sm:block">Sort by</span>
                                <div className="relative">
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilter('sort', e.target.value)}
                                        className="appearance-none bg-sand border border-line rounded-sm px-4 py-2 text-xs text-ink focus:border-forest pr-10 cursor-pointer"
                                        aria-label="Sort vehicles"
                                    >
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="hp-desc">Power: Max HP</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="panel p-8 text-center border-clay mb-8">
                                <p className="text-clay-ink font-bold mb-2">{error}</p>
                                <button onClick={reload} className="btn btn-outline mt-2 px-5 py-2 text-sm">
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Loading Skeleton */}
                        {isLoading ? (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="panel border-line overflow-hidden">
                                        <div className="h-48 bg-sand animate-pulse" />
                                        <div className="space-y-3 p-6">
                                            <div className="h-5 w-3/4 animate-pulse rounded-sm bg-sand" />
                                            <div className="h-3 w-1/2 animate-pulse rounded-sm bg-sand" />
                                            <div className="mt-4 h-8 w-full animate-pulse rounded-sm bg-sand" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : cars.length > 0 ? (
                            <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                                {/* A plain opacity crossfade. The previous `layout`
                                    plus scale-0.9 reflowed every surviving card on
                                    each keystroke in the search box. */}
                                <AnimatePresence initial={false}>
                                    {cars.map((car) => (
                                        <motion.div
                                            key={car.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                            className={`panel flex overflow-hidden border-line transition-colors hover:border-forest ${viewMode === 'list' ? 'flex-col sm:h-48 sm:flex-row' : 'flex-col'}`}
                                        >
                                            {/* List view only splits side-by-side from 640px:
                                                at 390px a third of the card left the photo
                                                110px wide and clipped the text beside it. */}
                                            <div
                                                className={`relative shrink-0 cursor-pointer overflow-hidden ${viewMode === 'list' ? 'h-44 sm:h-auto sm:w-1/3' : 'h-48'}`}
                                                onClick={() => navigate(`/car-details/${car.id}`)}
                                            >
                                                <img src={car.image} alt={`${car.brand} ${car.name}`} loading="lazy" className="h-full w-full object-cover" />
                                                <span className="absolute left-3 top-3 rounded-sm bg-forest px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-paper">
                                                    {car.brand}
                                                </span>
                                                {/* Always visible. Revealed on hover, these two
                                                    were unreachable on any touch device, and sat
                                                    in the tab order while invisible. */}
                                                <div className="absolute right-3 top-3 flex flex-col gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleWishlist(car); }}
                                                        aria-pressed={isWishlisted(car.id)}
                                                        className={`rounded-sm border p-2 transition-colors ${isWishlisted(car.id) ? 'border-forest bg-forest text-paper' : 'border-line bg-surface/90 text-ink hover:border-forest'}`}
                                                        aria-label={`Shortlist ${car.name}`}
                                                    >
                                                        <Heart size={16} fill={isWishlisted(car.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCompare(car); }}
                                                        aria-pressed={isCompared(car.id)}
                                                        className={`rounded-sm border p-2 transition-colors ${isCompared(car.id) ? 'border-forest bg-forest text-paper' : 'border-line bg-surface/90 text-ink hover:border-forest'}`}
                                                        aria-label={`Compare ${car.name}`}
                                                    >
                                                        <ArrowRightLeft size={16} aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
                                                <div>
                                                    <div className="mb-2 flex items-start justify-between gap-3">
                                                        <h3 className="title-md min-w-0">{car.name}</h3>
                                                        <span className="spec-value shrink-0 whitespace-nowrap text-forest">USD {(car.price / 1000).toFixed(0)}k</span>
                                                    </div>
                                                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                                                        <span className="spec-label">{car.type}</span>
                                                        <span className="spec-label">{car.hp} hp</span>
                                                        <span className="spec-label">{car.acceleration}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
                                                    <button
                                                        onClick={() => navigate(`/car-details/${car.id}`)}
                                                        className="link-cta text-[0.875rem]"
                                                    >
                                                        Full record <ArrowRight size={14} aria-hidden="true" />
                                                    </button>
                                                    <span className="meta shrink-0 text-[0.75rem] text-faint">REF {car.id.slice(0, 4).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-sand">
                                    <Search size={22} className="text-faint" aria-hidden="true" />
                                </div>
                                <h3 className="title-md">No vehicle matches that</h3>
                                <p className="mt-2 max-w-xs text-[0.9375rem] text-muted">
                                    Adjust the filters, or search for a different model.
                                </p>
                                <button
                                    onClick={() => { resetFilters(); setSearchInput(''); }}
                                    className="btn-secondary mt-6 px-5 py-2.5 text-sm"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
