/**
 * obj => json string
 */
export function jsonEncode(obj: any, prettier = false): string {
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return '';
  }
}

/**
 * json string => obj
 */
export function jsonDecode(json: string): any {
  try {
    return JSON.parse(json);
  } catch (error) {
    return {};
  }
}
