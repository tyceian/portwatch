import {
  setOwner,
  removeOwner,
  getOwner,
  hasOwner,
  listOwners,
  getPortsByOwner,
  getPortsByTeam,
  clearOwners,
  ownerCount,
} from './portOwner';
import {
  formatOwnerInline,
  renderOwnerRow,
  renderOwnerTable,
  renderOwnerSummary,
} from './portOwnerFormatter';

beforeEach(() => clearOwners());

describe('setOwner / getOwner', () => {
  it('stores and retrieves an owner rule', () => {
    const rule = setOwner(3000, 'alice', 'backend', 'alice@example.com');
    expect(rule.port).toBe(3000);
    expect(rule.owner).toBe('alice');
    expect(rule.team).toBe('backend');
    expect(getOwner(3000)).toEqual(rule);
  });

  it('returns undefined for unassigned port', () => {
    expect(getOwner(9999)).toBeUndefined();
  });
});

describe('hasOwner / removeOwner', () => {
  it('reports presence and removes correctly', () => {
    setOwner(4000, 'bob');
    expect(hasOwner(4000)).toBe(true);
    expect(removeOwner(4000)).toBe(true);
    expect(hasOwner(4000)).toBe(false);
  });

  it('returns false when removing non-existent', () => {
    expect(removeOwner(1234)).toBe(false);
  });
});

describe('listOwners / ownerCount', () => {
  it('returns sorted list', () => {
    setOwner(5000, 'charlie');
    setOwner(3000, 'alice');
    const list = listOwners();
    expect(list[0].port).toBe(3000);
    expect(list[1].port).toBe(5000);
    expect(ownerCount()).toBe(2);
  });
});

describe('getPortsByOwner / getPortsByTeam', () => {
  it('filters by owner (case-insensitive)', () => {
    setOwner(3000, 'Alice', 'backend');
    setOwner(4000, 'Bob', 'frontend');
    expect(getPortsByOwner('alice')).toHaveLength(1);
  });

  it('filters by team', () => {
    setOwner(3000, 'Alice', 'backend');
    setOwner(4000, 'Bob', 'backend');
    setOwner(5000, 'Carol', 'frontend');
    expect(getPortsByTeam('backend')).toHaveLength(2);
  });
});

describe('formatOwnerInline', () => {
  it('includes team and contact when present', () => {
    const rule = setOwner(3000, 'alice', 'backend', 'alice@x.com');
    const out = formatOwnerInline(rule);
    expect(out).toContain('owner=alice');
    expect(out).toContain('team=backend');
    expect(out).toContain('contact=alice@x.com');
  });
});

describe('renderOwnerTable', () => {
  it('shows empty message when no rules', () => {
    expect(renderOwnerTable([])).toMatch(/no owner/i);
  });

  it('renders header and rows', () => {
    setOwner(3000, 'alice', 'backend');
    const out = renderOwnerTable(listOwners());
    expect(out).toContain('OWNER');
    expect(out).toContain('alice');
  });
});

describe('renderOwnerSummary', () => {
  it('summarises counts', () => {
    setOwner(3000, 'alice', 'backend');
    setOwner(4000, 'bob', 'frontend');
    const out = renderOwnerSummary(listOwners());
    expect(out).toContain('2 port(s)');
    expect(out).toContain('2 team(s)');
  });
});
