import React from 'react';
import Hero from '../sections/Hero';
import Accreditations from '../sections/Accreditations';
import Services from '../sections/Services';
import HowItWorks from '../sections/HowItWorks';
import AiCheck from '../sections/AiCheck';
import VehicleHealth from '../sections/VehicleHealth';
import Trust from '../sections/Trust';
import Pricing from '../sections/Pricing';
import Testimonials from '../sections/Testimonials';
import Faq from '../sections/Faq';
import ClosingCta from '../sections/ClosingCta';

/**
 * Home — the section order alternates ground (paper / sand / forest)
 * and composition (asymmetric / grid / full-bleed) so no two
 * consecutive sections read the same way.
 */
const Home: React.FC = () => (
    <>
        <Hero />
        <Accreditations />
        <Services />
        <HowItWorks />
        <AiCheck />
        <VehicleHealth />
        <Trust />
        <Pricing />
        <Testimonials />
        <Faq />
        <ClosingCta />
    </>
);

export default Home;
