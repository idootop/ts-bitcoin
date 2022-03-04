import { createHash } from 'crypto';

/**
 * 当前时间的毫秒级时间戳
 */
export const now = () => Date.now();

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
 * jsonEncode => utf8 => doubleSHA256 => hex
 */
export function hash(obj: object): string {
  const doubleSHA256 = (buffer: Uint8Array): Buffer => {
    const SHA256 = (buffer: Uint8Array): Buffer => {
      return createHash('sha256').update(buffer).digest();
    };
    return SHA256(SHA256(buffer));
  };
  const objBuffer = Buffer.from(jsonEncode(obj), 'utf-8');
  return doubleSHA256(objBuffer).toString('hex');
}
