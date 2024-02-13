import type { NormalizedFullOptions } from "../liquid-options";
import { TokenKind } from "../parser";
import { DelimitedToken } from "./delimited-token";

export class OutputToken extends DelimitedToken {
  public constructor(input: string, begin: number, end: number, options: NormalizedFullOptions, file?: string) {
    const { trimOutputLeft, trimOutputRight, outputDelimiterLeft, outputDelimiterRight } = options;
    const valueRange: [number, number] = [begin + outputDelimiterLeft.length, end - outputDelimiterRight.length];
    super(TokenKind.Output, valueRange, input, begin, end, trimOutputLeft, trimOutputRight, file);
  }
}
