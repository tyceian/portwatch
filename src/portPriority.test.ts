import {
  setPriority, removePriority, getPriority, hasPriority,
  getPriorityLevel, listPriorities, clearPriorities,
  getPortsByLevel, comparePriority,
} from './portPriority';

beforeEach(() => clearPriorities());

describe('setPriority', () => {
  it('stores a priority rule', () => {
    const rule = setPriority(3000, 'high', 'main api');
    expect(rule.port).toBe(3000);
    expect(rule.level).toBe('high');
    expect(rule.reason).toBe('main api');
    expect(rule.setAt).toBeGreaterThan(0);
  });

  it('overwrites existing rule', () => {
    setPriority(3000, 'low');
    setPriority(3000, 'critical');
    expect(getPriorityLevel(3000)).toBe('critical');
  });
});

describe('removePriority', () => {
  it('removes an existing rule', () => {
    setPriority(4000, 'medium');
    expect(removePriority(4000)).toBe(true);
    expect(hasPriority(4000)).toBe(false);
  });

  it('returns false for unknown port', () => {
    expect(removePriority(9999)).toBe(false);
  });
});

describe('listPriorities', () => {
  it('returns rules sorted by level', () => {
    setPriority(1, 'low');
    setPriority(2, 'critical');
    setPriority(3, 'medium');
    const levels = listPriorities().map(r => r.level);
    expect(levels).toEqual(['critical', 'medium', 'low']);
  });
});

describe('getPortsByLevel', () => {
  it('returns only ports at the given level', () => {
    setPriority(3000, 'high');
    setPriority(4000, 'low');
    setPriority(5000, 'high');
    expect(getPortsByLevel('high').sort()).toEqual([3000, 5000]);
    expect(getPortsByLevel('low')).toEqual([4000]);
  });
});

describe('comparePriority', () => {
  it('orders critical before low', () => {
    setPriority(3000, 'critical');
    setPriority(4000, 'low');
    expect(comparePriority(3000, 4000)).toBeLessThan(0);
  });

  it('treats unset ports as low', () => {
    setPriority(3000, 'high');
    expect(comparePriority(3000, 9999)).toBeLessThan(0);
  });
});
