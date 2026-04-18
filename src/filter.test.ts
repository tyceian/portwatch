import { matchesFilter, applyFilter, FilterOptions } from './filter';

describe('matchesFilter', () => {
  it('returns true with empty options', () => {
    expect(matchesFilter(3000, 'node', {})).toBe(true);
  });

  it('matches specific ports allowlist', () => {
    expect(matchesFilter(3000, 'node', { ports: [3000, 8080] })).toBe(true);
    expect(matchesFilter(4000, 'node', { ports: [3000, 8080] })).toBe(false);
  });

  it('excludes ports in excludePorts', () => {
    expect(matchesFilter(3000, 'node', { excludePorts: [3000] })).toBe(false);
    expect(matchesFilter(4000, 'node', { excludePorts: [3000] })).toBe(true);
  });

  it('filters by minPort and maxPort', () => {
    expect(matchesFilter(1000, 'node', { minPort: 1024 })).toBe(false);
    expect(matchesFilter(1024, 'node', { minPort: 1024 })).toBe(true);
    expect(matchesFilter(9000, 'node', { maxPort: 8080 })).toBe(false);
    expect(matchesFilter(8080, 'node', { maxPort: 8080 })).toBe(true);
  });

  it('filters by process name (case-insensitive)', () => {
    expect(matchesFilter(3000, 'Node', { processes: ['node'] })).toBe(true);
    expect(matchesFilter(3000, 'python', { processes: ['node'] })).toBe(false);
  });
});

describe('applyFilter', () => {
  const portMap = new Map<number, string>([
    [3000, 'node'],
    [8080, 'python'],
    [5432, 'postgres'],
  ]);

  it('returns all entries with no filter', () => {
    expect(applyFilter(portMap, {}).size).toBe(3);
  });

  it('returns only matching ports', () => {
    const result = applyFilter(portMap, { ports: [3000, 5432] });
    expect(result.size).toBe(2);
    expect(result.has(8080)).toBe(false);
  });

  it('excludes specified ports', () => {
    const result = applyFilter(portMap, { excludePorts: [5432] });
    expect(result.size).toBe(2);
    expect(result.has(5432)).toBe(false);
  });
});
