import { LRU } from "./lru";

describe("LRU", () => {
  it("should perform read()/write()", () => {
    const lru = new LRU(2);
    expect(lru.limit).toEqual(2);

    lru.write("foo", "FOO");
    lru.write("bar", "BAR");
    expect(lru.read("foo")).toEqual("FOO");
    expect(lru.read("bar")).toEqual("BAR");
  });
  it("should perform clear()", () => {
    const lru = new LRU(2);
    lru.write("foo", "FOO");
    lru.write("bar", "BAR");
    expect(lru.size).toEqual(2);
    lru.clear();
    expect(lru.size).toEqual(0);
    expect(lru.read("foo")).toBe(undefined);
  });
  it("should remove lrc item when full(limit=-1)", () => {
    const lru = new LRU(-1);
    lru.write("foo", "FOO");
    lru.write("bar", "BAR");
    expect(lru.size).toEqual(0);
    expect(lru.read("foo")).toBe(undefined);
    expect(lru.read("bar")).toBe(undefined);
  });
  it("should remove lrc item when full(limit=0)", () => {
    const lru = new LRU(0);
    lru.write("foo", "FOO");
    lru.write("bar", "BAR");
    expect(lru.size).toEqual(0);
    expect(lru.read("foo")).toBe(undefined);
    expect(lru.read("bar")).toBe(undefined);
  });
  it("should remove lrc item when full(limit=1)", () => {
    const lru = new LRU(1);
    lru.write("foo", "FOO");
    lru.write("bar", "BAR");
    expect(lru.size).toEqual(1);
    expect(lru.read("foo")).toBe(undefined);
    expect(lru.read("bar")).toEqual("BAR");
  });
  it("should remove lrc item when full(limit=2)", () => {
    const lru = new LRU(2);
    expect(lru.size).toEqual(0);
    lru.write("foo", "FOO");
    expect(lru.size).toEqual(1);
    lru.write("bar", "BAR");
    expect(lru.size).toEqual(2);
    lru.write("coo", "COO");
    expect(lru.size).toEqual(2);
    expect(lru.read("foo")).toBe(undefined);
    expect(lru.read("bar")).toEqual("BAR");
    expect(lru.read("coo")).toEqual("COO");
  });
  it("should overwrite item the with same key", () => {
    const lru = new LRU(2);
    lru.write("foo", "FOO");
    expect(lru.size).toEqual(1);
    lru.write("foo", "BAR");
    expect(lru.size).toEqual(1);
    expect(lru.read("foo")).toEqual("BAR");
  });
});
