import {
  addReminder,
  removeReminder,
  getReminder,
  hasReminder,
  listReminders,
  clearReminders,
  isDue,
  markTriggered,
  getDueReminders,
} from './portReminder';

beforeEach(() => clearReminders());

describe('addReminder', () => {
  it('stores a reminder and returns the rule', () => {
    const rule = addReminder(3000, 'check this', 60_000);
    expect(rule.port).toBe(3000);
    expect(rule.message).toBe('check this');
    expect(rule.intervalMs).toBe(60_000);
  });

  it('overwrites existing reminder for same port', () => {
    addReminder(3000, 'first', 60_000);
    addReminder(3000, 'second', 30_000);
    expect(getReminder(3000)?.message).toBe('second');
  });
});

describe('removeReminder', () => {
  it('returns true when removed', () => {
    addReminder(3000, 'msg', 1000);
    expect(removeReminder(3000)).toBe(true);
  });

  it('returns false when not found', () => {
    expect(removeReminder(9999)).toBe(false);
  });
});

describe('hasReminder', () => {
  it('returns true after adding', () => {
    addReminder(4000, 'hi', 1000);
    expect(hasReminder(4000)).toBe(true);
  });

  it('returns false for unknown port', () => {
    expect(hasReminder(1234)).toBe(false);
  });
});

describe('isDue', () => {
  it('is due when interval has elapsed', () => {
    const now = Date.now();
    addReminder(5000, 'test', 1000);
    expect(isDue(5000, now + 2000)).toBe(true);
  });

  it('is not due before interval elapses', () => {
    const now = Date.now();
    addReminder(5000, 'test', 10_000);
    expect(isDue(5000, now + 100)).toBe(false);
  });
});

describe('markTriggered / getDueReminders', () => {
  it('resets due timer after marking triggered', () => {
    const now = Date.now();
    addReminder(6000, 'msg', 5000);
    markTriggered(6000, now);
    expect(isDue(6000, now + 100)).toBe(false);
  });

  it('returns only due reminders for active ports', () => {
    const now = Date.now();
    addReminder(3000, 'a', 1000);
    addReminder(4000, 'b', 100_000);
    const due = getDueReminders([3000, 4000], now + 2000);
    expect(due.map(r => r.port)).toEqual([3000]);
  });
});

describe('listReminders', () => {
  it('returns all reminders', () => {
    addReminder(1000, 'a', 1000);
    addReminder(2000, 'b', 2000);
    expect(listReminders()).toHaveLength(2);
  });
});
