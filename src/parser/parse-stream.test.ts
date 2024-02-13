import type { Token } from "../tokens";
import { ParseStream } from "./parse-stream";

describe("parseStream", () => {
  it('should trigger "token" event', () => {
    const token = { kind: 4 } as Token;
    const ps = new ParseStream([token], (token) => ({ token }) as any);
    let got;
    ps.on("token", (token) => {
      got = token;
    }).start();
    expect(got).toEqual(token);
  });
});
