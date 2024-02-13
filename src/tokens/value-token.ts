import type { RangeToken } from "./range-token";
import type { LiteralToken } from "./literal-token";
import type { NumberToken } from "./number-token";
import type { QuotedToken } from "./quoted-token";
import type { PropertyAccessToken } from "./property-access-token";

export type ValueToken = RangeToken | LiteralToken | QuotedToken | PropertyAccessToken | NumberToken;
