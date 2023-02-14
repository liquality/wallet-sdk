import { random } from "lodash";
import BigNumber from "bignumber.js";
import { ERC20, ERC20__factory } from "../../typechain-types";
import { AddressZero } from "@ethersproject/constants";
import { getChainProvider } from "../factory/chain-provider";

export async function withInterval<T>(
  func: () => Promise<T | undefined>
): Promise<T> {
  const updates = await func();
  if (updates) {
    return updates;
  }
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const updates = await func();
      if (updates) {
        clearInterval(interval);
        resolve(updates);
      }
    }, random(15000, 30000));
  });
}
