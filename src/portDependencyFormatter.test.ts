import {
  formatDependencyInline,
  renderDependencyRow,
  renderDependencyTable,
  renderAffectedWarning,
  renderDependencySummary,
} from './portDependencyFormatter';
import { PortDependency } from './portDependency';

const dep: PortDependency = { from: 3000, to: 5432, label: 'db', createdAt: 1000 };
const depNoLabel: PortDependency = { from: 4000, to: 6379, createdAt: 2000 };

describe('formatDependencyInline', () => {
  it('includes from, to and label', () => {
    const out = formatDependencyInline(dep);
    expect(out).toContain('3000');
    expect(out).toContain('5432');
    expect(out).toContain('db');
  });

  it('omits label section when undefined', () => {
    const out = formatDependencyInline(depNoLabel);
    expect(out).not.toContain('(');
  });
});

describe('renderDependencyRow', () => {
  it('formats from, to, and label in columns', () => {
    const row = renderDependencyRow(dep);
    expect(row).toContain('3000');
    expect(row).toContain('5432');
    expect(row).toContain('db');
  });

  it('shows dash when no label', () => {
    const row = renderDependencyRow(depNoLabel);
    expect(row).toContain('-');
  });
});

describe('renderDependencyTable', () => {
  it('shows empty message when no deps', () => {
    expect(renderDependencyTable([])).toContain('No dependencies');
  });

  it('renders header and rows', () => {
    const out = renderDependencyTable([dep, depNoLabel]);
    expect(out).toContain('FROM');
    expect(out).toContain('3000');
    expect(out).toContain('4000');
  });
});

describe('renderAffectedWarning', () => {
  it('returns empty string when no affected ports', () => {
    expect(renderAffectedWarning(5432, [])).toBe('');
  });

  it('lists affected ports in warning', () => {
    const out = renderAffectedWarning(5432, [3000, 4000]);
    expect(out).toContain('5432');
    expect(out).toContain('3000');
    expect(out).toContain('4000');
  });
});

describe('renderDependencySummary', () => {
  it('shows count and unique ports', () => {
    const out = renderDependencySummary([dep]);
    expect(out).toContain('1 dependency');
  });

  it('pluralises correctly for multiple deps', () => {
    const out = renderDependencySummary([dep, depNoLabel]);
    expect(out).toContain('2 dependencies');
  });
});
