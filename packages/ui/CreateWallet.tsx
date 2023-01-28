import * as React from "react";
import { useState, useEffect } from "react";
import { AuthService } from "sdk/src/auth/auth.service";
import { DirectParams } from "sdk/src/types";

type Props = {
  directParams: DirectParams;
  verifierMap: Record<string, any>;
};

export const CreateWallet: React.FC<Props> = (props) => {
  const { directParams, verifierMap } = props;
  const [tKey, setTKey] = useState<any>({});
  const [loginResponse, setLoginResponse] = useState<any>({});
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [passwordResponse, setPasswordResponse] = useState<string>("");
  const [newPasswordShare, setNewPasswordShare] = useState<any>({});
  const authService = new AuthService();

  useEffect(() => {
    const init = async () => {
      const tKeyResponse = await authService.init(directParams);
      setTKey(tKeyResponse);
    };

    init();
  }, [loginResponse, passwordResponse]);

  const createNewWallet = async () => {
    const response = await authService.createWallet(tKey, verifierMap);
    setLoginResponse(response);
  };

  const generatePassword = async (password: string) => {
    let response = await authService.generateNewShareWithPassword(
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
