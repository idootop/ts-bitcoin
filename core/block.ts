import { Transaction } from './transaction';
import { Hash, hashObj, now, printf } from './utils';

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
     * PoW（工作量证明）难度
     */
    public difficulty: number = 0,
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
