import {
  addScheduleRule, removeScheduleRule, listScheduleRules,
  clearScheduleRules, getScheduleRule, DayOfWeek
} from './portSchedule';
import {
  renderScheduleTable, renderScheduleSummary,
  formatScheduleInline, renderOutOfScheduleWarning
} from './portScheduleFormatter';

const VALID_DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const TIME_RE = /^\d{2}:\d{2}$/;

function parseDays(raw: string): DayOfWeek[] | null {
  const parts = raw.split(',').map(s => s.trim().toLowerCase()) as DayOfWeek[];
  if (parts.every(d => VALID_DAYS.includes(d))) return parts;
  return null;
}

export function handleAddSchedule(
  port: number, from: string, to: string, daysRaw: string, label?: string
): string {
  if (!TIME_RE.test(from) || !TIME_RE.test(to))
    return `Invalid time format. Use HH:MM (e.g. 09:00).`;
  const activeDays = parseDays(daysRaw);
  if (!activeDays) return `Invalid days. Use comma-separated: mon,tue,wed,thu,fri,sat,sun`;
  const rule = addScheduleRule({ port, activeDays, activeFrom: from, activeTo: to, label });
  return `Schedule added: ${formatScheduleInline(rule)}`;
}

export function handleRemoveSchedule(port: number): string {
  const removed = removeScheduleRule(port);
  return removed ? `Schedule rule for port ${port} removed.` : `No schedule rule found for port ${port}.`;
}

export function handleGetSchedule(port: number): string {
  const rule = getScheduleRule(port);
  if (!rule) return `No schedule rule for port ${port}.`;
  return formatScheduleInline(rule);
}

export function handleListSchedules(): string {
  const rules = listScheduleRules();
  return `${renderScheduleTable(rules)}\n${renderScheduleSummary(rules)}`;
}

export function handleClearSchedules(): string {
  const count = listScheduleRules().length;
  clearScheduleRules();
  return `Cleared ${count} schedule rule${count !== 1 ? 's' : ''}.`;
}

export function handleCheckOutOfSchedule(activePorts: number[]): string {
  const { getOutOfSchedulePorts } = require('./portSchedule');
  const offPorts: number[] = getOutOfSchedulePorts(activePorts);
  return renderOutOfScheduleWarning(offPorts) || 'All active ports are within their scheduled windows.';
}
