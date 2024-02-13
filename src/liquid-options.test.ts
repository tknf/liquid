import { defaultOptions, normalize } from "./liquid-options";

describe("liquid-options", () => {
  describe(".normalize()", () => {
    it("should set cache to undefined if specified to falsy", () => {
      const options = normalize({ cache: false, fs: defaultOptions.fs });
      expect(options.cache).toBeUndefined();
    });
  });
});
