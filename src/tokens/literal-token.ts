import { TokenKind } from "../parser";
import type { LiteralValue } from "../util/literal";
import { literalValues } from "../util/literal";
import { Token } from "./token";

export class LiteralToken extends Token {
  public content: LiteralValue;
  public literal: string;
  public constructor(
    public input: string,
    public begin: number,
    public end: number,
    public file?: string,
  ) {
    super(TokenKind.Literal, input, begin, end, file);
    this.literal = this.getText();
    this.content = literalValues[this.literal as keyof typeof literalValues];
  }
}
