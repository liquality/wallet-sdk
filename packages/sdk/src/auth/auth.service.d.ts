import ThresholdKey from "@tkey/default";
import type { CustomAuthArgs } from "@toruslabs/customauth";

export declare class AuthService {
    getTKeyDetails(tKey: ThresholdKey): Promise<import("@tkey/common-types").KeyDetails>;
    init(directParams: CustomAuthArgs): Promise<ThresholdKey>;
    createWallet(tKey: ThresholdKey, verifierMap: Record<string, any>): Promise<{
        tKey: ThresholdKey;
        loginResponse: import("@toruslabs/customauth").TorusLoginResponse | undefined;
        tKeyDetails: import("@tkey/common-types").KeyDetails;
    } | undefined>;
    generateNewShareWithPassword(tKey: ThresholdKey, password: string): Promise<{
        result: import("@tkey/common-types").GenerateNewShareResult;
        msg: string;
    } | {
        result: {};
        msg: string;
    }>;
    inputShareFromSecurityQuestions(tKey: ThresholdKey, password: string): Promise<void>;
    loginUsingSSO(tKey: ThresholdKey, verifierMap: Record<string, any>): Promise<import("@toruslabs/customauth").TorusLoginResponse | undefined>;
    loginUsingPassword(tKey: ThresholdKey, password: string): Promise<void>;
    private triggerSSOLogin;
}
//# sourceMappingURL=auth.service.d.ts.map