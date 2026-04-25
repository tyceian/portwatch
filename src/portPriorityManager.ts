import {
  setPriority, removePriority, getPriority,
  listPriorities, clearPriorities, getPortsByLevel,
  PriorityLevel,
} from './portPriority';
import {
  formatPriorityInline, renderPriorityTable, renderPrioritySummary,
} from './portPriorityFormatter';

const VALID_LEVELS: PriorityLevel[] = ['critical', 'high', 'medium', 'low'];

function isValidLevel(val: string): val is PriorityLevel {
  return VALID_LEVELS.includes(val as PriorityLevel);
}

export function handleSetPriority(args: string[]): void {
  const [portStr, level, ...rest] = args;
  const port = parseInt(portStr, 10);
  if (isNaN(port)) { console.error('Invalid port number'); return; }
  if (!isValidLevel(level)) {
    console.error(`Invalid level. Choose from: ${VALID_LEVELS.join(', ')}`);
    return;
  }
  const reason = rest.join(' ') || undefined;
  const rule = setPriority(port, level, reason);
  console.log(formatPriorityInline(rule));
}

export function handleRemovePriority(args: string[]): void {
  const port = parseInt(args[0], 10);
  if (isNaN(port)) { console.error('Invalid port number'); return; }
  const removed = removePriority(port);
  console.log(removed ? `Removed priority for port ${port}` : `No priority rule for port ${port}`);
}

export function handleGetPriority(args: string[]): void {
  const port = parseInt(args[0], 10);
  if (isNaN(port)) { console.error('Invalid port number'); return; }
  const rule = getPriority(port);
  if (!rule) { console.log(`No priority set for port ${port}`); return; }
  console.log(formatPriorityInline(rule));
}

export function handleListPriorities(args: string[]): void {
  const filterLevel = args[0] as PriorityLevel | undefined;
  let rules = listPriorities();
  if (filterLevel && isValidLevel(filterLevel)) {
    rules = rules.filter(r => r.level === filterLevel);
  }
  console.log(renderPriorityTable(rules));
  if (rules.length > 0) console.log('\n  ' + renderPrioritySummary(rules));
}

export function handleClearPriorities(): void {
  clearPriorities();
  console.log('All priority rules cleared.');
}

export function handlePortsByLevel(args: string[]): void {
  const level = args[0] as PriorityLevel;
  if (!isValidLevel(level)) {
    console.error(`Invalid level. Choose from: ${VALID_LEVELS.join(', ')}`);
    return;
  }
  const ports = getPortsByLevel(level);
  console.log(ports.length ? ports.join(', ') : `No ports at level "${level}"`);
}
