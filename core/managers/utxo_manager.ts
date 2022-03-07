import { Block } from '../block';
import { BlockManager } from '../block';
import { Output } from '../transaction';
import { HashUTXO } from '../utils';

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
   * todo 当链上添加区块
   */
  onAddBlocks(blocks: Block[]): void {
    throw new Error('Method not implemented.');
  }

  /**
   * todo 当链上移除区块
   */
  onRemoveBlocks(blocks: Block[]): void {
    throw new Error('Method not implemented.');
  }
}
