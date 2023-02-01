"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiqERC721__factory = exports.LiqERC1155__factory = exports.IERC165__factory = exports.ERC165__factory = exports.IERC721Receiver__factory = exports.IERC721__factory = exports.IERC721Metadata__factory = exports.ERC721URIStorage__factory = exports.ERC721Burnable__factory = exports.ERC721__factory = exports.IERC1155Receiver__factory = exports.IERC1155__factory = exports.IERC1155MetadataURI__factory = exports.ERC1155Burnable__factory = exports.ERC1155__factory = exports.Pausable__factory = exports.Ownable__factory = exports.factories = void 0;
exports.factories = __importStar(require("./factories"));
var Ownable__factory_1 = require("./factories/@openzeppelin/contracts/access/Ownable__factory");
Object.defineProperty(exports, "Ownable__factory", { enumerable: true, get: function () { return Ownable__factory_1.Ownable__factory; } });
var Pausable__factory_1 = require("./factories/@openzeppelin/contracts/security/Pausable__factory");
Object.defineProperty(exports, "Pausable__factory", { enumerable: true, get: function () { return Pausable__factory_1.Pausable__factory; } });
var ERC1155__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/ERC1155__factory");
Object.defineProperty(exports, "ERC1155__factory", { enumerable: true, get: function () { return ERC1155__factory_1.ERC1155__factory; } });
var ERC1155Burnable__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable__factory");
Object.defineProperty(exports, "ERC1155Burnable__factory", { enumerable: true, get: function () { return ERC1155Burnable__factory_1.ERC1155Burnable__factory; } });
var IERC1155MetadataURI__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI__factory");
Object.defineProperty(exports, "IERC1155MetadataURI__factory", { enumerable: true, get: function () { return IERC1155MetadataURI__factory_1.IERC1155MetadataURI__factory; } });
var IERC1155__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/IERC1155__factory");
Object.defineProperty(exports, "IERC1155__factory", { enumerable: true, get: function () { return IERC1155__factory_1.IERC1155__factory; } });
var IERC1155Receiver__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/IERC1155Receiver__factory");
Object.defineProperty(exports, "IERC1155Receiver__factory", { enumerable: true, get: function () { return IERC1155Receiver__factory_1.IERC1155Receiver__factory; } });
var ERC721__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/ERC721__factory");
Object.defineProperty(exports, "ERC721__factory", { enumerable: true, get: function () { return ERC721__factory_1.ERC721__factory; } });
var ERC721Burnable__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable__factory");
Object.defineProperty(exports, "ERC721Burnable__factory", { enumerable: true, get: function () { return ERC721Burnable__factory_1.ERC721Burnable__factory; } });
var ERC721URIStorage__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage__factory");
Object.defineProperty(exports, "ERC721URIStorage__factory", { enumerable: true, get: function () { return ERC721URIStorage__factory_1.ERC721URIStorage__factory; } });
var IERC721Metadata__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata__factory");
Object.defineProperty(exports, "IERC721Metadata__factory", { enumerable: true, get: function () { return IERC721Metadata__factory_1.IERC721Metadata__factory; } });
var IERC721__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/IERC721__factory");
Object.defineProperty(exports, "IERC721__factory", { enumerable: true, get: function () { return IERC721__factory_1.IERC721__factory; } });
var IERC721Receiver__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/IERC721Receiver__factory");
Object.defineProperty(exports, "IERC721Receiver__factory", { enumerable: true, get: function () { return IERC721Receiver__factory_1.IERC721Receiver__factory; } });
var ERC165__factory_1 = require("./factories/@openzeppelin/contracts/utils/introspection/ERC165__factory");
Object.defineProperty(exports, "ERC165__factory", { enumerable: true, get: function () { return ERC165__factory_1.ERC165__factory; } });
var IERC165__factory_1 = require("./factories/@openzeppelin/contracts/utils/introspection/IERC165__factory");
Object.defineProperty(exports, "IERC165__factory", { enumerable: true, get: function () { return IERC165__factory_1.IERC165__factory; } });
var LiqERC1155__factory_1 = require("./factories/contracts/nft/LIQ_ERC1155.sol/LiqERC1155__factory");
Object.defineProperty(exports, "LiqERC1155__factory", { enumerable: true, get: function () { return LiqERC1155__factory_1.LiqERC1155__factory; } });
var LiqERC721__factory_1 = require("./factories/contracts/nft/LIQ_ERC721.sol/LiqERC721__factory");
Object.defineProperty(exports, "LiqERC721__factory", { enumerable: true, get: function () { return LiqERC721__factory_1.LiqERC721__factory; } });
