import {
  formatQuotaType,
  formatQuotaInline,
  renderQuotaTable,
  renderViolationWarning,
  renderQuotaSummary,
} from './portQuotaFormatter';
import type { QuotaRule } from './portQuota';

function makeRule(type: 'process' | 'tag', target: string, max: number): QuotaRule {
  return { type, target, max, createdAt: Date.now() };
}

describe('formatQuotaType', () => {
  it('includes the type label', () => {
    expect(formatQuotaType('process')).toContain('process');
    expect(formatQuotaType('tag')).toContain('tag');
  });
});

describe('formatQuotaInline', () => {
  it('includes target and max', () => {
    const rule = makeRule('process', 'node', 5);
    const out = formatQuotaInline(rule);
    expect(out).toContain('node');
    expect(out).toContain('5');
  });
});

describe('renderQuotaTable', () => {
  it('returns placeholder when empty', () => {
    expect(renderQuotaTable([])).toContain('No quota');
  });

  it('renders header and rows', () => {
    const rules = [makeRule('process', 'node', 3), makeRule('tag', 'api', 10)];
    const out = renderQuotaTable(rules);
    expect(out).toContain('TYPE');
    expect(out).toContain('node');
    expect(out).toContain('api');
    expect(out).toContain('10');
  });
});

describe('renderViolationWarning', () => {
  it('mentions exceeded and the target', () => {
    const out = renderViolationWarning('process', 'node', 6, 3);
    expect(out).toContain('exceeded');
    expect(out).toContain('node');
    expect(out).toContain('6');
    expect(out).toContain('3');
  });
});

describe('renderQuotaSummary', () => {
  it('counts process and tag rules', () => {
    const rules = [
      makeRule('process', 'node', 2),
      makeRule('process', 'python', 1),
      makeRule('tag', 'db', 4),
    ];
    const out = renderQuotaSummary(rules);
    expect(out).toContain('2 process');
    expect(out).toContain('1 tag');
  });
});
