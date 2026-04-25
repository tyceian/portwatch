export interface BookmarkRule {
  port: number;
  label: string;
  color?: string;
  createdAt: number;
}

const bookmarks = new Map<number, BookmarkRule>();

export function addBookmark(
  port: number,
  label: string,
  color?: string
): BookmarkRule {
  const rule: BookmarkRule = {
    port,
    label,
    color,
    createdAt: Date.now(),
  };
  bookmarks.set(port, rule);
  return rule;
}

export function removeBookmark(port: number): boolean {
  return bookmarks.delete(port);
}

export function getBookmark(port: number): BookmarkRule | undefined {
  return bookmarks.get(port);
}

export function isBookmarked(port: number): boolean {
  return bookmarks.has(port);
}

export function listBookmarks(): BookmarkRule[] {
  return Array.from(bookmarks.values()).sort((a, b) => a.port - b.port);
}

export function clearBookmarks(): void {
  bookmarks.clear();
}

export function updateBookmarkLabel(port: number, label: string): boolean {
  const rule = bookmarks.get(port);
  if (!rule) return false;
  rule.label = label;
  return true;
}

export function getBookmarkCount(): number {
  return bookmarks.size;
}
