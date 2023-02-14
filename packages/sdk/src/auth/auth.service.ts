import ThresholdKey from "@tkey/default";
import TorusServiceProvider from "@tkey/service-provider-torus";
import TorusStorageLayer from "@tkey/storage-layer-torus";
import SecurityQuestionsModule from "@tkey/security-questions";
import ShareTransferModule from "@tkey/share-transfer";
import WebStorageModule from "@tkey/web-storage";
import type { CustomAuthArgs } from "@toruslabs/customauth";

export class AuthService {
  public async getTKeyDetails(tKey: ThresholdKey) {
    let details = tKey.getKeyDetails();
    return details;
  }

  public async init(directParams: CustomAuthArgs) {
    const serviceProvider = new TorusServiceProvider({
      customAuthArgs: directParams,
    });
    // 2. Initializing tKey
    const webStorageModule = new WebStorageModule();
    const securityQuestionsModule = new SecurityQuestionsModule(true);
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

    await (tKey.serviceProvider as TorusServiceProvider).init({
      skipSw: false,
    });

    return tKey;
  }

  public async createWallet(
    tKey: ThresholdKey,
    verifierMap: Record<string, any>
  ) {
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
  public async generateNewShareWithPassword(
    tKey: ThresholdKey,
    password: string
  ) {
    if (password.length > 10) {
      const result = await (
        tKey.modules.securityQuestions as SecurityQuestionsModule
      ).generateNewShareWithSecurityQuestions(password, "whats your password?");
      console.log("Successfully generated new share with password.");
      return { result, msg: "Successfully set password share" };
    } else {
      return {
        result: {},
        msg: "Error, could not set password share, password needs to be mininum 10 chars",
      };
    }
  }

  public async inputShareFromSecurityQuestions(
    tKey: ThresholdKey,
    password: string
  ) {
    console.log(
      "Importing Share from Security Question",
      tKey,
      "TKEY MODULES",
      tKey
    );
    if (password.length > 10 && tKey) {
      try {
        await tKey.initialize();
        await (
          tKey.modules.securityQuestions as SecurityQuestionsModule
        ).inputShareFromSecurityQuestions(password);
        console.log("Imported Share using the security question");
      } catch (error) {
        console.log("ERROOÖÖÖÖÖ ", error, "TKEEY:", tKey);
      }
    } else {
      console.log("Error", "Password must be > 10 characters", "error");
    }
  }



  public async loginUsingSSO(
    tKey: ThresholdKey,
    verifierMap: Record<string, any>
  ) {
    try {
      let loginResponse = await this.triggerSSOLogin(tKey, verifierMap);
      await tKey.initialize();
      const webStorageModule = tKey.modules["webStorage"] as WebStorageModule;
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

  public async loginUsingPassword(tKey: ThresholdKey, password: string) {
    try {
      await tKey.initialize();

      //TODO: You need the password share to recover without social, this would be stored
      // on game devs 'backend' or however they want to store it. For the purpose of this demo
      // user needs to store it themselves
      const securityQuestionsModule = tKey.modules[
        "securityQuestions"
      ] as SecurityQuestionsModule;
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

  private async triggerSSOLogin(
    tKey: ThresholdKey,
    verifierMap: Record<string, any>
  ) {
    try {
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
      console.log("Login response:", loginResponse);
      return loginResponse;

      // setConsoleText(loginResponse);
    } catch (error) {
      console.log(error, "GOT IN CATCH SSO");
    }
  }
}