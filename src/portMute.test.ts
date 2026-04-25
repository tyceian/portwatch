import {
  mutePort,
  unmutePort,
  isMuted,
  getMuteRule,
  listMuted,
  clearMutes,
  muteCount,
  filterMuted,
} from './portMute';

beforeEach(() => clearMutes());

describe('mutePort', () => {
  it('adds a mute rule', () => {
    const rule = mutePort(3000, 'noisy');
    expect(rule.port).toBe(3000);
    expect(rule.reason).toBe('noisy');
    expect(rule.mutedAt).toBeLessThanOrEqual(Date.now());
  });

  it('works without reason', () => {
    const rule = mutePort(4000);
    expect(rule.reason).toBeUndefined();
  });
});

describe('isMuted', () => {
  it('returns true for muted port', () => {
    mutePort(3000);
    expect(isMuted(3000)).toBe(true);
  });

  it('returns false for unmuted port', () => {
    expect(isMuted(9999)).toBe(false);
  });
});

describe('unmutePort', () => {
  it('removes the rule and returns true', () => {
    mutePort(3000);
    expect(unmutePort(3000)).toBe(true);
    expect(isMuted(3000)).toBe(false);
  });

  it('returns false when port was not muted', () => {
    expect(unmutePort(1234)).toBe(false);
  });
});

describe('getMuteRule', () => {
  it('returns the rule if present', () => {
    mutePort(8080, 'test');
    expect(getMuteRule(8080)?.reason).toBe('test');
  });

  it('returns undefined when not muted', () => {
    expect(getMuteRule(8080)).toBeUndefined();
  });
});

describe('listMuted', () => {
  it('returns sorted list of rules', () => {
    mutePort(5000);
    mutePort(3000);
    const list = listMuted();
    expect(list.map((r) => r.port)).toEqual([3000, 5000]);
  });
});

describe('muteCount', () => {
  it('reflects current mute store size', () => {
    mutePort(1111);
    mutePort(2222);
    expect(muteCount()).toBe(2);
  });
});

describe('filterMuted', () => {
  it('removes muted ports from list', () => {
    mutePort(3000);
    expect(filterMuted([3000, 4000, 5000])).toEqual([4000, 5000]);
  });

  it('returns all ports when none muted', () => {
    expect(filterMuted([80, 443])).toEqual([80, 443]);
  });
});
