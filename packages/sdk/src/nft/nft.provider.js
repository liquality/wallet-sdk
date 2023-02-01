"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftProvider = void 0;
const alchemy_nft_provider_1 = require("./providers/alchemy-nft.provider");
const base_nft_provider_1 = require("./providers/base-nft.provider");
class NftProvider extends base_nft_provider_1.BaseNftProvider {
    // Get all the NFTs owned by an address
    static async getNfts(owner, chainID) {
        let nfts;
        // Go through each nftProviders until one succeeds.
        for (let i = 0; i < this.nftProviders.length && !nfts; i++) {
            nfts = await this.nftProviders[i].getNfts(owner, chainID);
        }
        return nfts;
    }
    static async getNftType(contractAddress, chainID) {
        // Go through each nftProviders until one succeeds.
        let nftType;
        for (let i = 0; i < this.nftProviders.length && !nftType; i++) {
            nftType = await this.nftProviders[i].getNftType(contractAddress, chainID);
        }
        return nftType;
    }
}
exports.NftProvider = NftProvider;
NftProvider.nftProviders = [alchemy_nft_provider_1.AlchemyNftProvider];
