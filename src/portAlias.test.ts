import {
  addAlias,
  removeAlias,
  getAlias,
  resolveAlias,
  hasAlias,
  listAliases,
  clearAliases,
  getAliasCount,
} from './portAlias';
import { formatAliasInline, renderAliasTable, renderAliasSummary } from './portAliasFormatter';

beforeEach(() => clearAliases());

describe('addAlias', () => {
  it('adds an alias and returns the rule', () => {
    const rule = addAlias(3000, 'frontend', 'React dev server');
    expect(rule.port).toBe(3000);
    expect(rule.alias).toBe('frontend');
    expect(rule.description).toBe('React dev server');
  });

  it('normalises alias to lowercase', () => {
    const rule = addAlias(4000, 'API');
    expect(rule.alias).toBe('api');
  });

  it('throws when alias is already used by a different port', () => {
    addAlias(3000, 'frontend');
    expect(() => addAlias(4000, 'frontend')).toThrow();
  });

  it('allows re-adding the same alias to the same port', () => {
    addAlias(3000, 'frontend');
    expect(() => addAlias(3000, 'frontend', 'updated')).not.toThrow();
  });
});

describe('removeAlias', () => {
  it('removes an existing alias', () => {
    addAlias(3000, 'frontend');
    expect(removeAlias(3000)).toBe(true);
    expect(hasAlias(3000)).toBe(false);
  });

  it('returns false for unknown port', () => {
    expect(removeAlias(9999)).toBe(false);
  });
});

describe('resolveAlias', () => {
  it('resolves alias string to port number', () => {
    addAlias(5432, 'db');
    expect(resolveAlias('db')).toBe(5432);
  });

  it('returns undefined for unknown alias', () => {
    expect(resolveAlias('unknown')).toBeUndefined();
  });
});

describe('listAliases / getAliasCount', () => {
  it('returns sorted list and correct count', () => {
    addAlias(8080, 'proxy');
    addAlias(3000, 'frontend');
    const list = listAliases();
    expect(list[0].port).toBe(3000);
    expect(list[1].port).toBe(8080);
    expect(getAliasCount()).toBe(2);
  });
});

describe('formatAliasInline', () => {
  it('includes description when present', () => {
    const rule = addAlias(3000, 'frontend', 'React');
    expect(formatAliasInline(rule)).toContain('React');
  });
});

describe('renderAliasTable', () => {
  it('shows empty message when no aliases', () => {
    expect(renderAliasTable([])).toContain('no aliases');
  });

  it('renders rows for each alias', () => {
    addAlias(3000, 'frontend');
    const table = renderAliasTable(listAliases());
    expect(table).toContain('frontend');
    expect(table).toContain('3000');
  });
});

describe('renderAliasSummary', () => {
  it('returns no-alias message when empty', () => {
    expect(renderAliasSummary([])).toContain('No aliases');
  });

  it('summarises aliases concisely', () => {
    addAlias(3000, 'frontend');
    addAlias(5432, 'db');
    const summary = renderAliasSummary(listAliases());
    expect(summary).toContain('2 aliases');
  });
});
