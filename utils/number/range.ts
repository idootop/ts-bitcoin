import { clamp, toInt } from '.';

/**
 * 返回数组的合法下标
 */
export const safeIndex = (idx: number, arr?: any[]) => {
  if (arr === undefined) {
    return toInt(clamp(idx, 0, Infinity));
  }
  return toInt(clamp(idx, 0, arr.length - 1));
};

/**
 * div(3,1)=3
 * div(3,2)=1
 * div(3,10)=0
 */
export const div = (a: number, b: number) => {
  return Math.floor(a / b);
};

/**
 * range(3) => [1,2,3]
 */
export const range = (start: number, end?: number, step = 1) => {
  const result: number[] = [];
  // step 应为正数
  step = clamp(step, 0, Infinity);
  if (end === undefined) {
    end = start;
    start = step;
  }
  const isReversed = start > end;
  const sign = isReversed ? -1 : 1;
  const total = Math.abs(end - start);
  const len = div(total, step);
  for (let i = 0; i < len + 1; i++) {
    result.push(start + sign * i * step);
  }
  return result;
};
