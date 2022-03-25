import { kMyWallet } from '..';
import { blockChain } from '../blockchain';
import { Block } from '../blockchain/block';
import { Transaction } from '../blockchain/transaction';
import { getTransactionFees, validatePoW } from '../blockchain/validate';
import { kCentsPerCoin, kCoinbaseReward, kCoins, kMaxTransactionsPerBlock } from '../config';
import { p2p } from '../network/p2p';
import { now, printf } from '../utils';
import { Wallet } from '.';

class Miner {
  private _stopped = false;

  /**
   * 终止挖矿
   */
  stop() {
    this._stopped = true;
  }

  /**
   * 开始挖矿
   */
  async mining() {
    while (!this._stopped) {
      let times = 1;
      // 当前区块链高度
      const currentHeight = blockChain.height + 1;
      const block: Block = this.generateBlock();
      while (currentHeight === blockChain.height + 1) {
        if (validatePoW(block, currentHeight)) {
          // 当前区块链总价值
          const balance = Wallet.getBalance();
          const myBalance = Wallet.getBalance(kMyWallet.publicKey);
          printf(
            `>>> 🎉 恭喜你挖到了第${currentHeight}个区块，一共尝试了${times}次，区块链总价值：${balance}，我的钱包余额：${myBalance}`,
          );
          // 广播新区块
          p2p.brodcastBlockMsg(block);
          // 将新区块添加到本地
          blockChain.addBlocksIfValid([block]);
          break;
        } else {
          // printf(`>>> 正在挖掘第${currentHeight}个区块： 第${times}次尝试“${block.nonce}”无效`);
          times += 1;
          block.nonce += 1;
        }
      }
      if (block.hash !== blockChain.lastBlock!.hash) {
        printf(`>>> 第${currentHeight}个区块已被其他节点挖出，重新开始挖掘下一区块`);
      }
    }
  }

  /**
   * 打包交易，获取一个新区块
   */
  generateBlock() {
    const transactions: Transaction[] = [];
    const validTransactions = Object.values(blockChain.transactionPoolManager.validTransactions);
    // 按照手续费从高到低排序交易
    validTransactions.sort((a, b) => Number(getTransactionFees(b) - getTransactionFees(a)));
    for (const transaction of validTransactions) {
      if (transactions.length < kMaxTransactionsPerBlock) {
        // 每个区块中打包的交易数量不超过 kMaxTransactionsPerBlock (不包含coinbase交易)
        transactions.push(transaction);
      }
    }
    // 手续费
    const fees = transactions.reduce((pre, value) => pre + getTransactionFees(value), 0n);
    // 奖励
    let reward = kCoinbaseReward;
    // todo 动态变更奖励值，一定高度时减半
    // 当前区块链总价值
    const balance = Wallet.getBalance();
    // 区块链总价值（发行上限）
    const totalBalance = kCoins * kCentsPerCoin;
    if (totalBalance - balance < reward) {
      // 当区块链余额不足 kCoinbaseReward 时，剩余多少给多少奖励。
      reward = totalBalance - balance;
    }
    // 创建 coinbase 交易
    const coinbase = Transaction.coinbase(reward, fees, kMyWallet.publicKey!);
    // 创建新区块
    const preHash = blockChain.lastBlock!.hash;
    const timestamp = now();
    const nonce = 0;
    return new Block(preHash, timestamp, nonce, [coinbase, ...transactions]);
  }
}

export const miner = new Miner();
