import { TokenKind } from "../parser";
import { Token } from "./token";
import type { ValueToken } from "./value-token";
import type { IdentifierToken } from "./identifier-token";

export class HashToken extends Token {
  constructor(
    public input: string,
    public begin: number,
    public end: number,
    public name: IdentifierToken,
    public value?: ValueToken,
    public file?: string,
  ) {
    super(TokenKind.Hash, input, begin, end, file);
  }
}
