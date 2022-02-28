import { ArrayElement } from '../types';
import { keys } from './keys';

/**
 * ```typescript
 * pick({a:1,b:2}, ['a']) // => {a:1}
 * ```
 */
export const pick = <T extends object, K extends (keyof T)[], P extends ArrayElement<K>>(
  object: T,
  fields: K,
): Pick<T, P> => {
  // eslint-disable-next-line
  return fields.reduce<any>((obj, field) => {
    obj[field] = object[field];
    return obj;
  }, {});
};

/**
 * ```typescript
 * omit({a:1,b:2}, ['b']) // => {a:1}
 * ```
 */
export const omit = <T extends object, K extends (keyof T)[], P extends ArrayElement<K>>(
  object: T,
  fields: K,
): Omit<T, P> => {
  //eslint-disable-next-line
  return keys(object).reduce<any>((obj, field) => {
    if (!fields.includes(field)) {
      obj[field] = object[field];
    }
    return obj;
  }, {});
};
