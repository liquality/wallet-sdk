"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const default_1 = __importDefault(require("@tkey/default"));
const service_provider_torus_1 = __importDefault(
  require("@tkey/service-provider-torus")
);
const storage_layer_torus_1 = __importDefault(
  require("@tkey/storage-layer-torus")
);
const security_questions_1 = __importDefault(
  require("@tkey/security-questions")
);
const share_transfer_1 = __importDefault(require("@tkey/share-transfer"));
const web_storage_1 = __importDefault(require("@tkey/web-storage"));
class AuthService {
  async getTKeyDetails(tKey) {
    let details = tKey.getKeyDetails();
    return details;
  }
  async init(directParams) {
    const serviceProvider = new service_provider_torus_1.default({
      customAuthArgs: directParams,
    });
    // 2. Initializing tKey
    const webStorageModule = new web_storage_1.default();
    const securityQuestionsModule = new security_questions_1.default(true);
    const shareTransferModule = new share_transfer_1.default();
    const storageLayer = new storage_layer_torus_1.default({
      hostUrl: "https://metadata.tor.us",
    });
    // Creating the ThresholdKey instance
    const tKey = new default_1.default({
      serviceProvider: serviceProvider,
      storageLayer,
      modules: {
        webStorage: webStorageModule,
        securityQuestions: securityQuestionsModule,
        shareTransfer: shareTransferModule,
      },
    });
    await tKey.serviceProvider.init({
      skipSw: false,
    });
    return tKey;
  }
  async createWallet(tKey, verifierMap) {
    try {
      let loginResponse = await this.triggerSSOLogin(tKey, verifierMap);
      const res = await tKey._initializeNewKey({ initializeModules: true });
      console.log("response from _initializeNewKey", res);
      const details = await this.getTKeyDetails(tKey);
      if (details.requiredShares <= 0) {
        console.log(
          "All shares are present, you can reconstruct your private key and do operations on the tKey",
          tKey.getKeyDetails()
        );
      } else {
        console.log(
          "You need to generate more shares to reconstruct your private key"
        );
      }
      return {
        tKey,
        loginResponse,
        tKeyDetails: details,
      };
    } catch (error) {
      console.error(error, "Error calling triggerSSOLogin");
    }
  }
  //This function generates a new share with password that user chooses
  async generateNewShareWithPassword(tKey, password) {
    if (password.length > 10) {
      const result =
        await tKey.modules.securityQuestions.generateNewShareWithSecurityQuestions(
          password,
          "whats your password?"
        );
      console.log("Successfully generated new share with password.");
      return { result, msg: "Successfully set password share" };
    } else {
      return {
        result: {},
        msg: "Error, could not set password share, password needs to be mininum 10 chars",
      };
    }
  }
  async inputShareFromSecurityQuestions(tKey, password) {
    console.log(
      "Importing Share from Security Question",
      tKey,
      "TKEY MODULES",
      tKey
    );
    if (password.length > 10 && tKey) {
      try {
        await tKey.initialize();
        await tKey.modules.securityQuestions.inputShareFromSecurityQuestions(
          password
        );
        console.log("Imported Share using the security question");
      } catch (error) {
        console.log("ERROOÖÖÖÖÖ ", error, "TKEEY:", tKey);
      }
    } else {
      console.log("Error", "Password must be > 10 characters", "error");
    }
  }
  async loginUsingSSO(tKey, verifierMap) {
    try {
      let loginResponse = await this.triggerSSOLogin(tKey, verifierMap);
      await tKey.initialize();
      const webStorageModule = tKey.modules["webStorage"];
      await webStorageModule.inputShareFromWebStorage();
      const indexes = tKey.getCurrentShareIndexes();
      const details = await this.getTKeyDetails(tKey);
      console.log(
        "Total number of available shares: " + indexes.length,
        "Shareinfo:",
        indexes
      );
      return {
        tKey,
        loginResponse,
        tKeyDetails: details,
      };
    } catch (error) {
      console.error(error, "caught");
    }
  }
  async loginUsingPassword(tKey, password) {
    try {
      await tKey.initialize();
      //TODO: You need the password share to recover without social, this would be stored
      // on game devs 'backend' or however they want to store it. For the purpose of this demo
      // user needs to store it themselves
      const securityQuestionsModule = tKey.modules["securityQuestions"];
      await securityQuestionsModule.inputShareFromSecurityQuestions(password);
      const indexes = tKey.getCurrentShareIndexes();
      console.log(
        "Total number of available shares: " + indexes.length,
        "Shareinfo:",
        indexes
      );
    } catch (error) {
      console.error(error, "Error logging in using password");
    }
  }
  async triggerSSOLogin(tKey, verifierMap) {
    try {
      // 2. Set jwtParameters depending on the verifier (google / facebook / linkedin etc)
      //Not needed for google
      const jwtParams = {};
      const { typeOfLogin, clientId, verifier } = verifierMap.google;
      // 3. Trigger Login ==> opens the popup
      const loginResponse = await tKey.serviceProvider.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
        jwtParams,
      });
      console.log("Login response:", loginResponse);
      return loginResponse;
      // setConsoleText(loginResponse);
    } catch (error) {
      console.log(error, "GOT IN CATCH SSO");
    }
  }
}
exports.AuthService = AuthService;
