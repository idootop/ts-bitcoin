import { Msg, processMsg } from './msg';
import { Hash, hashObj, uuid } from './utils';

class P2P {
  constructor(public address = uuid()) {
    this.fetchNodes();
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
  nodes: string[] = [];

  /**
   * 查询节点
   */
  async fetchNodes() {
    // todo
  }

  /**
   * 向指定节点发送消息
   *
   * todo 检查节点是否联通正常，节点下线时应从nodes列表中移除
   */
  sendMsg2Node(msg: Msg, node: string) {
    msg.sender = this.address;
    // todo
  }

  /**
   * 向每个节点发送消息
   */
  sendMsg(msg: Msg) {
    this.nodes.forEach((node) => {
      this.sendMsg2Node(msg, node);
    });
  }

  /**
   * 中继消息
   */
  relayMsg(msg: Msg) {
    this.nodes.forEach((node) => {
      if (node !== msg.sender) {
        this.sendMsg2Node(msg, node);
      }
    });
  }

  onReciveMsg(msg: any) {
    const msgHash = hashObj({ data: msg?.data });
    if (this.knownMsgs.includes(msgHash)) {
      // 同一消息只处理一次
      return;
    }
    this.knownMsgs.push(msgHash);
    // 中继广播消息到网络其他节点
    this.relayMsg(msg);
    // 处理对应类型的消息
    processMsg(msg);
  }
}

export const p2p = new P2P();
