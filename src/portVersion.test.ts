import {
  setVersion,
  removeVersion,
  getVersion,
  hasVersion,
  listVersions,
  clearVersions,
  bumpVersion,
  compareVersions,
} from './portVersion';

beforeEach(() => {
  clearVersions();
});

describe('setVersion / getVersion', () => {
  it('stores and retrieves a version string', () => {
    setVersion(3000, '1.2.3');
    expect(getVersion(3000)).toEqual({ port: 3000, version: '1.2.3', updatedAt: expect.any(Number) });
  });

  it('returns undefined for unknown port', () => {
    expect(getVersion(9999)).toBeUndefined();
  });

  it('overwrites an existing version', () => {
    setVersion(3000, '1.0.0');
    setVersion(3000, '2.0.0');
    expect(getVersion(3000)?.version).toBe('2.0.0');
  });
});

describe('hasVersion', () => {
  it('returns true when version exists', () => {
    setVersion(8080, '0.9.1');
    expect(hasVersion(8080)).toBe(true);
  });

  it('returns false when version does not exist', () => {
    expect(hasVersion(1234)).toBe(false);
  });
});

describe('removeVersion', () => {
  it('removes an existing version', () => {
    setVersion(4000, '3.1.4');
    removeVersion(4000);
    expect(hasVersion(4000)).toBe(false);
  });

  it('is a no-op for unknown port', () => {
    expect(() => removeVersion(5555)).not.toThrow();
  });
});

describe('listVersions', () => {
  it('returns all stored version records', () => {
    setVersion(3000, '1.0.0');
    setVersion(4000, '2.0.0');
    const list = listVersions();
    expect(list).toHaveLength(2);
    expect(list.map(r => r.port).sort()).toEqual([3000, 4000]);
  });

  it('returns empty array when nothing stored', () => {
    expect(listVersions()).toEqual([]);
  });
});

describe('bumpVersion', () => {
  it('bumps patch segment', () => {
    setVersion(3000, '1.2.3');
    bumpVersion(3000, 'patch');
    expect(getVersion(3000)?.version).toBe('1.2.4');
  });

  it('bumps minor segment and resets patch', () => {
    setVersion(3000, '1.2.3');
    bumpVersion(3000, 'minor');
    expect(getVersion(3000)?.version).toBe('1.3.0');
  });

  it('bumps major segment and resets minor/patch', () => {
    setVersion(3000, '1.2.3');
    bumpVersion(3000, 'major');
    expect(getVersion(3000)?.version).toBe('2.0.0');
  });

  it('throws when port has no version', () => {
    expect(() => bumpVersion(9999, 'patch')).toThrow();
  });
});

describe('compareVersions', () => {
  it('returns 0 for equal versions', () => {
    expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
  });

  it('returns positive when first is newer', () => {
    expect(compareVersions('2.0.0', '1.9.9')).toBeGreaterThan(0);
  });

  it('returns negative when first is older', () => {
    expect(compareVersions('1.0.0', '1.0.1')).toBeLessThan(0);
  });
});
