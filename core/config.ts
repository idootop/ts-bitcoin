const kCoin = 1000000;
const kCent = 100;
const kCoinbase = 100 * kCoin;

export const config = {
  /**
   * 总币数：100万
   */
  coin: kCoin,
  /**
   * 1 coin = 100 cent
   */
  cent: kCent,
  /**
   * coinbase 奖励 100 coin
   *
   * 单位：cent
   */
  coinbase: kCoinbase,
};
