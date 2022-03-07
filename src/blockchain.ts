import { Block } from './block';
import { kGenesisBlock } from './config';
import { ConfirmedDataManager, TransactionPoolManager, UTXOManager } from './managers';
import { Hash } from './utils';
import { validateBlock, validateContinuousBlocks } from './validate';

// todo 在接收新的交易与区块前，先从附近节点同步主链数据
export class BlockChain {
  constructor() {
    // todo 初始化主链区块与交易 addGenesisBlock
    this.addBlocksIfValid([kGenesisBlock]);
  }

  /**
   * 主链（最长链）
   *
   * 当最新区块产生分叉时，节点总是接受 nonce 值的 hash 值更大的那个区块，并丢掉旧区块
   */
  chain: Hash[] = [];

  /**
   * 交易池管理者
   *
   * 孤儿交易 + 合法交易
   */
  transactionPoolManager: TransactionPoolManager = new TransactionPoolManager();

  /**
   * UTXO(未花费交易输出)管理者
   */
  utxoManager: UTXOManager = new UTXOManager();

  /**
   * 链上已确认数据管理者
   *
   * 当前链上已确认的区块 + 交易
   */
  confirmedDataManager: ConfirmedDataManager = new ConfirmedDataManager();

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
    return this.confirmedDataManager.getBlock(lastBlockHash);
  }

  /**
   * 添加合法区块
   *
   * blocks 应该在当前 chain 后连续
   *
   * 通常用于添加新加区块，或同步不同节点之间的主链数据
   *
   * 同步主链区块数据的流程为：
   *
   * 1. 查询临近节点最长的链
   * 2. 查询在最长链上最近的公共节点
   * 3. 同步在最长链上最近的公共节点之后的所有区块（先移除旧块，再添加新块）
   */
  addBlocksIfValid(blocks: Block[]) {
    if (
      this.lastBlock !== undefined && // 不是创始区块
      !validateContinuousBlocks([this.lastBlock, ...blocks])
    ) {
      // 在当前 chain 后不连续
      return;
    }

    // todo 如果产生分歧点？先移除顶部区块，然后更新新区块。考虑单个新区块和多个新区块情况。

    for (const block of blocks) {
      if (!validateBlock(block)) {
        // 遇到无效区块，终止添加后续区块
        return;
      }
      // 添加区块（hash）、交易
      this.confirmedDataManager.addBlock(block);
      // 更新UTXO
      this.utxoManager.addBlock(block);
      // 更新交易池（孤儿交易、有效交易）
      this.transactionPoolManager.addBlock(block);
    }
  }

  /**
   * 移除无效区块
   *
   * 通常在此块之后的区块也需要一并移除
   */
  removeBlocks(blockHash: Hash) {
    const blockIndex = this.chain.indexOf(blockHash);
    if (blockIndex < 0) {
      // 目标区块不存在
      return;
    }

    // 待移除区块
    const needRemoveBlocks = this.chain
      .slice(blockIndex, this.height - 1)
      .map((hash) => this.confirmedDataManager.getBlock(hash)!);

    // 倒序移除区块
    for (const block of needRemoveBlocks.reverse()) {
      // 移除区块（hash）、交易
      this.confirmedDataManager.removeBlock(block);
      // 更新UTXO
      this.utxoManager.removeBlock(block);
      // 更新交易池（孤儿交易、有效交易）
      this.transactionPoolManager.removeBlock(block);
    }
  }
}

export const blockChain = new BlockChain();
