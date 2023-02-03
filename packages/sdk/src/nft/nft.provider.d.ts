import { BaseNftProvider } from "./providers/base-nft.provider";
import { Nft, NftType } from "./types";
export declare abstract class NftProvider extends BaseNftProvider {
    private static nftProviders;
    static getNfts(owner: string, chainID: number): Promise<Nft[] | null>;
    static getNftType(contractAddress: string, chainID: number): Promise<NftType>;
}
//# sourceMappingURL=nft.provider.d.ts.map