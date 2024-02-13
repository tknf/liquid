import { isFunction } from "../util/underscore";
import type { TagToken, TopLevelToken } from "../tokens";
import type { Emitter } from "../emitters";
import type { Context } from "../context";
import type { Liquid } from "../liquid";
import { Tag } from "./tag";
import type { TagClass, TagRenderReturn } from "./tag";
import { Hash } from "./hash";

export interface TagImplOptions {
  [key: string]: any;
  parse?: (this: Tag & TagImplOptions, token: TagToken, remainingTokens: TopLevelToken[]) => void;
  render: (this: Tag & TagImplOptions, ctx: Context, emitter: Emitter, hash: Record<string, any>) => TagRenderReturn;
}

export function createTagClass(options: TagImplOptions): TagClass {
  return class extends Tag {
    constructor(token: TagToken, tokens: TopLevelToken[], liquid: Liquid) {
      super(token, tokens, liquid);
      if (isFunction(options.parse)) {
        options.parse.call(this, token, tokens);
      }
    }
    *render(ctx: Context, emitter: Emitter): TagRenderReturn {
      const hash = (yield new Hash(this.token.args).render(ctx)) as Record<string, any>;
      return yield options.render.call(this, ctx, emitter, hash);
    }
  };
}
