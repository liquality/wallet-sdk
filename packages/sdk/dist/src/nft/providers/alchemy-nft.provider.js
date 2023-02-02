"use strict";
exports.__esModule = true;
exports.AlchemyNftProvider = void 0;
var tslib_1 = require("tslib");
var alchemy_sdk_1 = require("alchemy-sdk");
var alchemy_provider_1 = require("../../factory/alchemy-provider");
var types_1 = require("../types");
var base_nft_provider_1 = require("./base-nft.provider");
var AlchemyNftProvider = /** @class */ (function (_super) {
    tslib_1.__extends(AlchemyNftProvider, _super);
    function AlchemyNftProvider() {
        return _super.call(this) || this;
    }
    AlchemyNftProvider.getNfts = function (owner, chainID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alchemy, nfts, error_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        alchemy = (0, alchemy_provider_1.getAlchemyProvider)(chainID);
                        return [4 /*yield*/, alchemy.nft.getNftsForOwner(owner)];
                    case 1:
                        nfts = (_a.sent()).ownedNfts;
                        return [2 /*return*/, nfts.map(function (nft) {
                                return {
                                    id: nft.tokenId,
                                    contract: {
                                        address: nft.contract.address,
                                        name: nft.contract.name || '',
                                        symbol: nft.contract.symbol || '',
                                        type: _this.extractNftType(nft.tokenType) || undefined
                                    },
                                    metadata: {
                                        name: nft.rawMetadata.name || '',
                                        description: nft.rawMetadata.description || '',
                                        image: nft.rawMetadata.image || ''
                                    },
                                    balance: _this.isERC1155(nft) ? nft.balance : undefined
                                };
                            })];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AlchemyNftProvider.getNftType = function (contractAddress, chainID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alchemy, nft;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alchemy = (0, alchemy_provider_1.getAlchemyProvider)(chainID);
                        return [4 /*yield*/, alchemy.nft.getContractMetadata(contractAddress)];
                    case 1:
                        nft = _a.sent();
                        return [2 /*return*/, this.extractNftType(nft.tokenType)];
                }
            });
        });
    };
    AlchemyNftProvider.extractNftType = function (alchemyNftType) {
        if (alchemyNftType === alchemy_sdk_1.NftTokenType.ERC1155)
            return types_1.NftType.ERC1155;
        else if (alchemyNftType === alchemy_sdk_1.NftTokenType.ERC721)
            return types_1.NftType.ERC721;
        else
            return types_1.NftType.UNKNOWN;
    };
    AlchemyNftProvider.isERC1155 = function (nft) {
        return nft.contract.tokenType === alchemy_sdk_1.NftTokenType.ERC1155;
    };
    return AlchemyNftProvider;
}(base_nft_provider_1.BaseNftProvider));
exports.AlchemyNftProvider = AlchemyNftProvider;
