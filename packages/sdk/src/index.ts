import { OwnedNft } from "alchemy-sdk"; // This is temporary, probably need custom types
import axios from "axios";
import ThresholdKey from "@tkey/default";
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage";
import TorusServiceProvider from "@tkey/service-provider-torus";
import TorusStorageLayer from "@tkey/storage-layer-torus";
import SecurityQuestionsModule from "@tkey/security-questions";
import ShareTransferModule from "@tkey/share-transfer";




export type { OwnedNft };

const verifierMap: Record<string, any> = {
  google: {
    name: "Google",
    typeOfLogin: "google",
    clientId:
      "852640103435-0qhvrgpkm66c9hu0co6edkhao3hrjlv3.apps.googleusercontent.com",
    verifier: "liquality-google-testnet",
  },
};



//THIS WORKS AS EXPECTED
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





//END OF THIS WORKS AS EXPECTED


const API_URL = "http://localhost:3001";

const sdk = {
  async getNfts(address: string): Promise<OwnedNft[]> {
    let url = `${API_URL}/nft/${address}`
    const result = await axios.get(url);
    return result.data;
  },





  //AUTH FLOW (TODO: move these auth functions to seperate file)
  async triggerSSOLogin(tKey) {
    try {
      console.log("Triggering Login");

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
      // setConsoleText(loginResponse);
    } catch (error) {
      console.log(error, 'GOT IN CATCH SSO');
    }
  },

  async initializeNewKey() {
    console.log(location.origin, 'LOC ORIGIN')



    // 2. Initializing tKey
    let WebStorageModule = (await import('@tkey/web-storage')).default

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
        webStorage: new WebStorageModule(),
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
        console.error(error);
      }
    };
    init()


    try {
      await this.triggerSSOLogin(tKey);
      //await tKey.initialize();
      //const res = await tKey._initializeNewKey({ initializeModules: true });
      //console.log("response from _initializeNewKey", res);

      //return res.privKey
    } catch (error) {
      console.log('GOT IN ERROOOOOOR')
      console.error(error, "caught");
    }
  },


};

export default sdk;
