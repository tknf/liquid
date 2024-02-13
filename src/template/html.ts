import type { Template } from "../template";
import { TemplateImpl } from "../template";
import type { HTMLToken } from "../tokens";
import type { Context } from "../context";
import type { Emitter } from "../emitters";

export class HTML extends TemplateImpl<HTMLToken> implements Template {
  private str: string;
  public constructor(token: HTMLToken) {
    super(token);
    this.str = token.getContent();
  }
  public *render(ctx: Context, emitter: Emitter): IterableIterator<void> {
    emitter.write(this.str);
  }
}
