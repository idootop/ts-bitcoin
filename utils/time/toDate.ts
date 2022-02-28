import { isIntString, isString, toInt } from '..';
import { LDate } from '.';

/**
 * Date/字符串转时间戳（millisecondsSinceEpoch）
 */
export function toTimeStamp(time: LDate, second = false) {
  const milliseconds = Date.parse(toDate(time).toString());
  return second ? toInt(milliseconds / 1000) : milliseconds;
}

/**
 * 时间戳/字符串转Date
 */
export function toDate(time: LDate): Date {
  if (isString(time) && isIntString(time as string)) {
    const timestamp = toInt(time as string);
    return new Date(timestamp);
  }
  return new Date(time);
}
