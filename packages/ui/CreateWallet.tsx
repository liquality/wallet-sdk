import * as React from "react";
import { useState, useEffect } from "react";
import { AuthService } from "@liquality/wallet-sdk";
import type { CustomAuthArgs } from "@toruslabs/customauth";
import { ERC20Service } from "@liquality/wallet-sdk";

type Props = {
  directParams: CustomAuthArgs;
  verifierMap: Record<string, any>;
};

import { setup } from "@liquality/wallet-sdk";

function setupSDK() {
  setup({
    alchemyApiKey: "JmoTKlpUIjzd1y5-8h-La50OewZULyL0",
    etherscanApiKey: "-",
    infuraProjectId: "-",
    pocketNetworkApplicationID: "-",
    quorum: 1,
    slowGasPriceMultiplier: 1,
    averageGasPriceMultiplier: 1.5,
    fastGasPriceMultiplier: 2,
    gasLimitMargin: 2000,
  });
}

export const CreateWallet: React.FC<Props> = (props) => {
  const { directParams, verifierMap } = props;
  const [tKey, setTKey] = useState<any>({});
  const [loginResponse, setLoginResponse] = useState<any>({});
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [passwordResponse, setPasswordResponse] = useState<string>("");
  const [newPasswordShare, setNewPasswordShare] = useState<any>({});

  setupSDK();
  useEffect(() => {
    const init = async () => {
      const tKeyResponse = await AuthService.init(directParams);
      setTKey(tKeyResponse);
      const balances = await ERC20Service.listAccountTokens(
        "0x595ec62736Bf19445d7F00D66072B3a3c7aeA0F5",
        5
      );
      console.log(balances, "balancos");
    };

    init();
  }, [loginResponse, passwordResponse]);

  const createNewWallet = async () => {
    const response = await AuthService.createWallet(tKey, verifierMap);
    setLoginResponse(response);
  };

  const generatePassword = async (password: string) => {
    let response = await AuthService.generateNewShareWithPassword(
      loginResponse.tKey,
      password
    );
    setNewPasswordShare(response.result);
    response.msg.startsWith("Error")
      ? setErrorMsg(response.msg)
      : setPasswordResponse(response.msg);
  };

  const _renderPasswordInput = () => {
    return (
      <div>
        Set password minimum 10 characters:
        <input
          type="password"
          placeholder="Address"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={() => generatePassword(password)}>Set password</button>
        <br></br>
        {errorMsg ? <p style={{ color: "red" }}> {errorMsg}</p> : null}
        {passwordResponse.startsWith("Error") ? (
          <p style={{ color: "red" }}> {passwordResponse}</p>
        ) : (
          <p style={{ color: "green" }}>{passwordResponse}</p>
        )}
      </div>
    );
  };

  const _renderCreatedWalletDetails = () => {
    return (
      <div>
        <h3 style={{ color: "green" }}>
          Your wallet was created successfully!
        </h3>
        <p>
          <b>Public Address:</b> <br></br>
          {loginResponse.loginResponse?.publicAddress}
        </p>
        <p>
          <b>Private Key:</b> <br></br>
          {loginResponse.loginResponse?.privateKey}
        </p>
        <p>
          <b>User email:</b> <br></br>{" "}
          {loginResponse.loginResponse?.userInfo?.email}
        </p>
      </div>
    );
  };

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality & tKey Create Wallet</h3>
      <button onClick={createNewWallet}>Create Wallet</button>
      {loginResponse.loginResponse ? _renderCreatedWalletDetails() : null}
      {loginResponse.loginResponse ? _renderPasswordInput() : null}
    </div>
  );
};
