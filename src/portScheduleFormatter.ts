import { ScheduleRule, DayOfWeek } from './portSchedule';
import { colorize } from './formatter';

const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun'
};

export function formatDays(days: DayOfWeek[]): string {
  const all: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return all.map(d => days.includes(d) ? colorize(DAY_LABELS[d], 'green') : colorize(DAY_LABELS[d], 'dim')).join(' ');
}

export function formatScheduleInline(rule: ScheduleRule): string {
  const days = formatDays(rule.activeDays);
  return `port ${colorize(String(rule.port), 'cyan')} active ${rule.activeFrom}–${rule.activeTo} [${days}]`;
}

export function renderScheduleRow(rule: ScheduleRule): string {
  const label = rule.label ? colorize(rule.label, 'yellow') : colorize('(no label)', 'dim');
  return `  ${String(rule.port).padEnd(6)} ${label.padEnd(20)} ${rule.activeFrom}–${rule.activeTo}  ${formatDays(rule.activeDays)}`;
}

export function renderScheduleTable(rules: ScheduleRule[]): string {
  if (rules.length === 0) return colorize('No schedule rules defined.', 'dim');
  const header = colorize('  PORT   LABEL                TIME           DAYS', 'bold');
  const rows = rules.map(renderScheduleRow).join('\n');
  return `${header}\n${rows}`;
}

export function renderOutOfScheduleWarning(ports: number[]): string {
  if (ports.length === 0) return '';
  const list = ports.map(p => colorize(String(p), 'yellow')).join(', ');
  return colorize(`⚠ Ports active outside schedule: ${list}`, 'yellow');
}

export function renderScheduleSummary(rules: ScheduleRule[]): string {
  return colorize(`${rules.length} schedule rule${rules.length !== 1 ? 's' : ''} configured`, 'dim');
}
