import {
  silencePort,
  unsilencePort,
  isSilenced,
  getSilenceRule,
  listSilenced,
  clearAllSilences,
  getSilenceCount,
} from './portSilence';

beforeEach(() => clearAllSilences());

describe('silencePort', () => {
  it('adds a timed silence rule', () => {
    const rule = silencePort(3000, 60_000, 'test');
    expect(rule.port).toBe(3000);
    expect(rule.reason).toBe('test');
    expect(rule.until).toBeGreaterThan(Date.now());
  });

  it('adds a permanent silence when durationMs is 0', () => {
    const rule = silencePort(8080, 0);
    expect(rule.until).toBe(0);
  });
});

describe('isSilenced', () => {
  it('returns true for an active timed rule', () => {
    silencePort(4000, 10_000);
    expect(isSilenced(4000)).toBe(true);
  });

  it('returns true for a permanent rule', () => {
    silencePort(4001, 0);
    expect(isSilenced(4001)).toBe(true);
  });

  it('returns false and removes expired rule', () => {
    silencePort(4002, -1); // already expired
    expect(isSilenced(4002)).toBe(false);
    expect(getSilenceRule(4002)).toBeUndefined();
  });

  it('returns false for unknown port', () => {
    expect(isSilenced(9999)).toBe(false);
  });
});

describe('unsilencePort', () => {
  it('removes an existing rule', () => {
    silencePort(5000, 60_000);
    expect(unsilencePort(5000)).toBe(true);
    expect(isSilenced(5000)).toBe(false);
  });

  it('returns false when port was not silenced', () => {
    expect(unsilencePort(1234)).toBe(false);
  });
});

describe('listSilenced', () => {
  it('returns only active rules', () => {
    silencePort(6000, 60_000);
    silencePort(6001, 0);
    const list = listSilenced();
    expect(list.map(r => r.port)).toEqual(expect.arrayContaining([6000, 6001]));
  });
});

describe('getSilenceCount', () => {
  it('reflects current map size', () => {
    silencePort(7000, 60_000);
    silencePort(7001, 60_000);
    expect(getSilenceCount()).toBe(2);
  });
});
