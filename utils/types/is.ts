export function isNaN(e: unknown): boolean {
  return Number.isNaN(e);
}

export function isNull(e: unknown): boolean {
  return e === null;
}

export function isUndefined(e: unknown): boolean {
  return e === undefined;
}

/**
 * 判断类型是否为空
 *
 * 当值为 null 或 undifined 时返回 true
 */
export function isNullish(e: unknown): boolean {
  return e === null || e === undefined;
}

export function isNotNullish(e: unknown): boolean {
  return !isNullish(e);
}

/**
 * 判断数值是否为空
 *
 * 当值为 null、undifined 或空字符串/数组/对象时返回 true
 *
 * @warning 对于非nullish/string/number/boolean/array/map/set的对象，如Date/RegExp等，都视为空对象
 */
export function isEmpty(e: any): boolean {
  // 对于非空的 Map / Set
  if (e?.size ?? 0 > 0) return false;
  return (
    isNaN(e) ||
    isNullish(e) ||
    (isString(e) && (e.length < 1 || !/\S/.test(e))) ||
    (isArray(e) && e.length < 1) ||
    (isObject(e) && Object.keys(e).length < 1)
  );
}

/**
 * 判断数值是否非空
 *
 * 当值不为 null、undifined 或空字符串/数组时返回 true
 */
export function isNotEmpty(e: unknown): boolean {
  return !isEmpty(e);
}

export function isNumber(e: unknown): boolean {
  return typeof e === 'number' && !isNaN(e);
}

export function isString(e: unknown): boolean {
  return typeof e === 'string';
}

export function isStringNumber(e: any): boolean {
  return isString(e) && isNotEmpty(e) && !isNaN(Number(e));
}

export function isArray(e: unknown): boolean {
  return Array.isArray(e);
}

export function isObject(e: unknown): boolean {
  return typeof e === 'object' && isNotNullish(e);
}

export function isFunction(e: unknown): boolean {
  return typeof e === 'function';
}

export function isClass(e: any): boolean {
  return isFunction(e) && e.toString().startsWith('class ');
}
