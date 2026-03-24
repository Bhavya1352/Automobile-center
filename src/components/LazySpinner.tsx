import React from 'react';

/**
 * LazySpinner — Full-screen loading indicator used as Suspense fallback.
 * Provides visual feedback during code-split chunk loading.
 */
const LazySpinner: React.FC = () => (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
        </div>
        <div className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">Loading Module</div>
    </div>
);

export default LazySpinner;
