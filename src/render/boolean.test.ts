import type { Context } from "../context";
import { isTruthy, isFalsy } from "./boolean";

describe("boolean Shopify", function () {
  describe(".isTruthy()", function () {
    const ctx = {
      opts: {
        jsTruthy: false,
      },
    } as unknown as Context;
    //
    // Spec: https://shopify.github.io/liquid/basics/truthy-and-falsy/
    it("true is truthy", function () {
      expect(isTruthy(true, ctx)).toBeTruthy();
    });
    it("false is falsy", function () {
      expect(isTruthy(false, ctx)).toBeFalsy();
    });
    it("null is falsy", function () {
      expect(isTruthy(null, ctx)).toBeFalsy();
    });
    it('"foo" is truthy', function () {
      expect(isTruthy("foo", ctx)).toBeTruthy();
    });
    it('"" is truthy', function () {
      expect(isTruthy("", ctx)).toBeTruthy();
    });
    it("0 is truthy", function () {
      expect(isTruthy(0, ctx)).toBeTruthy();
    });
    it("1 is truthy", function () {
      expect(isTruthy(1, ctx)).toBeTruthy();
    });
    it("1.1 is truthy", function () {
      expect(isTruthy(1.1, ctx)).toBeTruthy();
    });
    it("[1] is truthy", function () {
      expect(isTruthy([1], ctx)).toBeTruthy();
    });
    it("[] is truthy", function () {
      expect(isTruthy([], ctx)).toBeTruthy();
    });
  });
});

describe("boolean jsTruthy", function () {
  const ctx = {
    opts: {
      jsTruthy: true,
    },
  } as unknown as Context;

  describe(".isFalsy()", function () {
    it("null is always falsy", function () {
      expect(isFalsy(null, ctx)).toBeTruthy();
    });
  });

  describe(".isTruthy()", function () {
    it("true is truthy", function () {
      expect(isTruthy(true, ctx)).toBeTruthy();
    });
    it("false is falsy", function () {
      expect(isTruthy(false, ctx)).toBeFalsy();
    });
    it("null is always falsy", function () {
      expect(isTruthy(null, ctx)).toBeFalsy();
    });
    it("null is always falsy", function () {
      expect(isTruthy(null, ctx)).toBeFalsy();
    });
    it('"foo" is truthy', function () {
      expect(isTruthy("foo", ctx)).toBeTruthy();
    });
    it('"" is falsy', function () {
      expect(isTruthy("", ctx)).toBeFalsy();
    });
    it("0 is falsy", function () {
      expect(isTruthy(0, ctx)).toBeFalsy();
    });
    it("1 is truthy", function () {
      expect(isTruthy(1, ctx)).toBeTruthy();
    });
    it("1.1 is truthy", function () {
      expect(isTruthy(1.1, ctx)).toBeTruthy();
    });
    it("[1] is truthy", function () {
      expect(isTruthy([1], ctx)).toBeTruthy();
    });
    it("[] is truthy", function () {
      expect(isTruthy([], ctx)).toBeTruthy();
    });
  });
});
