import { entries, omit } from '.';

export const removeKey = <T extends object>(
  //
  obj: T,
  key: keyof T,
) => {
  const old = obj[key];
  delete obj[key];
  return old;
};

/**
 * 返回被删除的元素
 */
export const removeKeys = <T extends object>(
  //
  obj: T,
  keys: (keyof T)[],
) => {
  return keys.map((key) => removeKey(obj, key));
};

/**
 * 返回移除空值后的新对象
 */
export const removeNullishKeys = <T extends object>(obj: T) => {
  const nullKeys = entries(obj)
    .filter(([_, v]) => v == undefined)
    .map(([k, _]) => k);
  return omit(obj, nullKeys);
};
