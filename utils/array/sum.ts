export const sum = (...arr: number[]) => sumBy([...arr], (v) => v);

export const sumBy = <T = unknown>(
  //
  arr: T[],
  getNum: (value: T, index: number, array: T[]) => number,
) => {
  return arr.map(getNum).reduce((acc, val) => acc + val, 0);
};

export const sumByKey = <T extends object>(
  //
  arr: T[],
  key: string,
) => {
  // eslint-disable-next-line
  const numFun = (value: any) => value[key];
  return sumBy(arr, numFun);
};
