import { defaults } from '../object';
import { DeepPartial } from '../types';

interface AsyncItteratorOptions {
  /**
   * 是否阻塞按序执行(默认并发按序执行)
   */
  inSequence: boolean;
}

const defaultOptions: AsyncItteratorOptions = {
  inSequence: false,
};

/**
 * @param inSequence 是否阻塞按序执行(默认并发按序执行)
 */
export const asyncForEach = async <T>(
  array: T[],
  itterator: (value: T, index: number, array: T[]) => Promise<void>,
  options?: DeepPartial<AsyncItteratorOptions>,
): Promise<void> => {
  const { inSequence } = defaults(options, defaultOptions);
  if (inSequence) {
    for (let index = 0; index < array.length; index++) {
      await itterator(array[index], index, array);
    }
    return;
  }
  const promises = array.map((value, index, arr) => itterator(value, index, arr));
  await Promise.all(promises);
};

/**
 * @param inSequence 是否阻塞按序执行(默认并发按序执行)
 */
export const asyncMap = async <T, K>(
  array: T[],
  executor: (element: T, index: number, array: T[]) => Promise<K>,
  options?: DeepPartial<AsyncItteratorOptions>,
): Promise<K[]> => {
  const { inSequence } = defaults(options, defaultOptions);
  if (inSequence) {
    const results: K[] = [];
    for (let index = 0; index < array.length; index++) {
      const result = await executor(array[index], index, array);
      results.push(result);
    }
    return results;
  }
  return Promise.all(array.map(executor));
};

type WaitForResult<T> = [null, Error] | [T, null];

/**
 * Normalises a promise that errors into an awaitable [result, error] array.
 *
 * @param promise The resolveable promise
 */
export const waitFor = async <T>(promise: Promise<T>): Promise<WaitForResult<T>> => {
  return promise
    .then((result) => {
      return [result, null] as [T, null];
    })
    .catch((e) => {
      return [null, e];
    });
};
