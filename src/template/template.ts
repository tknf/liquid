import type { Context } from "../context/context";
import type { Token } from "../tokens/token";
import type { Emitter } from "../emitters/emitter";

export interface Template {
  token: Token;
  render(ctx: Context, emitter: Emitter): any;
}
