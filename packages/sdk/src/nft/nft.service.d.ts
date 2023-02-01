import { CreateERC1155CollectionRequest, CreateERC721CollectionRequest, Nft, TransferRequest } from './types';
import { MintERC1155Request, MintERC721Request } from '../types';
export declare abstract class NftService {
    private static cache;
    static getNfts(owner: string, chainID: number): Promise<Nft[] | null>;
    static transferNft(transferRequest: TransferRequest, chainId: number, pk: string): Promise<string>;
    private static cacheGet;
    static createERC1155Collection({ uri, creator }: CreateERC1155CollectionRequest, chainId: number, pk: string): Promise<string>;
    static mintERC1155Token({ contractAddress, owner, recipient, id, amount }: MintERC1155Request, chainId: number, pk: string): Promise<string>;
    static createERC721Collection({ tokenName, tokenSymbol, creator }: CreateERC721CollectionRequest, chainId: number, pk: string): Promise<string>;
    static mintERC721Token({ contractAddress, owner, recipient, uri }: MintERC721Request, chainId: number, pk: string): Promise<string>;
}
//# sourceMappingURL=nft.service.d.ts.map