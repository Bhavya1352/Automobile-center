import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useVehicleDetail } from '../hooks/useVehicles';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { MAX_COMPARE } from '../types/inventory';
import { Zap, Gauge, Cpu, ArrowLeft, Heart, ArrowRightLeft, Clock, Search, CheckCircle2, Loader2 } from 'lucide-react';

const CarDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist, isCompared, toggleCompare } = useInventory();
    const { showToast } = useToast();

    const { state } = useVehicleDetail(id ?? '');
    const car = state.data?.car ?? null;
    const similar = state.data?.similar ?? [];
    const isLoading = state.status === 'loading';

    useDocumentTitle(car ? `${car.brand} ${car.name}` : isLoading ? null : 'Vehicle not found');

    const handleWishlist = () => {
        if (!car) return;
        const added = toggleWishlist(car.id);
        showToast(added ? `${car.name} saved to your shortlist` : `${car.name} removed from your shortlist`, added ? 'success' : 'info');
    };

    const handleCompare = () => {
        if (!car) return;
        const result = toggleCompare(car.id);
        if (result === 'added') showToast(`${car.name} added to comparison`, 'success');
        else if (result === 'removed') showToast(`${car.name} removed from comparison`, 'info');
        else showToast(`You can compare up to ${MAX_COMPARE} vehicles at a time`, 'error');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center bg-paper py-32">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={28} className="animate-spin text-forest" aria-hidden="true" />
                    <span className="spec-label" role="status">Loading the record</span>
                </div>
            </div>
        );
    }

    // 404 state
    if (!car) {
        return (
            <div className="wrap flex flex-col items-center justify-center py-28 text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-sm bg-sand">
                    <Search size={22} className="text-faint" aria-hidden="true" />
                </div>
                <h1 className="display-md">No record for that vehicle</h1>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
                    The link may be out of date, or the vehicle is no longer in the showcase.
                </p>
                <button onClick={() => navigate('/inventory')} className="btn btn-solid mt-8">
                    Back to the showcase
                </button>
            </div>
        );
    }

    const wishlisted = isWishlisted(car.id);
    const compared = isCompared(car.id);

    /* Every figure here comes off the record. The previous first tile
       read "Torque 750 Nm" for all eight vehicles — a number the dataset
       never held. Power is the field that was actually missing. */
    const stats = [
        { label: 'Power', value: `${car.hp} hp`, icon: Zap },
        { label: 'Top speed', value: `${car.topSpeed} km/h`, icon: Gauge },
        { label: '0–100 km/h', value: car.acceleration, icon: Clock },
        { label: 'Engine', value: car.engine, icon: Cpu },
    ];

    return (
        <div className="bg-paper pb-20">
            {/* Header. The page had no top padding, so this row sat flush
                against the fixed navbar. */}
            <div className="wrap mb-10 flex items-center justify-between gap-4 pt-10">
                <button onClick={() => navigate('/inventory')} className="flex items-center gap-2 text-[0.8125rem] font-medium text-muted transition-colors hover:text-ink">
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to the showcase
                </button>
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        onClick={handleCompare}
                        aria-pressed={compared}
                        className={`rounded-sm border p-2.5 transition-colors ${compared ? 'border-forest bg-forest text-paper' : 'border-line bg-surface text-muted hover:border-forest hover:text-ink'}`}
                        aria-label={`Compare ${car.name}`}
                    >
                        <ArrowRightLeft size={18} aria-hidden="true" />
                    </button>
                    <button
                        onClick={handleWishlist}
                        aria-pressed={wishlisted}
                        className={`rounded-sm border p-2.5 transition-colors ${wishlisted ? 'border-forest bg-forest text-paper' : 'border-line bg-surface text-muted hover:border-forest hover:text-ink'}`}
                        aria-label={`Shortlist ${car.name}`}
                    >
                        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Left: Visuals */}
                <div className="space-y-6">
                    {/* Title set below the photograph rather than over an
                        ivory gradient scrim: dark type on a scrim over an
                        unknown image is a contrast gamble. */}
                    <div className="photo-frame aspect-[4/3]">
                        <img src={car.image} alt={`${car.brand} ${car.name}`} className="photo" />
                    </div>
                    <div>
                        <p className="spec-label">{car.brand}&nbsp;&nbsp;/&nbsp;&nbsp;REF {car.id.slice(0, 4).toUpperCase()}</p>
                        <h1 className="display-lg mt-2">{car.name}</h1>
                    </div>

                    {/* Quick Stats */}
                    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {stats.map(stat => (
                            <div key={stat.label} className="panel-sand p-5 text-center">
                                <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-sm bg-forest-pale">
                                    <stat.icon size={16} className="text-forest" aria-hidden="true" />
                                </div>
                                <dd className="spec-value">{stat.value}</dd>
                                <dt className="spec-label mt-1.5">{stat.label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Right: Info */}
                <div className="space-y-10">
                    <div>
                        <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-4">
                            <div>
                                <dt className="spec-label">Body style</dt>
                                <dd className="spec-value mt-0.5">{car.type}</dd>
                            </div>
                            <div>
                                <dt className="spec-label">Model year</dt>
                                <dd className="spec-value mt-0.5">{car.year}</dd>
                            </div>
                            <div>
                                <dt className="spec-label">Marque</dt>
                                <dd className="spec-value mt-0.5">{car.brand}</dd>
                            </div>
                        </dl>
                        <p className="lede mt-6">{car.description}</p>
                    </div>

                    <div className="panel-sand p-6 sm:p-8">
                        <div>
                            {/* Was "$224k.00" — a decimal suffix after a
                                thousands abbreviation. */}
                            <p className="spec-label">Indicative price</p>
                            <p className="stat mt-1.5 text-[2.5rem]">
                                USD {(car.price / 1000).toFixed(0)}k
                            </p>
                            <p className="mt-1 text-[0.8125rem] text-muted">
                                Manufacturer&rsquo;s figure as recorded in our showcase.
                            </p>
                        </div>

                        <ul className="mt-8 space-y-0 border-t border-line-soft">
                            {car.features.map(f => (
                                <li key={f} className="flex items-center gap-3 border-b border-line-soft py-3 text-[0.9375rem] text-ink-soft">
                                    <CheckCircle2 size={15} className="shrink-0 text-forest" aria-hidden="true" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* Both buttons here were inert, and offered to reserve
                            and test-drive a car the showcase does not sell. The
                            inspection is a service we actually run. */}
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <Link to="/contact" className="btn btn-solid w-full">
                                Book an inspection
                            </Link>
                            <Link to="/compare" className="btn btn-outline w-full">
                                Compare vehicles
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {similar.length > 0 && (
                <section className="wrap mt-24">
                    <h2 className="display-md border-b border-ink pb-6">Comparable records</h2>
                    {/* The grid was held at 60% opacity until hover, so on any
                        touch device it never reached full contrast. Each card is
                        a button now, not a div with an onClick. */}
                    <ul className="mt-8 grid gap-6 sm:grid-cols-3">
                        {similar.map(rec => (
                            <li key={rec.id}>
                                <button
                                    type="button"
                                    onClick={() => { navigate(`/car-details/${rec.id}`); window.scrollTo(0, 0); }}
                                    className="panel w-full border-line p-5 text-left transition-colors hover:border-forest"
                                >
                                    <span className="photo-frame block h-32">
                                        <img src={rec.image} className="photo" alt={`${rec.brand} ${rec.name}`} loading="lazy" />
                                    </span>
                                    <span className="mt-4 flex items-center justify-between gap-3">
                                        <span className="title-sm min-w-0 truncate">{rec.name}</span>
                                        <span className="spec-value shrink-0 whitespace-nowrap text-forest">USD {(rec.price / 1000).toFixed(0)}k</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default CarDetails;
