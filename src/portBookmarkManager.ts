import {
  addBookmark,
  removeBookmark,
  getBookmark,
  listBookmarks,
  clearBookmarks,
  updateBookmarkLabel,
} from './portBookmark';
import {
  renderBookmarkTable,
  renderBookmarkSummary,
  formatBookmarkInline,
} from './portBookmarkFormatter';

export function handleAddBookmark(
  port: number,
  label: string,
  color?: string
): void {
  const rule = addBookmark(port, label, color);
  console.log(`Bookmarked port ${rule.port} as "${rule.label}"`);
}

export function handleRemoveBookmark(port: number): void {
  const removed = removeBookmark(port);
  if (removed) {
    console.log(`Removed bookmark for port ${port}`);
  } else {
    console.log(`No bookmark found for port ${port}`);
  }
}

export function handleGetBookmark(port: number): void {
  const rule = getBookmark(port);
  if (!rule) {
    console.log(`No bookmark for port ${port}`);
    return;
  }
  console.log(formatBookmarkInline(rule));
}

export function handleListBookmarks(summary = false): void {
  const rules = listBookmarks();
  if (summary) {
    console.log(renderBookmarkSummary(rules));
  } else {
    console.log(renderBookmarkTable(rules));
  }
}

export function handleUpdateBookmark(port: number, label: string): void {
  const updated = updateBookmarkLabel(port, label);
  if (updated) {
    console.log(`Updated bookmark for port ${port} to "${label}"`);
  } else {
    console.log(`No bookmark found for port ${port}`);
  }
}

export function handleClearBookmarks(): void {
  clearBookmarks();
  console.log('All bookmarks cleared.');
}
