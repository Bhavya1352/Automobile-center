import React from 'react';
import Home1 from './Home1';
import Home2 from './Home2';

/**
 * The main homepage combines:
 *  - Home1: Services, Diagnostics, Pricing, FAQ, Stats banner
 *  - Home2: Heritage, Timeline, Showcase, Team Preview, CTA
 * A subtle section divider separates the two halves.
 */
const Home: React.FC = () => {
    return (
        <div className="flex flex-col">
            <Home1 />
            {/* Section divider between the two home halves */}
            <div className="w-full border-t border-white/5" />
            <Home2 />
        </div>
    );
};

export default Home;
