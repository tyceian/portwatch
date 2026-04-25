import type { AccessRule } from './portAccess';
import {
  formatAccessMode,
  formatAccessInline,
  renderAccessRow,
  renderAccessTable,
  renderAccessSummary,
} from './portAccessFormatter';

const makeRule = (overrides: Partial<AccessRule> = {}): AccessRule => ({
  port: 3000,
  mode: 'allow',
  reason: 'dev',
  createdAt: new Date('2024-06-01').getTime(),
  ...overrides,
});

describe('formatAccessMode', () => {
  it('formats allow in green', () => {
    expect(formatAccessMode('allow')).toContain('ALLOW');
  });

  it('formats deny in red', () => {
    expect(formatAccessMode('deny')).toContain('DENY');
  });
});

describe('formatAccessInline', () => {
  it('includes port and mode', () => {
    const out = formatAccessInline(makeRule());
    expect(out).toContain('3000');
    expect(out).toContain('ALLOW');
  });

  it('includes reason when present', () => {
    const out = formatAccessInline(makeRule({ reason: 'test reason' }));
    expect(out).toContain('test reason');
  });

  it('omits reason section when absent', () => {
    const out = formatAccessInline(makeRule({ reason: undefined }));
    expect(out).not.toContain('—');
  });
});

describe('renderAccessTable', () => {
  it('returns placeholder when no rules', () => {
    expect(renderAccessTable([])).toBe('No access rules defined.');
  });

  it('renders header and rows', () => {
    const out = renderAccessTable([makeRule()]);
    expect(out).toContain('PORT');
    expect(out).toContain('MODE');
    expect(out).toContain('3000');
  });
});

describe('renderAccessSummary', () => {
  it('includes counts', () => {
    const out = renderAccessSummary(5, 2);
    expect(out).toContain('5');
    expect(out).toContain('2');
  });
});
