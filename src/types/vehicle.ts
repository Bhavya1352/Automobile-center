/** Vehicle domain types, shared by the data layer, services and UI. */

export type BodyStyle = 'Coupe' | 'Sedan' | 'Estate' | 'SUV' | 'Convertible';

export type VehicleSort = 'price-asc' | 'price-desc' | 'hp-desc';

export interface Car {
    id: string;
    name: string;
    brand: string;
    type: BodyStyle;
    /** USD, whole units. */
    price: number;
    hp: number;
    engine: string;
    /** 0–100 km/h, e.g. "3.2s". */
    acceleration: string;
    /** km/h. */
    topSpeed: number;
    year: number;
    image: string;
    description: string;
    features: string[];
}

export interface FetchCarsParams {
    search?: string;
    type?: string;
    maxPrice?: number;
    sort?: VehicleSort;
}
