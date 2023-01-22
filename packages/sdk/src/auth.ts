

import ThresholdKey from "@tkey/default";
import TorusServiceProvider from "@tkey/service-provider-torus";
import TorusStorageLayer from "@tkey/storage-layer-torus";
import SecurityQuestionsModule from "@tkey/security-questions";
import ShareTransferModule from "@tkey/share-transfer";
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage";
import { DirectParams } from "./types";





export const auth = {

    async getTKeyDetails(tKey: ThresholdKey) {
        let details = tKey.getKeyDetails()
        console.log("Tkey details", details);
        return details
    },


    async initializeNewKey(directParams: DirectParams, verifierMap: Record<string, any>) {
        const serviceProvider = new TorusServiceProvider({
            customAuthArgs: directParams,
        });

        // 2. Initializing tKey
        const webStorageModule = new WebStorageModule();
        const securityQuestionsModule = new SecurityQuestionsModule();
        const shareTransferModule = new ShareTransferModule();
        const storageLayer = new TorusStorageLayer({
            hostUrl: "https://metadata.tor.us",
        });

        // Creating the ThresholdKey instance
        const tKey = new ThresholdKey({
            serviceProvider: serviceProvider,
            storageLayer,
            modules: {
                webStorage: webStorageModule,
                securityQuestions: securityQuestionsModule,
                shareTransfer: shareTransferModule,
            },
        });

        const init = async () => {
            // Init Service Provider
            await (tKey.serviceProvider as TorusServiceProvider).init({
                skipSw: false,
            });
            try {
            } catch (error) {
                console.error(error, 'ERROR initing tkey serviceprovider');
            }
        };
        await init()

        try {
            let loginResponse = await this.triggerSSOLogin(tKey, verifierMap);
            await tKey.initialize();
            const res = await tKey._initializeNewKey({ initializeModules: true });
            console.log("response from _initializeNewKey", res);
            const details = await this.getTKeyDetails(tKey);
            if (details.requiredShares <= 0) {
                console.log("All shares are present, you can reconstruct your private key and do operations on the tKey", tKey.getKeyDetails());
            } else {
                console.log("You need to generate more shares to reconstruct your private key");
            }

            return {
                tKey, loginResponse, tKeyDetails: details,
            }
        } catch (error) {
            console.error(error, "ERROR calling triggerSSOLogin");
        }
    },


    //This function generates a new share with password that user chooses
    async generateNewShareWithPassword(tKey: ThresholdKey, password: string) {
        console.log(tKey, 'TKEY GENERETARED AND SENTs')
        if (password.length > 10) {
            await (
                tKey.modules.securityQuestions as SecurityQuestionsModule
            ).generateNewShareWithSecurityQuestions(password, "whats your password?");
            console.log("Successfully generated new share with password.");
        } else {
            return "Error, password must be minimum 10 characters"
        }
        await this.getTKeyDetails(tKey);
        return "Successfully set password share"
    },


    async loginUsingLocalShare(tKey, directParams, verifierMap) {
        try {
            console.log("Logging in");
            await this.triggerSSOLogin(directParams, verifierMap);
            await tKey.initialize();

            console.log("Adding local webstorage share");
            const webStorageModule = tKey.modules["webStorage"] as WebStorageModule;
            await webStorageModule.inputShareFromWebStorage();

            const indexes = tKey.getCurrentShareIndexes();
            console.log(indexes);
            console.log("Total number of available shares: " + indexes.length);
            const reconstructedKey = await tKey.reconstructKey();
            console.log("tkey: " + reconstructedKey.privKey.toString("hex"));
        } catch (error) {
            console.error(error, "caught");
        }
    },

    async triggerSSOLogin(tKey: ThresholdKey, verifierMap: Record<string, any>) {
        try {
            // 2. Set jwtParameters depending on the verifier (google / facebook / linkedin etc)
            //Not needed for google
            const jwtParams = {};
            const { typeOfLogin, clientId, verifier } = verifierMap.google;

            console.log(verifierMap, 'VERIFIER MAP')
            // 3. Trigger Login ==> opens the popup
            const loginResponse = await (
                tKey.serviceProvider as TorusServiceProvider
            ).triggerLogin({
                typeOfLogin,
                verifier,
                clientId,
                jwtParams,
            });
            console.log(loginResponse, 'LOGIN RESP?')

            return loginResponse

            // setConsoleText(loginResponse);
        } catch (error) {
            console.log(error, 'GOT IN CATCH SSO');
        }
    },


};

//export default auth