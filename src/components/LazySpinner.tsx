import React from 'react';

/** Suspense fallback shown while a route chunk loads. */
const LazySpinner: React.FC = () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full border border-line" />
            <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-forest" />
        </div>
        <p className="spec-label">Loading</p>
    </div>
);

export default LazySpinner;
