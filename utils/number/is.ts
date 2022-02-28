// 整数
export const isInt = (value: number) => Number.isInteger(value);

// 无穷
export const isInfinite = (value: number) => value === Infinity || value === -Infinity;
const mod2 = (remainder: number) => (value: number) =>
  isInt(value) && Math.abs(value % 2) === remainder;

// 偶数
export const isEvenInt = mod2(0);

// 奇数
export const isOddInt = mod2(1);
