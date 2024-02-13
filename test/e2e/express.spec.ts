import request from "supertest";
import express from "express";
import { resolve } from "path";
import { Liquid } from "../../src/liquid";
import { nodeFs } from "../../src/node/fs";

describe("express()", function () {
  const root = resolve(__dirname, "../stub/root");
  const views = resolve(__dirname, "../stub/views");
  const partials = resolve(__dirname, "../stub/partials");
  let app: express.Application, engine: Liquid;

  beforeEach(function () {
    app = express();
    engine = new Liquid({
      root,
      extname: ".html",
      fs: nodeFs,
    });

    app.set("view engine", "html");
    app.engine("html", engine.express());

    app.get("/name", (req, res) =>
      res.render("name", {
        name: "harttle",
      }),
    );
    app.get("/include/:file", (req, res) =>
      res.render("include", {
        file: req.params.file,
      }),
    );
  });
  it("should respect express views(array)", function (done) {
    app.set("views", [views]);
    request(app).get("/name").expect("My name is harttle.").expect(200, done);
  });
  it("should respect express views(string)", function (done) {
    app.set("views", views);
    request(app).get("/include/bar").expect("bar").expect(200, done);
  });
  it("should pass error when file not found", function () {
    new Promise<void>((done, reject) => {
      const view = {
        root: [],
      };
      const file = "/not-exist.html";
      const ctx = {};
      engine.express().call(view, file, ctx, function (err: any) {
        try {
          expect(err.code).toBe("ENOENT");
          expect(err.message).toMatch(/Failed to lookup/);
          done();
        } catch (e) {
          reject(e);
        }
      });
    });
  });
  it("should respect root option when lookup", function (done) {
    app.set("views", [views]);
    request(app).get("/include/foo").expect("foo").expect(200, done);
  });
  it("should respect express views (Array) when lookup", function (done) {
    app.set("views", [views, partials]);
    request(app).get("/include/bar").expect("bar").expect(200, done);
  });
});
