import {
  addDependency,
  removeDependency,
  getDependenciesFor,
  getDependentsOf,
  listDependencies,
  clearDependencies,
  hasDependency,
  getAffectedPorts,
} from './portDependency';

beforeEach(() => clearDependencies());

describe('addDependency', () => {
  it('adds a new dependency', () => {
    const dep = addDependency(3000, 5432, 'db');
    expect(dep.from).toBe(3000);
    expect(dep.to).toBe(5432);
    expect(dep.label).toBe('db');
  });

  it('returns existing dep and updates label', () => {
    addDependency(3000, 5432);
    const dep = addDependency(3000, 5432, 'updated');
    expect(dep.label).toBe('updated');
    expect(listDependencies()).toHaveLength(1);
  });
});

describe('removeDependency', () => {
  it('removes an existing dependency', () => {
    addDependency(3000, 5432);
    expect(removeDependency(3000, 5432)).toBe(true);
    expect(listDependencies()).toHaveLength(0);
  });

  it('returns false if not found', () => {
    expect(removeDependency(9999, 1111)).toBe(false);
  });
});

describe('getDependenciesFor', () => {
  it('returns ports that the given port depends on', () => {
    addDependency(3000, 5432);
    addDependency(3000, 6379);
    addDependency(4000, 5432);
    expect(getDependenciesFor(3000)).toHaveLength(2);
  });
});

describe('getDependentsOf', () => {
  it('returns ports that depend on the given port', () => {
    addDependency(3000, 5432);
    addDependency(4000, 5432);
    const deps = getDependentsOf(5432);
    expect(deps.map(d => d.from)).toEqual(expect.arrayContaining([3000, 4000]));
  });
});

describe('hasDependency', () => {
  it('returns true when dependency exists', () => {
    addDependency(3000, 5432);
    expect(hasDependency(3000, 5432)).toBe(true);
  });

  it('returns false when not present', () => {
    expect(hasDependency(3000, 5432)).toBe(false);
  });
});

describe('getAffectedPorts', () => {
  it('returns ports that depend on the closed port', () => {
    addDependency(3000, 5432);
    addDependency(4000, 5432);
    expect(getAffectedPorts(5432)).toEqual(expect.arrayContaining([3000, 4000]));
  });

  it('returns empty array when no dependents', () => {
    expect(getAffectedPorts(9999)).toEqual([]);
  });
});
