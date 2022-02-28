export const unique = <T = unknown>(arr: T[]) => [...Array.from(new Set(arr))];

export const uniqueBy = <T = unknown>(
  //
  arr: T[],
  isEquel: (a: T, b: T) => boolean,
) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x) => isEquel(v, x))) acc.push(v);
    return acc;
  }, [] as T[]);

export const uniqueByKey = <T = unknown>(
  //
  arr: T[],
  key: keyof T,
) => uniqueBy(arr, (a, b) => a[key] === b[key]);
