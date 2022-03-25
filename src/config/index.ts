import { Wallet } from '../application';
import { Block } from '../blockchain/block';
import { Transaction } from '../blockchain/transaction';

/**
 * 总币数：100万
 */
export const kCoins = 1000000n;

/**
 * 1 coin = 100 cent
 *
 * 单位：cent
 */
export const kCentsPerCoin = 100n;

/**
 * coinbase 奖励 100 coin (单位：cent)
 *
 * 当余币不足 100 coin 时，按剩余币数奖励
 */
export const kCoinbaseReward = 100n * kCentsPerCoin;

/**
 * coinbase 交易输入 unlockScript
 */
export const kCoinbaseUnlockScript = 'coinbase';

/**
 * 每个区块的交易笔数上限（100笔，不包含 coinbase 交易）
 */
export const kMaxTransactionsPerBlock = 100;

/**
 * 每笔交易最低的手续费（单位 cent）
 */
export const kMinFeesPerTransaction = 1;

/**
 * PoW（工作量证明）难度增加步长
 */
export const kDifficultySteps = 10000;

/**
 * 创世区块
 */
export const kGenesisBlock = new Block('genesis', 1646462674470, 404, [
  Transaction.coinbase(0n, 0n, 'A love that never dies.'),
]);

/**
 * coinbase 交易输入 hash
 */
export const kCoinbaseInputHash = 'coinbase_404';

/**
 * 我的钱包公钥
 */
export const kPublicKey =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyQJpkdWpwms5MM7nf0cl\n4ABSl+uYqaLRF4SkzIwvf+xEVcqlVriiliaTknWuIMNwsCmcreZO0sYexasTnqlY\nF5LGGmSEz1QhIR9ohNsxBfX8w6f41t8ArNkOOmAMd29KjqesUV6286Btcy+CtTJl\nzOoIpk9N7xcXgsIsU2CmwW4jNNlBARlg6Y/DJ8Utkl7SqpaIOnmdiK8V8o2q0Db+\nsE2Y2X8kzfPCqiOZ5V+US8LhLslU7p0A4Y1NlgZYwQDwynUUDrPJGF+h5QmDJLGs\nrdDQ25t0Q0Au+efuxUw5ZX5gEiKljRxnIo7+7VFraMNeS2kS82cuz82saqjscYk4\n8QIDAQAB\n-----END PUBLIC KEY-----\n';

/**
 * 我的钱包私钥
 */
export const kPrivteKey =
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJAmmR1anCazkw\nzud/RyXgAFKX65ipotEXhKTMjC9/7ERVyqVWuKKWJpOSda4gw3CwKZyt5k7Sxh7F\nqxOeqVgXksYaZITPVCEhH2iE2zEF9fzDp/jW3wCs2Q46YAx3b0qOp6xRXrbzoG1z\nL4K1MmXM6gimT03vFxeCwixTYKbBbiM02UEBGWDpj8MnxS2SXtKqlog6eZ2IrxXy\njarQNv6wTZjZfyTN88KqI5nlX5RLwuEuyVTunQDhjU2WBljBAPDKdRQOs8kYX6Hl\nCYMksayt0NDbm3RDQC755+7FTDllfmASIqWNHGcijv7tUWtow15LaRLzZy7Pzaxq\nqOxxiTjxAgMBAAECggEAabkxGZlNzopi7D8HF7SuQSEqT+mExER0wW/s1gEtwpTc\nZFtPl0tJiLwFhlULHwRssttQI08tSkMWUFVo3lynjs6OD7eq+vl+61L/wFEheccm\nCSrCARIN4tvPVfjK1c7dYibixXGRvJY2uwzULMWzMZIutnqjvQtiPE4wzjHZw4Zh\nngcH5DXOPgOzbz4msAuCRlsV3GS3R5WEZ9aqiPxGuMMhoV88k3+5w8oLnIdA/0Pg\nSz8fxfalhjlde4ro4qtlK4suiLpH7QtuCXGeGgVr/hOEoDQt7gCCF55Oknpzydbi\nuhOY9dhBlkcYj3GxnV+GHT60OIA9gfncZVLLUMM6WQKBgQDoqR51A0R7RaqyzEBZ\nf8VEFUiLIpNifsuOsVGVzVO+IeSDCYBN7e8JbkJjxNIjy3UZhqNlIxQwwgM5sBhW\nubpkfWWUsef63r9NacefHpAY+IkId+++XmTkebNF/BEaVmjlgaI3i2mDglX55dhM\nSU0cGUUjeQz04wsn3xd8OWOv9wKBgQDdLHgqJ0o8fWy1yenCKGsMXRbDAVUk48xq\nl6T1t7F689iaMqz3nx8Mp50Ra38vAh3s20NtnGayxCdwFkovf4M1/seuJtPKuYUJ\nPfWmroOQvbxVO3TTa98jKvVhy51gDj9B5/TnM1C2NvsLbVJYmRa5hexA8L8JcQFU\nltzf4Ff0VwKBgFi69tSldF6XCSy7XOdFJVR70XjOrOrpdHRtB7Jb5k4i2uVmoDoY\nPguYs1UdYQ8prvUXNgWCRVb7BwPfNskMeBuO/0igONqiTM8XQnxayZXcY1aJdzNh\nCJViHI7aPSOQRN0SfW01i/4NnQB7OeyOIAxRTt7icaCLXlvMZ0aHFI+tAoGBANRa\n+hUfHDvwAQyaDQMKY52/UzdwdBuzTHWbnBsAgDuZHQMQXNpzwRAZbslm+PpdgfYE\noD0ByekiROttu1TXjVeuhHJFfVxLu9wfzVh4foHeapE7QPQtwlS1zlxTb4rmov3Y\nhF/n+Tq6l1dlY4cFlbgTSb8gZ4vdIHXjU7bwZAKJAoGAGXVUlgqFJql70+bxTBFv\nf3GXgKXBMmHx0QAkVTuszDOC64lNopdhHq0RCN6/RA8qwzSf6Us3mqOmn8pCjhuU\nCR8l32Oy6/oPKk/YwE5fmPN9A/En2whHgSYv7mlqxrcL9w1g3RA3h10XxP1FRfWI\ncBRcCiaJLX1Io2rqz0dNREg=\n-----END PRIVATE KEY-----\n';
