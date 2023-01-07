import { OwnedNft } from "alchemy-sdk"; // This is temporary, probably need custom types
import axios from "axios";
import ThresholdKey from "@tkey/default";
import ServiceProviderBase from "@tkey/service-provider-base";
import TorusStorageLayer from "@tkey/storage-layer-torus";
import SecurityQuestionModule from "@tkey/security-questions";
import WebStorageModule from "@tkey/web-storage";

import { ShareStore, TkeyError } from "@tkey/common-types";
import TorusServiceProvider from "@tkey/service-provider-torus";


// 1. Setup Service Provider
const directParams = {
  baseUrl: `http://localhost:3000/serviceworker`,
  enableLogging: true,
  networkUrl:
    "https://small-long-brook.ropsten.quiknode.pro/e2fd2eb01412e80623787d1c40094465aa67624a",
  network: "testnet" as any,
};
const serviceProvider = new TorusServiceProvider({
  customAuthArgs: directParams,
});


const storageLayer = new TorusStorageLayer({
  hostUrl: "https://metadata.tor.us",
});


const webStorageModule = new WebStorageModule();
const securityQuestion = new SecurityQuestionModule();

export type { OwnedNft };

/* const verifierMap: Record<string, any> = {
  google: {
    name: "Google",
    typeOfLogin: "google",
    clientId:
      "852640103435-0qhvrgpkm66c9hu0co6edkhao3hrjlv3.apps.googleusercontent.com",
    verifier: "liquality-google-testnet",
  },
};

const tKey = new ThresholdKey({
  serviceProvider: serviceProvider,
  storageLayer: storageLayer,
  modules: {
    webStorage: webStorageModule,
    securityQuestions: securityQuestion,
  },
});
 */

const API_URL = "http://localhost:3001";

const sdk = {
  async getNfts(address: string): Promise<OwnedNft[]> {
    let url = `${API_URL}/nft/${address}`
    const result = await axios.get(url);
    return result.data;
  },




  //AUTH FLOW
  async triggerSSOLogin() {
    try {
      console.log("Triggering Login");

      // 2. Set jwtParameters depending on the verifier (google / facebook / linkedin etc)
      //Not needed for google
      const jwtParams = {};

      const { typeOfLogin, clientId, verifier } = verifierMap.google;

      // 3. Trigger Login ==> opens the popup
      const loginResponse = await (
        tKey.serviceProvider as TorusServiceProvider
      ).triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
        jwtParams,
      });

      // setConsoleText(loginResponse);
    } catch (error) {
      console.log(error);
    }
  },

  async initializeNewKey() {
    /*   try {
        await this.triggerSSOLogin();
        await tKey.initialize();
        const res = await tKey._initializeNewKey({ initializeModules: true });
        console.log("response from _initializeNewKey", res);
  
        return res.privKey
      } catch (error) {
        console.error(error, "caught");
      } */
  },


};

export default sdk;
