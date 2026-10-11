import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CARS } from '../data/carsData';
import type { Car } from '../types/vehicle';
import { useInventory } from '../hooks/useInventory';
import { MAX_COMPARE } from '../types/inventory';
import { ArrowLeft, Trash2, Zap, Gauge, Clock, Calendar, CheckSquare, Plus, Sparkles, ArrowRightLeft } from 'lucide-react';

interface ComparisonRow {
    id: keyof Car;
    label: string;
    icon: React.ElementType;
    render: (car: Car) => string;
}

const Comparison: React.FC = () => {
    const navigate = useNavigate();
    const { compareList, removeFromCompare } = useInventory();

    const selectedCars = CARS.filter(car => compareList.includes(car.id));

    if (selectedCars.length === 0) {
        return (
            <div className="wrap flex flex-col items-center justify-center py-28 text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-sm bg-sand">
                    <ArrowRightLeft size={22} className="text-faint" aria-hidden="true" />
                </div>
                <h1 className="display-md">Nothing to compare yet</h1>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
                    Pick up to {MAX_COMPARE} vehicles in the showcase and their recorded
                    figures appear here side by side.
                </p>
                <button onClick={() => navigate('/inventory')} className="btn btn-solid mt-8">
                    Open the showcase
                </button>
            </div>
        );
    }

    /* Each row owns its own accessor, so a formatter can never be
       handed a field of the wrong type. Previously every key was cast
       to `keyof Car` and number formatters were applied to strings. */
    const comparisonRows: ComparisonRow[] = [
        { id: 'brand', label: 'Brand', icon: Sparkles, render: car => car.brand },
        { id: 'price', label: 'Price', icon: Zap, render: car => `USD ${(car.price / 1000).toFixed(0)}k` },
        { id: 'hp', label: 'Power', icon: Zap, render: car => `${car.hp} HP` },
        { id: 'acceleration', label: '0-100 km/h', icon: Clock, render: car => car.acceleration },
        { id: 'topSpeed', label: 'Top Speed', icon: Gauge, render: car => `${car.topSpeed} km/h` },
        { id: 'engine', label: 'Engine', icon: Calendar, render: car => car.engine },
        { id: 'type', label: 'Body Style', icon: CheckSquare, render: car => car.type },
    ];

    return (
        <div className="bg-paper pb-20">
            {/* Masthead — on the page grid, in the house type. The italic
                uppercase title here was the only one in the project. */}
            <div className="wrap mb-12 pt-10">
                <button onClick={() => navigate('/inventory')} className="group mb-6 flex items-center gap-2 text-[0.8125rem] font-medium text-muted transition-colors hover:text-ink">
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to the showcase
                </button>
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="spec-label">Vehicle showcase&nbsp;&nbsp;/&nbsp;&nbsp;Compare</p>
                        <h1 className="display-lg mt-3">Side by side</h1>
                    </div>
                    {selectedCars.length < MAX_COMPARE && (
                        <button
                            onClick={() => navigate('/inventory')}
                            className="btn btn-outline shrink-0 px-5 py-2.5 text-[0.875rem]"
                        >
                            <Plus size={15} aria-hidden="true" /> Add another vehicle
                        </button>
                    )}
                </div>
            </div>

            <div className="wrap">
                <p className="mb-3 text-[0.8125rem] text-muted lg:hidden" role="note">
                    Scroll the table sideways to see every column.
                </p>
                <div className="panel overflow-hidden border-line">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-line">
                                    <th scope="col" className="w-56 bg-sand p-6">
                                        <span className="spec-label">Metric</span>
                                    </th>
                                    {selectedCars.map(car => (
                                        <th scope="col" key={car.id} className="relative min-w-[250px] border-l border-line p-6 align-top">
                                            <div className="photo-frame relative mb-5 h-40">
                                                <img src={car.image} alt={`${car.brand} ${car.name}`} className="photo" />
                                                {/* Always visible: hidden behind :hover this was
                                                    unreachable on touch, and bg-red-500 was not
                                                    in the palette at all. */}
                                                <button
                                                    onClick={() => removeFromCompare(car.id)}
                                                    className="absolute right-2 top-2 rounded-sm border border-line bg-surface/90 p-2 text-clay-ink transition-colors hover:border-clay hover:bg-clay-pale"
                                                    aria-label={`Remove ${car.brand} ${car.name} from the comparison`}
                                                >
                                                    <Trash2 size={14} aria-hidden="true" />
                                                </button>
                                            </div>
                                            <p className="spec-label">{car.brand}</p>
                                            <p className="title-md mt-1">{car.name}</p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row) => (
                                    <tr key={row.id} className="group border-b border-line transition-colors hover:bg-sand">
                                        <th scope="row" className="bg-sand p-6 text-left">
                                            <span className="flex items-center gap-3 text-sm font-semibold text-muted">
                                                <row.icon size={15} className="text-faint transition-colors group-hover:text-forest" aria-hidden="true" />
                                                {row.label}
                                            </span>
                                        </th>
                                        {selectedCars.map(car => (
                                            <td key={`${car.id}-${row.id}`} className="spec-value border-l border-line p-6">
                                                {row.render(car)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <th scope="row" className="bg-sand p-6 text-left">
                                        <span className="text-sm font-semibold text-muted">Record</span>
                                    </th>
                                    {selectedCars.map(car => (
                                        <td key={`${car.id}-action`} className="border-l border-line p-6">
                                            <button
                                                onClick={() => navigate(`/car-details/${car.id}`)}
                                                className="btn-primary w-full px-4 py-2.5 text-xs"
                                            >
                                                Full record
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="mt-10 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-muted">
                    Figures are the manufacturer&rsquo;s published numbers as recorded in our
                    showcase, not our own measurements. Prices are indicative and in US
                    dollars.
                </p>
            </div>
        </div>
    );
};

export default Comparison;
