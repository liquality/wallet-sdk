import { createERC1155Collection, createERC721Collection, getNfts, mintERC1155Token, mintERC721Token, transferNft } from "./nft"

const nft = {
    getNfts,
    transferNft,
    createERC1155Collection,
    createERC721Collection,
    mintERC1155Token,
    mintERC721Token
}

export const sdk =  {nft}

