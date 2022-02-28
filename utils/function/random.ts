/**
 * 随机数
 *
 * random(100) => 0 - 100
 *
 * random(0,100) => 0 - 100
 */
export const random = (min = 100, max?: number) => {
  if (max == undefined) [min, max] = [0, min];
  if (min > max) [min, max] = [max, min];
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function randomBool(): boolean {
  return pickOne([true, false]);
}

/**
 * 从数组中随机取出一个元素
 */
export const pickOne = <T>(arr: T[]) => {
  if (arr.length < 1) {
    throw new Error('array is empty');
  }
  return arr[random(arr.length - 1)];
};
