import type { Liquid, TopLevelToken, Emitter, TagToken, Context } from "..";
import { Tag } from "..";
import { isNumber, stringify } from "../util/underscore";

export default class extends Tag {
  private variable: string;
  constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid);
    this.variable = this.tokenizer.readIdentifier().content;
  }
  render(context: Context, emitter: Emitter) {
    const scope = context.environments;
    if (!isNumber(scope[this.variable as keyof typeof scope])) {
      scope[this.variable as keyof typeof scope] = 0;
    }
    emitter.write(stringify(--scope[this.variable as keyof typeof scope]));
  }
}
