/**
 * CSV export.
 *
 * The Export and Download controls in the dashboards produce a real
 * file rather than a toast that claims one was sent: the rows are
 * already in the browser, so building the file there is the honest
 * implementation, not a stand-in for a backend.
 */

/** Quote a cell only when it needs it, and double any inner quotes —
 *  an unescaped comma in a service name would shift every later column. */
function escapeCell(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export type CsvRow = Record<string, string | number | null | undefined>;

export function toCsv(rows: CsvRow[], columns: string[]): string {
    const header = columns.map(escapeCell).join(',');
    const body = rows.map(row => columns.map(col => escapeCell(row[col])).join(','));
    return [header, ...body].join('\r\n');
}

/**
 * Hand the file to the browser. Returns false when the download could
 * not be started, so the caller can report an error instead of
 * claiming success — object URLs are unavailable in some embedded
 * webviews.
 */
export function downloadCsv(filename: string, rows: CsvRow[], columns: string[]): boolean {
    try {
        // The BOM keeps Excel from mangling the rupee sign and any
        // non-ASCII name in the file.
        const blob = new Blob(['﻿', toCsv(rows, columns)], {
            type: 'text/csv;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Revoked on the next tick: Safari needs the URL to outlive the
        // click handler.
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
        return true;
    } catch {
        return false;
    }
}
