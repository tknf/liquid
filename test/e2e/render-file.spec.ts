import { Liquid } from "../../src/liquid";
import { resolve } from "path";
import { nodeFs } from "../../src/node/fs";

describe("#renderFile()", function () {
  const root = resolve(__dirname, "../stub/root");
  const views = resolve(__dirname, "../stub/views");
  let engine: Liquid;
  beforeEach(function () {
    engine = new Liquid({
      root,
      extname: ".html",
      fs: nodeFs,
    });
  });
  it("should render file", async function () {
    const html = await engine.renderFile(resolve(root, "foo.html"), {});
    return expect(html).toBe("foo");
  });
  it("should find files without extname", async function () {
    var engine = new Liquid({ root, fs: nodeFs });
    const html = await engine.renderFile(resolve(root, "bar"), {});
    return expect(html).toBe("bar");
  });
  it("should accept relative path", async function () {
    const html = await engine.renderFile("foo.html");
    return expect(html).toBe("foo");
  });
  it("should traverse root array", async function () {
    engine = new Liquid({
      root: ["/boo", root],
      extname: ".html",
      fs: nodeFs,
    });
    const html = await engine.renderFile("foo.html");
    return expect(html).toBe("foo");
  });
  it("should default root to cwd", async function () {
    engine = new Liquid({
      fs: nodeFs,
    });
    const html = await engine.renderFile("package.json");
    return expect(html).toContain('"name": "@tknf-labs/liquid"');
  });
  it("should render file with context", async function () {
    const html = await engine.renderFile(resolve(views, "name.html"), { name: "harttle" });
    return expect(html).toBe("My name is harttle.");
  });
  it("should use default extname", async function () {
    const html = await engine.renderFile(resolve(root, "foo"));
    return expect(html).toBe("foo");
  });
  it("should throw with lookup list when file not exist", function () {
    engine = new Liquid({
      root: ["/boo", "/root/"],
      extname: ".html",
      fs: nodeFs,
    });
    return expect(engine.renderFile("/not/exist.html")).rejects.toThrow(
      /Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/,
    );
  });
});
