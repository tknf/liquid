import type { Template } from "../template";
import { TemplateImpl } from "../template";
import type { Context } from "../context/context";
import type { Emitter } from "../emitters/emitter";
import type { OutputToken } from "../tokens/output-token";
import { Tokenizer } from "../parser";
import type { Liquid } from "../liquid";
import { Value } from "./value";
import { Filter } from "./filter";

export class Output extends TemplateImpl<OutputToken> implements Template {
  value: Value;
  public constructor(token: OutputToken, liquid: Liquid) {
    super(token);
    const tokenizer = new Tokenizer(token.input, liquid.options.operators, token.file, token.contentRange);
    this.value = new Value(tokenizer.readFilteredValue(), liquid);
    const filters = this.value.filters;
    const outputEscape = liquid.options.outputEscape;
    if (!filters[filters.length - 1]?.raw && outputEscape) {
      filters.push(new Filter(toString.call(outputEscape), outputEscape, [], liquid));
    }
  }
  public *render(ctx: Context, emitter: Emitter): IterableIterator<unknown> {
    const val = yield this.value.value(ctx, false);
    emitter.write(val);
  }
}
