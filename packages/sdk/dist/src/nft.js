"use strict";
exports.__esModule = true;
exports.nft = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
//END OF THIS WORKS AS EXPECTED
var API_URL = "http://localhost:3001";
exports.nft = {
    getNfts: function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(API_URL, "/nft/").concat(address);
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.data];
                }
            });
        });
    }
};
//export default nft
