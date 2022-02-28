import { removeNullishKeys } from '../object';
import { isArray } from '../types';

export const remove = <T = unknown>(arr: T[], val: T) => arr.splice(arr.indexOf(val), 1);

/**
 * 返回被删除的元素
 */
export const removeWhere = <T = unknown>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
) =>
  Array.isArray(arr)
    ? arr.filter(predicate).reduce((acc, val) => {
        remove(arr, val);
        return acc.concat(val);
      }, [] as T[])
    : [];

/**
 * 移除对象/数组中的空值，返回新对象/数组
 */
export const removeNullish = <T extends object>(obj: T | T[]) => {
  if (isArray(obj)) {
    return (obj as T[]).filter((e) => e != null);
  }
  return removeNullishKeys(obj);
};
