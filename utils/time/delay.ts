/**
 * 延时函数，单位毫秒
 */
export const delay = async (time: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
};

export const sleep = async (time: number) => delay(time);
