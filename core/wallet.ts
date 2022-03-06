import { blockChain } from './blockchain';
import { Output } from './transaction';
import { createKeyPair } from './utils';

export class Wallet {
  constructor(public publicKey?: string, public privateKey?: string) {
    if ([publicKey, privateKey].includes(undefined)) {
      const keypair = createKeyPair();
      this.privateKey = keypair.privateKey;
      this.publicKey = keypair.publicKey;
    }
  }

  /**
   * 查询钱包余额
   */
  static getBalance(publicKey: string) {
    const isMineUTXO = (utxo: Output) => publicKey === utxo.lockScript;
    let balance = 0n;
    // 遍历当前区块链上有效的UTXOs
    for (const [_, utxo] of Object.entries(blockChain.UTXOs)) {
      if (isMineUTXO(utxo)) {
        balance += utxo.value;
      }
    }
    return balance;
  }

  /**
   * 查询收支账单
   */
  static getBilling(publicKey: string) {
    // todo
  }

  /**
   * 支付/转账
   */
  sendMoney(value: bigint, receiverPublicKey: string) {
    // todo 创建交易，广播到网络
  }
}
