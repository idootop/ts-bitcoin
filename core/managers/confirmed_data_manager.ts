import { Block } from '../block';
import { BlockManager } from '../block';
import { Transaction } from '../transaction';
import { Hash } from '../utils';

export class ConfirmedDataManager extends BlockManager {
  /**
   * 当前链上验证有效的区块
   */
  confirmedBlocks: Record<Hash, Block> = {};

  /**
   * 当前链上验证有效的交易
   */
  confirmedTransactions: Record<Hash, Transaction> = {};

  /**
   * 获取已确认区块
   */
  getBlock(blockHash: Hash): Block | undefined {
    return this.confirmedBlocks[blockHash];
  }

  /**
   * todo 当链上添加区块
   */
  onAddBlocks(blocks: Block[]): void {
    throw new Error('Method not implemented.');
  }

  /**
   * todo 当链上移除区块
   */
  onRemoveBlocks(blocks: Block[]): void {
    throw new Error('Method not implemented.');
  }
}
