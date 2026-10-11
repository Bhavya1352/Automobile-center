import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import { ErrorState } from '../ui/DataState';
import { runVehicleCheck } from '../../services/workshopService';
import { useWorkshop, vehicleLabel } from '../../hooks/useWorkshop';
import { cn } from '../../lib/cn';
import type { OwnedVehicle, VehicleCheckResult } from '../../types/workshop';

interface VehicleCheckDialogProps {
    open: boolean;
    onClose: () => void;
    vehicles: OwnedVehicle[];
    presetVehicleId?: string;
    /** Carries the assessment through to the booking form. */
    onBook: (vehicleId: string, serviceSlug: string, notes: string) => void;
}

const URGENCY_TONE: Record<VehicleCheckResult['urgency'], string> = {
    Monitor: 'bg-sand text-muted',
    'Service soon': 'bg-clay-pale text-clay-ink',
    Urgent: 'bg-clay-pale text-clay-ink',
};

/** Shortest description that could plausibly name a symptom. */
const MIN_SYMPTOM_LENGTH = 12;

/**
 * VehicleCheckDialog — the AI vehicle check, run against the owner's
 * own record.
 *
 * The assessment is produced by a symptom matcher in the service
 * layer, not a language model, and the panel says as much: it reports
 * what it matched, which of the car's records it leaned on, and
 * reaches a booking rather than a conclusion. The homepage promises a
 * triage step; this is that step, not a pretend oracle.
 */
export const VehicleCheckDialog: React.FC<VehicleCheckDialogProps> = ({
    open, onClose, vehicles, presetVehicleId, onBook,
}) => {
    const { records } = useWorkshop();
    // Mounted afresh each time it is opened, so the preselection the
    // caller asked for is simply the initial value.
    const [vehicleId, setVehicleId] = useState(presetVehicleId ?? vehicles[0]?.id ?? '');
    const [symptom, setSymptom] = useState('');
    const [touched, setTouched] = useState(false);
    const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
    const [result, setResult] = useState<VehicleCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const tooShort = symptom.trim().length < MIN_SYMPTOM_LENGTH;
    const fieldError = touched && tooShort
        ? 'Describe the symptom in a few more words — when it happens, and what it feels like.'
        : undefined;

    const run = async () => {
        setTouched(true);
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (tooShort || !vehicle) return;

        setStatus('running');
        setError(null);
        try {
            setResult(await runVehicleCheck({ symptom, vehicle, records }));
            setStatus('done');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'The check could not be completed.');
            setStatus('error');
        }
    };

    const startOver = () => {
        setResult(null);
        setStatus('idle');
        setSymptom('');
        setTouched(false);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="md"
            busy={status === 'running'}
            title="AI vehicle check"
            description="Describe the symptom in your own words. The check reads it against this car's own service record."
            footer={status === 'done' && result ? (
                <>
                    <button type="button" onClick={startOver} className="btn-secondary px-5 py-2.5 text-[0.875rem]">
                        Check something else
                    </button>
                    <button
                        type="button"
                        onClick={() => onBook(vehicleId, result.recommendedSlug, result.symptom)}
                        className="btn-primary px-5 py-2.5 text-[0.875rem]"
                    >
                        Book {result.recommendedName} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button" onClick={onClose} disabled={status === 'running'}
                        className="btn-secondary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" form="check-form" disabled={status === 'running' || vehicles.length === 0}
                        className="btn-primary px-5 py-2.5 text-[0.875rem] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === 'running' && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {status === 'running' ? 'Reading the record…' : 'Run the check'}
                    </button>
                </>
            )}
        >
            {status === 'error' ? (
                <ErrorState message={error ?? 'The check could not be completed.'} onRetry={run} />
            ) : status === 'done' && result ? (
                <div className="space-y-5">
                    <div>
                        <p className="spec-label">You described</p>
                        <p className="mt-2 border-l-2 border-line pl-4 text-[1rem] italic leading-relaxed text-ink-soft">
                            &ldquo;{result.symptom}&rdquo;
                        </p>
                        <p className="mt-2 text-xs text-muted">{result.vehicleLabel}</p>
                    </div>

                    <hr className="rule" />

                    <div>
                        <p className="spec-label">Likely cause</p>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{result.likelyCause}</p>
                    </div>

                    <div>
                        <p className="spec-label">What this is based on</p>
                        <ul className="mt-2 space-y-1.5">
                            {result.basis.map(line => (
                                <li key={line} className="flex gap-2.5 text-[0.875rem] text-muted">
                                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary" />
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', URGENCY_TONE[result.urgency])}>
                            {result.urgency}
                        </span>
                        <span className="text-[0.875rem] text-muted">{result.urgencyNote}</span>
                    </div>

                    <div className="border border-line bg-sand px-4 py-3">
                        <p className="spec-label">Suggested next step</p>
                        <p className="mt-1 text-[0.9375rem] font-semibold text-ink">{result.recommendedMeta}</p>
                        <p className="mt-1 text-xs text-muted">
                            A triage step, not a diagnosis — the technician confirms it on the ramp.
                        </p>
                    </div>
                </div>
            ) : (
                <form
                    id="check-form"
                    onSubmit={event => { event.preventDefault(); void run(); }}
                    noValidate
                    className="space-y-4"
                >
                    {vehicles.length === 0 ? (
                        <p className="text-[0.9375rem] text-muted">
                            Add a vehicle to your garage first — the check reads a car&rsquo;s own history.
                        </p>
                    ) : (
                        <>
                            <Field
                                as="select" label="Vehicle" name="vehicleId" value={vehicleId}
                                onChange={event => setVehicleId(event.target.value)}
                            >
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{vehicleLabel(v)} · {v.registration}</option>
                                ))}
                            </Field>

                            <Field
                                as="textarea" label="What is it doing?" name="symptom" rows={4}
                                value={symptom}
                                onChange={event => setSymptom(event.target.value)}
                                onBlur={() => setTouched(true)}
                                error={fieldError}
                                placeholder="A vibration through the steering wheel when I brake from highway speed."
                                hint="The noise, when it happens, what it feels like."
                            />

                            {status === 'running' && (
                                <p role="status" aria-live="polite" className="text-[0.875rem] text-muted">
                                    Reading this vehicle&rsquo;s service record…
                                </p>
                            )}
                        </>
                    )}
                </form>
            )}
        </Modal>
    );
};
