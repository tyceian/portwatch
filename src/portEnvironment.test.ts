import {
  setEnvironment,
  removeEnvironment,
  getEnvironment,
  hasEnvironment,
  listEnvironments,
  getPortsForEnvironment,
  clearEnvironments,
  isKnownEnvironment,
  getRuleCount,
} from './portEnvironment';

beforeEach(() => clearEnvironments());

describe('setEnvironment', () => {
  it('stores a rule and returns it', () => {
    const rule = setEnvironment(3000, 'dev');
    expect(rule.port).toBe(3000);
    expect(rule.environment).toBe('dev');
    expect(rule.addedAt).toBeLessThanOrEqual(Date.now());
  });

  it('normalises environment to lowercase', () => {
    const rule = setEnvironment(4000, 'PROD');
    expect(rule.environment).toBe('prod');
  });

  it('overwrites existing rule for same port', () => {
    setEnvironment(3000, 'dev');
    setEnvironment(3000, 'staging');
    expect(getEnvironment(3000)?.environment).toBe('staging');
    expect(getRuleCount()).toBe(1);
  });
});

describe('removeEnvironment', () => {
  it('removes an existing rule', () => {
    setEnvironment(3000, 'dev');
    expect(removeEnvironment(3000)).toBe(true);
    expect(hasEnvironment(3000)).toBe(false);
  });

  it('returns false for unknown port', () => {
    expect(removeEnvironment(9999)).toBe(false);
  });
});

describe('listEnvironments', () => {
  it('returns rules sorted by port', () => {
    setEnvironment(8080, 'staging');
    setEnvironment(3000, 'dev');
    const list = listEnvironments();
    expect(list[0].port).toBe(3000);
    expect(list[1].port).toBe(8080);
  });
});

describe('getPortsForEnvironment', () => {
  it('returns only matching ports', () => {
    setEnvironment(3000, 'dev');
    setEnvironment(3001, 'dev');
    setEnvironment(8080, 'staging');
    const devPorts = getPortsForEnvironment('dev');
    expect(devPorts).toHaveLength(2);
    expect(devPorts.map(r => r.port)).toContain(3000);
  });

  it('is case-insensitive', () => {
    setEnvironment(3000, 'prod');
    expect(getPortsForEnvironment('PROD')).toHaveLength(1);
  });
});

describe('isKnownEnvironment', () => {
  it('returns true for known envs', () => {
    expect(isKnownEnvironment('dev')).toBe(true);
    expect(isKnownEnvironment('PROD')).toBe(true);
  });

  it('returns false for custom envs', () => {
    expect(isKnownEnvironment('canary')).toBe(false);
  });
});
