import ThresholdKey from "@tkey/default";
import TorusServiceProvider from "@tkey/service-provider-torus";
import TorusStorageLayer from "@tkey/storage-layer-torus";
import SecurityQuestionsModule from "@tkey/security-questions";
import ShareTransferModule from "@tkey/share-transfer";
import WebStorageModule from "@tkey/web-storage";
import type { CustomAuthArgs } from "@toruslabs/customauth";
import { LoginResult } from "src/types";
import { KeyDetails } from "@tkey/common-types";

export class AuthService {
  public async getTKeyDetails(tKey: ThresholdKey): Promise<KeyDetails> {
    let details = tKey.getKeyDetails();
    return details;
  }

  public async init(directParams: CustomAuthArgs): Promise<ThresholdKey> {
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
  ): Promise<LoginResult | null> {
    try {
      let loginResponse = await this.triggerSSOLogin(tKey, verifierMap);
      const res = await tKey._initializeNewKey({ initializeModules: true });
      const details = await this.getTKeyDetails(tKey);
      const result = {
        tKey,
        loginResponse,
        tKeyDetails: details,
      } as LoginResult

      return result

    } catch (error) {
      console.error(error, "Error calling triggerSSOLogin");
      return null
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
      ).generateNewShareWithSecurityQuestions(password, "What is your password?");
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
    if (password.length > 10 && tKey) {
      try {
        await tKey.initialize();
        await (
          tKey.modules.securityQuestions as SecurityQuestionsModule
        ).inputShareFromSecurityQuestions(password);
      } catch (error) {
        console.log(error, 'Error in inputShareFromSecurityQuestions');
      }
    } else {
      console.log("Error", "Password must be > 10 characters", "error");
    }
  }

  public async loginUsingSSO(
    tKey: ThresholdKey,
    verifierMap: Record<string, any>
  ): Promise<LoginResult | null> {
    try {
      let loginResponse = await this.triggerSSOLogin(tKey, verifierMap);
      await tKey.initialize();
      const webStorageModule = tKey.modules["webStorage"] as WebStorageModule;
      await webStorageModule.inputShareFromWebStorage();
      const indexes = tKey.getCurrentShareIndexes();
      const details = await this.getTKeyDetails(tKey);
      const result = {
        tKey,
        loginResponse,
        tKeyDetails: details,
      } as LoginResult
      return result
    } catch (error) {
      console.error(error, "Error in loginUsingSSO");
      return null
    }
  }

  //TODO: This function is not finished, still looking into if this is even possible
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
      return loginResponse;
    } catch (error) {
      console.log(error, "GOT IN CATCH SSO");
    }
  }
}
