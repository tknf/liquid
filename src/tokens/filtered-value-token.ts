import { TokenKind } from "../parser";
import type { Expression } from "../render";
import { Token } from "./token";
import type { FilterToken } from "./filter-token";

/**
 * value expression with optional filters
 * e.g.
 * {% assign foo="bar" | append: "coo" %}
 */
export class FilteredValueToken extends Token {
  constructor(
    public initial: Expression,
    public filters: FilterToken[],
    public input: string,
    public begin: number,
    public end: number,
    public file?: string,
  ) {
    super(TokenKind.FilteredValue, input, begin, end, file);
  }
}
