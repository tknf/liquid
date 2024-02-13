import type { Context, Emitter } from "..";
import { Tag } from "..";

export default class extends Tag {
  render(ctx: Context, emitter: Emitter) {
    // @ts-ignore
    emitter["break"] = true;
  }
}
