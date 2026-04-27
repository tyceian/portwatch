import {
  formatPhaseBadge,
  formatLifecycleInline,
  renderLifecycleRow,
  renderLifecycleTable,
  renderLifecycleSummary,
} from './portLifecycleFormatter';
import { PortLifecycle } from './portLifecycle';

const devLc: PortLifecycle = { phase: 'development', note: 'local dev server' };
const prodLc: PortLifecycle = { phase: 'production' };
const depLc: PortLifecycle = { phase: 'deprecated', note: 'migrating away' };

describe('formatPhaseBadge', () => {
  it('wraps phase in brackets and includes ANSI codes', () => {
    const badge = formatPhaseBadge('production');
    expect(badge).toContain('[PRODUCTION]');
    expect(badge).toMatch(/\x1b\[/);
  });

  it('handles all valid phases', () => {
    const phases = ['development', 'staging', 'production', 'deprecated', 'experimental'] as const;
    for (const phase of phases) {
      expect(formatPhaseBadge(phase)).toContain(phase.toUpperCase());
    }
  });
});

describe('formatLifecycleInline', () => {
  it('includes phase badge and note', () => {
    const result = formatLifecycleInline(devLc);
    expect(result).toContain('[DEVELOPMENT]');
    expect(result).toContain('local dev server');
  });

  it('omits note section when note is absent', () => {
    const result = formatLifecycleInline(prodLc);
    expect(result).not.toContain('—');
  });
});

describe('renderLifecycleRow', () => {
  it('contains port, phase, and note', () => {
    const row = renderLifecycleRow(3000, depLc);
    expect(row).toContain('3000');
    expect(row).toContain('deprecated');
    expect(row).toContain('migrating away');
  });
});

describe('renderLifecycleTable', () => {
  it('returns fallback for empty list', () => {
    expect(renderLifecycleTable([])).toBe('No lifecycle phases set.');
  });

  it('renders header and rows', () => {
    const entries = [
      { port: 3000, lc: devLc },
      { port: 8080, lc: prodLc },
    ];
    const table = renderLifecycleTable(entries);
    expect(table).toContain('PORT');
    expect(table).toContain('3000');
    expect(table).toContain('8080');
  });
});

describe('renderLifecycleSummary', () => {
  it('returns fallback for empty list', () => {
    expect(renderLifecycleSummary([])).toBe('No lifecycle data.');
  });

  it('counts phases correctly', () => {
    const entries = [
      { port: 3000, lc: devLc },
      { port: 3001, lc: devLc },
      { port: 8080, lc: prodLc },
    ];
    const summary = renderLifecycleSummary(entries);
    expect(summary).toContain('×2');
    expect(summary).toContain('×1');
  });
});
