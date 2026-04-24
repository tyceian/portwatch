// User-defined tags for ports (e.g. "frontend", "db", "api")

export interface PortTag {
  port: number;
  tags: string[];
}

const tagStore = new Map<number, Set<string>>();

export function addTag(port: number, tag: string): void {
  if (!tagStore.has(port)) {
    tagStore.set(port, new Set());
  }
  tagStore.get(port)!.add(tag.toLowerCase().trim());
}

export function removeTag(port: number, tag: string): boolean {
  const tags = tagStore.get(port);
  if (!tags) return false;
  return tags.delete(tag.toLowerCase().trim());
}

export function getTagsForPort(port: number): string[] {
  return Array.from(tagStore.get(port) ?? []);
}

export function getPortsForTag(tag: string): number[] {
  const normalized = tag.toLowerCase().trim();
  const result: number[] = [];
  for (const [port, tags] of tagStore.entries()) {
    if (tags.has(normalized)) result.push(port);
  }
  return result.sort((a, b) => a - b);
}

export function hasTag(port: number, tag: string): boolean {
  return tagStore.get(port)?.has(tag.toLowerCase().trim()) ?? false;
}

export function clearTagsForPort(port: number): void {
  tagStore.delete(port);
}

export function clearAllTags(): void {
  tagStore.clear();
}

export function listAllTags(): PortTag[] {
  return Array.from(tagStore.entries())
    .filter(([, tags]) => tags.size > 0)
    .map(([port, tags]) => ({ port, tags: Array.from(tags).sort() }))
    .sort((a, b) => a.port - b.port);
}

export function getAllTagNames(): string[] {
  const all = new Set<string>();
  for (const tags of tagStore.values()) {
    for (const t of tags) all.add(t);
  }
  return Array.from(all).sort();
}
