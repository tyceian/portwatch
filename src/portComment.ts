// Port comments — multi-line annotations attached to a port

export interface PortComment {
  port: number;
  text: string;
  author?: string;
  createdAt: number;
  updatedAt: number;
}

const store = new Map<number, PortComment>();

export function setComment(
  port: number,
  text: string,
  author?: string
): PortComment {
  const now = Date.now();
  const existing = store.get(port);
  const comment: PortComment = {
    port,
    text,
    author: author ?? existing?.author,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  store.set(port, comment);
  return comment;
}

export function getComment(port: number): PortComment | undefined {
  return store.get(port);
}

export function removeComment(port: number): boolean {
  return store.delete(port);
}

export function hasComment(port: number): boolean {
  return store.has(port);
}

export function listComments(): PortComment[] {
  return Array.from(store.values()).sort((a, b) => a.port - b.port);
}

export function clearComments(): void {
  store.clear();
}

export function updateAuthor(port: number, author: string): boolean {
  const comment = store.get(port);
  if (!comment) return false;
  comment.author = author;
  comment.updatedAt = Date.now();
  return true;
}

export function getCommentCount(): number {
  return store.size;
}
