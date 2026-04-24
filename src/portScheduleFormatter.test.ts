import { formatDays, formatScheduleInline, renderScheduleTable, renderOutOfScheduleWarning, renderScheduleSummary } from './portScheduleFormatter';
import { ScheduleRule } from './portSchedule';

const rule: ScheduleRule = {
  port: 3000,
  label: 'dev-server',
  activeDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  activeFrom: '09:00',
  activeTo: '17:00',
  createdAt: 1700000000000
};

describe('formatDays', () => {
  it('includes all 7 day labels', () => {
    const result = formatDays(['mon', 'wed', 'fri']);
    expect(result).toContain('Mon');
    expect(result).toContain('Wed');
    expect(result).toContain('Fri');
    expect(result).toContain('Sat');
  });
});

describe('formatScheduleInline', () => {
  it('includes port and time range', () => {
    const result = formatScheduleInline(rule);
    expect(result).toContain('3000');
    expect(result).toContain('09:00');
    expect(result).toContain('17:00');
  });
});

describe('renderScheduleTable', () => {
  it('returns empty message when no rules', () => {
    expect(renderScheduleTable([])).toContain('No schedule rules');
  });

  it('renders rows for each rule', () => {
    const result = renderScheduleTable([rule]);
    expect(result).toContain('3000');
    expect(result).toContain('dev-server');
    expect(result).toContain('09:00');
  });
});

describe('renderOutOfScheduleWarning', () => {
  it('returns empty string when no ports', () => {
    expect(renderOutOfScheduleWarning([])).toBe('');
  });

  it('lists out-of-schedule ports', () => {
    const result = renderOutOfScheduleWarning([3000, 4000]);
    expect(result).toContain('3000');
    expect(result).toContain('4000');
  });
});

describe('renderScheduleSummary', () => {
  it('handles singular', () => {
    expect(renderScheduleSummary([rule])).toContain('1 schedule rule ');
  });

  it('handles plural', () => {
    expect(renderScheduleSummary([rule, rule])).toContain('2 schedule rules');
  });
});
