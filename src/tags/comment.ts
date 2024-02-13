import type { Liquid, TopLevelToken, TagToken } from "..";
import { Tag } from "..";
import { isTagToken } from "../util/type-guards";

export default class extends Tag {
  constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(tagToken, remainTokens, liquid);
    while (remainTokens.length) {
      const token = remainTokens.shift()!;
      if (isTagToken(token) && token.name === "endcomment") return;
    }
    throw new Error(`tag ${tagToken.getText()} not closed`);
  }
  render() {}
}
