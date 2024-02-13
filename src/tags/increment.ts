import { isNumber, stringify } from "../util/underscore";
import type { Liquid, TopLevelToken, Emitter, TagToken, Context } from "..";
import { Tag } from "..";

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
    const val = scope[this.variable as keyof typeof scope];
    scope[this.variable as keyof typeof scope]++;
    emitter.write(stringify(val));
  }
}
