import { PortTag, listAllTags, getTagsForPort } from "./portTag";
import { colorize } from "./formatter";

const TAG_COLORS: Record<string, string> = {
  frontend: "cyan",
  backend: "blue",
  db: "yellow",
  api: "green",
  dev: "magenta",
};

export function formatTag(tag: string): string {
  const color = TAG_COLORS[tag] ?? "white";
  return colorize(`[${tag}]`, color);
}

export function formatTagsInline(port: number): string {
  const tags = getTagsForPort(port);
  if (tags.length === 0) return "";
  return tags.map(formatTag).join(" ");
}

export function renderTagRow(entry: PortTag): string {
  const tagStr = entry.tags.map(formatTag).join(" ");
  return `  :${entry.port}\t${tagStr}`;
}

export function renderTagTable(entries?: PortTag[]): string {
  const rows = entries ?? listAllTags();
  if (rows.length === 0) return colorize("No tagged ports.", "gray");
  const header = colorize("PORT\tTAGS", "bold");
  const lines = rows.map(renderTagRow);
  return [header, ...lines].join("\n");
}

export function renderTagSummary(entries?: PortTag[]): string {
  const rows = entries ?? listAllTags();
  const total = rows.reduce((sum, e) => sum + e.tags.length, 0);
  return colorize(
    `${rows.length} tagged port(s), ${total} total tag(s)`,
    "cyan"
  );
}
