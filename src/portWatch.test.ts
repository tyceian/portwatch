import {
  addWatchRule,
  removeWatchRule,
  getWatchRule,
  listWatchRules,
  clearWatchRules,
  shouldNotifyWatch,
  getWatchCount,
} from './portWatch';
import {
  formatWatchEvent,
  formatWatchRuleInline,
  renderWatchTable,
  renderWatchSummary,
} from './portWatchFormatter';

beforeEach(() => clearWatchRules());

describe('addWatchRule / getWatchRule', () => {
  it('stores and retrieves a rule', () => {
    const rule = addWatchRule(3000, 'open', 'dev server');
    expect(rule.port).toBe(3000);
    expect(rule.event).toBe('open');
    expect(rule.label).toBe('dev server');
    expect(getWatchRule(3000)).toEqual(rule);
  });

  it('defaults event to both', () => {
    const rule = addWatchRule(4000);
    expect(rule.event).toBe('both');
  });

  it('overwrites existing rule', () => {
    addWatchRule(3000, 'open');
    addWatchRule(3000, 'close', 'updated');
    expect(getWatchRule(3000)?.event).toBe('close');
  });
});

describe('removeWatchRule', () => {
  it('removes an existing rule', () => {
    addWatchRule(3000);
    expect(removeWatchRule(3000)).toBe(true);
    expect(getWatchRule(3000)).toBeUndefined();
  });

  it('returns false for unknown port', () => {
    expect(removeWatchRule(9999)).toBe(false);
  });
});

describe('shouldNotifyWatch', () => {
  it('notifies on matching open event', () => {
    addWatchRule(3000, 'open');
    expect(shouldNotifyWatch(3000, 'open')).toBe(true);
    expect(shouldNotifyWatch(3000, 'close')).toBe(false);
  });

  it('notifies on both events', () => {
    addWatchRule(4000, 'both');
    expect(shouldNotifyWatch(4000, 'open')).toBe(true);
    expect(shouldNotifyWatch(4000, 'close')).toBe(true);
  });

  it('returns false for unwatched port', () => {
    expect(shouldNotifyWatch(5000, 'open')).toBe(false);
  });
});

describe('listWatchRules / getWatchCount', () => {
  it('returns sorted rules', () => {
    addWatchRule(8080);
    addWatchRule(3000);
    const list = listWatchRules();
    expect(list.map((r) => r.port)).toEqual([3000, 8080]);
  });

  it('tracks count correctly', () => {
    addWatchRule(1000);
    addWatchRule(2000);
    expect(getWatchCount()).toBe(2);
  });
});

describe('formatWatchEvent', () => {
  it('formats each event type', () => {
    expect(formatWatchEvent('open')).toBe('▲ open');
    expect(formatWatchEvent('close')).toBe('▼ close');
    expect(formatWatchEvent('both')).toBe('⇅ both');
  });
});

describe('formatWatchRuleInline', () => {
  it('includes label when present', () => {
    const rule = addWatchRule(3000, 'open', 'api');
    expect(formatWatchRuleInline(rule)).toContain('(api)');
  });

  it('omits label when absent', () => {
    const rule = addWatchRule(3000, 'close');
    expect(formatWatchRuleInline(rule)).not.toContain('(');
  });
});

describe('renderWatchTable', () => {
  it('shows empty message when no rules', () => {
    expect(renderWatchTable([])).toContain('No watch rules');
  });

  it('renders rows for each rule', () => {
    addWatchRule(3000, 'both', 'dev');
    addWatchRule(5432, 'open');
    const table = renderWatchTable(listWatchRules());
    expect(table).toContain('3000');
    expect(table).toContain('5432');
  });
});

describe('renderWatchSummary', () => {
  it('returns none when empty', () => {
    expect(renderWatchSummary([])).toBe('Watching: none');
  });

  it('lists watched ports', () => {
    addWatchRule(3000);
    addWatchRule(8080);
    const summary = renderWatchSummary(listWatchRules());
    expect(summary).toContain('2 port(s)');
    expect(summary).toContain('3000');
  });
});
