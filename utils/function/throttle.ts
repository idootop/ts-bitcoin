// 来源：https://github.com/github/mini-throttle/blob/main/index.ts

// | fn()                                         | 1 2 3 4 5 6 7 8 9 10 |
// | throttle(fn, 100)                            | 1 2   4   6   8   10 |
// | throttle(fn, 100, {start: false})            |   2   4   6   8   10 |
// | throttle(fn, 100, {middle: false})           | 1                 10 |
// | throttle(fn, 100, {once: true})              | 1                    |
// | throttle(fn, 100, {once: true, start: false})|   2                  |
// | debounce(fn, 100)                            |                   10 |
export interface ThrottleOptions {
  /**
   * Fire immediately on the first call.
   */
  start?: boolean;
  /**
   * Fire as soon as `wait` has passed.
   */
  middle?: boolean;
  /**
   * Cancel after the first successful call.
   */
  once?: boolean;
}

interface Throttler<T extends unknown[]> {
  (...args: T): void;
  cancel: () => void;
}

/**
 * 函数节流
 *
 * 在指定时间内多次调用函数只响应第一次
 *
 * ```typescript
 * function fn(i: number): void {
 *   console.log(i);
 * }
 *
 * const throttleFn = throttle(fn, 100);
 *
 * for (let i = 1; i <= 10; ++i) {
 *   throttleFn(i);
 *   await delay(50);
 * }
 *
 * //  1 2 3 4 5 6 7 8 9 10
 * ```
 */
export function throttle<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  { start = true, middle = true, once = false }: ThrottleOptions = {},
): Throttler<T> {
  let last = 0;
  let timer: ReturnType<typeof setTimeout>;
  let cancelled = false;
  function fn(this: unknown, ...args: T): any {
    if (cancelled) return;
    const delta = Date.now() - last;
    last = Date.now();
    if (start) {
      start = false;
      callback.apply(this, args);
      if (once) fn.cancel();
    } else if ((middle && delta < wait) || !middle) {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          last = Date.now();
          callback.apply(this, args);
          if (once) fn.cancel();
        },
        !middle ? wait : wait - delta,
      );
    }
  }
  fn.cancel = () => {
    clearTimeout(timer);
    cancelled = true;
  };
  return fn;
}

/**
 * 函数防抖
 *
 * 延迟响应函数调用，在指定时间之内重复调用，则继续延迟
 *
 * ```typescript
 * function fn(i: number): void {
 *   console.log(i);
 * }
 *
 * const debounceFn = debounce(fn, 100);
 *
 * for (let i = 1; i <= 10; ++i) {
 *   debounceFn(i);
 *   await delay(50);
 * }
 *
 * //                   10
 * ```
 */
export function debounce<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  { start = false, middle = false, once = false }: ThrottleOptions = {},
): Throttler<T> {
  return throttle(callback, wait, { start, middle, once });
}
