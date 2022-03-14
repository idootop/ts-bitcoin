import { Block } from './block';
import { blockChain } from './blockchain';
import { Transaction } from './transaction';
import { printf, UUID } from './utils';

/**
 * 已知命令
 */
const knownCommands = ['Block', 'Transaction'];

export const sendBlockMsg = (block: Block) => {
  // todo
};

export const sendTransationMsg = (transaction: Transaction) => {
  // todo
};

/**
 * 处理消息
 */
export const processMsg = (msg: KnownMsgs) => {
  if (!knownCommands.includes(msg?.command) || msg.data == undefined) {
    printf(`>>> 未知消息：${msg}`);
    return;
  }
  if (msg.command === 'Block') {
    // 收到新区块
    blockChain.addBlocksIfValid([
      new Block(msg.data.preHash, msg.data.timestamp, msg.data.nonce, msg.data.transactions),
    ]);
  } else if (msg.command === 'Transaction') {
    // 收到新交易
    blockChain.transactionPoolManager.addTransaction(
      new Transaction(msg.data.inputs, msg.data.outputs),
    );
  } else {
    printf(`>>> 未处理的消息：${msg}`);
  }
};

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
  extra: any;
  /**
   * 发消息者地址uuid
   */
  sender: string;
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
