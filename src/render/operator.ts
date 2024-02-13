import { isComparable } from "../drop/comparable";
import type { Context } from "../context";
import { isFalsy, isTruthy } from "../render/boolean";
import { isArray, isFunction, toValue } from "../util/underscore";

export type UnaryOperatorHandler = (operand: any, ctx: Context) => boolean;
export type BinaryOperatorHandler = (lhs: any, rhs: any, ctx: Context) => boolean;
export type OperatorHandler = UnaryOperatorHandler | BinaryOperatorHandler;
export type Operators = Record<string, OperatorHandler>;

export const defaultOperators: Operators = {
  "==": equal,
  "!=": (l: any, r: any) => !equal(l, r),
  ">": (l: any, r: any) => {
    if (isComparable(l)) return l.gt(r);
    if (isComparable(r)) return r.lt(l);
    return toValue(l) > toValue(r);
  },
  "<": (l: any, r: any) => {
    if (isComparable(l)) return l.lt(r);
    if (isComparable(r)) return r.gt(l);
    return toValue(l) < toValue(r);
  },
  ">=": (l: any, r: any) => {
    if (isComparable(l)) return l.geq(r);
    if (isComparable(r)) return r.leq(l);
    return toValue(l) >= toValue(r);
  },
  "<=": (l: any, r: any) => {
    if (isComparable(l)) return l.leq(r);
    if (isComparable(r)) return r.geq(l);
    return toValue(l) <= toValue(r);
  },
  contains: (l: any, r: any) => {
    l = toValue(l);
    r = toValue(r);
    return l && isFunction(l.indexOf) ? l.indexOf(r) > -1 : false;
  },
  not: (v: any, ctx: Context) => isFalsy(toValue(v), ctx),
  and: (l: any, r: any, ctx: Context) => isTruthy(toValue(l), ctx) && isTruthy(toValue(r), ctx),
  or: (l: any, r: any, ctx: Context) => isTruthy(toValue(l), ctx) || isTruthy(toValue(r), ctx),
};

function equal(lhs: any, rhs: any): boolean {
  if (isComparable(lhs)) return lhs.equals(rhs);
  if (isComparable(rhs)) return rhs.equals(lhs);
  lhs = toValue(lhs);
  rhs = toValue(rhs);
  if (isArray(lhs)) {
    return isArray(rhs) && arrayEqual(lhs, rhs);
  }
  return lhs === rhs;
}

function arrayEqual(lhs: any[], rhs: any[]): boolean {
  if (lhs.length !== rhs.length) return false;
  return !lhs.some((value, i) => !equal(value, rhs[i]));
}
