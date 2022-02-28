export const first = <T>(arr: T[]) => {
  const len = arr.length;
  return len < 1 ? undefined : arr[0];
};

export const last = <T>(arr: T[]) => {
  const len = arr.length;
  return len < 1 ? undefined : arr[len - 1];
};
