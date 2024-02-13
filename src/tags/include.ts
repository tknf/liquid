import type { Template, ValueToken, TopLevelToken, Liquid, Emitter, TagToken, Context } from "..";
import { Tag, assert, evalToken, Hash } from "..";
import type { Scope } from "../context";
import { BlockMode } from "../context";
import { parseFilePath, renderFilePath } from "./render";

export default class extends Tag {
  private withVar?: ValueToken;
  private hash: Hash;
  constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid);
    const { tokenizer } = token;
    // @ts-ignore
    this["file"] = parseFilePath(tokenizer, this.liquid);
    // @ts-ignore
    this["currentFile"] = token.file;

    const begin = tokenizer.p;
    const withStr = tokenizer.readIdentifier();
    if (withStr.content === "with") {
      tokenizer.skipBlank();
      if (tokenizer.peek() !== ":") {
        this.withVar = tokenizer.readValue();
      } else tokenizer.p = begin;
    } else tokenizer.p = begin;

    this.hash = new Hash(tokenizer.remaining(), this.liquid.options.jekyllInclude);
  }
  *render(ctx: Context, emitter: Emitter): Generator<unknown, void, unknown> {
    const { liquid, hash, withVar } = this;
    const { renderer } = liquid;
    // @ts-ignore
    const filepath = (yield renderFilePath(this["file"], ctx, liquid)) as string;
    assert(filepath, () => `illegal file path "${filepath}"`);

    const saved = ctx.saveRegister("blocks", "blockMode");
    ctx.setRegister("blocks", {});
    ctx.setRegister("blockMode", BlockMode.OUTPUT);
    const scope = (yield hash.render(ctx)) as Scope;
    if (withVar) scope[filepath as keyof typeof scope] = yield evalToken(withVar, ctx);
    // @ts-ignore
    const templates = (yield liquid._parsePartialFile(filepath, ctx.sync, this["currentFile"])) as Template[];
    ctx.push(ctx.opts.jekyllInclude ? { include: scope } : scope);
    yield renderer.renderTemplates(templates, ctx, emitter);
    ctx.pop();
    ctx.restoreRegister(saved);
  }
}
