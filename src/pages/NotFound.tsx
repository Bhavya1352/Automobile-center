import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
    <div className="wrap flex min-h-[60vh] flex-col justify-center py-20">
        <p className="spec-label">Error 404</p>
        <h1 className="display-lg mt-3 max-w-[20ch]">
            That page is not in the workshop.
        </h1>
        <p className="lede mt-5 max-w-[42ch]">
            The link may be out of date, or the page may have moved. The
            service pages below are the usual starting points.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/" className="btn btn-solid">Back to home</Link>
            <Link to="/contact" className="link-cta">Book a service</Link>
        </div>
    </div>
);

export default NotFound;
