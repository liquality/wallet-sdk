"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nft = void 0;
const axios_1 = __importDefault(require("axios"));
//END OF THIS WORKS AS EXPECTED
const API_URL = "http://localhost:3001";
exports.nft = {
    async getNfts(address) {
        let url = `${API_URL}/nft/${address}`;
        const result = await axios_1.default.get(url);
        return result.data;
    },
};
//export default nft
