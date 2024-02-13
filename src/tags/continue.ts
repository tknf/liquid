import type { Emitter, Context } from "..";
import { Tag } from "..";

export default class extends Tag {
  render(ctx: Context, emitter: Emitter) {
    // @ts-ignore
    emitter["continue"] = true;
  }
}
