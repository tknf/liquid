import type { Liquid, TopLevelToken, TagToken, Context } from "..";
import { Value, Tag } from "..";
export default class extends Tag {
  private key: string;
  private value: Value;

  constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid);
    this.key = this.tokenizer.readIdentifier().content;
    this.tokenizer.assert(this.key, "expected variable name");

    this.tokenizer.skipBlank();
    this.tokenizer.assert(this.tokenizer.peek() === "=", 'expected "="');

    this.tokenizer.advance();
    this.value = new Value(this.tokenizer.readFilteredValue(), this.liquid);
  }
  *render(ctx: Context): Generator<unknown, void, unknown> {
    // @ts-ignore
    ctx.bottom()[this.key] = yield this.value.value(ctx, this.liquid.options.lenientIf);
  }
}
