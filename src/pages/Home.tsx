import React from 'react';
import Home1 from './Home1';
import Home2 from './Home2';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col">
            <Home1 />
            <div className="py-20 border-t border-white/5 opacity-20" />
            <Home2 />
        </div>
    );
};

export default Home;
