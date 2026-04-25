import {
  setExpiry,
  removeExpiry,
  getExpiry,
  isExpired,
  listExpired,
  listExpiring,
  listExpiryRules,
  clearExpiryRules,
} from "./portExpiry";
import {
  formatTimeRemaining,
  formatExpiryInline,
  renderExpiryTable,
  renderExpirySummary,
} from "./portExpiryFormatter";

beforeEach(() => clearExpiryRules());

const future = (ms: number) => new Date(Date.now() + ms);
const past = (ms: number) => new Date(Date.now() - ms);

test("setExpiry creates a rule", () => {
  const rule = setExpiry(3000, future(60000), "temp server");
  expect(rule.port).toBe(3000);
  expect(rule.reason).toBe("temp server");
});

test("getExpiry returns rule for port", () => {
  setExpiry(4000, future(5000));
  expect(getExpiry(4000)).toBeDefined();
  expect(getExpiry(9999)).toBeUndefined();
});

test("removeExpiry deletes rule", () => {
  setExpiry(5000, future(5000));
  expect(removeExpiry(5000)).toBe(true);
  expect(getExpiry(5000)).toBeUndefined();
});

test("isExpired returns true for past date", () => {
  setExpiry(3001, past(1000));
  expect(isExpired(3001)).toBe(true);
});

test("isExpired returns false for future date", () => {
  setExpiry(3002, future(60000));
  expect(isExpired(3002)).toBe(false);
});

test("listExpired returns only expired rules", () => {
  setExpiry(3010, past(1000));
  setExpiry(3011, future(60000));
  const expired = listExpired();
  expect(expired.map((r) => r.port)).toContain(3010);
  expect(expired.map((r) => r.port)).not.toContain(3011);
});

test("listExpiring returns rules expiring within window", () => {
  setExpiry(3020, future(5000));
  setExpiry(3021, future(120000));
  const soon = listExpiring(10000);
  expect(soon.map((r) => r.port)).toContain(3020);
  expect(soon.map((r) => r.port)).not.toContain(3021);
});

test("formatTimeRemaining formats correctly", () => {
  const now = new Date();
  const exp = new Date(now.getTime() + 3 * 3600 * 1000 + 5 * 60 * 1000);
  expect(formatTimeRemaining(exp, now)).toBe("3h 5m");
});

test("renderExpiryTable shows no-rules message", () => {
  expect(renderExpiryTable([])).toBe("No expiry rules set.");
});

test("renderExpirySummary counts correctly", () => {
  setExpiry(4100, past(100));
  setExpiry(4101, future(60000));
  const rules = listExpiryRules();
  const summary = renderExpirySummary(rules);
  expect(summary).toContain("2 total");
  expect(summary).toContain("1 active");
  expect(summary).toContain("1 expired");
});

test("formatExpiryInline includes reason", () => {
  const rule = setExpiry(5050, future(90000), "dev proxy");
  const line = formatExpiryInline(rule);
  expect(line).toContain("5050");
  expect(line).toContain("dev proxy");
});
