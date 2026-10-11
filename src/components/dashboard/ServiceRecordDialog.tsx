import React from 'react';
import { Star, Download } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useToast } from '../../hooks/useToast';
import { useWorkshop, vehicleLabel } from '../../hooks/useWorkshop';
import { formatDate, formatKm, formatRupees } from '../../lib/format';
import { downloadCsv } from '../../lib/csv';
import type { ServiceRecord } from '../../types/workshop';

interface ServiceRecordDialogProps {
    open: boolean;
    onClose: () => void;
    record: ServiceRecord | null;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
        <dt className="text-[0.8125rem] text-muted">{label}</dt>
        <dd className="text-right text-[0.875rem] font-medium text-ink">{children}</dd>
    </div>
);

/**
 * ServiceRecordDialog — the receipt for one completed visit.
 *
 * Line items, the reading the car arrived on, and the invoice number,
 * because "₹11,480 — Periodic Maintenance" on its own is not a record
 * anyone can check a year later.
 */
export const ServiceRecordDialog: React.FC<ServiceRecordDialogProps> = ({
    open, onClose, record,
}) => {
    const { vehicles } = useWorkshop();
    const { showToast } = useToast();
    if (!record) return null;

    const vehicle = vehicles.find(v => v.id === record.vehicleId);

    const exportRecord = () => {
        const ok = downloadCsv(
            `${record.invoiceId}.csv`,
            record.workDone.map(line => ({
                Invoice: record.invoiceId,
                Date: record.completedOn,
                Vehicle: vehicleLabel(vehicle),
                Service: record.serviceName,
                Technician: record.technician,
                'Work done': line,
                'Total (INR)': record.cost,
            })),
            ['Invoice', 'Date', 'Vehicle', 'Service', 'Technician', 'Work done', 'Total (INR)'],
        );
        showToast(
            ok ? `${record.invoiceId} downloaded.` : 'The download could not be started.',
            ok ? 'success' : 'error',
        );
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={record.serviceName}
            description={`${record.invoiceId} · ${formatDate(record.completedOn)}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-[0.875rem]">
                        Close
                    </button>
                    <button type="button" onClick={exportRecord} className="btn-primary px-5 py-2.5 text-[0.875rem]">
                        <Download size={14} aria-hidden="true" /> Download receipt
                    </button>
                </>
            }
        >
            <div className="space-y-6">
                <dl>
                    <Row label="Vehicle">{vehicleLabel(vehicle)}{vehicle ? ` · ${vehicle.registration}` : ''}</Row>
                    <Row label="Odometer at service">{formatKm(record.odometerKm)}</Row>
                    <Row label="Technician">{record.technician}</Row>
                    <Row label="Your rating">
                        {record.rating === null ? (
                            <span className="text-muted">Not rated</span>
                        ) : (
                            <span className="inline-flex items-center gap-0.5" aria-label={`${record.rating} out of 5`}>
                                {Array.from({ length: record.rating }).map((_, i) => (
                                    <Star key={i} size={12} className="fill-clay text-clay-ink" aria-hidden="true" />
                                ))}
                            </span>
                        )}
                    </Row>
                </dl>

                <section>
                    <p className="spec-label">Work carried out</p>
                    <ul className="mt-2.5 space-y-2">
                        {record.workDone.map(line => (
                            <li key={line} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-soft">
                                <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary" />
                                {line}
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="flex items-baseline justify-between border-t border-ink pt-4">
                    <span className="text-[0.875rem] font-semibold text-ink">Total paid</span>
                    <span className="text-[1.25rem] font-bold text-primary">{formatRupees(record.cost)}</span>
                </div>
            </div>
        </Modal>
    );
};
