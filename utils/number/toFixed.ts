import { isEmpty, isString, isStringNumber } from '../types';

/**
 * toFixed(12.999,1) => 12.9
 *
 * toFixed(12.9,2) => 12.90
 *
 * toFixed(12,1) => 12.0
 */
export function toFixed(num: number, fixed: number): string {
  if (fixed < 0) {
    fixed = 0;
  }
  const s = num.toFixed(fixed + 1);
  const str = s.substr(0, s.length - 1);
  return fixed > 0 ? str : str.replace('.', '');
}

/**
 * 将数字或字符串转为整数（向下取整）
 */
export const toInt = (v?: number | string) => {
  if (isEmpty(v)) return 0;
  if (isString(v)) {
    if (!isStringNumber(v)) {
      return 0;
    }
    return parseInt(v as string, 10);
  }
  return Math.floor(v as number);
};

/**
 * '1.0' => 1.0
 */
export const toNumber = (v?: string) => {
  if (!isStringNumber(v)) {
    return 0;
  }
  return parseFloat(v as string);
};
