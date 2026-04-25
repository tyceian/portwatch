import {
  setAccessRule,
  removeAccessRule,
  getAccessRule,
  isAllowed,
  isDenied,
  listAccessRules,
  clearAccessRules,
  getAccessSummary,
} from './portAccess';

beforeEach(() => clearAccessRules());

describe('setAccessRule', () => {
  it('creates an allow rule', () => {
    const rule = setAccessRule(3000, 'allow', 'dev server');
    expect(rule.port).toBe(3000);
    expect(rule.mode).toBe('allow');
    expect(rule.reason).toBe('dev server');
    expect(rule.createdAt).toBeLessThanOrEqual(Date.now());
  });

  it('creates a deny rule', () => {
    const rule = setAccessRule(22, 'deny', 'ssh blocked');
    expect(rule.mode).toBe('deny');
  });

  it('overwrites an existing rule', () => {
    setAccessRule(8080, 'allow');
    setAccessRule(8080, 'deny', 'now blocked');
    expect(getAccessRule(8080)?.mode).toBe('deny');
  });
});

describe('isAllowed / isDenied', () => {
  it('defaults to allowed when no rule exists', () => {
    expect(isAllowed(9999)).toBe(true);
    expect(isDenied(9999)).toBe(false);
  });

  it('respects deny rule', () => {
    setAccessRule(22, 'deny');
    expect(isAllowed(22)).toBe(false);
    expect(isDenied(22)).toBe(true);
  });

  it('respects allow rule', () => {
    setAccessRule(3000, 'allow');
    expect(isAllowed(3000)).toBe(true);
  });
});

describe('removeAccessRule', () => {
  it('removes an existing rule', () => {
    setAccessRule(4000, 'deny');
    expect(removeAccessRule(4000)).toBe(true);
    expect(getAccessRule(4000)).toBeUndefined();
  });

  it('returns false when no rule exists', () => {
    expect(removeAccessRule(9999)).toBe(false);
  });
});

describe('listAccessRules', () => {
  it('returns sorted list', () => {
    setAccessRule(8080, 'allow');
    setAccessRule(3000, 'deny');
    const list = listAccessRules();
    expect(list[0].port).toBe(3000);
    expect(list[1].port).toBe(8080);
  });
});

describe('getAccessSummary', () => {
  it('counts allow and deny rules', () => {
    setAccessRule(3000, 'allow');
    setAccessRule(3001, 'allow');
    setAccessRule(22, 'deny');
    const { allowed, denied } = getAccessSummary();
    expect(allowed).toBe(2);
    expect(denied).toBe(1);
  });
});
