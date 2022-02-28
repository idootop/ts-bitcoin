import { toTimeStamp } from '.';

/**
 * 当前时间（Date）
 */
export const now = (): Date => new Date();

/**
 * 当前时间戳（millisecondsSinceEpoch）
 *
 * 示例：1568259372000
 */
export const nowTimestamp = (second = false) => toTimeStamp(now(), second);
