import { TokenKind } from "../parser";
import { Token } from "./token";
import type { ValueToken } from "./value-token";

export class RangeToken extends Token {
  constructor(
    public input: string,
    public begin: number,
    public end: number,
    public lhs: ValueToken,
    public rhs: ValueToken,
    public file?: string,
  ) {
    super(TokenKind.Range, input, begin, end, file);
  }
}
