import { Block } from './block';

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
   * 交易的校验hash
   */
  get hash(): string {
    // todo
    return '';
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
       * 这笔UTXO所在交易的hash
       */
      transaction: string;
      /**
       * 这笔UTXO在所在交易的 outputs 中的索引
       */
      outputIndex: number;
    },
  ) {}
}

export class Output {
  constructor(
    /**
     * 价值
     *
     * 单位：cent
     */
    public amount: bigint = 0n,
    /**
     * 锁定脚本，用于验证谁有权利来花费这笔UTXO
     *
     * 通常为接收方账户地址或公钥
     */
    public lockScript: string = '',
  ) {}
}

export class UTXO {
  constructor(
    /**
     * 价值
     *
     * 单位：cent
     */
    public amount: bigint = 0n,
    /**
     * 这笔UTXO的来源
     *
     * 注意：每个 block 的第一笔交易为奖励给矿工的新币，称为 coinbase
     */
    public reference: {
      /**
       * 所在区块
       */
      block: Block;
      /**
       * 所在交易
       */
      transaction: Transaction;
      /**
       * 这笔UTXO在所在交易的 outputs 中的索引
       */
      outputIndex: number;
    },
  ) {}
}
