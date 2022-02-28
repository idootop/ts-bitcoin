export const padLeft = (str: string | number, num = 2, fill = '0') =>
  String(str).padStart(num, fill);

export const padRight = (str: string | number, num = 2, fill = '0') =>
  String(str).padEnd(num, fill);
