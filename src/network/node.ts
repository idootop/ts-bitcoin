import { Block } from '../blockchain/block';
import { Transaction } from '../blockchain/transaction';
import { Msg } from './message';
import { p2p } from './p2p';

export class P2PNode {
  constructor(public address: string) {}

  /**
   * 向当前节点发送消息
   *
   * todo 当本地在线节点列表为空时，添加消息至发送队列，当连接节点数量超过安全值后，再按顺序广播暂存的消息。
   */
  sendMsg = (msg: Msg) => {
    msg.sender = p2p.address;
    // todo 发送消息
    // todo 发消息失败
    const sendFailed = false;
    if (sendFailed) {
      p2p.removeNodeIfOffline(this.address);
    }
  };

  /**
   * 向当前节点发送区块消息
   */
  sendBlockMsg = (block: Block) => {
    this.sendMsg({
      command: 'Block',
      data: block,
    });
  };

  /**
   * 向当前节点发送交易消息
   */
  sendTransationMsg = (transaction: Transaction) => {
    this.sendMsg({
      command: 'Transation',
      data: transaction,
    });
  };
}
