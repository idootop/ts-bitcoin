import { Block } from '../blockchain/block';
import { Transaction } from '../blockchain/transaction';
import { Hash, hashObj, removeWhere, uuid } from '../utils';
import { Msg, processRecivedMsg } from './message';
import { P2PNode } from './node';

class P2P {
  constructor(public address = uuid()) {}

  async init() {
    this.fetchNodes();
    // todo 连接节点
    // todo 同步主链数据
    // todo 初始化完毕，开始接收并处理区块，交易消息广播
  }

  /**
   * 已知消息（收到的区块或交易消息广播）
   *
   * 同一个区块或交易消息只处理一次
   *
   * todo: 考虑到消息数据量较大，已知消息池应有过期消息清理机制
   */
  knownMsgs: Hash[] = [];

  /**
   * 已知节点
   */
  nodes: P2PNode[] = [];

  /**
   * 广播区块消息
   */
  brodcastBlockMsg = (block: Block) => {
    this.nodes.forEach((node) => {
      node.sendBlockMsg(block);
    });
  };

  /**
   * 广播交易消息
   */
  brodcastTransationMsg = (transaction: Transaction) => {
    this.nodes.forEach((node) => {
      node.sendTransationMsg(transaction);
    });
  };

  /**
   * 中继消息
   */
  relayMsg(msg: Msg) {
    this.nodes.forEach((node) => {
      if (node.address !== msg.sender) {
        node.sendMsg(msg);
      }
    });
  }

  /**
   * 收到新消息
   */
  onReciveMsg(msg: any) {
    this.addNodeIfOnline(msg.sender);
    const msgHash = hashObj({ data: msg?.data });
    if (this.knownMsgs.includes(msgHash)) {
      // 同一消息只处理一次
      return;
    }
    this.knownMsgs.push(msgHash);
    // 中继广播消息到网络其他节点
    this.relayMsg(msg);
    // 处理对应类型的消息
    processRecivedMsg(msg);
  }

  /**
   * 向主网查询已知节点
   */
  async fetchNodes() {
    // todo 向主网查询已知节点并更新到本地
  }

  /**
   * 添加节点至本地
   *
   * 如果节点不在本地节点列表中且在线，则添加节点至本地
   */
  addNodeIfOnline(address?: string) {
    if (address === undefined) return;
    const isKnownNode = this.nodes.map((node) => node.address).includes(address);
    if (isKnownNode) return;
    // todo 判断是否在线
    const isOnline = true;
    if (isOnline) {
      this.nodes.push(new P2PNode(address));
    }
  }

  /**
   * 删除本地节点
   *
   * 如果节点下线，则从本地节点列表中移除
   */
  removeNodeIfOffline(address: string) {
    // todo 判断是否下线
    const isOffline = true;
    if (isOffline) {
      removeWhere(this.nodes, (node) => node.address === address);
    }
  }
}

export const p2p = new P2P();
