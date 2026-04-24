import {
  pinPort,
  unpinPort,
  isPinned,
  getPinRule,
  listPinned,
  clearPins,
  getPinnedCount,
  updatePinLabel,
  serializePins,
  deserializePins,
} from "./portPin";

beforeEach(() => {
  clearPins();
});

describe("pinPort", () => {
  it("pins a port and returns the rule", () => {
    const rule = pinPort(3000, "dev server", "always running");
    expect(rule.port).toBe(3000);
    expect(rule.label).toBe("dev server");
    expect(rule.reason).toBe("always running");
    expect(rule.pinnedAt).toBeLessThanOrEqual(Date.now());
  });

  it("overwrites an existing pin", () => {
    pinPort(3000, "old");
    pinPort(3000, "new");
    expect(getPinRule(3000)?.label).toBe("new");
    expect(getPinnedCount()).toBe(1);
  });
});

describe("isPinned", () => {
  it("returns true for pinned port", () => {
    pinPort(8080);
    expect(isPinned(8080)).toBe(true);
  });

  it("returns false for unknown port", () => {
    expect(isPinned(9999)).toBe(false);
  });
});

describe("unpinPort", () => {
  it("removes a pinned port", () => {
    pinPort(4000);
    expect(unpinPort(4000)).toBe(true);
    expect(isPinned(4000)).toBe(false);
  });

  it("returns false if port was not pinned", () => {
    expect(unpinPort(1234)).toBe(false);
  });
});

describe("listPinned", () => {
  it("returns sorted list of pinned ports", () => {
    pinPort(9000);
    pinPort(3000);
    pinPort(5000);
    const list = listPinned();
    expect(list.map((r) => r.port)).toEqual([3000, 5000, 9000]);
  });
});

describe("updatePinLabel", () => {
  it("updates label for existing pin", () => {
    pinPort(8000, "original");
    expect(updatePinLabel(8000, "updated")).toBe(true);
    expect(getPinRule(8000)?.label).toBe("updated");
  });

  it("returns false if port not pinned", () => {
    expect(updatePinLabel(1111, "nope")).toBe(false);
  });
});

describe("serialize/deserialize", () => {
  it("round-trips pin data", () => {
    pinPort(3000, "api", "main service");
    pinPort(5432, "db");
    const data = serializePins();
    clearPins();
    expect(getPinnedCount()).toBe(0);
    deserializePins(data);
    expect(getPinnedCount()).toBe(2);
    expect(isPinned(3000)).toBe(true);
    expect(getPinRule(5432)?.label).toBe("db");
  });
});
