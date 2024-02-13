import { TokenKind } from "../parser";
import { Token } from "./token";
import type { LiteralToken } from "./literal-token";
import type { ValueToken } from "./value-token";
import type { IdentifierToken } from "./identifier-token";
import type { NumberToken } from "./number-token";
import type { RangeToken } from "./range-token";
import type { QuotedToken } from "./quoted-token";

export class PropertyAccessToken extends Token {
  constructor(
    public variable: QuotedToken | RangeToken | LiteralToken | NumberToken | undefined,
    public props: (ValueToken | IdentifierToken)[],
    input: string,
    begin: number,
    end: number,
    file?: string,
  ) {
    super(TokenKind.PropertyAccess, input, begin, end, file);
  }
}
