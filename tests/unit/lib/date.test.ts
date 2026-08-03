import { describe, it, expect } from "vitest";
import {
    formatDate,
    formatDateLong,
    formatDateFull,
    formatDateTime,
    formatDateNumeric,
} from "@/lib/utils/date";

// 3 August 2026 was a Monday
const SAMPLE = new Date(2026, 7, 3, 14, 5);

describe("date formatting", () => {
    it("renders short dates in Indonesian by default", () => {
        expect(formatDate(SAMPLE)).toBe("3 Agu 2026");
    });

    it("renders short dates in English when asked", () => {
        expect(formatDate(SAMPLE, "en")).toBe("Aug 3, 2026");
    });

    it("spells out the month for long dates", () => {
        expect(formatDateLong(SAMPLE)).toBe("3 Agustus 2026");
        expect(formatDateLong(SAMPLE, "en")).toBe("August 3, 2026");
    });

    it("includes the weekday for full dates", () => {
        expect(formatDateFull(SAMPLE)).toBe("Senin, 3 Agustus 2026");
        expect(formatDateFull(SAMPLE, "en")).toBe("Monday, August 3, 2026");
    });

    it("includes the clock time only for formatDateTime", () => {
        expect(formatDateTime(SAMPLE, "en")).toBe("Aug 3, 2026, 14:05");
        expect(formatDate(SAMPLE, "en")).not.toContain("14");
    });

    it("uses a 24-hour clock", () => {
        expect(formatDateTime(new Date(2026, 7, 3, 0, 30), "en")).toContain("00:30");
        expect(formatDateTime(new Date(2026, 7, 3, 23, 45), "en")).toContain("23:45");
    });

    it("renders numeric dates locale-independently and zero-padded", () => {
        expect(formatDateNumeric(SAMPLE)).toBe("2026-08-03");
        expect(formatDateNumeric(new Date(2026, 10, 25))).toBe("2026-11-25");
    });

    it("accepts strings and timestamps", () => {
        expect(formatDate("2026-08-03T00:00:00", "en")).toBe("Aug 3, 2026");
        expect(formatDate(SAMPLE.getTime(), "en")).toBe("Aug 3, 2026");
    });

    it("returns an empty string for unparseable input instead of throwing", () => {
        expect(formatDate("not a date")).toBe("");
        expect(formatDateTime(new Date("nope"))).toBe("");
        expect(formatDateNumeric("")).toBe("");
    });
});
