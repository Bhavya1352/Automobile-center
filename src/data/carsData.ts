/**
 * carsData.ts — Vehicle inventory data with type definitions.
 * Single source of truth for car interface + inventory array.
 */

export interface Car {
    id: string;
    name: string;
    brand: string;
    type: 'Coupe' | 'Sedan' | 'SUV' | 'Convertible' | 'Hypercar';
    price: number;
    hp: number;
    engine: string;
    acceleration: string;
    topSpeed: number;
    year: number;
    image: string;
    description: string;
    features: string[];
}

export const CARS: Car[] = [
    {
        id: 'porsche-911-gt3',
        name: '911 GT3 RS',
        brand: 'Porsche',
        type: 'Coupe',
        price: 223800,
        hp: 518,
        engine: '4.0L Flat-6',
        acceleration: '3.2s',
        topSpeed: 296,
        year: 2024,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&q=80',
        description: 'Engineered for maximum downforce and aerodynamic precision. The 911 GT3 RS is a street-legal race car that dominates both track and road.',
        features: ['DRS System', 'Carbon Ceramic Brakes', 'Alcantara Interior', 'Variable Valve Timing']
    },
    {
        id: 'ferrari-f8',
        name: 'F8 Tributo',
        brand: 'Ferrari',
        type: 'Coupe',
        price: 276550,
        hp: 710,
        engine: '3.9L V8 Twin-Turbo',
        acceleration: '2.9s',
        topSpeed: 340,
        year: 2023,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&q=80',
        description: 'A tribute to the most powerful V8 in Ferrari history. The F8 Tributo delivers unparalleled performance and aerodynamics.',
        features: ['S-Duct Technology', 'Side Slip Control 6.1', 'Magneride Suspension', 'V8 Special Series Engine']
    },
    {
        id: 'lamborghini-huracan',
        name: 'Huracán STO',
        brand: 'Lamborghini',
        type: 'Coupe',
        price: 327838,
        hp: 640,
        engine: '5.2L V10',
        acceleration: '3.0s',
        topSpeed: 310,
        year: 2024,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1000&q=80',
        description: 'Inspired by the racing heritage of Lamborghini Squadra Corse. A road-homologated super sports car with pure track performance.',
        features: ['Rear-Wheel Steering', 'Carbon Fiber Skin', 'Aero-optimized Chassis', 'Magnesium Wheels']
    },
    {
        id: 'mercedes-amg-gtr',
        name: 'AMG GT Black Series',
        brand: 'Mercedes',
        type: 'Coupe',
        price: 325000,
        hp: 720,
        engine: '4.0L V8 Biturbo',
        acceleration: '3.2s',
        topSpeed: 325,
        year: 2023,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&q=80',
        description: 'The pinnacle of AMG engineering. The Black Series features a flat-plane crankshaft and extreme aerodynamics for track domination.',
        features: ['Adjustable Rear Wing', 'Carbon Drive Shaft', '9-mode Traction Control', 'Uniball Bearings']
    },
    {
        id: 'mclaren-720s',
        name: '720S Spider',
        brand: 'McLaren',
        type: 'Convertible',
        price: 315000,
        hp: 710,
        engine: '4.0L V8 Twin-Turbo',
        acceleration: '2.8s',
        topSpeed: 341,
        year: 2024,
        image: 'https://images.unsplash.com/photo-1597404294360-fedeca044ad1?w=1000&q=80',
        description: 'Lighter, stronger, faster. The 720S Spider is the perfect fusion of extreme performance and open-top excitement.',
        features: ['Monocage II-S', 'Proactive Chassis Control II', 'Retractable Hard Top', 'Static Adaptive Headlights']
    },
    {
        id: 'bmw-m4-cs',
        name: 'M4 CSL',
        brand: 'BMW',
        type: 'Coupe',
        price: 139900,
        hp: 543,
        engine: '3.0L Inline-6 Twin-Turbo',
        acceleration: '3.6s',
        topSpeed: 307,
        year: 2024,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&q=80',
        description: 'Competition, Sport, Lightweight. The return of the CSL legend delivers the ultimate M driving experience.',
        features: ['Bucket Seats', 'Titanium Silencer', 'Laser Tail Lights', 'Carbon Fiber Bonnet']
    },
    {
        id: 'audi-rs6',
        name: 'RS6 Avant',
        brand: 'Audi',
        type: 'Sedan',
        price: 125800,
        hp: 621,
        engine: '4.0L V8 Twin-Turbo',
        acceleration: '3.3s',
        topSpeed: 305,
        year: 2024,
        image: 'https://images.unsplash.com/photo-1621485488224-5119bb559a7a?w=1000&q=80',
        description: 'The ultimate sleeper. Combining supercar performance with everyday practicality and estate-car versatility.',
        features: ['Quattro AWD', 'Dynamic All-wheel Steering', 'Matrix LED Headlights', 'Virtual Cockpit']
    },
    {
        id: 'aston-martin-dbx',
        name: 'DBX 707',
        brand: 'Aston Martin',
        type: 'SUV',
        price: 236000,
        hp: 697,
        engine: '4.0L V8 Twin-Turbo',
        acceleration: '3.1s',
        topSpeed: 310,
        year: 2024,
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1000&q=80',
        description: 'The worlds most powerful luxury SUV. Uniting peak performance with the spirit of the DB lineage.',
        features: ['Electronic Differential', 'Sports Exhaust System', 'Soft Close Doors', '23-inch Forged Wheels']
    }
];
