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
  Transaction.coinbase(kCoinbaseReward, 0n, 'A love that never dies.'),
]);

/**
 * coinbase 交易输入 hash
 */
export const kCoinbaseInputHash = 'coinbase';
