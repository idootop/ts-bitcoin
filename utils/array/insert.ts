import { clamp } from '../number';

export const insert = <T = unknown>(arr: T[], index: number, item: T) => {
  arr.splice(clamp(index, 0, arr.length - 1), 0, item);
  return arr;
};
