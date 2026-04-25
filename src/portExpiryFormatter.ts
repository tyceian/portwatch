import { ExpiryRule } from "./portExpiry";

export function formatTimeRemaining(expiresAt: Date, now: Date = new Date()): string {
  const diffMs = expiresAt.getTime() - now.getTime();
  if (diffMs <= 0) return "expired";
  const totalSecs = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function formatExpiryInline(rule: ExpiryRule, now: Date = new Date()): string {
  const remaining = formatTimeRemaining(rule.expiresAt, now);
  const reason = rule.reason ? ` (${rule.reason})` : "";
  return `port ${rule.port} — expires in ${remaining}${reason}`;
}

export function renderExpiryRow(rule: ExpiryRule, now: Date = new Date()): string {
  const expired = now >= rule.expiresAt;
  const status = expired ? "EXPIRED" : formatTimeRemaining(rule.expiresAt, now);
  const reason = rule.reason ?? "—";
  return `  ${String(rule.port).padEnd(8)} ${status.padEnd(14)} ${reason}`;
}

export function renderExpiryTable(rules: ExpiryRule[], now: Date = new Date()): string {
  if (rules.length === 0) return "No expiry rules set.";
  const header = `  ${ "PORT".padEnd(8)} ${ "REMAINING".padEnd(14)} REASON`;
  const divider = "  " + "-".repeat(40);
  const rows = rules.map((r) => renderExpiryRow(r, now));
  return [header, divider, ...rows].join("\n");
}

export function renderExpirySummary(rules: ExpiryRule[], now: Date = new Date()): string {
  const total = rules.length;
  const expired = rules.filter((r) => now >= r.expiresAt).length;
  const active = total - expired;
  return `Expiry rules: ${total} total, ${active} active, ${expired} expired`;
}
