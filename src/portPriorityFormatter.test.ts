import { clearPriorities, setPriority } from './portPriority';
import {
  formatPriorityBadge, formatPriorityInline,
  renderPriorityRow, renderPriorityTable, renderPrioritySummary,
} from './portPriorityFormatter';

beforeEach(() => clearPriorities());

describe('formatPriorityBadge', () => {
  it('includes the level name uppercased', () => {
    expect(formatPriorityBadge('critical')).toContain('CRITICAL');
    expect(formatPriorityBadge('low')).toContain('LOW');
  });
});

describe('formatPriorityInline', () => {
  it('includes port and level', () => {
    const rule = setPriority(3000, 'high', 'api server');
    const out = formatPriorityInline(rule);
    expect(out).toContain('3000');
    expect(out).toContain('HIGH');
    expect(out).toContain('api server');
  });

  it('omits reason when not set', () => {
    const rule = setPriority(4000, 'low');
    const out = formatPriorityInline(rule);
    expect(out).not.toContain('—');
  });
});

describe('renderPriorityRow', () => {
  it('contains port and level', () => {
    const rule = setPriority(8080, 'medium', 'dev proxy');
    const row = renderPriorityRow(rule);
    expect(row).toContain('8080');
    expect(row).toContain('dev proxy');
  });
});

describe('renderPriorityTable', () => {
  it('returns placeholder for empty list', () => {
    expect(renderPriorityTable([])).toContain('no priority rules');
  });

  it('renders header and rows', () => {
    setPriority(3000, 'critical');
    setPriority(4000, 'low');
    const { listPriorities } = require('./portPriority');
    const out = renderPriorityTable(listPriorities());
    expect(out).toContain('PORT');
    expect(out).toContain('3000');
    expect(out).toContain('4000');
  });
});

describe('renderPrioritySummary', () => {
  it('counts levels', () => {
    const rules = [setPriority(1, 'high'), setPriority(2, 'high'), setPriority(3, 'low')];
    const summary = renderPrioritySummary(rules);
    expect(summary).toContain('2 high');
    expect(summary).toContain('1 low');
  });
});
