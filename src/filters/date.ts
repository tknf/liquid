import type { LiquidDate } from "../util/liquid-date";
import type { FilterImpl } from "../template";
import { isNil, isNumber, isString, stringify, toValue } from "../util/underscore";
import { TimezoneDate } from "../util/timezone-date";
import { strftime } from "../util/strftime";

export function date(this: FilterImpl, v: string | Date, format?: string, timezoneOffset?: number | string) {
  const opts = this.context.opts;
  let date: LiquidDate;
  v = toValue(v);
  format = toValue(format);
  if (isNil(format)) format = opts.dateFormat;
  else format = stringify(format);
  if (v === "now" || v === "today") {
    date = new Date();
  } else if (isNumber(v)) {
    date = new Date(v * 1000);
  } else if (isString(v)) {
    if (/^\d+$/.test(v)) {
      date = new Date(+v * 1000);
    } else if (opts.preserveTimezones) {
      date = TimezoneDate.createDateFixedToTimezone(v);
    } else {
      date = new Date(v);
    }
  } else {
    date = v;
  }
  if (!isValidDate(date)) return v;
  if (timezoneOffset !== undefined) {
    date = new TimezoneDate(date, parseTimezoneOffset(date, timezoneOffset));
  } else if (!(date instanceof TimezoneDate) && opts.timezoneOffset !== undefined) {
    date = new TimezoneDate(date, parseTimezoneOffset(date, opts.timezoneOffset));
  }
  return strftime(date, format);
}

function isValidDate(date: any): date is Date {
  return (date instanceof Date || date instanceof TimezoneDate) && !isNaN(date.getTime());
}

/**
 * need pass in a `date` because offset is dependent on whether DST is active
 */
function parseTimezoneOffset(date: Date, timeZone: string | number) {
  if (isNumber(timeZone)) return timeZone;
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return (utcDate.getTime() - tzDate.getTime()) / 6e4;
}
