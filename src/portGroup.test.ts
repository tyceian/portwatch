import {
  categorizePort,
  groupPortsByCategory,
  groupPortsByProcess,
  formatPortGroup,
  summarizeGroups,
  PortGroup,
} from './portGroup';

describe('categorizePort', () => {
  it('categorizes web ports', () => {
    expect(categorizePort(3000)).toBe('web');
    expect(categorizePort(8080)).toBe('web');
    expect(categorizePort(80)).toBe('web');
  });

  it('categorizes database ports', () => {
    expect(categorizePort(5432)).toBe('database');
    expect(categorizePort(3306)).toBe('database');
    expect(categorizePort(27017)).toBe('database');
  });

  it('categorizes devtools ports', () => {
    expect(categorizePort(9229)).toBe('devtools');
    expect(categorizePort(5173)).toBe('devtools');
  });

  it('falls back to other for unknown ports', () => {
    expect(categorizePort(12345)).toBe('other');
    expect(categorizePort(9999)).toBe('other');
  });
});

describe('groupPortsByCategory', () => {
  it('groups ports into correct categories', () => {
    const groups = groupPortsByCategory([3000, 5432, 9229, 12345]);
    const categories = groups.map(g => g.category);
    expect(categories).toContain('web');
    expect(categories).toContain('database');
    expect(categories).toContain('devtools');
    expect(categories).toContain('other');
  });

  it('returns empty array for no ports', () => {
    expect(groupPortsByCategory([])).toEqual([]);
  });

  it('sorts ports within each group', () => {
    const groups = groupPortsByCategory([3500, 3001, 3200]);
    const webGroup = groups.find(g => g.category === 'web');
    expect(webGroup?.ports).toEqual([3001, 3200, 3500]);
  });
});

describe('groupPortsByProcess', () => {
  it('groups ports by process name', () => {
    const map = new Map([[3000, 'node'], [3001, 'node'], [5432, 'postgres']]);
    const groups = groupPortsByProcess(map);
    expect(groups.get('node')).toEqual([3000, 3001]);
    expect(groups.get('postgres')).toEqual([5432]);
  });

  it('uses unknown for missing process names', () => {
    const map = new Map([[9999, '']]);
    const groups = groupPortsByProcess(map);
    expect(groups.has('unknown')).toBe(true);
  });
});

describe('summarizeGroups', () => {
  it('returns no active ports message for empty array', () => {
    expect(summarizeGroups([])).toBe('No active ports');
  });

  it('formats multiple groups', () => {
    const groups: PortGroup[] = [
      { name: 'Web', ports: [3000], category: 'web' },
      { name: 'Database', ports: [5432], category: 'database' },
    ];
    const result = summarizeGroups(groups);
    expect(result).toContain('[Web]');
    expect(result).toContain('[Database]');
  });
});
