export interface ReminderRule {
  port: number;
  message: string;
  intervalMs: number;
  lastTriggered?: number;
  createdAt: number;
}

const reminders = new Map<number, ReminderRule>();

export function addReminder(port: number, message: string, intervalMs: number): ReminderRule {
  const rule: ReminderRule = {
    port,
    message,
    intervalMs,
    createdAt: Date.now(),
  };
  reminders.set(port, rule);
  return rule;
}

export function removeReminder(port: number): boolean {
  return reminders.delete(port);
}

export function getReminder(port: number): ReminderRule | undefined {
  return reminders.get(port);
}

export function hasReminder(port: number): boolean {
  return reminders.has(port);
}

export function listReminders(): ReminderRule[] {
  return Array.from(reminders.values());
}

export function clearReminders(): void {
  reminders.clear();
}

export function isDue(port: number, now = Date.now()): boolean {
  const rule = reminders.get(port);
  if (!rule) return false;
  const last = rule.lastTriggered ?? rule.createdAt;
  return now - last >= rule.intervalMs;
}

export function markTriggered(port: number, now = Date.now()): void {
  const rule = reminders.get(port);
  if (rule) rule.lastTriggered = now;
}

export function getDueReminders(activePorts: number[], now = Date.now()): ReminderRule[] {
  return activePorts
    .filter(p => isDue(p, now))
    .map(p => reminders.get(p)!)
    .filter(Boolean);
}
