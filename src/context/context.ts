import { __assign } from "tslib";
import { Drop } from "../drop/drop";
import type { NormalizedFullOptions, RenderOptions } from "../liquid-options";
import { defaultOptions } from "../liquid-options";
import { toValueSync } from "../util/async";
import { isArray, isFunction, isNil, isString, isUndefined, toLiquid } from "../util/underscore";
import { InternalUndefinedVariableError } from "../util/error";
import type { Scope } from "./scope";

type PropertyKey = string | number;

export class Context {
  /**
   * insert a Context-level empty scope,
   * for tags like `{% capture %}` `{% assign %}` to operate
   */
  private scopes: Scope[] = [{}];
  private registers = {};
  /**
   * user passed in scope
   * `{% increment %}`, `{% decrement %}` changes this scope,
   * whereas `{% capture %}`, `{% assign %}` only hide this scope
   */
  public environments: Scope;
  /**
   * global scope used as fallback for missing variables
   */
  public globals: Scope;
  public sync: boolean;
  /**
   * The normalized liquid options object
   */
  public opts: NormalizedFullOptions;
  /**
   * Throw when accessing undefined variable?
   */
  public strictVariables: boolean;
  public ownPropertyOnly: boolean;
  public constructor(
    env: object = {},
    opts: NormalizedFullOptions = defaultOptions,
    renderOptions: RenderOptions = {},
  ) {
    this.sync = !!renderOptions.sync;
    this.opts = opts;
    this.globals = renderOptions.globals ?? opts.globals;
    this.environments = env;
    this.strictVariables = renderOptions.strictVariables ?? this.opts.strictVariables;
    this.ownPropertyOnly = renderOptions.ownPropertyOnly ?? opts.ownPropertyOnly;
  }
  public getRegister(key: string) {
    // @ts-ignore
    return (this.registers[key] = this.registers[key] || {});
  }
  public setRegister(key: string, value: any) {
    // @ts-ignore
    return (this.registers[key] = value);
  }
  public saveRegister(...keys: string[]): [string, any][] {
    return keys.map((key) => [key, this.getRegister(key)]);
  }
  public restoreRegister(keyValues: [string, any][]) {
    return keyValues.forEach(([key, value]) => this.setRegister(key, value));
  }
  public getAll() {
    return [this.globals, this.environments, ...this.scopes].reduce((ctx, val) => __assign(ctx, val), {});
  }
  /**
   * @deprecated use `_get()` or `getSync()` instead
   */
  public get(paths: PropertyKey[]): unknown {
    return this.getSync(paths);
  }
  public getSync(paths: PropertyKey[]): unknown {
    return toValueSync(this._get(paths));
  }
  public *_get(paths: PropertyKey[]): IterableIterator<unknown> {
    const scope = this.findScope(paths[0]);
    return yield this._getFromScope(scope, paths);
  }
  /**
   * @deprecated use `_get()` instead
   */
  public getFromScope(scope: unknown, paths: PropertyKey[] | string): IterableIterator<unknown> {
    return toValueSync(this._getFromScope(scope, paths));
  }
  public *_getFromScope(
    scope: unknown,
    paths: PropertyKey[] | string,
    strictVariables = this.strictVariables,
  ): IterableIterator<unknown> {
    if (isString(paths)) paths = paths.split(".");
    for (let i = 0; i < paths.length; i++) {
      scope = yield readProperty(scope as object, paths[i], this.ownPropertyOnly);
      if (strictVariables && isUndefined(scope)) {
        throw new InternalUndefinedVariableError((paths as string[]).slice(0, i + 1).join!("."));
      }
    }
    return scope;
  }
  public push(ctx: object) {
    return this.scopes.push(ctx);
  }
  public pop() {
    return this.scopes.pop();
  }
  public bottom() {
    return this.scopes[0];
  }
  private findScope(key: string | number) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const candidate = this.scopes[i];
      if (key in candidate) return candidate;
    }
    if (key in this.environments) return this.environments;
    return this.globals;
  }
}

export function readProperty(obj: Scope, key: PropertyKey, ownPropertyOnly: boolean) {
  obj = toLiquid(obj);
  if (isNil(obj)) return obj;
  // @ts-ignore
  if (isArray(obj) && key < 0) return obj[obj.length + +key];
  const value = readJSProperty(obj, key, ownPropertyOnly);
  if (value === undefined && obj instanceof Drop) return obj.liquidMethodMissing(key);
  if (isFunction(value)) return value.call(obj);
  if (key === "size") return readSize(obj);
  else if (key === "first") return readFirst(obj);
  else if (key === "last") return readLast(obj);
  return value;
}
export function readJSProperty(obj: Scope, key: PropertyKey, ownPropertyOnly: boolean) {
  if (ownPropertyOnly && !Object.hasOwnProperty.call(obj, key) && !(obj instanceof Drop)) return undefined;
  return obj[key as keyof typeof obj];
}

function readFirst(obj: Scope) {
  if (isArray(obj)) return obj[0];
  return obj["first" as keyof typeof obj];
}

function readLast(obj: Scope) {
  if (isArray(obj)) return obj[obj.length - 1];
  return obj["last" as keyof typeof obj];
}

function readSize(obj: Scope) {
  if (obj.hasOwnProperty("size") || obj["size" as keyof typeof obj] !== undefined)
    return obj["size" as keyof typeof obj];
  if (isArray(obj) || isString(obj)) return obj.length;
  if (typeof obj === "object") return Object.keys(obj).length;
}
