import { Liquid } from "../../src/liquid";
import { LiquidOptions } from "../../src/liquid-options";

export const liquid = new Liquid();

export function render(src: string, ctx?: object) {
  return liquid.parseAndRender(src, ctx);
}

export async function test(src: string, ctx: object | string, expected?: string | RegExp, opts?: LiquidOptions) {
  if (expected === undefined) {
    expected = ctx as string;
    ctx = {};
  }
  const engine = opts ? new Liquid(opts) : liquid;
  const result = await engine.parseAndRender(src, ctx as object);
  if (expected instanceof RegExp) return expect(result).toMatch(expected);
  return expect(result).toBe(expected);
}
