import { Block } from './block';
import { blockChain } from './blockchain';
import {
  kCoinbaseReward,
  kGenesisBlock,
  kMaxTransactionsPerBlock,
  kMinFeesPerTransaction,
} from './config';
import { Input, Transaction } from './transaction';
import { deepClone, HashUTXO, verifySignature } from './utils';

type TransactionType = 'valid' | 'invalid' | 'orphan';

/**
 * 校验交易是否有效，或为孤儿交易
 *
 * 需满足：
 * 1. 输入为有效的 UTXO（若引用不存在，则为孤儿交易）
 * 2. 输入 <= 输出 （ coinbase 交易除外 ）
 * 3. 输入 - 输出 = 手续费 >= 单笔交易最低手续费
 * 4. 所有输入都能正常解锁对应输出
 */
export const validateTransaction = (transaction: Transaction): TransactionType => {
  // coinbase 交易总是有效
  if (transaction.isCoinbase) {
    return 'valid';
  }
  // 输入或输出不能为空
  if ([transaction.inputs.length, transaction.outputs.length].includes(0)) {
    return 'invalid';
  }

  let inputTotal = 0n;
  let outputTotal = 0n;

  for (const input of transaction.inputs) {
    const utxo = blockChain.utxoManager.getUTXO(input.hashUTXO);
    if (utxo === undefined) {
      // 找不到引用，可能为孤儿交易
      return 'orphan';
    }
    const publicKey = utxo.lockScript;
    const signature = input.unlockScript;
    // 无效的签名
    if (!verifySignature(publicKey, signature)) {
      return 'invalid';
    }
    inputTotal += utxo.value;
  }

  for (const output of transaction.outputs) {
    outputTotal += output.value;
  }

  if (outputTotal > inputTotal) {
    // 输出不能大于输入
    return 'invalid';
  }

  const fees = inputTotal - outputTotal;
  if (fees < kMinFeesPerTransaction) {
    // 单笔交易手续费不能低于 kMinFeesPerTransaction
    return 'invalid';
  }

  return 'valid';
};

/**
 * 校验区块所有交易是否有效
 *
 * 1. 每笔交易（除coinbase）的输入都能正常解锁对应输出
 * 2. 每笔交易（除coinbase）的输入 - 输出 = 手续费 >= 最低手续费
 * 3. coinbase 奖励 coin 与手续费有效
 * 4. 同一区块中可能存在相互引用的交易（除coinbase），所有交易输入对应的UTXO有效
 */
export const validateBlockTransactions = (originTransactions: Transaction[]) => {
  if (originTransactions.length < 1) {
    // 交易不能为空
    return false;
  }
  const [coinbase, ...transactions] = originTransactions;
  if (!coinbase.isCoinbase) {
    // 首笔交易必须为 coinbase
    return false;
  }

  if (transactions.length > kMaxTransactionsPerBlock) {
    // 单个区块中的交易笔数不能超过 kMaxTransactionsPerBlock
    return false;
  }

  const tempUTXOs = deepClone(blockChain.utxoManager.UTXOs);
  coinbase.outputs.forEach((output, outputIndex) => {
    const hashUTXO: HashUTXO = `${coinbase.hash}_${outputIndex}`;
    tempUTXOs[hashUTXO] = output;
  });

  let feesTotal = 0n;
  for (const transaction of transactions) {
    let inputTotal = 0n;
    let outputTotal = 0n;
    // 输入
    for (const input of transaction.inputs) {
      const utxo = tempUTXOs[input.hashUTXO];
      if (utxo === undefined) {
        // 找不到引用的 UTXO
        return;
      }

      const publicKey = utxo.lockScript;
      const signature = input.unlockScript;
      // 无效的签名
      if (!verifySignature(publicKey, signature)) {
        return false;
      }

      inputTotal += utxo.value;
    }
    // 输出
    for (const output of transaction.outputs) {
      outputTotal += output.value;
    }

    if (outputTotal > inputTotal) {
      // 输出不能大于输入
      return false;
    }

    const fees = inputTotal - outputTotal;
    if (fees < kMinFeesPerTransaction) {
      // 单笔交易手续费不能低于 kMinFeesPerTransaction
      return false;
    }

    feesTotal += fees;

    // 从 UTXO 中移除当前交易中的 input
    transaction.inputs.forEach((input) => {
      delete tempUTXOs[input.hashUTXO];
    });
    // 添加新的 UTXO
    transaction.outputs.forEach((output, outputIndex) => {
      const hashUTXO: HashUTXO = `${transaction.hash}_${outputIndex}`;
      tempUTXOs[hashUTXO] = output;
    });
  }

  if (coinbase.outputs[0].value > feesTotal + kCoinbaseReward) {
    // coinbase 的输出值不能大于奖励 + 手续费
    return false;
  }

  return true;
};

/**
 * 校验区块是否有效
 *
 * 1. preHash 为区块链最后一个区块的 hash （创世区块除外）
 * 2. 区块 hash 满足 PoW （工作量证明）
 * 3. 区块所有交易有效
 */
export const validateBlock = (block: Block, height: number) => {
  // 创世区块
  if (blockChain.height === 0 && block === kGenesisBlock) {
    return true;
  }

  if (blockChain.lastBlock!.hash !== block.preHash) {
    // 区块的 preHash 必须为主链上最后一个区块的 hash
    return false;
  }

  if (!validatePoW(block, height)) {
    // 必须满足工作量证明
    return false;
  }

  if (!validateBlockTransactions(block.transactions)) {
    // 所有交易必须有效
    return false;
  }

  return true;
};

/**
 * 区块是否满足 PoW（工作量证明）
 */
export const validatePoW = (block: Block, height: number) => {
  const difficulty = Block.calcDifficulty(height);
  return block.hash.startsWith(''.padEnd(difficulty, '0'));
};

/**
 * 区块是连续的
 */
export const validateContinuousBlocks = (blocks: Block[]) => {
  if (blocks.length < 2) return true;
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].preHash !== blocks[i - 1].hash) {
      return false;
    }
  }
};
