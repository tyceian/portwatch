import {
  setComment,
  getComment,
  removeComment,
  hasComment,
  listComments,
  clearComments,
  updateAuthor,
  getCommentCount,
} from './portComment';

beforeEach(() => clearComments());

describe('setComment', () => {
  it('creates a comment for a port', () => {
    const c = setComment(3000, 'main dev server', 'alice');
    expect(c.port).toBe(3000);
    expect(c.text).toBe('main dev server');
    expect(c.author).toBe('alice');
    expect(c.createdAt).toBeLessThanOrEqual(Date.now());
  });

  it('preserves createdAt on update', () => {
    const first = setComment(3000, 'original');
    const second = setComment(3000, 'updated');
    expect(second.createdAt).toBe(first.createdAt);
    expect(second.text).toBe('updated');
  });

  it('inherits existing author when none provided', () => {
    setComment(3000, 'hello', 'bob');
    const updated = setComment(3000, 'new text');
    expect(updated.author).toBe('bob');
  });
});

describe('getComment', () => {
  it('returns undefined for unknown port', () => {
    expect(getComment(9999)).toBeUndefined();
  });

  it('returns the stored comment', () => {
    setComment(4000, 'api gateway');
    expect(getComment(4000)?.text).toBe('api gateway');
  });
});

describe('removeComment', () => {
  it('removes an existing comment', () => {
    setComment(5000, 'temp');
    expect(removeComment(5000)).toBe(true);
    expect(hasComment(5000)).toBe(false);
  });

  it('returns false for unknown port', () => {
    expect(removeComment(9999)).toBe(false);
  });
});

describe('listComments', () => {
  it('returns comments sorted by port', () => {
    setComment(8080, 'proxy');
    setComment(3000, 'frontend');
    const list = listComments();
    expect(list[0].port).toBe(3000);
    expect(list[1].port).toBe(8080);
  });
});

describe('updateAuthor', () => {
  it('updates the author of an existing comment', () => {
    setComment(3000, 'hello');
    expect(updateAuthor(3000, 'carol')).toBe(true);
    expect(getComment(3000)?.author).toBe('carol');
  });

  it('returns false when port not found', () => {
    expect(updateAuthor(9999, 'carol')).toBe(false);
  });
});

describe('getCommentCount', () => {
  it('tracks the number of comments', () => {
    expect(getCommentCount()).toBe(0);
    setComment(1000, 'a');
    setComment(2000, 'b');
    expect(getCommentCount()).toBe(2);
  });
});
