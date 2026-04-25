import {
  addBookmark,
  removeBookmark,
  getBookmark,
  isBookmarked,
  listBookmarks,
  clearBookmarks,
  updateBookmarkLabel,
  getBookmarkCount,
} from './portBookmark';

beforeEach(() => {
  clearBookmarks();
});

test('addBookmark creates and stores a rule', () => {
  const rule = addBookmark(3000, 'dev-server', 'green');
  expect(rule.port).toBe(3000);
  expect(rule.label).toBe('dev-server');
  expect(rule.color).toBe('green');
  expect(rule.createdAt).toBeLessThanOrEqual(Date.now());
});

test('isBookmarked returns true after adding', () => {
  addBookmark(8080, 'proxy');
  expect(isBookmarked(8080)).toBe(true);
  expect(isBookmarked(9999)).toBe(false);
});

test('getBookmark returns correct rule', () => {
  addBookmark(5432, 'postgres');
  const rule = getBookmark(5432);
  expect(rule).toBeDefined();
  expect(rule?.label).toBe('postgres');
});

test('removeBookmark deletes the entry', () => {
  addBookmark(4000, 'api');
  expect(removeBookmark(4000)).toBe(true);
  expect(isBookmarked(4000)).toBe(false);
});

test('removeBookmark returns false for unknown port', () => {
  expect(removeBookmark(1234)).toBe(false);
});

test('listBookmarks returns sorted by port', () => {
  addBookmark(9000, 'c');
  addBookmark(3000, 'a');
  addBookmark(5000, 'b');
  const list = listBookmarks();
  expect(list.map((r) => r.port)).toEqual([3000, 5000, 9000]);
});

test('updateBookmarkLabel changes label', () => {
  addBookmark(8000, 'old-label');
  expect(updateBookmarkLabel(8000, 'new-label')).toBe(true);
  expect(getBookmark(8000)?.label).toBe('new-label');
});

test('updateBookmarkLabel returns false for missing port', () => {
  expect(updateBookmarkLabel(7777, 'x')).toBe(false);
});

test('getBookmarkCount tracks size', () => {
  expect(getBookmarkCount()).toBe(0);
  addBookmark(1111, 'one');
  addBookmark(2222, 'two');
  expect(getBookmarkCount()).toBe(2);
  clearBookmarks();
  expect(getBookmarkCount()).toBe(0);
});
