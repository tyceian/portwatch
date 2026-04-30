import {
  setQuota,
  removeQuota,
  getQuota,
  hasQuota,
  listQuotas,
  clearQuotas,
  checkQuotaViolation,
} from './portQuota';

beforeEach(() => clearQuotas());

describe('setQuota', () => {
  it('creates a quota rule', () => {
    const rule = setQuota('process', 'node', 3);
    expect(rule.target).toBe('node');
    expect(rule.type).toBe('process');
    expect(rule.max).toBe(3);
  });

  it('overwrites existing rule for same key', () => {
    setQuota('process', 'node', 3);
    setQuota('process', 'node', 5);
    expect(getQuota('process', 'node')?.max).toBe(5);
  });

  it('throws if max < 1', () => {
    expect(() => setQuota('tag', 'backend', 0)).toThrow();
  });
});

describe('removeQuota', () => {
  it('removes an existing rule', () => {
    setQuota('tag', 'frontend', 2);
    expect(removeQuota('tag', 'frontend')).toBe(true);
    expect(hasQuota('tag', 'frontend')).toBe(false);
  });

  it('returns false when rule does not exist', () => {
    expect(removeQuota('process', 'ghost')).toBe(false);
  });
});

describe('listQuotas', () => {
  it('returns all rules sorted by creation time', () => {
    setQuota('process', 'node', 2);
    setQuota('tag', 'api', 4);
    const rules = listQuotas();
    expect(rules).toHaveLength(2);
    expect(rules[0].target).toBe('node');
  });
});

describe('checkQuotaViolation', () => {
  it('returns null when no rule exists', () => {
    expect(checkQuotaViolation('process', 'unknown', 5)).toBeNull();
  });

  it('returns violated=true when over limit', () => {
    setQuota('process', 'node', 3);
    const result = checkQuotaViolation('process', 'node', 5);
    expect(result?.violated).toBe(true);
    expect(result?.max).toBe(3);
    expect(result?.current).toBe(5);
  });

  it('returns violated=false when within limit', () => {
    setQuota('process', 'node', 3);
    const result = checkQuotaViolation('process', 'node', 2);
    expect(result?.violated).toBe(false);
  });

  it('returns violated=false at exact limit', () => {
    setQuota('tag', 'db', 4);
    const result = checkQuotaViolation('tag', 'db', 4);
    expect(result?.violated).toBe(false);
  });
});
