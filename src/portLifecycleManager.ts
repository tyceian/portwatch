import {
  setLifecyclePhase,
  removeLifecycle,
  getLifecycle,
  listLifecycles,
  LifecyclePhase,
} from './portLifecycle';
import {
  formatLifecycleInline,
  renderLifecycleTable,
  renderLifecycleSummary,
} from './portLifecycleFormatter';

const VALID_PHASES: LifecyclePhase[] = [
  'development',
  'staging',
  'production',
  'deprecated',
  'experimental',
];

function isValidPhase(value: string): value is LifecyclePhase {
  return VALID_PHASES.includes(value as LifecyclePhase);
}

export function handleSetLifecycle(port: number, phase: string, note?: string): void {
  if (!isValidPhase(phase)) {
    console.error(`Invalid phase "${phase}". Valid phases: ${VALID_PHASES.join(', ')}`);
    return;
  }
  setLifecyclePhase(port, phase, note);
  const lc = getLifecycle(port)!;
  console.log(`Port ${port}: lifecycle set to ${formatLifecycleInline(lc)}`);
}

export function handleRemoveLifecycle(port: number): void {
  if (!getLifecycle(port)) {
    console.log(`Port ${port} has no lifecycle phase set.`);
    return;
  }
  removeLifecycle(port);
  console.log(`Port ${port}: lifecycle phase removed.`);
}

export function handleGetLifecycle(port: number): void {
  const lc = getLifecycle(port);
  if (!lc) {
    console.log(`Port ${port}: no lifecycle phase set.`);
    return;
  }
  console.log(`Port ${port}: ${formatLifecycleInline(lc)}`);
}

export function handleListLifecycles(): void {
  const all = listLifecycles();
  const entries = Object.entries(all).map(([p, lc]) => ({
    port: Number(p),
    lc,
  }));
  console.log(renderLifecycleTable(entries));
}

export function handleLifecycleSummary(): void {
  const all = listLifecycles();
  const entries = Object.entries(all).map(([p, lc]) => ({
    port: Number(p),
    lc,
  }));
  console.log(renderLifecycleSummary(entries));
}
