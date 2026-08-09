/**
 * Single source of truth for user-facing date rendering.
 *
 * Public themes render in Indonesian, the admin UI renders in English — pass
 * the locale explicitly at the call site. Whether a surface shows the clock
 * time is decided by picking `formatDateTime` over `formatDate`, never by
 * hand-editing format options across a dozen files.
 */

type DateInput = Date | string | number;

export type DateLocale = "id" | "en";

const LOCALE_TAGS: Record<DateLocale, string> = {
    id: "id-ID",
    en: "en-US",
};

function toDate(value: DateInput): Date | null {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function render(
    value: DateInput,
    options: Intl.DateTimeFormatOptions,
    locale: DateLocale
): string {
    const date = toDate(value);
    if (!date) return "";
    return new Intl.DateTimeFormat(LOCALE_TAGS[locale], options).format(date);
}

/** `3 Agu 2026` — lists, cards, table cells. */
export function formatDate(value: DateInput, locale: DateLocale = "id"): string {
    return render(value, { day: "numeric", month: "short", year: "numeric" }, locale);
}

/** `3 Agustus 2026` — single post / page headers. */
export function formatDateLong(value: DateInput, locale: DateLocale = "id"): string {
    return render(value, { day: "numeric", month: "long", year: "numeric" }, locale);
}

/** `Senin, 3 Agustus 2026` — greetings and datelines that spell out the weekday. */
export function formatDateFull(value: DateInput, locale: DateLocale = "id"): string {
    return render(
        value,
        { weekday: "long", day: "numeric", month: "long", year: "numeric" },
        locale
    );
}

/** `3 Agu 2026, 14.05` — only where the clock time carries meaning (audit trails). */
export function formatDateTime(value: DateInput, locale: DateLocale = "id"): string {
    return render(
        value,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        },
        locale
    );
}

/** `2026-08-03` — sortable and locale-independent, for tabular listings. */
export function formatDateNumeric(value: DateInput): string {
    const date = toDate(value);
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}
