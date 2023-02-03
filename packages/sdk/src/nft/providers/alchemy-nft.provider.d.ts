import { Nft, NftType } from '../types';
import { BaseNftProvider } from './base-nft.provider';
export declare abstract class AlchemyNftProvider extends BaseNftProvider {
    constructor();
    static getNfts(owner: string, chainID: number): Promise<Nft[] | null>;
    static getNftType(contractAddress: string, chainID: number): Promise<NftType>;
    private static extractNftType;
    private static isERC1155;
}
//# sourceMappingURL=alchemy-nft.provider.d.ts.map