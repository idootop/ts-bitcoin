export interface Block {
  /**
   * 上一区块的hash
   */
  preHash: string;
  /**
   * 创建时间戳
   */
  timestamp: number;
  /**
   * PoW（工作量证明）难度
   */
  difficulty: number;
  /**
   * 随机数
   */
  nonce: number;
  /**
   * 当前块所确认的所有交易的校验hash
   */
  checksum: string;
  /**
   * 当前块所确认的所有交易
   */
  transactions: Transaction[];
}

export interface Transaction {
  /**
   * 交易的校验hash
   */
  hash: string;
  /**
   * 交易输入
   *
   * 所需的UTXO（未花费输出）
   */
  inputs: TxIn[];
  /**
   * 交易输出
   *
   * 产出的UTXO（未花费输出）
   */
  outputs: TxOut[];
}

export interface TxIn {
  /**
   * 这笔UTXO的来源
   *
   * 注意：每个 block 的第一笔交易为奖励给矿工的新币，称为 coinbase
   *
   * 此交易 input 中的 reference 为空，unlockScript 可以是任意数据（coinbase）
   */
  reference?: {
    /**
     * 这笔UTXO所在交易hash
     */
    txHash: string;
    /**
     * 这笔UTXO在当前交易 outputs 中的索引
     */
    idx: number;
  };
  /**
   * 解锁脚本，用于证明使用者有权利来花费这笔UTXO
   */
  unlockScript: string;
}

export interface TxOut {
  /**
   * 价值
   *
   * 单位：cent
   */
  value: number;
  /**
   * 锁定脚本，用于验证谁有权利来花费这笔UTXO
   */
  lockScript: string;
}
