import { Block } from '../../block';
import { BlockManager } from '../../block';
import { Transaction } from '../../transaction';
import { Hash, removeWhere } from '../../utils';
import { blockChain } from '../blockchain';

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
   * 获取已确认交易
   */
  getTransaction(transactionHash: Hash): Transaction | undefined {
    return this.confirmedTransactions[transactionHash];
  }

  /**
   * 当链上添加区块
   */
  addBlock(block: Block): void {
    // 更新 blockchain.chain 中的 hash
    blockChain.chain.push(block.hash);
    // 添加区块
    this.confirmedBlocks[block.hash] = block;
    // 添加交易
    block.transactions.forEach((transaction) => {
      this.confirmedTransactions[transaction.hash] = transaction;
    });
  }

  /**
   * 当链上移除区块
   */
  removeBlock(block: Block): void {
    // 更新 blockchain.chain 中的 hash
    removeWhere(blockChain.chain, (hash) => hash === block.hash);
    // 移除区块
    delete this.confirmedBlocks[block.hash];
    // 移除交易
    block.transactions.forEach((transaction) => {
      delete this.confirmedTransactions[transaction.hash];
    });
  }
}
