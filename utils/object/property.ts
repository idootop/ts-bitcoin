import { isFunction } from '..';

/**
 * Takes an array of objects and returns an array of values from the given `property`
 *
 * @param array The array of objects
 * @param property The property to extract
 */
export const mapProperty = <T, K extends keyof T>(array: T[], property: K): T[K][] => {
  return array.map((element) => element[property]);
};

/**
 * Replace a property on an objcet with a different type
 *
 * @param object The object
 * @param property The property to replace
 * @param replacer Function to take the value and return the new value
 * @returns An object with the property replaced
 */
export const replaceProperty = <T extends object, K extends keyof T, P>(
  object: T,
  property: K,
  replace: P | ((value: T[K]) => P),
): Omit<T, K> & { [key in K]: P } => {
  const newObject: any = { ...object };
  newObject[property] = isFunction(replace) ? (replace as any)(newObject[property]) : replace;
  return newObject;
};
