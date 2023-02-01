"use strict";
exports.__esModule = true;
exports.NftProvider = void 0;
var tslib_1 = require("tslib");
var alchemy_nft_provider_1 = require("./providers/alchemy-nft.provider");
var base_nft_provider_1 = require("./providers/base-nft.provider");
var NftProvider = /** @class */ (function (_super) {
    tslib_1.__extends(NftProvider, _super);
    function NftProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Get all the NFTs owned by an address
    NftProvider.getNfts = function (owner, chainID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nfts, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.nftProviders.length && !nfts)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.nftProviders[i].getNfts(owner, chainID)];
                    case 2:
                        nfts = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, nfts];
                }
            });
        });
    };
    NftProvider.getNftType = function (contractAddress, chainID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nftType, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.nftProviders.length && !nftType)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.nftProviders[i].getNftType(contractAddress, chainID)];
                    case 2:
                        nftType = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, nftType];
                }
            });
        });
    };
    NftProvider.nftProviders = [alchemy_nft_provider_1.AlchemyNftProvider];
    return NftProvider;
}(base_nft_provider_1.BaseNftProvider));
exports.NftProvider = NftProvider;
