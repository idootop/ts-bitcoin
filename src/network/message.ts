import { Block } from '../blockchain/block';
import { blockChain } from '../blockchain/blockchain';
import { Transaction } from '../blockchain/transaction';
import { printf, UUID } from '../utils';

export interface Msg {
  /**
   * 命令
   */
  command: string;
  /**
   * 数据或uuid（command msg）
   */
  data: any;
  /**
   * command 消息的附加数据
   */
  extra?: any;
  /**
   * 发消息者地址uuid
   */
  sender?: string;
}

interface BlockMsg extends Msg {
  command: 'Block';
  data: Block;
}

interface TransactionMsg extends Msg {
  command: 'Transaction';
  data: Transaction;
}

interface CommandMsg<T extends string> extends Msg {
  command: T;
  data: UUID;
}

type KnownMsgs = BlockMsg | TransactionMsg | CommandMsg<'getBlocks'>;

/**
 * 已知命令
 */
const knownCommands = ['Block', 'Transaction'];

/**
 * 处理收到的消息
 */
export const processRecivedMsg = (msg: KnownMsgs) => {
  if (!knownCommands.includes(msg?.command) || msg.data == undefined) {
    printf(`>>> 未知消息：${msg}`);
    return;
  }
  switch (msg.command) {
    case 'Block':
      // 收到新区块
      blockChain.addBlocksIfValid([
        new Block(msg.data.preHash, msg.data.timestamp, msg.data.nonce, msg.data.transactions),
      ]);
      break;
    case 'Transaction':
      // 收到新交易
      blockChain.transactionPoolManager.addTransaction(
        new Transaction(msg.data.inputs, msg.data.outputs),
      );
      break;
    default:
      printf(`>>> 未处理的消息：${msg}`);
  }
};
