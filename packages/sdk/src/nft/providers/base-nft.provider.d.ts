import { NftType } from "../types";
import { Nft } from "../types";
export declare abstract class BaseNftProvider {
    abstract getNfts(owner: string, chainID: number): Promise<Nft[] | null>;
    abstract getNftType(contractAddress: string, chainID: number): Promise<NftType>;
}
//# sourceMappingURL=base-nft.provider.d.ts.map