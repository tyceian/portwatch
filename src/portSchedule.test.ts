import {
  addScheduleRule, removeScheduleRule, getScheduleRule,
  listScheduleRules, clearScheduleRules, isWithinSchedule,
  getOutOfSchedulePorts
} from './portSchedule';

beforeEach(() => clearScheduleRules());

describe('addScheduleRule', () => {
  it('adds a rule and returns it with createdAt', () => {
    const rule = addScheduleRule({ port: 3000, activeDays: ['mon', 'tue'], activeFrom: '09:00', activeTo: '17:00' });
    expect(rule.port).toBe(3000);
    expect(rule.createdAt).toBeGreaterThan(0);
  });

  it('overwrites existing rule for same port', () => {
    addScheduleRule({ port: 3000, activeDays: ['mon'], activeFrom: '08:00', activeTo: '12:00' });
    addScheduleRule({ port: 3000, activeDays: ['fri'], activeFrom: '10:00', activeTo: '18:00' });
    expect(listScheduleRules()).toHaveLength(1);
    expect(getScheduleRule(3000)?.activeDays).toEqual(['fri']);
  });
});

describe('removeScheduleRule', () => {
  it('removes an existing rule', () => {
    addScheduleRule({ port: 4000, activeDays: ['wed'], activeFrom: '09:00', activeTo: '17:00' });
    expect(removeScheduleRule(4000)).toBe(true);
    expect(getScheduleRule(4000)).toBeUndefined();
  });

  it('returns false for unknown port', () => {
    expect(removeScheduleRule(9999)).toBe(false);
  });
});

describe('isWithinSchedule', () => {
  it('returns true when no rule exists', () => {
    expect(isWithinSchedule(5000)).toBe(true);
  });

  it('returns false when day not in activeDays', () => {
    addScheduleRule({ port: 3000, activeDays: ['mon'], activeFrom: '09:00', activeTo: '17:00' });
    const tuesday = new Date('2024-01-09T12:00:00'); // Tuesday
    expect(isWithinSchedule(3000, tuesday)).toBe(false);
  });

  it('returns true when within time window', () => {
    addScheduleRule({ port: 3000, activeDays: ['tue'], activeFrom: '09:00', activeTo: '17:00' });
    const tuesday = new Date('2024-01-09T12:00:00');
    expect(isWithinSchedule(3000, tuesday)).toBe(true);
  });

  it('returns false when outside time window', () => {
    addScheduleRule({ port: 3000, activeDays: ['tue'], activeFrom: '09:00', activeTo: '11:00' });
    const tuesday = new Date('2024-01-09T14:00:00');
    expect(isWithinSchedule(3000, tuesday)).toBe(false);
  });
});

describe('getOutOfSchedulePorts', () => {
  it('returns ports that are active but outside schedule', () => {
    addScheduleRule({ port: 3000, activeDays: ['mon'], activeFrom: '09:00', activeTo: '17:00' });
    const tuesday = new Date('2024-01-09T12:00:00');
    expect(getOutOfSchedulePorts([3000, 4000], tuesday)).toEqual([3000]);
  });

  it('ignores ports with no rule', () => {
    const tuesday = new Date('2024-01-09T12:00:00');
    expect(getOutOfSchedulePorts([8080], tuesday)).toEqual([]);
  });
});
