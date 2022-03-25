import { kCoinbaseInputHash } from '../../config';
import { HashUTXO, printf } from '../../utils';
import { Block } from '../block';
import { BlockManager } from '../block';
import { blockChain } from '../blockchain';
import { Output, Transaction } from '../transaction';

export class UTXOManager extends BlockManager {
  /**
   * 未花费交易输出
   */
  UTXOs: Record<HashUTXO, Output> = {};

  /**
   * 查询有效的UTXO
   */
  getUTXO(hashUTXO: HashUTXO): Output | undefined {
    return this.UTXOs[hashUTXO];
  }

  /**
   * 当链上添加区块
   */
  addBlock(block: Block): void {
    // 正向添加交易
    for (const transaction of block.transactions) {
      // 从 UTXO 中移除当前交易中的 input
      transaction.inputs.forEach((input) => {
        if (input.hashUTXO === kCoinbaseInputHash) return;
        delete this.UTXOs[input.hashUTXO];
      });
      // 添加新的 UTXO
      transaction.outputs.forEach((output, outputIndex) => {
        const hashUTXO: HashUTXO = `${transaction.hash}_${outputIndex}`;
        this.UTXOs[hashUTXO] = output;
      });
    }
  }

  /**
   * 当链上移除区块
   */
  removeBlock(block: Block): void {
    // 反向移除交易
    for (const transaction of block.transactions.reverse()) {
      // 恢复输入为UTXO
      transaction.inputs.forEach((input) => {
        if (input.hashUTXO === kCoinbaseInputHash) return;
        const { transactionHash, outputIndex } = input.reference!;
        const tx = blockChain.confirmedDataManager.getTransaction(transactionHash)!;
        const output = tx.getOutput(outputIndex);
        this.UTXOs[input.hashUTXO] = output;
      });
      // 从 UTXO 中移除当前交易中的 output
      transaction.outputs.forEach((output, outputIndex) => {
        const hashUTXO: HashUTXO = `${transaction.hash}_${outputIndex}`;
        delete this.UTXOs[hashUTXO];
      });
    }
  }
}
