// portSchedule: define time-based rules for when ports should be active

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ScheduleRule {
  port: number;
  label?: string;
  activeDays: DayOfWeek[];
  activeFrom: string; // HH:MM
  activeTo: string;   // HH:MM
  createdAt: number;
}

const scheduleRules = new Map<number, ScheduleRule>();

export function addScheduleRule(rule: Omit<ScheduleRule, 'createdAt'>): ScheduleRule {
  const full: ScheduleRule = { ...rule, createdAt: Date.now() };
  scheduleRules.set(rule.port, full);
  return full;
}

export function removeScheduleRule(port: number): boolean {
  return scheduleRules.delete(port);
}

export function getScheduleRule(port: number): ScheduleRule | undefined {
  return scheduleRules.get(port);
}

export function listScheduleRules(): ScheduleRule[] {
  return Array.from(scheduleRules.values());
}

export function clearScheduleRules(): void {
  scheduleRules.clear();
}

export function isWithinSchedule(port: number, now: Date = new Date()): boolean {
  const rule = scheduleRules.get(port);
  if (!rule) return true; // no rule = always active

  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = days[now.getDay()];
  if (!rule.activeDays.includes(today)) return false;

  const [fromH, fromM] = rule.activeFrom.split(':').map(Number);
  const [toH, toM] = rule.activeTo.split(':').map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const from = fromH * 60 + fromM;
  const to = toH * 60 + toM;

  return current >= from && current <= to;
}

export function getOutOfSchedulePorts(activePorts: number[], now: Date = new Date()): number[] {
  return activePorts.filter(port => {
    const rule = scheduleRules.get(port);
    if (!rule) return false;
    return !isWithinSchedule(port, now);
  });
}
