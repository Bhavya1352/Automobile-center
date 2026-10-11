import React from 'react';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/cn';
import type { Recommendation } from '../../lib/recommendations';

interface RecommendationDialogProps {
    open: boolean;
    onClose: () => void;
    recommendation: Recommendation | null;
    /** Offered only when the recommendation names a bookable service. */
    onBook: (vehicleId: string, serviceSlug: string, notes: string) => void;
}

const PRIORITY_TONE: Record<Recommendation['priority'], string> = {
    Urgent: 'bg-clay-pale text-clay-ink',
    Soon: 'bg-clay-pale text-clay-ink',
    Routine: 'bg-sand text-muted',
};

/**
 * RecommendationDialog — why the dashboard raised this, in full.
 *
 * Every recommendation carries the records it was drawn from, so the
 * owner can see it came from their own service history rather than a
 * marketing calendar. Advisories with nothing to book (an insurance
 * lapse, say) offer no booking button rather than a misleading one.
 */
export const RecommendationDialog: React.FC<RecommendationDialogProps> = ({
    open, onClose, recommendation, onBook,
}) => {
    if (!recommendation) return null;
    const { serviceSlug, serviceName, vehicleId, title } = recommendation;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            description={recommendation.vehicleLabel}
            footer={
                <>
                    <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-[0.875rem]">
                        Close
                    </button>
                    {serviceSlug && (
                        <button
                            type="button"
                            onClick={() => onBook(vehicleId, serviceSlug, `${title} — ${recommendation.summary}`)}
                            className="btn-primary px-5 py-2.5 text-[0.875rem]"
                        >
                            Book {serviceName}
                        </button>
                    )}
                </>
            }
        >
            <div className="space-y-5">
                <span className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-bold',
                    PRIORITY_TONE[recommendation.priority],
                )}>
                    {recommendation.priority}
                </span>

                <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{recommendation.detail}</p>

                <div>
                    <p className="spec-label">Drawn from</p>
                    <ul className="mt-2 space-y-1.5">
                        {recommendation.basis.map(line => (
                            <li key={line} className="flex gap-2.5 text-[0.875rem] text-muted">
                                <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary" />
                                {line}
                            </li>
                        ))}
                    </ul>
                </div>

                {!serviceSlug && (
                    <p className="border border-line bg-sand px-4 py-3 text-[0.875rem] text-muted">
                        Nothing to book for this one — it is on the dashboard so it does not
                        catch you out.
                    </p>
                )}
            </div>
        </Modal>
    );
};
