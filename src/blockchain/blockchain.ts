import { kGenesisBlock } from '../config';
import { Hash } from '../utils';
import { Block } from './block';
import { ConfirmedDataManager, TransactionPoolManager, UTXOManager } from './managers';
import { validateBlock, validateContinuousBlocks, validatePoW } from './validate';

export class BlockChain {
  constructor() {
    // 初始化区块链状态
    // todo 数据本地持久化
    this.addBlocksIfValid([kGenesisBlock]);
    // todo 在接收新的交易与区块前，先从附近节点同步主链数据
  }

  /**
   * 主链（最长链）
   *
   * 当最新区块产生分叉时，节点总是接受 nonce 值更大的那个区块，并丢掉旧区块
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
   * 通常用于添加新加区块，或同步不同节点之间的主链数据
   *
   * 同步主链区块数据的流程为：
   *
   * 1. 查询临近节点最长的链
   * 2. 查询在最长链上最近的公共节点
   * 3. 同步在最长链上最近的公共节点之后的所有区块（先移除旧块，再添加新块）
   */
  addBlocksIfValid(blocks: Block[]) {
    if (blocks.length < 1) return;
    if (!validateContinuousBlocks(blocks)) {
      // 区块不连续
      return;
    }

    const chain = blockChain.chain;
    const preHash = blocks[0].preHash;
    const preBlockIndex = chain.indexOf(preHash);
    if (preBlockIndex < 0) {
      // 未找到新区块的 preBlock，丢掉更新
      return;
    }

    if (blocks.some((block, idx) => !validatePoW(block, idx + 1 + preBlockIndex + 1))) {
      // 区块不满足 PoW（工作量证明）
      // 可能为某些篡改的非法的区块数据，直接丢掉更新
      return;
    }

    // 如果产生旧的分岔点 (公共区块之后多于1个区块)
    // 通常出现在有节点在离线挖矿，节点重新连接网络后，数据较旧出现冲突
    if (chain.length - 1 - preBlockIndex > 1) {
      const incomingBlocks = blocks.length;
      const mineBlocks = chain.length - 1 - preBlockIndex;
      if (incomingBlocks > mineBlocks) {
        // 同步过来的区块长度更长，我的区块无效（我可能在离线挖矿）
        // 同步区块
        this.removeBlocks(chain[preBlockIndex + 1]);
      } else {
        // 我的区块长度更长，对方区块无效（对方可能在离线挖矿）
        // 丢掉更新
        return;
      }
    } else if (chain.length > 1 && chain[chain.length - 2] === preHash) {
      // 如果产生新的分岔点 (区块的 preHash 为主链上的倒数第二个区块的 hash)
      if (blocks.length === 1) {
        // 同步单个区块
        // 当新区块 nonce 值大于当前最后一个区块时，新区块有效，丢掉旧区块
        if (blocks[0].nonce > blockChain.lastBlock!.nonce) {
          // 新的区块有效，替换掉当前最后一个区块
          this.removeBlocks(chain[chain.length - 1]);
        } else {
          // 新的区块无效，丢掉更新
          return;
        }
      } else {
        // 同步多个区块
        // 我们总是以最长链的数据为准，故完全同步（信任）新区块
        this.removeBlocks(chain[chain.length - 1]);
      }
    }

    for (let idx = 0; idx < blocks.length; idx++) {
      const block = blocks[idx];
      if (!validateBlock(block, idx + 1 + preBlockIndex + 1)) {
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
