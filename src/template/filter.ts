import { evalToken } from "../render";
import type { Context } from "../context";
import { identify, isFunction } from "../util/underscore";
import type { FilterArg } from "../parser/filter-arg";
import { isKeyValuePair } from "../parser/filter-arg";
import type { Liquid } from "../liquid";
import type { FilterHandler, FilterImplOptions } from "./filter-impl-options";

export class Filter {
  public name: string;
  public args: FilterArg[];
  public readonly raw: boolean;
  private handler: FilterHandler;
  private liquid: Liquid;

  public constructor(name: string, options: FilterImplOptions | undefined, args: FilterArg[], liquid: Liquid) {
    this.name = name;
    this.handler = isFunction(options) ? options : isFunction(options?.handler) ? options!.handler : identify;
    this.raw = !isFunction(options) && !!options?.raw;
    this.args = args;
    this.liquid = liquid;
  }
  public *render(value: any, context: Context): IterableIterator<unknown> {
    const argv: any[] = [];
    for (const arg of this.args as FilterArg[]) {
      if (isKeyValuePair(arg)) argv.push([arg[0], yield evalToken(arg[1], context)]);
      else argv.push(yield evalToken(arg, context));
    }
    return yield this.handler.apply({ context, liquid: this.liquid }, [value, ...argv]);
  }
}
