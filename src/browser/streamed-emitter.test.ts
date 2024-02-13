import { StreamedEmitter } from "./streamed-emitter";

describe("browser/streamed-emitter-browser", () => {
  it("should throw when try to constructing", () => {
    expect(() => new StreamedEmitter()).toThrow(/streaming not supported/);
  });
});
