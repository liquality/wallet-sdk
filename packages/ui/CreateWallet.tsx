import * as React from "react";
import { useState } from "react";
import { auth } from "sdk";
import { DirectParams } from "sdk/src/types";

type Props = {
  directParams: DirectParams;
  verifierMap: Record<string, any>;
};

export const CreateWallet: React.FC<Props> = (props) => {
  const { directParams, verifierMap } = props;
  const [shareToggle, setShareToggle] = useState<string>("split");
  const [loginResponse, setLoginResponse] = useState<any>({});
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [passwordResponse, setPasswordResponse] = useState<string>("");

  React.useEffect(() => {
    console.log("UPDATED!! useffect");
  }, [loginResponse, passwordResponse]);

  const initializeNewKey = async () => {
    const response = await auth.initializeNewKey(
      directParams,
      verifierMap,
      true
    );
    setLoginResponse(response);
  };

  const generatePassword = async (password: string) => {
    let response = await auth.generateNewShareWithPassword(
      loginResponse.tKey,
      password
    );
    setPasswordResponse(response);
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
  console.log(
    loginResponse.loginResponse?.publicAddress,
    "LOGINRESPONSE IN REACT COMÅPNENT ADDRESS"
  );
  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality & tKey Create Wallet</h3>
      <button onClick={initializeNewKey}>Create Wallet</button>
      {loginResponse.loginResponse ? _renderCreatedWalletDetails() : null}
      {loginResponse.loginResponse ? _renderPasswordInput() : null}
    </div>
  );
};
