"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
const types_1 = require("./types");
const constants_1 = require("@ethersproject/constants");
const nft_provider_1 = require("./nft.provider");
const ethers_1 = require("ethers");
const typechain_types_1 = require("../../typechain-types");
const transaction_service_1 = require("../transaction/transaction.service");
const chain_provider_1 = require("../factory/chain-provider");
class NftService {
    // Get all the NFTs owned by an address
    static async getNfts(owner, chainID) {
        return nft_provider_1.NftProvider.getNfts(owner, chainID);
    }
    static async transferNft(transferRequest, chainId, pk) {
        const { contractAddress, owner, receiver, tokenIDs, amounts } = transferRequest;
        const { schema, contract } = await this.cacheGet(contractAddress, chainId);
        let tx;
        const data = '0x';
        switch (schema) {
            case types_1.NftType.ERC721: {
                if (tokenIDs.length !== 1) {
                    throw new Error(`ERC 721 transfer supports exactly 1 tokenID, received ${tokenIDs.join()}`);
                }
                const _contract = contract;
                tx = await _contract.populateTransaction['safeTransferFrom(address,address,uint256)'](owner, receiver, tokenIDs[0]);
                break;
            }
            case types_1.NftType.ERC1155: {
                const _contract = contract;
                if (tokenIDs.length > 1) {
                    tx = await _contract.populateTransaction.safeBatchTransferFrom(owner, receiver, tokenIDs, amounts, data);
                }
                else {
                    tx = await _contract.populateTransaction.safeTransferFrom(owner, receiver, tokenIDs[0], amounts[0], data);
                }
                break;
            }
            default: {
                throw new Error(`Unsupported NFT type: ${schema}`);
            }
        }
        const preparedTx = await transaction_service_1.TransactionService.prepareTransaction(Object.assign(Object.assign({}, tx), { from: transferRequest.owner, chainId }), chainId);
        return (await new ethers_1.Wallet(pk).sendTransaction(preparedTx)).hash;
    }
    static async cacheGet(contractAddress, chainID) {
        if (NftService.cache[contractAddress]) {
            return NftService.cache[contractAddress];
        }
        const nftType = await nft_provider_1.NftProvider.getNftType(contractAddress, chainID);
        if (nftType !== types_1.NftType.UNKNOWN) {
            const contractFactory = nftType == types_1.NftType.ERC1155 ? typechain_types_1.LiqERC1155__factory : typechain_types_1.LiqERC721__factory;
            NftService.cache[contractAddress] = {
                contract: contractFactory.connect(constants_1.AddressZero, (0, chain_provider_1.getChainProvider)(chainID)).attach(contractAddress),
                schema: nftType,
            };
            return NftService.cache[contractAddress];
        }
        throw new Error(`${contractAddress} is not an NFT contract`);
    }
    static async createERC1155Collection({ uri, creator }, chainId, pk) {
        const contractFactory = new ethers_1.ethers.ContractFactory(typechain_types_1.LiqERC1155__factory.abi, typechain_types_1.LiqERC1155__factory.bytecode);
        const deployTx = contractFactory.getDeployTransaction(uri);
        const preparedTx = await transaction_service_1.TransactionService.prepareTransaction({
            data: deployTx.data.toString(),
            from: creator,
            chainId,
            to: constants_1.AddressZero,
        }, chainId);
        return (await new ethers_1.Wallet(pk).sendTransaction(preparedTx)).hash;
    }
    static async mintERC1155Token({ contractAddress, owner, recipient, id, amount }, chainId, pk) {
        const contract = typechain_types_1.LiqERC1155__factory.connect(constants_1.AddressZero, (0, chain_provider_1.getChainProvider)(chainId)).attach(contractAddress);
        const data = '0x';
        const tx = await contract.populateTransaction.mint(recipient, id, amount, data);
        const preparedTx = await transaction_service_1.TransactionService.prepareTransaction(Object.assign(Object.assign({}, tx), { from: owner, chainId }), chainId);
        return (await new ethers_1.Wallet(pk).sendTransaction(preparedTx)).hash;
    }
    static async createERC721Collection({ tokenName, tokenSymbol, creator }, chainId, pk) {
        const contractFactory = new ethers_1.ethers.ContractFactory(typechain_types_1.LiqERC721__factory.abi, typechain_types_1.LiqERC721__factory.bytecode);
        const deployTx = contractFactory.getDeployTransaction(tokenName, tokenSymbol);
        const preparedTx = await transaction_service_1.TransactionService.prepareTransaction({
            data: deployTx.data.toString(),
            from: creator,
            chainId,
            to: constants_1.AddressZero,
        }, chainId);
        return (await new ethers_1.Wallet(pk).sendTransaction(preparedTx)).hash;
    }
    static async mintERC721Token({ contractAddress, owner, recipient, uri }, chainId, pk) {
        const contract = typechain_types_1.LiqERC721__factory.connect(constants_1.AddressZero, (0, chain_provider_1.getChainProvider)(chainId)).attach(contractAddress);
        const tx = await contract.populateTransaction.safeMint(recipient, uri);
        const preparedTx = await transaction_service_1.TransactionService.prepareTransaction(Object.assign(Object.assign({}, tx), { from: owner, chainId }), chainId);
        return (await new ethers_1.Wallet(pk).sendTransaction(preparedTx)).hash;
    }
}
exports.NftService = NftService;
NftService.cache = {};
