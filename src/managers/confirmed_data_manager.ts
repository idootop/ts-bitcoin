import { Block } from '../block';
import { BlockManager } from '../block';
import { blockChain } from '../blockchain';
import { Transaction } from '../transaction';
import { Hash, removeWhere } from '../utils';

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
  addBlock(block: Block): void {
    // 同时更新 blockchain.chain 中的 hash
    blockChain.chain.push(block.hash);
    // todo
    throw new Error('Method not implemented.');
  }

  /**
   * todo 当链上移除区块
   */
  removeBlock(block: Block): void {
    // 同时更新 blockchain.chain 中的 hash
    removeWhere(blockChain.chain, (hash) => hash === block.hash);
    // todo
    throw new Error('Method not implemented.');
  }
}
