import { Transaction } from './transaction';
import { Hash } from './utils';

export class TransactionPool {
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
}

export const transactionPool = new TransactionPool();
