import { blockChain } from '../blockchain/blockchain';
import { Input, Output, Transaction } from '../blockchain/transaction';
import { p2p } from '../network/p2p';
import { createKeyPair, createSignature, printf, verifySignature } from '../utils';

interface Billing {
  type: 'income' | 'expenditure';
  transaction: Transaction;
}

export class Wallet {
  constructor(public publicKey?: string, public privateKey?: string) {
    if ([publicKey, privateKey].includes(undefined)) {
      const keypair = createKeyPair();
      this.privateKey = keypair.privateKey;
      this.publicKey = keypair.publicKey;
    }
  }

  /**
   * 查询钱包余额（单位：cent）
   *
   * @publicKey 为空时，查询当前区块链总价值量
   */
  static getBalance(publicKey?: string) {
    const isMineUTXO = (utxo: Output) => publicKey === undefined || publicKey === utxo.lockScript;
    let balance = 0n;
    // 遍历当前区块链上有效的UTXOs
    for (const [_, utxo] of Object.entries(blockChain.utxoManager.UTXOs)) {
      if (isMineUTXO(utxo)) {
        balance += utxo.value;
      }
    }
    return balance;
  }

  /**
   * 查询收支账单
   */
  static getBilling(wallet: Wallet): Billing[] {
    const { privateKey, publicKey } = wallet;
    const billing: Billing[] = [];
    for (const [_, transaction] of Object.entries(
      blockChain.confirmedDataManager.confirmedTransactions,
    )) {
      const isExpenditure = transaction.inputs.some((input: any) =>
        verifySignature(privateKey!, input.unlockScript),
      );
      if (isExpenditure) {
        // 支出
        billing.push({ type: 'expenditure', transaction: transaction });
        continue;
      }
      const isIncome = transaction.outputs.some((output: any) => publicKey === output.lockScript);
      if (isIncome) {
        // 收入
        billing.push({ type: 'income', transaction: transaction });
      }
    }
    return billing;
  }

  /**
   * 支付/转账
   */
  sendMoney(value: bigint, receiverPublicKey: string): boolean {
    const isMineUTXO = (utxo: Output) => this.publicKey === utxo.lockScript;
    let balance = 0n;
    const inputs: Input[] = [];
    // 遍历当前区块链上有效的UTXOs
    for (const [hash, utxo] of Object.entries(blockChain.utxoManager.UTXOs)) {
      if (isMineUTXO(utxo)) {
        balance += utxo.value;
        const reference = {
          transactionHash: hash.split('_')[0],
          outputIndex: parseInt(hash.split('_')[1], 10),
        };
        inputs.push(new Input(createSignature(this.privateKey!, hash), reference));
        if (balance >= value) break;
      }
    }
    if (balance < value) {
      printf(`>>> 转账至${receiverPublicKey}：余额不足，所需${value}，余额${balance}`);
      return false;
    }
    const outputs =
      balance === value
        ? [new Output(value, receiverPublicKey)]
        : [new Output(value, receiverPublicKey), new Output(balance - value, receiverPublicKey)];
    // 创建交易
    const transaction = new Transaction(inputs, outputs);
    // 广播到网络
    p2p.brodcastTransationMsg(transaction);
    printf(`>>> 转账至${receiverPublicKey}：交易已创建，等待确认`);
    return true;
  }
}
