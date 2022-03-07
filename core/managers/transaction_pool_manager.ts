import { Block } from '../block';
import { BlockManager } from '../block';
import { Transaction } from '../transaction';
import { Hash } from '../utils';

export class TransactionPoolManager extends BlockManager {
  /**
   * 合法交易
   *
   * 已验证合法，等待确认的交易
   */
  validTransactions: Record<Hash, Transaction> = {};
  /**
   * 孤儿交易
   *
   * 在交易链中存在未确认UTXO来源的交易
   */
  orphanTransactions: Record<Hash, Transaction> = {};

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
