import { miner, Wallet } from './application';
import { blockChain } from './blockchain';
import { kPrivteKey, kPublicKey } from './config';
import { p2p } from './network/p2p';
import { printf } from './utils';

/**
 * 我的钱包
 */
export const kMyWallet = new Wallet(kPublicKey, kPrivteKey);

export const main = async () => {
  // 初始化本地区块链状态
  await blockChain.init();
  printf('BlockChain inited');
  // 初始化网络连接，同步主链数据
  await p2p.init();
  printf('P2P Node inited');
  // 开始挖矿🎉
  printf('Start mining');
  await miner.mining();
};

main();
