/**
 * someThing -> SomeThing
 */
export function upFirst(s = ''): string {
  return s.replace(/^[a-z]/, (g) => g.toUpperCase());
}

/**
 * SomeThing -> someThing
 */
export function downFirst(s = ''): string {
  return s.replace(/^[A-Z]/, (g) => g.toLowerCase());
}

/**
 * someThing -> some-thing
 *
 * SomeThing -> some-thing
 */
export function kebab(str: string): string {
  return downFirst(str)
    .replace(/[A-Z]/g, (capital) => {
      return '-' + capital.toLowerCase();
    })
    .replace(/-+/g, '-');
}

/**
 * some thing -> someThing
 *
 * some-thing -> someThing
 *
 * some_thing -> someThing
 *
 * SomeThing -> someThing
 */
export function camel(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/(\s+|-|_)/g, '');
}
