import * as crypto from 'crypto';

export const printf = (message?: any, ...optionalParams: any[]) =>
  console.log(message, ...optionalParams);

/**
 * 当前时间的毫秒级时间戳
 */
export const now = () => Date.now();

/**
 * obj => json string
 */
export const jsonEncode = (obj: any, prettier = false) => {
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return '';
  }
};

export type Hash = string;
export type HashUTXO = `${Hash}_${number}`;

/**
 * jsonEncode => utf8 => doubleSHA256 => hex
 */
export const hashObj = (obj: object) => {
  const doubleSHA256 = (buffer: Uint8Array): Buffer => {
    const SHA256 = (buffer: Uint8Array): Buffer => {
      return crypto.createHash('sha256').update(buffer).digest();
    };
    return SHA256(SHA256(buffer));
  };
  const objBuffer = Buffer.from(jsonEncode(obj), 'utf-8');
  return doubleSHA256(objBuffer).toString('hex');
};

/**
 * 创建公私钥对
 */
export const createKeyPair = () =>
  crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

/**
 * 创建签名
 */
export const createSignature = (privateKey: string, data: string) => {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data).end();
  return sign.sign(privateKey, 'hex');
};

/**
 * 校验签名
 */
export const verifySignature = (publicKey: string, signature: string) => {
  const verify = crypto.createVerify('RSA-SHA256');
  return verify.verify(publicKey, Buffer.from(signature, 'hex'));
};
