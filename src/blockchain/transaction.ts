import { kCoinbaseInputHash, kCoinbaseUnlockScript } from '../config';
import { hashObj, HashUTXO, printf, uuid } from '../utils';

export class Transaction {
  constructor(
    /**
     * 交易输入
     *
     * 所需的UTXO（未花费输出）
     */
    public inputs: Input[] = [],
    /**
     * 交易输出
     *
     * 产出的UTXO（未花费输出）
     */
    public outputs: Output[] = [],
  ) {}

  /**
   * 创建 coinbase 交易
   * @param reward 奖励，单位：cent
   * @param fees 手续费，单位：cent
   * @param lockScript 锁定脚本（矿工公钥）
   * @returns
   */
  static coinbase(reward: bigint, fees: bigint, lockScript: string) {
    return new Transaction(
      [new Input(kCoinbaseUnlockScript + uuid())],
      [new Output(reward + fees, lockScript)],
    );
  }

  /**
   * 交易的校验hash
   */
  get hash() {
    return hashObj(this);
  }

  /**
   * 是否为coinbase交易
   */
  get isCoinbase() {
    return (
      this.inputs.length === 1 &&
      this.outputs.length === 1 &&
      this.inputs[0].reference === undefined &&
      this.inputs[0].unlockScript.startsWith(kCoinbaseUnlockScript)
    );
  }

  /**
   * 获取交易输出引用
   *
   */
  getOutput(outputIndex: number) {
    return this.outputs[outputIndex];
  }
}

export class Input {
  constructor(
    /**
     * 解锁脚本，用于证明自己有权利来花费这笔UTXO
     *
     * 通常为使用者私钥签名
     */
    public unlockScript: string = '',
    /**
     * 这笔UTXO的来源
     *
     * 注意：每个 block 的第一笔交易为奖励给矿工的新币，称为 coinbase
     *
     * 此交易 input 中的 reference 为空，unlockScript 可以是任意数据（coinbase）
     */
    public reference?: {
      /**
       * UTXO所在交易的hash
       */
      transactionHash: string;
      /**
       * UTXO在所在交易的 outputs 中的索引
       */
      outputIndex: number;
    },
  ) {}

  get hashUTXO(): HashUTXO {
    return this.reference === undefined
      ? (kCoinbaseInputHash as any)
      : `${this.reference.transactionHash}_${this.reference.outputIndex}`;
  }
}

export class Output {
  constructor(
    /**
     * 价值
     *
     * 单位：cent
     */
    public value: bigint = 0n,
    /**
     * 锁定脚本，用于验证谁有权利来花费这笔UTXO
     *
     * 通常为接收方账户地址或公钥
     */
    public lockScript: string = '',
  ) {}
}
