import { NftService } from "./nft/nft.service";
import { AuthService } from "./auth/auth.service";
import { ConfigParams } from "./types";
declare function setup(config: ConfigParams): void;
export declare const sdk: {
    nft: typeof NftService;
    auth: typeof AuthService;
    setup: typeof setup;
};
export {};
//# sourceMappingURL=index.d.ts.map