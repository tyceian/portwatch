import {
  addTag,
  removeTag,
  getTagsForPort,
  getPortsForTag,
  hasTag,
  clearTagsForPort,
  clearAllTags,
  listAllTags,
  getAllTagNames,
} from "./portTag";

beforeEach(() => clearAllTags());

describe("addTag / getTagsForPort", () => {
  it("adds a tag to a port", () => {
    addTag(3000, "frontend");
    expect(getTagsForPort(3000)).toContain("frontend");
  });

  it("normalizes tag to lowercase", () => {
    addTag(3000, "FRONTEND");
    expect(getTagsForPort(3000)).toContain("frontend");
  });

  it("deduplicates tags", () => {
    addTag(3000, "api");
    addTag(3000, "api");
    expect(getTagsForPort(3000).filter((t) => t === "api")).toHaveLength(1);
  });
});

describe("removeTag", () => {
  it("removes an existing tag", () => {
    addTag(4000, "db");
    expect(removeTag(4000, "db")).toBe(true);
    expect(getTagsForPort(4000)).not.toContain("db");
  });

  it("returns false when tag not found", () => {
    expect(removeTag(9999, "nope")).toBe(false);
  });
});

describe("getPortsForTag", () => {
  it("returns ports with a given tag", () => {
    addTag(3000, "api");
    addTag(4000, "api");
    expect(getPortsForTag("api")).toEqual([3000, 4000]);
  });
});

describe("hasTag", () => {
  it("returns true when tag present", () => {
    addTag(5000, "dev");
    expect(hasTag(5000, "dev")).toBe(true);
  });

  it("returns false when tag absent", () => {
    expect(hasTag(5000, "dev")).toBe(false);
  });
});

describe("listAllTags", () => {
  it("returns all tagged ports", () => {
    addTag(3000, "frontend");
    addTag(5432, "db");
    const list = listAllTags();
    expect(list.map((e) => e.port)).toContain(3000);
    expect(list.map((e) => e.port)).toContain(5432);
  });
});

describe("getAllTagNames", () => {
  it("returns unique sorted tag names", () => {
    addTag(3000, "api");
    addTag(4000, "api");
    addTag(5000, "db");
    expect(getAllTagNames()).toEqual(["api", "db"]);
  });
});

describe("clearTagsForPort", () => {
  it("removes all tags for a port", () => {
    addTag(3000, "api");
    clearTagsForPort(3000);
    expect(getTagsForPort(3000)).toHaveLength(0);
  });
});
