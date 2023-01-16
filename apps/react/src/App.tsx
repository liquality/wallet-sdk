import { useEffect, useState } from "react";

import logo from "./logo.svg";
import "./App.css";
import ThresholdKey from "@tkey/default";
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage";
import TorusServiceProvider from "@tkey/service-provider-torus";
import TorusStorageLayer from "@tkey/storage-layer-torus";
import SecurityQuestionsModule from "@tkey/security-questions";
import ShareTransferModule from "@tkey/share-transfer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import swal from "sweetalert";
import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
  mnemonicToEntropy,
} from "bip39";
import HDKey from "hdkey";

declare global {
  interface Window {
    secrets: any;
  }
}

const GOOGLE = "google";
const FACEBOOK = "facebook";
const LINKEDIN = "linkedin";
const TWITTER = "twitter";
const AUTH_DOMAIN = "https://torus-test.auth0.com";

const loginConnectionMap: Record<string, any> = {
  [LINKEDIN]: { domain: AUTH_DOMAIN },
  [TWITTER]: { domain: AUTH_DOMAIN },
};

const verifierMap: Record<string, any> = {
  [GOOGLE]: {
    name: "Google",
    typeOfLogin: "google",
    clientId:
      "852640103435-0qhvrgpkm66c9hu0co6edkhao3hrjlv3.apps.googleusercontent.com",
    verifier: "web3auth-testnet-verifier",
  },
  [FACEBOOK]: {
    name: "Facebook",
    typeOfLogin: "facebook",
    clientId: "617201755556395",
    verifier: "facebook-lrc",
  },
  [LINKEDIN]: {
    name: "Linkedin",
    typeOfLogin: "linkedin",
    clientId: "59YxSgx79Vl3Wi7tQUBqQTRTxWroTuoc",
    verifier: "torus-auth0-linkedin-lrc",
  },
  [TWITTER]: {
    name: "Twitter",
    typeOfLogin: "twitter",
    clientId: "A7H8kkcmyFRlusJQ9dZiqBLraG2yWIsO",
    verifier: "torus-auth0-twitter-lrc",
  },
};

// 1. Setup Service Provider
const directParams = {
  baseUrl: `${window.location.origin}/serviceworker`,
  enableLogging: true,
  networkUrl:
    "https://small-long-brook.ropsten.quiknode.pro/e2fd2eb01412e80623787d1c40094465aa67624a",
  network: "testnet" as any,
};
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

const App = function App() {
  const [authVerifier, setAuthVerifier] = useState<string>("google");
  const [consoleText, setConsoleText] = useState<any>(
    "Output will appear here"
  );
  const [derivedAccount, setDerivedAccount] = useState<any>(
    "Output will appear here"
  );
  const [mnemonics, setMnemonics] = useState<any>("");
  const [bip39Seed, setBIP39Seed] = useState<any>("");
  const [entropy, setEntropy] = useState<any>("");
  const [hdKey, setHDKey] = useState<any>(null);
  const [derivationPath, setDerivationPath] = useState<any>("m/44'/60'/0'/0");
  const [privateKey, setPrivateKey] = useState<any>("");
  const [publicKey, setPublicKey] = useState<any>("");
  const [privateExtendedKey, setPrivateExtendedKey] = useState<any>("");
  const [publicExtendedKey, setPublicExtendedKey] = useState<any>("");
  const [shareDetails, setShareDetails] = useState<string>("0x0");
  const [shareToggle, setShareToggle] = useState<string>("split");
  const [total, setTotal] = useState<number>(3);
  const [threshold, setThreshold] = useState<number>(2);

  const appendConsoleText = (el: any) => {
    const data = typeof el === "string" ? el : JSON.stringify(el);
    setConsoleText((x: any) => x + "\n" + data);
  };

  useEffect(() => {
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

    init();
  }, []);

  const triggerLogin = async () => {
    try {
      console.log("Triggering Login");

      // 2. Set jwtParameters depending on the verifier (google / facebook / linkedin etc)
      const jwtParams = loginConnectionMap[authVerifier] || {};

      const { typeOfLogin, clientId, verifier } = verifierMap[authVerifier];

      console.log(
        typeOfLogin,
        clientId,
        verifier,
        "typeOfLogin, clientId, verifier"
      );
      console.log(jwtParams, "JWT params");
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
  };

  const initializeNewKey = async () => {
    try {
      setConsoleText("Initializing a new key");
      await triggerLogin();
      await tKey.initialize();
      const res = await tKey._initializeNewKey({ initializeModules: true });
      console.log("response from _initializeNewKey", res);
      appendConsoleText(res.privKey);
      setShareToggle("split");
      setShareDetails(res.privKey.toString("hex"));
    } catch (error) {
      console.error(error, "caught");
    }
  };

  const loginUsingLocalShare = async () => {
    try {
      setConsoleText("Logging in");
      await triggerLogin();
      await tKey.initialize();

      appendConsoleText("Adding local webstorage share");
      const webStorageModule = tKey.modules["webStorage"] as WebStorageModule;
      await webStorageModule.inputShareFromWebStorage();

      const indexes = tKey.getCurrentShareIndexes();
      appendConsoleText(indexes);
      appendConsoleText("Total number of available shares: " + indexes.length);
      const reconstructedKey = await tKey.reconstructKey();
      appendConsoleText("tkey: " + reconstructedKey.privKey.toString("hex"));
    } catch (error) {
      console.error(error, "caught");
    }
  };

  const reconstructKey = async () => {
    try {
      setConsoleText("Reconstucting key");
      let reconstructedKey = await tKey.reconstructKey();
      appendConsoleText(reconstructedKey.privKey);
    } catch (error) {
      console.error(error, "caught");
    }
  };

  const getTKeyDetails = async () => {
    setConsoleText("Tkey details");
    appendConsoleText(tKey.getKeyDetails());
  };

  const generateNewShareWithPassword = async () => {
    setConsoleText("Generating new share with password");
    swal("Enter password (>10 characters)", {
      content: "input" as any,
    }).then(async (value) => {
      if (value.length > 10) {
        await (
          tKey.modules.securityQuestions as SecurityQuestionsModule
        ).generateNewShareWithSecurityQuestions(value, "whats your password?");
        appendConsoleText("Successfully generated new share with password.");
      } else {
        swal("Error", "Password must be > 10 characters", "error");
      }
    });
    await getTKeyDetails();
  };

  const inputShareFromSecurityQuestions = async () => {
    setConsoleText("Importing Share from Security Question");
    swal("What is your password ?", {
      content: "input" as any,
    }).then(async (value) => {
      if (value.length > 10) {
        await (
          tKey.modules.securityQuestions as SecurityQuestionsModule
        ).inputShareFromSecurityQuestions(value);
        appendConsoleText("Imported Share using the security question");
      } else {
        swal("Error", "Password must be > 10 characters", "error");
      }
    });
  };

  const checkShareRequests = async () => {
    consoleText("Checking Share Requests");
    try {
      const result = await (
        tKey.modules.shareTransfer as ShareTransferModule
      ).getShareTransferStore();
      const requests = await (
        tKey.modules.shareTransfer as ShareTransferModule
      ).lookForRequests();
      appendConsoleText("Share Requests" + JSON.stringify(requests));
      console.log("Share requests", requests);
      console.log("Share Transfer Store", result);
    } catch (err) {
      console.log(err);
    }
  };

  const resetShareRequests = async () => {
    setConsoleText("Resetting Share Transfer Requests");
    try {
      const res = await (
        tKey.modules.shareTransfer as ShareTransferModule
      ).resetShareTransferStore();
      console.log(res);
      appendConsoleText("Reset share transfer successful");
    } catch (err) {
      console.log(err);
    }
  };

  const requestShare = async () => {
    setConsoleText("Requesting New Share");
    try {
      const result = await (
        tKey.modules.shareTransfer as ShareTransferModule
      ).requestNewShare(navigator.userAgent, tKey.getCurrentShareIndexes());
      appendConsoleText(result);
    } catch (err) {
      console.error(err);
    }
  };

  const approveShareRequest = async () => {
    setConsoleText("Approving Share Request");
    try {
      const result = await (
        tKey.modules.shareTransfer as ShareTransferModule
      ).getShareTransferStore();
      const requests = await (
        tKey.modules.shareTransfer as ShareTransferModule
      ).lookForRequests();
      let shareToShare;
      try {
        shareToShare = await (
          tKey.modules.webStorage as WebStorageModule
        ).getDeviceShare();
      } catch (err) {
        console.error("No on device share found. Generating a new share");
        const newShare = await tKey.generateNewShare();
        shareToShare =
          newShare.newShareStores[newShare.newShareIndex.toString("hex")];
      }
      console.log(result, requests, tKey);

      await (tKey.modules.shareTransfer as ShareTransferModule).approveRequest(
        requests[0],
        shareToShare
      );
      // await this.tbsdk.modules.shareTransfer.deleteShareTransferStore(requests[0]) // delete old share requests
      appendConsoleText("Approved Share Transfer request");
    } catch (err) {
      console.error(err);
    }
  };

  const generateShares = () => {
    var re = /[0-9A-Fa-f]*/g;
    var keyToBeSplit = shareDetails.replaceAll('"', "");
    if (keyToBeSplit.substring(0, 2) === "0x") {
      keyToBeSplit = keyToBeSplit.substring(2);
    }
    if (re.test(keyToBeSplit)) {
      setShareToggle("combine");
      var shares = window.secrets.share(keyToBeSplit, total, threshold);
      setShareDetails(shares.join("\n"));
    } else {
      swal("Please enter a valid hexadecimal number");
    }
  };
  const combineShares = () => {
    if (shareToggle == "combine") {
      setShareToggle("split");
    }
    console.log(shareDetails.split("\n"));
    var comb = window.secrets.combine(shareDetails.split("\n"));
    setShareDetails(comb);
  };
  const generateMnemonics = () => {
    if (!validateMnemonic(mnemonics)) {
      swal("Incorrect Mnemonic", "", "error");
      setBIP39Seed("Incorrect Mnemonic");
      setEntropy("Incorrect Mnemonic");
      setPublicKey("Incorrect Mnemonic");
      setPublicExtendedKey("Incorrect Mnemonic");
      setPrivateKey("Incorrect Mnemonic");
      setPrivateExtendedKey("Incorrect Mnemonic");
    } else {
      const bip39Seed = mnemonicToSeedSync(mnemonics).toString("hex");
      const bip39entropy = mnemonicToEntropy(mnemonics);

      setBIP39Seed(bip39Seed);
      setEntropy(bip39entropy);
      const hd = HDKey.fromMasterSeed(Buffer.from(bip39Seed, "hex"));
      setPublicKey(hd.publicKey.toString("hex"));
      setPublicExtendedKey(hd.publicExtendedKey);
      setPrivateKey(hd.privateKey.toString("hex"));
      setPrivateExtendedKey(hd.privateExtendedKey);
      setHDKey(hd);
    }
  };
  const deriveAccount = () => {
    const childHd = hdKey.derive(derivationPath);
    setDerivedAccount(
      "Private Key " +
        childHd.privateKey.toString("hex") +
        "\nPublic Key " +
        childHd.publicKey.toString("hex")
    );
  };
  const generateMnemonicsRandom = () => {
    const bipMnemonic = generateMnemonic();
    const bip39Seed = mnemonicToSeedSync(bipMnemonic).toString("hex");
    const bip39entropy = mnemonicToEntropy(bipMnemonic);
    setMnemonics(bipMnemonic);
    setBIP39Seed(bip39Seed);
    setEntropy(bip39entropy);
    const hd = HDKey.fromMasterSeed(Buffer.from(bip39Seed, "hex"));
    setPublicKey(hd.publicKey.toString("hex"));
    setPublicExtendedKey(hd.publicExtendedKey);
    setPrivateKey(hd.privateKey.toString("hex"));
    setPrivateExtendedKey(hd.privateExtendedKey);
    setHDKey(hd);
  };

  return (
    <div className="showcase">
      <div className="showcase-top">
        <img
          src="https://web3auth.io/images/web3auth-logo---Dark-1.svg"
          alt="Web3 Auth Logo"
        />
      </div>
      <div className="showcase-content">
        <Row className="center">
          <Col>
            <h4>Select Verifier</h4>
          </Col>
          <Col>
            <ul>
              <li>
                <span onClick={() => setAuthVerifier("facebook")}>
                  <i
                    className={
                      "fa fa-facebook " +
                      (authVerifier === "facebook" ? "selected" : "")
                    }
                  ></i>
                </span>
              </li>
              <li>
                <span onClick={() => setAuthVerifier("twitter")}>
                  <i
                    className={
                      "fa fa-twitter " +
                      (authVerifier === "twitter" ? "selected" : "")
                    }
                  ></i>
                </span>
              </li>
              <li>
                <span onClick={() => setAuthVerifier("linkedin")}>
                  <i
                    className={
                      "fa fa-linkedin " +
                      (authVerifier === "linkedin" ? "selected" : "")
                    }
                  ></i>
                </span>
              </li>
              <li>
                <span onClick={() => setAuthVerifier("google")}>
                  <i
                    className={
                      "fa fa-google " +
                      (authVerifier === "google" ? "selected" : "")
                    }
                  ></i>
                </span>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="frame">
          <Col>
            <Row>
              <Col>
                <h1>Login / Reset</h1>
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={loginUsingLocalShare}>
                Login
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={initializeNewKey}>
                Create New tKey
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={reconstructKey}>
                Reconstruct tKey
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={getTKeyDetails}>
                Get tKey Details
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <h1>Shares</h1>
              </Col>
            </Row>
            <Row>
              <br></br>
            </Row>
            <Row>
              <br></br>
            </Row>
            <Row>
              <Col
                className="custom-btn"
                onClick={generateNewShareWithPassword}
              >
                Create a new password
              </Col>
            </Row>
            <Row>
              <Col
                className="custom-btn"
                onClick={inputShareFromSecurityQuestions}
              >
                Input password share
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <h1>Share Transfer</h1>
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={checkShareRequests}>
                Check Share requests
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={requestShare}>
                Request Share
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={approveShareRequest}>
                Approve Request
              </Col>
            </Row>
            <Row>
              <Col className="custom-btn" onClick={resetShareRequests}>
                Reset Share Request
              </Col>
            </Row>
          </Col>
        </Row>
        <h1>Console</h1>
        <textarea
          style={{ width: "100%", height: "8vh" }}
          value={consoleText}
          readOnly
        ></textarea>
        <hr></hr>
        <h1>Secret Sharing</h1>
        <div>
          <input
            type="number"
            value={threshold}
            onChange={(e) => {
              setThreshold(parseInt(e.target.value));
              setShareDetails("0x0");
              setShareToggle("split");
            }}
          />{" "}
          out of{" "}
          <input
            type="number"
            value={total}
            onChange={(e) => {
              setTotal(parseInt(e.target.value));
              setShareDetails("0x0");
              setShareToggle("split");
            }}
          />
        </div>
        <br></br>
        {shareToggle === "split" ? (
          <h4> Private key (hex format) below</h4>
        ) : (
          <h4>Private Key split into {total} shares</h4>
        )}
        {shareToggle === "split" ? (
          <textarea
            style={{ width: "100%", height: "4vh" }}
            value={shareDetails}
            onChange={(e) => setShareDetails(e.currentTarget.value)}
          ></textarea>
        ) : (
          <textarea
            style={{ width: "100%", height: 4 * total + "vh" }}
            value={shareDetails}
            onChange={(e) => setShareDetails(e.currentTarget.value)}
          ></textarea>
        )}
        <br></br>
        {shareToggle === "split" ? (
          <button
            className="custom-btn"
            style={{ width: "auto" }}
            onClick={generateShares}
          >
            Generate Shares
          </button>
        ) : (
          <button
            className="custom-btn"
            style={{ width: "auto" }}
            onClick={combineShares}
          >
            Combine Shares
          </button>
        )}
        <br></br>
        <h1>Mnemonics</h1>
        {mnemonics.length === 0 ? (
          <button
            className="custom-btn"
            style={{ width: "auto" }}
            onClick={generateMnemonicsRandom}
          >
            Generate Random Mnemonics
          </button>
        ) : (
          <button
            className="custom-btn"
            style={{ width: "auto" }}
            onClick={generateMnemonics}
          >
            Generate Using Mnemonic
          </button>
        )}

        <Table>
          <Row>
            <span style={{ width: "20%" }}>BIP39 Mnemonic</span>
            <Col>
              <input
                style={{ width: "100%" }}
                value={mnemonics}
                onChange={(e) => setMnemonics(e.currentTarget.value)}
                placeholder="Insert Mnemonic or Generate Random Mnemonic"
              ></input>
            </Col>
          </Row>
          <Row>
            <span style={{ width: "20%" }}>BIP39 Seed</span>
            <Col>
              <input
                style={{ width: "100%" }}
                value={bip39Seed}
                readOnly
              ></input>
            </Col>
          </Row>
          <Row>
            <span style={{ width: "20%" }}>Entropy</span>
            <Col>
              <input style={{ width: "100%" }} value={entropy} readOnly></input>
            </Col>
          </Row>
          <Row>
            <span style={{ width: "20%" }}>Public Key</span>
            <Col>
              <input
                style={{ width: "100%" }}
                value={publicKey}
                readOnly
              ></input>
            </Col>
          </Row>
          <Row>
            <span style={{ width: "20%" }}>Extended Public Key </span>
            <Col>
              <input
                style={{ width: "100%" }}
                value={publicExtendedKey}
                readOnly
              ></input>
            </Col>
          </Row>
          <Row>
            <span style={{ width: "20%" }}>Private Key</span>
            <Col>
              <input
                style={{ width: "100%" }}
                value={privateKey}
                readOnly
              ></input>
            </Col>
          </Row>
          <Row>
            <span style={{ width: "20%" }}>Extended Private Key </span>
            <Col>
              <input
                style={{ width: "100%" }}
                value={privateExtendedKey}
                readOnly
              ></input>
            </Col>
          </Row>
          <br></br>
          <h4>BIP32 Derivation Path</h4>
          <Col>
            <input
              style={{ width: "20%", textAlign: "center" }}
              value={derivationPath}
              onChange={(e) => setDerivationPath(e.currentTarget.value)}
            ></input>
          </Col>
          <button className="custom-btn" onClick={deriveAccount}>
            Derive
          </button>
          <textarea
            style={{ width: "100%", height: "8vh" }}
            value={derivedAccount}
            readOnly
          ></textarea>
        </Table>
      </div>
    </div>
  );
};

export default App;
