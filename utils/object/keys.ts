/**
 * ```typescript
 * keys({a:1,b:2}) // => ['a','b']
 * ```
 */
export const keys = <T extends object>(object?: T): Extract<keyof T, string>[] => {
  if (!object) return [];
  // eslint-disable-next-line
  return Object.keys(object) as any;
};

/**
 * ```typescript
 * entries({a:1,b:2}) // => [['a',1],['b',2]]
 * ```
 */
export const entries = <T extends object>(object?: T): { [K in keyof T]: [K, T[K]] }[keyof T][] => {
  if (!object) return [];
  // eslint-disable-next-line
  return Object.entries(object) as any;
};
