type SortByFunc<T> = (a: T, b: T) => number;

type SortByOrder = 'asc' | 'desc';

export const sort = <T = unknown>(
  //
  arr: T[],
  order: SortByOrder = 'asc',
) => {
  const sortFun = (a: T, b: T) => String(a).localeCompare(String(b));
  return sortBy(arr, sortFun, order);
};

export const sortBy = <T = unknown>(
  //
  arr: T[],
  sortFun: SortByFunc<T>,
  order: SortByOrder = 'asc',
) => {
  const realSortFun = (a: T, b: T) => (order === 'asc' ? 1 : -1 * sortFun(a, b));
  return [...arr].sort(realSortFun);
};

export const sortByKey = <T extends object>(
  //
  arr: T[],
  key: keyof T,
  order: SortByOrder = 'asc',
) => {
  const sortFun = (a: T, b: T) => String(a[key]).localeCompare(String(b[key]));
  return sortBy(arr, sortFun, order);
};
