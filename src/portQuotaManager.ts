import {
  setQuota,
  removeQuota,
  getQuota,
  listQuotas,
  clearQuotas,
  checkQuotaViolation,
} from './portQuota';
import {
  formatQuotaInline,
  renderQuotaTable,
  renderViolationWarning,
  renderQuotaSummary,
} from './portQuotaFormatter';

function parseType(raw: string): 'process' | 'tag' {
  if (raw === 'process' || raw === 'tag') return raw;
  throw new Error(`Invalid type "${raw}". Must be "process" or "tag".`);
}

export function handleSetQuota(args: string[]): void {
  const [rawType, target, rawMax] = args;
  if (!rawType || !target || !rawMax) {
    console.error('Usage: portwatch quota set <process|tag> <target> <max>');
    return;
  }
  const type = parseType(rawType);
  const max = parseInt(rawMax, 10);
  if (isNaN(max)) { console.error('max must be a number'); return; }
  const rule = setQuota(type, target, max);
  console.log(`Quota set: ${formatQuotaInline(rule)}`);
}

export function handleRemoveQuota(args: string[]): void {
  const [rawType, target] = args;
  if (!rawType || !target) {
    console.error('Usage: portwatch quota remove <process|tag> <target>');
    return;
  }
  const type = parseType(rawType);
  const removed = removeQuota(type, target);
  console.log(removed ? `Quota removed for ${type} "${target}".` : `No quota found for ${type} "${target}".`);
}

export function handleGetQuota(args: string[]): void {
  const [rawType, target] = args;
  if (!rawType || !target) {
    console.error('Usage: portwatch quota get <process|tag> <target>');
    return;
  }
  const type = parseType(rawType);
  const rule = getQuota(type, target);
  console.log(rule ? formatQuotaInline(rule) : `No quota set for ${type} "${target}".`);
}

export function handleListQuotas(): void {
  const rules = listQuotas();
  console.log(renderQuotaTable(rules));
  console.log(renderQuotaSummary(rules));
}

export function handleCheckQuota(args: string[]): void {
  const [rawType, target, rawCount] = args;
  if (!rawType || !target || !rawCount) {
    console.error('Usage: portwatch quota check <process|tag> <target> <count>');
    return;
  }
  const type = parseType(rawType);
  const count = parseInt(rawCount, 10);
  if (isNaN(count)) { console.error('count must be a number'); return; }
  const result = checkQuotaViolation(type, target, count);
  if (!result) { console.log(`No quota rule for ${type} "${target}".`); return; }
  if (result.violated) {
    console.log(renderViolationWarning(type, target, result.current, result.max));
  } else {
    console.log(`OK: ${type} "${target}" is within quota (${result.current}/${result.max}).`);
  }
}

export function handleClearQuotas(): void {
  clearQuotas();
  console.log('All quota rules cleared.');
}
