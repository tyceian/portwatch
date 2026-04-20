// Groups ports by process name or service category for organized display

import { getLabelForPort } from './portLabel';

export interface PortGroup {
  name: string;
  ports: number[];
  category: 'web' | 'database' | 'cache' | 'devtools' | 'other';
}

const CATEGORY_RANGES: Record<PortGroup['category'], number[][]> = {
  web: [[80, 80], [443, 443], [3000, 3999], [8000, 8999]],
  database: [[3306, 3306], [5432, 5432], [27017, 27017], [6379, 6379]],
  cache: [[6379, 6379], [11211, 11211]],
  devtools: [[9229, 9229], [4200, 4200], [5173, 5173], [24678, 24678]],
  other: [],
};

export function categorizePort(port: number): PortGroup['category'] {
  for (const [category, ranges] of Object.entries(CATEGORY_RANGES) as [PortGroup['category'], number[][]][]) {
    if (category === 'other') continue;
    for (const [min, max] of ranges) {
      if (port >= min && port <= max) return category;
    }
  }
  return 'other';
}

export function groupPortsByCategory(ports: number[]): PortGroup[] {
  const groups = new Map<PortGroup['category'], number[]>();

  for (const port of ports) {
    const category = categorizePort(port);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(port);
  }

  return Array.from(groups.entries()).map(([category, groupPorts]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    ports: groupPorts.sort((a, b) => a - b),
    category,
  }));
}

export function groupPortsByProcess(portProcessMap: Map<number, string>): Map<string, number[]> {
  const groups = new Map<string, number[]>();

  for (const [port, processName] of portProcessMap.entries()) {
    const key = processName || 'unknown';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(port);
  }

  return groups;
}

export function formatPortGroup(group: PortGroup): string {
  const portList = group.ports
    .map(p => {
      const label = getLabelForPort(p);
      return label ? `${p}(${label})` : `${p}`;
    })
    .join(', ');
  return `[${group.name}] ${portList}`;
}

export function summarizeGroups(groups: PortGroup[]): string {
  if (groups.length === 0) return 'No active ports';
  return groups.map(formatPortGroup).join('\n');
}
