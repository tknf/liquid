import { resolve } from "node:path";
import { drainStream } from "../stub/stream";
import { nodeFs } from "../../src/node/fs";

describe(".renderToNodeStream()", function () {
  it("should render to stream in Node.js", () => {
    new Promise<void>((done, reject) => {
      const cjs = require("../../dist/liquid.node.cjs");
      const engine = new cjs.Liquid({
        fs: nodeFs,
      });
      const tpl = engine.parseFileSync(resolve(__dirname, "../stub/root/foo.html"));
      const stream = engine.renderToNodeStream(tpl);
      let html = "";
      stream.on("data", (data: string) => {
        html += data;
      });
      stream.on("end", () => {
        try {
          expect(html).toBe("foo");
          done();
        } catch (err) {
          reject(err);
        }
      });
    });
  });
  it("should throw in browser", async function () {
    const cjs = require("../../dist/liquid.browser.umd");
    const engine = new cjs.Liquid({
      fs: nodeFs,
    });
    const render = () => engine.renderToNodeStream("foo");
    return expect(render).toThrow("streaming not supported in browser");
  });
});

describe(".renderFileToNodeStream()", function () {
  it("should render to stream in Node.js", async () => {
    const cjs = require("../../dist/liquid.node.cjs");
    const engine = new cjs.Liquid({
      root: resolve(__dirname, "../stub/root/"),
      fs: nodeFs,
    });
    const stream = await engine.renderFileToNodeStream("foo.html");
    expect(drainStream(stream)).resolves.toBe("foo");
  });
});
