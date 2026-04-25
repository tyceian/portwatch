import {
  addReminder,
  removeReminder,
  getReminder,
  listReminders,
  clearReminders,
} from './portReminder';
import {
  renderReminderTable,
  formatReminderInline,
  renderReminderSummary,
} from './portReminderFormatter';

const DEFAULT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function parseInterval(raw: string): number {
  const match = raw.match(/^(\d+)(s|m|h)?$/);
  if (!match) throw new Error(`Invalid interval: "${raw}"`);
  const val = parseInt(match[1], 10);
  const unit = match[2] ?? 'm';
  if (unit === 's') return val * 1000;
  if (unit === 'h') return val * 3_600_000;
  return val * 60_000;
}

export function handleAddReminder(port: number, message: string, intervalRaw?: string): void {
  const intervalMs = intervalRaw ? parseInterval(intervalRaw) : DEFAULT_INTERVAL_MS;
  const rule = addReminder(port, message, intervalMs);
  console.log(`Reminder added: ${formatReminderInline(rule)}`);
}

export function handleRemoveReminder(port: number): void {
  const removed = removeReminder(port);
  console.log(removed ? `Reminder for port ${port} removed.` : `No reminder found for port ${port}.`);
}

export function handleGetReminder(port: number): void {
  const rule = getReminder(port);
  if (!rule) {
    console.log(`No reminder for port ${port}.`);
    return;
  }
  console.log(formatReminderInline(rule));
}

export function handleListReminders(): void {
  const rules = listReminders();
  console.log(renderReminderTable(rules));
  console.log(renderReminderSummary(rules));
}

export function handleClearReminders(): void {
  clearReminders();
  console.log('All reminders cleared.');
}
