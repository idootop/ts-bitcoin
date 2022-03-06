import { Block } from './block';
import { kGenesisBlock, kGenesisBlockHash, kGenesisTransaction } from './config';
import { Output, Transaction } from './transaction';
import { Hash, HashUTXO } from './utils';

// todo 在接收新的交易与区块前，先从附近节点同步主链数据
export class BlockChain {
  constructor() {
    // 初始化主链区块与交易
    this.chain = [kGenesisBlockHash];
    this.confirmedBlocks = {
      genesisBlockHash: kGenesisBlock,
    };
    this.confirmedTransactions = { genesisTransactionHash: kGenesisTransaction };
  }

  /**
   * 主链（最长链）
   *
   * 当最新区块产生分叉时，节点总是接受 nonce 值的 hash 值更大的那个区块，并丢掉旧区块
   */
  chain: Hash[] = [];

  /**
   * 当前链上验证有效的区块
   */
  confirmedBlocks: Record<Hash, Block> = {};

  /**
   * 当前链上验证有效的交易
   */
  confirmedTransactions: Record<Hash, Transaction> = {};

  /**
   * 未花费交易输出
   */
  UTXOs: Record<HashUTXO, Output> = {};

  /**
   * 当前区块链高度
   */
  get height() {
    return this.chain.length;
  }

  /**
   * 最后一个区块
   */
  get lastBlock() {
    const lastBlockHash = this.chain[this.chain.length - 1];
    return this.confirmedBlocks[lastBlockHash];
  }

  /**
   * 添加合法区块
   *
   * 通常用于添加新加区块，或同步不同节点之间的主链数据
   *
   * 同步主链区块数据的流程为：
   *
   * 1. 查询临近节点最长的链
   * 2. 查询在最长链上最近的公共节点
   * 3. 同步在最长链上最近的公共节点之后的所有区块（先移除旧块，再添加新块）
   */
  addBlocksIfValid(block: Block[]) {
    // todo 校验区块合法（交易合法，满足pow，preHash）
    // todo 将合法区块中的合法交易添加到已确认交易中
    // todo 更新UTXO
    // todo 更新交易池（孤儿交易、合法交易）
  }

  /**
   * 移除无效区块
   *
   * 通常在此块之后的区块也需要一并移除
   */
  removeBlocks(blockHash: Hash) {
    // todo 移除旧区块、交易
    // todo 更新UTXO
  }

  /**
   * 查询有效的UTXO
   */
  getUTXO(hashUTXO: HashUTXO): Output | undefined {
    return this.UTXOs[hashUTXO];
  }
}

export const blockChain = new BlockChain();
