import { DeepPartial, isObject } from '../types';
import { keys } from './keys';

/**
 * Deeply applies defaults to an object.
 *
 * @param supplied The supplied options, a `DeepPartial` of `defaultValues`.
 * @param defaultValues The default values to fallback on. Should represent a full copy of the options object.
 */
export const defaults = <T extends object>(
  supplied: DeepPartial<T> | undefined,
  defaultValues: T,
) => {
  const result: T = { ...defaultValues };
  keys(supplied).forEach((key) => {
    if (isObject(defaultValues[key])) {
      //@ts-ignore
      result[key] = defaults(supplied[key], defaultValues[key]);
      return;
    }
    //@ts-ignore
    result[key] = supplied[key];
  });
  return result;
};
