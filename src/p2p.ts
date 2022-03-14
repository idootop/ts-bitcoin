import { Block } from './block';
import { blockChain } from './blockchain';
import { Transaction } from './transaction';
import { Hash, hashObj, printf, UUID } from './utils';

interface Msg {
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

class P2P {
  /**
   * 已知消息（收到的区块或交易消息广播）
   *
   * 同一个区块或交易消息只处理一次
   *
   * todo: 考虑到消息数据量较大，已知消息池应有过期消息清理机制
   */
  knownMsgs: Hash[] = [];

  onReciveMsg(msg: any) {
    const msgHash = hashObj(msg);
    if (this.knownMsgs.includes(msgHash)) {
      // 同一消息只处理一次
      return;
    }
    this.knownMsgs.push(msgHash);
    // todo 中继广播消息到网络其他节点
    if (!knownCommands.includes(msg?.command) || msg.data == undefined) {
      printf(`>>> 未知消息：${msg}`);
      return;
    }
    this.processMsg(msg);
  }

  processMsg(msg: KnownMsgs) {
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
  }
}

export const p2p = new P2P();
