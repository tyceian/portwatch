import {
  isRateLimited,
  resetRateLimit,
  clearRateLimits,
  getRateLimitStats,
  getRateLimitKey,
} from './rateLimit';

beforeEach(() => {
  clearRateLimits();
});

describe('getRateLimitKey', () => {
  it('formats key from port and type', () => {
    expect(getRateLimitKey(3000, 'open')).toBe('3000:open');
  });
});

describe('isRateLimited', () => {
  const cfg = { windowMs: 5000, maxAlerts: 3 };

  it('allows first alert through', () => {
    expect(isRateLimited(3000, 'open', cfg)).toBe(false);
  });

  it('allows up to maxAlerts within window', () => {
    isRateLimited(3000, 'open', cfg);
    isRateLimited(3000, 'open', cfg);
    expect(isRateLimited(3000, 'open', cfg)).toBe(false);
  });

  it('blocks alerts beyond maxAlerts', () => {
    for (let i = 0; i < 3; i++) isRateLimited(3000, 'open', cfg);
    expect(isRateLimited(3000, 'open', cfg)).toBe(true);
  });

  it('does not cross-contaminate port+type combos', () => {
    for (let i = 0; i < 4; i++) isRateLimited(3000, 'open', cfg);
    expect(isRateLimited(3000, 'close', cfg)).toBe(false);
    expect(isRateLimited(4000, 'open', cfg)).toBe(false);
  });
});

describe('resetRateLimit', () => {
  it('clears entry so alerts flow again', () => {
    const cfg = { windowMs: 5000, maxAlerts: 2 };
    for (let i = 0; i < 3; i++) isRateLimited(8080, 'open', cfg);
    resetRateLimit(8080, 'open');
    expect(isRateLimited(8080, 'open', cfg)).toBe(false);
  });
});

describe('getRateLimitStats', () => {
  it('returns undefined for unknown key', () => {
    expect(getRateLimitStats(9999, 'open')).toBeUndefined();
  });

  it('returns stats after alerts', () => {
    isRateLimited(3000, 'open');
    isRateLimited(3000, 'open');
    const stats = getRateLimitStats(3000, 'open');
    expect(stats?.count).toBe(2);
  });
});
