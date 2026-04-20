import { getLabelForPort, isWellKnownPort, formatPortWithLabel } from './portLabel';
import { colorize } from './formatter';

export type LabelDisplayOptions = {
  color?: boolean;
  showBadge?: boolean;
};

const WELL_KNOWN_COLOR = 'cyan';
const UNKNOWN_COLOR = 'white';
const BADGE_KNOWN = '●';
const BADGE_UNKNOWN = '○';

export function renderPortLabel(
  port: number,
  options: LabelDisplayOptions = {}
): string {
  const { color = true, showBadge = false } = options;
  const { label, isKnown } = getLabelForPort(port);
  const badge = showBadge ? (isKnown ? `${BADGE_KNOWN} ` : `${BADGE_UNKNOWN} `) : '';
  const text = `${badge}${formatPortWithLabel(port)}`;

  if (!color) return text;
  return colorize(text, isKnown ? WELL_KNOWN_COLOR : UNKNOWN_COLOR);
}

export function renderPortLabelList(
  ports: number[],
  options: LabelDisplayOptions = {}
): string[] {
  return ports.map((port) => renderPortLabel(port, options));
}

export function renderLabelTable(ports: number[]): string {
  if (ports.length === 0) return 'No ports to display.';

  const rows = ports.map((port) => {
    const { label, isKnown } = getLabelForPort(port);
    const badge = isKnown ? BADGE_KNOWN : BADGE_UNKNOWN;
    const portStr = String(port).padEnd(6);
    const labelStr = label.padEnd(24);
    return `  ${badge}  ${portStr} ${labelStr} ${isKnown ? '[known]' : ''}`;
  });

  const header = `  ${'PORT'.padEnd(8)}${'SERVICE'.padEnd(24)}`;
  const divider = '  ' + '-'.repeat(40);
  return [header, divider, ...rows].join('\n');
}

export function highlightUnknownPorts(ports: number[]): string[] {
  return ports
    .filter((p) => !isWellKnownPort(p))
    .map((p) => renderPortLabel(p, { color: true, showBadge: true }));
}
