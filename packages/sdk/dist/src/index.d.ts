import { NftService } from "./nft/nft.service";
import { AuthService } from "./auth/auth.service";
import { ConfigParams } from "./types";
export { AuthService } from './auth/auth.service';
export { NftService } from "./nft/nft.service";
declare function setup(config: ConfigParams): void;
export declare const sdk: {
    nft: typeof NftService;
    auth: typeof AuthService;
    setup: typeof setup;
};
//# sourceMappingURL=index.d.ts.map