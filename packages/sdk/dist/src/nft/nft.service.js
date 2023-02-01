"use strict";
exports.__esModule = true;
exports.NftService = void 0;
var tslib_1 = require("tslib");
var types_1 = require("./types");
var constants_1 = require("@ethersproject/constants");
var nft_provider_1 = require("./nft.provider");
var ethers_1 = require("ethers");
var typechain_types_1 = require("../../typechain-types");
var transaction_service_1 = require("../transaction/transaction.service");
var chain_provider_1 = require("../factory/chain-provider");
var NftService = /** @class */ (function () {
    function NftService() {
    }
    // Get all the NFTs owned by an address
    NftService.getNfts = function (owner, chainID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, nft_provider_1.NftProvider.getNfts(owner, chainID)];
            });
        });
    };
    NftService.transferNft = function (transferRequest, chainId, pk) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddress, owner, receiver, tokenIDs, amounts, _a, schema, contract, tx, data, _b, _contract, _contract, preparedTx;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        contractAddress = transferRequest.contractAddress, owner = transferRequest.owner, receiver = transferRequest.receiver, tokenIDs = transferRequest.tokenIDs, amounts = transferRequest.amounts;
                        return [4 /*yield*/, this.cacheGet(contractAddress, chainId)];
                    case 1:
                        _a = _c.sent(), schema = _a.schema, contract = _a.contract;
                        data = '0x';
                        _b = schema;
                        switch (_b) {
                            case types_1.NftType.ERC721: return [3 /*break*/, 2];
                            case types_1.NftType.ERC1155: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 9];
                    case 2:
                        if (tokenIDs.length !== 1) {
                            throw new Error("ERC 721 transfer supports exactly 1 tokenID, received ".concat(tokenIDs.join()));
                        }
                        _contract = contract;
                        return [4 /*yield*/, _contract.populateTransaction['safeTransferFrom(address,address,uint256)'](owner, receiver, tokenIDs[0])];
                    case 3:
                        tx = _c.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        _contract = contract;
                        if (!(tokenIDs.length > 1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, _contract.populateTransaction.safeBatchTransferFrom(owner, receiver, tokenIDs, amounts, data)];
                    case 5:
                        tx = _c.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, _contract.populateTransaction.safeTransferFrom(owner, receiver, tokenIDs[0], amounts[0], data)];
                    case 7:
                        tx = _c.sent();
                        _c.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        {
                            throw new Error("Unsupported NFT type: ".concat(schema));
                        }
                        _c.label = 10;
                    case 10: return [4 /*yield*/, transaction_service_1.TransactionService.prepareTransaction(tslib_1.__assign(tslib_1.__assign({}, tx), { from: transferRequest.owner, chainId: chainId }), chainId)];
                    case 11:
                        preparedTx = _c.sent();
                        return [4 /*yield*/, new ethers_1.Wallet(pk).sendTransaction(preparedTx)];
                    case 12: return [2 /*return*/, (_c.sent()).hash];
                }
            });
        });
    };
    NftService.cacheGet = function (contractAddress, chainID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nftType, contractFactory;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (NftService.cache[contractAddress]) {
                            return [2 /*return*/, NftService.cache[contractAddress]];
                        }
                        return [4 /*yield*/, nft_provider_1.NftProvider.getNftType(contractAddress, chainID)];
                    case 1:
                        nftType = _a.sent();
                        if (nftType !== types_1.NftType.UNKNOWN) {
                            contractFactory = nftType == types_1.NftType.ERC1155 ? typechain_types_1.LiqERC1155__factory : typechain_types_1.LiqERC721__factory;
                            NftService.cache[contractAddress] = {
                                contract: contractFactory.connect(constants_1.AddressZero, (0, chain_provider_1.getChainProvider)(chainID)).attach(contractAddress),
                                schema: nftType
                            };
                            return [2 /*return*/, NftService.cache[contractAddress]];
                        }
                        throw new Error("".concat(contractAddress, " is not an NFT contract"));
                }
            });
        });
    };
    NftService.createERC1155Collection = function (_a, chainId, pk) {
        var uri = _a.uri, creator = _a.creator;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractFactory, deployTx, preparedTx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contractFactory = new ethers_1.ethers.ContractFactory(typechain_types_1.LiqERC1155__factory.abi, typechain_types_1.LiqERC1155__factory.bytecode);
                        deployTx = contractFactory.getDeployTransaction(uri);
                        return [4 /*yield*/, transaction_service_1.TransactionService.prepareTransaction({
                                data: deployTx.data.toString(),
                                from: creator,
                                chainId: chainId,
                                to: constants_1.AddressZero
                            }, chainId)];
                    case 1:
                        preparedTx = _b.sent();
                        return [4 /*yield*/, new ethers_1.Wallet(pk).sendTransaction(preparedTx)];
                    case 2: return [2 /*return*/, (_b.sent()).hash];
                }
            });
        });
    };
    NftService.mintERC1155Token = function (_a, chainId, pk) {
        var contractAddress = _a.contractAddress, owner = _a.owner, recipient = _a.recipient, id = _a.id, amount = _a.amount;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, data, tx, preparedTx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contract = typechain_types_1.LiqERC1155__factory.connect(constants_1.AddressZero, (0, chain_provider_1.getChainProvider)(chainId)).attach(contractAddress);
                        data = '0x';
                        return [4 /*yield*/, contract.populateTransaction.mint(recipient, id, amount, data)];
                    case 1:
                        tx = _b.sent();
                        return [4 /*yield*/, transaction_service_1.TransactionService.prepareTransaction(tslib_1.__assign(tslib_1.__assign({}, tx), { from: owner, chainId: chainId }), chainId)];
                    case 2:
                        preparedTx = _b.sent();
                        return [4 /*yield*/, new ethers_1.Wallet(pk).sendTransaction(preparedTx)];
                    case 3: return [2 /*return*/, (_b.sent()).hash];
                }
            });
        });
    };
    NftService.createERC721Collection = function (_a, chainId, pk) {
        var tokenName = _a.tokenName, tokenSymbol = _a.tokenSymbol, creator = _a.creator;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractFactory, deployTx, preparedTx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contractFactory = new ethers_1.ethers.ContractFactory(typechain_types_1.LiqERC721__factory.abi, typechain_types_1.LiqERC721__factory.bytecode);
                        deployTx = contractFactory.getDeployTransaction(tokenName, tokenSymbol);
                        return [4 /*yield*/, transaction_service_1.TransactionService.prepareTransaction({
                                data: deployTx.data.toString(),
                                from: creator,
                                chainId: chainId,
                                to: constants_1.AddressZero
                            }, chainId)];
                    case 1:
                        preparedTx = _b.sent();
                        return [4 /*yield*/, new ethers_1.Wallet(pk).sendTransaction(preparedTx)];
                    case 2: return [2 /*return*/, (_b.sent()).hash];
                }
            });
        });
    };
    NftService.mintERC721Token = function (_a, chainId, pk) {
        var contractAddress = _a.contractAddress, owner = _a.owner, recipient = _a.recipient, uri = _a.uri;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, tx, preparedTx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contract = typechain_types_1.LiqERC721__factory.connect(constants_1.AddressZero, (0, chain_provider_1.getChainProvider)(chainId)).attach(contractAddress);
                        return [4 /*yield*/, contract.populateTransaction.safeMint(recipient, uri)];
                    case 1:
                        tx = _b.sent();
                        return [4 /*yield*/, transaction_service_1.TransactionService.prepareTransaction(tslib_1.__assign(tslib_1.__assign({}, tx), { from: owner, chainId: chainId }), chainId)];
                    case 2:
                        preparedTx = _b.sent();
                        return [4 /*yield*/, new ethers_1.Wallet(pk).sendTransaction(preparedTx)];
                    case 3: return [2 /*return*/, (_b.sent()).hash];
                }
            });
        });
    };
    NftService.cache = {};
    return NftService;
}());
exports.NftService = NftService;
