import { kDifficultySteps } from '../config';
import { Hash, hashObj, now } from '../utils';
import { Transaction } from './transaction';

export class Block {
  constructor(
    /**
     * 上一区块的hash
     */
    public preHash: Hash = '',
    /**
     * 创建时间戳
     */
    public timestamp: number = now(),
    /**
     * 随机数
     */
    public nonce: number = 0,
    /**
     * 当前块所确认的所有交易
     */
    public transactions: Transaction[] = [],
  ) {}

  /**
   * 区块 hash
   */
  get hash() {
    return hashObj(this);
  }
}

export abstract class BlockManager {
  /**
   * 添加已确认区块
   */
  abstract addBlock(block: Block): void;
  /**
   * 移除无效区块
   */
  abstract removeBlock(block: Block): void;
}

/**
 * 计算区块难度值
 */
export const calcBlockDifficulty = (height: number) => {
  // 每 kDifficultySteps 个区块，难度 +1
  return height === 1 ? 0 : Math.floor((height - 1) / kDifficultySteps) + 4;
};
