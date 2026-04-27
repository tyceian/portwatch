import {
  setLifecyclePhase,
  removeLifecycle,
  getLifecycle,
  hasLifecycle,
  listLifecycles,
  clearLifecycles,
  getPortsByPhase,
  transitionPhase,
} from './portLifecycle';

beforeEach(() => clearLifecycles());

describe('setLifecyclePhase', () => {
  it('stores a rule and returns it', () => {
    const rule = setLifecyclePhase(3000, 'starting', 'dev server');
    expect(rule.port).toBe(3000);
    expect(rule.phase).toBe('starting');
    expect(rule.note).toBe('dev server');
    expect(rule.since).toBeLessThanOrEqual(Date.now());
  });

  it('overwrites an existing rule', () => {
    setLifecyclePhase(3000, 'starting');
    setLifecyclePhase(3000, 'running');
    expect(getLifecycle(3000)?.phase).toBe('running');
  });
});

describe('hasLifecycle / getLifecycle', () => {
  it('returns false when not set', () => {
    expect(hasLifecycle(9999)).toBe(false);
  });

  it('returns true after setting', () => {
    setLifecyclePhase(4000, 'expected');
    expect(hasLifecycle(4000)).toBe(true);
  });

  it('getLifecycle returns undefined for unknown port', () => {
    expect(getLifecycle(1234)).toBeUndefined();
  });
});

describe('removeLifecycle', () => {
  it('removes an existing rule', () => {
    setLifecyclePhase(5000, 'running');
    expect(removeLifecycle(5000)).toBe(true);
    expect(hasLifecycle(5000)).toBe(false);
  });

  it('returns false when rule does not exist', () => {
    expect(removeLifecycle(7777)).toBe(false);
  });
});

describe('listLifecycles', () => {
  it('returns sorted list', () => {
    setLifecyclePhase(8080, 'running');
    setLifecyclePhase(3000, 'starting');
    const list = listLifecycles();
    expect(list[0].port).toBe(3000);
    expect(list[1].port).toBe(8080);
  });
});

describe('getPortsByPhase', () => {
  it('filters by phase', () => {
    setLifecyclePhase(3000, 'running');
    setLifecyclePhase(4000, 'stopping');
    setLifecyclePhase(5000, 'running');
    const running = getPortsByPhase('running');
    expect(running).toHaveLength(2);
    expect(running.map((r) => r.port)).toEqual([3000, 5000]);
  });
});

describe('transitionPhase', () => {
  it('transitions when current phase matches', () => {
    setLifecyclePhase(3000, 'starting');
    const result = transitionPhase(3000, 'starting', 'running');
    expect(result?.phase).toBe('running');
  });

  it('returns null when phase does not match', () => {
    setLifecyclePhase(3000, 'running');
    expect(transitionPhase(3000, 'starting', 'running')).toBeNull();
  });

  it('returns null for unknown port', () => {
    expect(transitionPhase(9999, 'expected', 'starting')).toBeNull();
  });

  it('preserves note through transition', () => {
    setLifecyclePhase(3000, 'starting', 'api server');
    const result = transitionPhase(3000, 'starting', 'running');
    expect(result?.note).toBe('api server');
  });
});
