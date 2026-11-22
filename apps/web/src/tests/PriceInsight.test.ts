import { describe, expect, it } from "vitest";
import type { PriceHistoryOutputType } from "@repo/types";
import { PriceInsight } from "../lib/utils/PriceInsight";

const NOW = new Date("2026-05-01T12:00:00.000Z");
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function entry(
  price: number | string,
  daysAgo: number,
  extraHoursAgo = 0,
  asDate = false
): PriceHistoryOutputType {
  const date = new Date(NOW.getTime() - daysAgo * DAY_MS - extraHoursAgo * HOUR_MS);
  return {
    productId: "test-product-id",
    price: typeof price === "number" ? price.toFixed(2) : price,
    checkedAt: asDate ? date : date.toISOString(),
  };
}

describe("PriceInsight", () => {
  describe("1. Insufficient data & 30-day rolling window", () => {
    it("1. returns insufficient_data for empty history", () => {
      expect(PriceInsight([], NOW)).toEqual({ status: "insufficient_data" });
    });

    it("2. returns insufficient_data for a single price record", () => {
      expect(PriceInsight([entry(1000, 1)], NOW)).toEqual({
        status: "insufficient_data",
      });
    });

    it("3. returns no_change when the latest record is older than 30 days", () => {
      const history = [entry(1000, 40), entry(700, 31)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("4. still analyzes when the latest record is just inside the 30-day window (29d 23h ago)", () => {
      const history = [entry(1000, 35), entry(800, 29, 23)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(200, 2);
    });

    it("5. anchors the latest pre-window record as baseline when only 1 record is inside the 30-day window", () => {
      const history = [entry(1000, 40), entry(800, 5)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(200, 2);
    });

    it("6. ignores older pre-window records and anchors only the most recent one", () => {
      const history = [entry(500, 60), entry(1000, 40), entry(800, 5)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(200, 2);
    });
  });

  describe("2. 1% noise filter & threshold boundaries", () => {
    it("7. returns no_change when price stays completely flat", () => {
      const history = [entry(1000, 5), entry(1000, 0)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("8. filters out sub-1% price increases (+0.9%) as no_change", () => {
      const history = [entry(1000, 3), entry(1009, 0)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("9. filters out sub-1% price drops (-0.9%) as no_change", () => {
      const history = [entry(1000, 3), entry(991, 0)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("10. detects an exact 1% increase boundary as price_increase", () => {
      const history = [entry(1000, 3), entry(1010, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(1, 2);
      expect(result.priceChangeAmount).toBeCloseTo(10, 2);
    });

    it("11. detects an exact 1% decrease boundary as real_discount", () => {
      const history = [entry(1000, 3), entry(990, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(1, 2);
      expect(result.priceChangeAmount).toBeCloseTo(10, 2);
    });

    it("12. skips trailing noisy records (<1% apart) to find the real preceding price shift", () => {
      const history = [
        entry(1000, 10),
        entry(1200, 4),
        entry(1205, 2),
        entry(1202, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(20.2, 2);
      expect(result.priceChangeAmount).toBeCloseTo(202, 2);
    });

    it("13. returns no_change across cumulative micro-fluctuations all staying under 1%", () => {
      const history = [
        entry(1000, 10),
        entry(1005, 6),
        entry(1008, 3),
        entry(1002, 0),
      ];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });
  });

  describe("3. Price increases & trough scanning", () => {
    it("14. calculates single-step price increase amount and percentage accurately", () => {
      const history = [entry(1000, 5), entry(1250, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(25, 2);
      expect(result.priceChangeAmount).toBeCloseTo(250, 2);
    });

    it("15. computes cumulative increase relative to the lowest baseline across stepped hikes", () => {
      const history = [
        entry(1000, 12),
        entry(1100, 8),
        entry(1200, 4),
        entry(1500, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(50, 2);
      expect(result.priceChangeAmount).toBeCloseTo(500, 2);
    });

    it("16. stops baseline scan at a prior higher peak after a drop-and-rebound", () => {
      const history = [entry(1500, 15), entry(1000, 7), entry(1300, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(30, 2);
      expect(result.priceChangeAmount).toBeCloseTo(300, 2);
    });

    it("17. does not break baseline scan on minor (<1%) pre-hike noise", () => {
      const history = [
        entry(1000, 10),
        entry(1005, 7),
        entry(1002, 4),
        entry(1200, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(200, 2);
    });
  });

  describe("4. Real discounts", () => {
    it("18. returns real_discount when the peak is at the start of the window (peakIndex === 0)", () => {
      const history = [entry(1000, 10), entry(800, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(200, 2);
    });

    it("19. computes total discount from highest peak across stepped price drops", () => {
      const history = [entry(1200, 10), entry(1100, 5), entry(900, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(25, 2);
      expect(result.priceChangeAmount).toBeCloseTo(300, 2);
    });

    it("20. treats a drop from a peak older than 5 days as real_discount (settled market price)", () => {
      const history = [entry(1000, 20), entry(1500, 8), entry(1200, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(300, 2);
    });

    it("21. respects exact 5-day peak-age boundary (5.0d -> fake_discount vs 5d 1h -> real_discount)", () => {
      const atExact5Days = [entry(1000, 10), entry(1500, 5), entry(1200, 0)];
      const past5Days = [entry(1000, 10), entry(1500, 5, 1), entry(1200, 0)];

      expect(PriceInsight(atExact5Days, NOW).status).toBe("fake_discount");
      expect(PriceInsight(past5Days, NOW).status).toBe("real_discount");
    });

    it("22. returns real_discount when price drops below the pre-hike baseline", () => {
      const history = [entry(1000, 10), entry(1400, 2), entry(850, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo((550 / 1400) * 100, 2);
      expect(result.priceChangeAmount).toBeCloseTo(550, 2);
    });
  });

  describe("5. Short-lived (<24h) price spike filtering", () => {
    it("23. filters out a <24h spike that reverts exactly to the pre-hike price as no_change", () => {
      const history = [entry(1000, 5), entry(1400, 0, 10), entry(1000, 0)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("24. filters out a <24h spike that reverts within 1% of the pre-hike baseline as no_change", () => {
      const history = [entry(1000, 5), entry(1400, 0, 6), entry(995, 0)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("25. treats a >24h hike reverting to baseline (36h duration) as real_discount", () => {
      const history = [entry(1000, 5), entry(1400, 1, 12), entry(1000, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo((400 / 1400) * 100, 2);
      expect(result.priceChangeAmount).toBeCloseTo(400, 2);
    });

    it("26. still detects real_discount when a <24h spike is followed by a genuine drop well below baseline", () => {
      const history = [entry(1000, 5), entry(1400, 0, 6), entry(800, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangePercent).toBeCloseTo((600 / 1400) * 100, 2);
      expect(result.priceChangeAmount).toBeCloseTo(600, 2);
    });
  });

  describe("6. Fake discounts (raise-then-discount) & edge conversions", () => {
    it("27. detects classic raise-then-discount with accurate base, peak, dates, and percentages", () => {
      const base = entry(1000, 10);
      const peak = entry(1500, 3);
      const latest = entry(1200, 0);
      const result = PriceInsight([base, peak, latest], NOW);

      expect(result.status).toBe("fake_discount");
      expect(result.basePrice).toBe(1000);
      expect(result.peakPrice).toBe(1500);
      expect(result.baseDate).toBe(base.checkedAt);
      expect(result.peakDate).toBe(peak.checkedAt);
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
      expect(result.priceChangeAmount).toBeCloseTo(200, 2);
      expect(result.recentDropPercent).toBeCloseTo(20, 2);
      expect(result.recentDropAmount).toBeCloseTo(300, 2);
    });

    it("28. scans past intermediate stepped hikes to find the true pre-hike baseline", () => {
      const history = [
        entry(1000, 4),
        entry(1200, 3),
        entry(1500, 2),
        entry(1300, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("fake_discount");
      expect(result.basePrice).toBe(1000);
      expect(result.peakPrice).toBe(1500);
      expect(result.priceChangePercent).toBeCloseTo(30, 2);
      expect(result.priceChangeAmount).toBeCloseTo(300, 2);
    });

    it("29. classifies as price_increase when drop from peak is negligible (<1%)", () => {
      const history = [entry(1000, 4), entry(1500, 2), entry(1490, 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("price_increase");
      expect(result.priceChangePercent).toBeCloseTo(49, 2);
      expect(result.priceChangeAmount).toBeCloseTo(490, 2);
    });

    it("30. returns no_change when fake-discount net increase over baseline is under 1%", () => {
      const history = [entry(1000, 4), entry(1500, 2), entry(1005, 0)];
      expect(PriceInsight(history, NOW)).toEqual({ status: "no_change" });
    });

    it("31. follows delta-only stepped hikes to the active pre-hike price (600) and stops before older history (400)", () => {
      const history = [
        entry(400, 25),
        entry(600, 15),
        entry(1000, 4),
        entry(1500, 2),
        entry(1200, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("fake_discount");
      expect(result.basePrice).toBe(600);
      expect(result.priceChangePercent).toBeCloseTo(100, 2);
    });

    it("32. stops at a settled pre-hike baseline older than 5 days (10d) without reaching further back (20d)", () => {
      const history = [
        entry(600, 20),
        entry(1000, 10),
        entry(1500, 2),
        entry(1200, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("fake_discount");
      expect(result.basePrice).toBe(1000);
      expect(result.priceChangePercent).toBeCloseTo(20, 2);
    });
  });

  describe("7. Data types & realistic multi-point stress cases", () => {
    it("33. handles decimal kurus string prices accurately", () => {
      const history = [entry("1299.90", 6), entry("999.90", 0)];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("real_discount");
      expect(result.priceChangeAmount).toBeCloseTo(300, 2);
      expect(result.priceChangePercent).toBeCloseTo((300 / 1299.9) * 100, 2);
    });

    it("34. produces identical output for Date objects and ISO string checkedAt timestamps", () => {
      const isoHistory = [entry(1000, 8, 0, false), entry(1400, 2, 0, false), entry(1150, 0, 0, false)];
      const dateHistory = [entry(1000, 8, 0, true), entry(1400, 2, 0, true), entry(1150, 0, 0, true)];

      const isoRes = PriceInsight(isoHistory, NOW);
      const dateRes = PriceInsight(dateHistory, NOW);

      expect(isoRes.status).toBe(dateRes.status);
      expect(isoRes.priceChangePercent).toBeCloseTo(dateRes.priceChangePercent ?? 0, 5);
      expect(isoRes.recentDropPercent).toBeCloseTo(dateRes.recentDropPercent ?? 0, 5);
      expect(isoRes.basePrice).toBe(dateRes.basePrice);
      expect(isoRes.peakPrice).toBe(dateRes.peakPrice);
    });

    it("35. evaluates a realistic 15-point noisy 30-day e-commerce price curve accurately", () => {
      const history = [
        entry(2200, 29),
        entry(2195, 26),
        entry(2210, 23),
        entry(2100, 20),
        entry(2090, 18),
        entry(2095, 16),
        entry(2050, 14),
        entry(2045, 12),
        entry(2055, 10),
        entry(2000, 7),
        entry(2005, 5),
        entry(2000, 4),
        entry(2600, 2),
        entry(2595, 1),
        entry(2250, 0),
      ];
      const result = PriceInsight(history, NOW);

      expect(result.status).toBe("fake_discount");
      expect(result.basePrice).toBe(2000);
      expect(result.peakPrice).toBe(2600);
      expect(result.priceChangePercent).toBeCloseTo(12.5, 2);
      expect(result.priceChangeAmount).toBeCloseTo(250, 2);
    });
  });
});
