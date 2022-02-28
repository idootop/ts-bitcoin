/**
 * 判断是整数
 */
export function isIntString(s: string): boolean {
  return /^-?[0-9]\d*$/.test(s);
}

/**
 * 判断是浮点数
 */
export function isFloatString(s: string): boolean {
  return /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/.test(s);
}
