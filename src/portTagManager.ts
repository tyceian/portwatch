import {
  addTag,
  removeTag,
  clearTagsForPort,
  getTagsForPort,
  getPortsForTag,
  listAllTags,
  clearAllTags,
} from "./portTag";

export interface TagCommandResult {
  ok: boolean;
  message: string;
}

export function handleAddTag(port: number, tag: string): TagCommandResult {
  if (!tag || tag.trim() === "") {
    return { ok: false, message: "Tag must not be empty" };
  }
  addTag(port, tag);
  return { ok: true, message: `Tagged port ${port} with '${tag}'` };
}

export function handleRemoveTag(port: number, tag: string): TagCommandResult {
  const removed = removeTag(port, tag);
  if (!removed) {
    return { ok: false, message: `Tag '${tag}' not found on port ${port}` };
  }
  return { ok: true, message: `Removed tag '${tag}' from port ${port}` };
}

export function handleClearPort(port: number): TagCommandResult {
  clearTagsForPort(port);
  return { ok: true, message: `Cleared all tags from port ${port}` };
}

export function handleListByTag(tag: string): number[] {
  return getPortsForTag(tag);
}

export function handleListByPort(port: number): string[] {
  return getTagsForPort(port);
}

export function handleListAll() {
  return listAllTags();
}

export function handleClearAll(): TagCommandResult {
  clearAllTags();
  return { ok: true, message: "Cleared all port tags" };
}
