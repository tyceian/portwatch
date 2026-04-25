import {
  setAccessRule,
  removeAccessRule,
  getAccessRule,
  listAccessRules,
  clearAccessRules,
  getAccessSummary,
} from './portAccess';
import {
  formatAccessInline,
  renderAccessTable,
  renderAccessSummary,
} from './portAccessFormatter';

export function handleAllow(port: number, reason?: string): void {
  const rule = setAccessRule(port, 'allow', reason);
  console.log(`✓ ${formatAccessInline(rule)}`);
}

export function handleDeny(port: number, reason?: string): void {
  const rule = setAccessRule(port, 'deny', reason);
  console.log(`✓ ${formatAccessInline(rule)}`);
}

export function handleRemoveAccess(port: number): void {
  const removed = removeAccessRule(port);
  if (removed) {
    console.log(`Removed access rule for port ${port}.`);
  } else {
    console.log(`No access rule found for port ${port}.`);
  }
}

export function handleGetAccess(port: number): void {
  const rule = getAccessRule(port);
  if (!rule) {
    console.log(`No access rule for port ${port} (default: ALLOW).`);
    return;
  }
  console.log(formatAccessInline(rule));
}

export function handleListAccess(): void {
  const rules = listAccessRules();
  console.log(renderAccessTable(rules));
  const { allowed, denied } = getAccessSummary();
  console.log('\n' + renderAccessSummary(allowed, denied));
}

export function handleClearAccess(): void {
  clearAccessRules();
  console.log('All access rules cleared.');
}
