import { SDK, Auth } from "@infura/sdk";
import { Config } from "../common/config";

const infuraProviderCache: Record<number, SDK> = {};
export function getInfuraProvider(chainId: number) {
  if (infuraProviderCache[chainId]) return infuraProviderCache[chainId];
  return createInfuraProvider(chainId);
}

export function createInfuraProvider(chainId: number) {
  const settings = new Auth({
    projectId: Config.INFURA_PROJECT_ID,
    secretId: Config.INFURA_PROJECT_SECRET,
    chainId,
  });

  const InfuraProvider = new SDK(settings);
  infuraProviderCache[chainId] = InfuraProvider;

  return InfuraProvider;
}
