import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type LegalDoc = 'privacy' | 'terms' | 'cookies';

const DOCS: Record<LegalDoc, { title: string; summary: string }> = {
    privacy: {
        title: 'Privacy policy',
        summary: 'What we record about you and your vehicle, why we keep it, and how to have it removed.',
    },
    terms: {
        title: 'Terms of service',
        summary: 'The terms you agree to when booking work, and the warranty that covers it.',
    },
    cookies: {
        title: 'Cookie policy',
        summary: 'What this site stores in your browser and what it is used for.',
    },
};

/**
 * Placeholder for the legal pages. These need real copy from the
 * business before launch; the route exists so the footer has no dead
 * links and the page states this honestly rather than pretending.
 */
const Legal: React.FC<{ doc: LegalDoc }> = ({ doc }) => {
    const { title, summary } = DOCS[doc];
    useDocumentTitle(title);

    return (
        <>
            <PageHero badge="Legal" title={title} subtitle={summary} breadcrumb={['Home', 'Legal', title]} />
            <div className="wrap pb-24">
                <div className="max-w-[62ch]">
                    <p className="text-[0.9375rem] leading-relaxed text-muted">
                        This document has not been published yet. For any question about how
                        we handle your data or the terms covering a booking, contact the
                        service centre and ask for the duty manager — we will answer in writing.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link to="/contact" className="btn btn-solid">Contact the centre</Link>
                        <Link to="/" className="link-cta">Back to home</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Legal;
