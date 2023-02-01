"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemyNftProvider = void 0;
const alchemy_sdk_1 = require("alchemy-sdk");
const alchemy_provider_1 = require("../../factory/alchemy-provider");
const types_1 = require("../types");
const base_nft_provider_1 = require("./base-nft.provider");
class AlchemyNftProvider extends base_nft_provider_1.BaseNftProvider {
    constructor() {
        super();
    }
    static async getNfts(owner, chainID) {
        try {
            const alchemy = (0, alchemy_provider_1.getAlchemyProvider)(chainID);
            const nfts = (await alchemy.nft.getNftsForOwner(owner)).ownedNfts;
            return nfts.map((nft) => {
                return {
                    id: nft.tokenId,
                    contract: {
                        address: nft.contract.address,
                        name: nft.contract.name || '',
                        symbol: nft.contract.symbol || '',
                        type: this.extractNftType(nft.tokenType) || undefined,
                    },
                    metadata: {
                        name: nft.rawMetadata.name || '',
                        description: nft.rawMetadata.description || '',
                        image: nft.rawMetadata.image || '',
                    },
                    balance: this.isERC1155(nft) ? nft.balance : undefined,
                };
            });
        }
        catch (error) {
            return null;
        }
    }
    static async getNftType(contractAddress, chainID) {
        const alchemy = (0, alchemy_provider_1.getAlchemyProvider)(chainID);
        const nft = await alchemy.nft.getContractMetadata(contractAddress);
        return this.extractNftType(nft.tokenType);
    }
    static extractNftType(alchemyNftType) {
        if (alchemyNftType === alchemy_sdk_1.NftTokenType.ERC1155)
            return types_1.NftType.ERC1155;
        else if (alchemyNftType === alchemy_sdk_1.NftTokenType.ERC721)
            return types_1.NftType.ERC721;
        else
            return types_1.NftType.UNKNOWN;
    }
    static isERC1155(nft) {
        return nft.contract.tokenType === alchemy_sdk_1.NftTokenType.ERC1155;
    }
}
exports.AlchemyNftProvider = AlchemyNftProvider;
