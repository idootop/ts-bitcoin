import { Block } from '../block';
import { BlockManager } from '../block';
import { blockChain } from '../blockchain';
import { Transaction } from '../transaction';
import { Hash } from '../utils';
import { validateTransaction } from '../validate';

// todo 节点间中继消息时，不要重复接收已存在的交易或区块，即一个消息只处理一次
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
   * 向交易池中添加交易
   */
  addTransaction(transaction: Transaction) {
    const hash = transaction.hash;
    if (
      [
        this.validTransactions[hash],
        this.orphanTransactions[hash],
        blockChain.confirmedDataManager.confirmedTransactions[hash],
      ].some((tx) => tx !== undefined)
    ) {
      // 当前交易已在交易池中存在
      return;
    }
    const result = validateTransaction(transaction);
    if (result === 'valid') {
      this.validTransactions[hash] = transaction;
    } else if (result === 'orphan') {
      this.orphanTransactions[hash] = transaction;
    }
  }

  /**
   * 更新交易池
   *
   * 通常在UTXO发生变更时会更新
   *
   * todo 更新随着每个区块的添加/移除而进行，每次变动遍历一遍交易池（可能比较庞大）可能会有性能问题，待优化。
   */
  updatePool() {
    Object.entries(this.validTransactions).forEach(([hash, transaction]) => {
      const result = validateTransaction(transaction);
      if (result !== 'valid') {
        // 交易不再有效
        delete this.validTransactions[hash];
        if (result === 'orphan') {
          // 添加到孤儿交易
          this.orphanTransactions[hash] = transaction;
        }
      }
    });
    Object.entries(this.orphanTransactions).forEach(([hash, transaction]) => {
      const result = validateTransaction(transaction);
      if (result !== 'orphan') {
        // 不再是孤儿交易
        delete this.orphanTransactions[hash];
        if (result === 'valid') {
          // 添加到有效交易
          this.validTransactions[hash] = transaction;
        }
      }
    });
  }

  /**
   * 当链上添加区块
   */
  addBlock(block: Block): void {
    block.transactions.forEach((transaction) => {
      // 从交易池中删除已确认的有效交易
      if (this.validTransactions[transaction.hash] !== undefined) {
        delete this.validTransactions[transaction.hash];
      }
      // 从交易池中删除已确认的孤儿交易
      if (this.orphanTransactions[transaction.hash] !== undefined) {
        delete this.orphanTransactions[transaction.hash];
      }
    });
    // 更新交易池
    this.updatePool();
  }

  /**
   * 当链上移除区块
   */
  removeBlock(block: Block): void {
    // 更新交易池
    this.updatePool();
  }
}
