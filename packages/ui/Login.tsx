import * as React from "react";
import { useState } from "react";
import { AuthService } from "@liquality/wallet-sdk";
import type { CustomAuthArgs } from "@toruslabs/customauth";

type Props = {
  directParams: CustomAuthArgs;
  verifierMap: Record<string, any>;
};

export const Login: React.FC<Props> = (props) => {
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [tKey, setTKey] = useState<any>({});
  const [password, setPassword] = useState<string>("");
  const authService = new AuthService();

  const logInUsingGoogleSSO = async () => {
    const response = await authService.loginUsingSSO(tKey, props.verifierMap);
    setLoginResponse(response);
  };

  console.log(tKey, "FULL TKEEEY IN CLIENT");

  const logInUsingPassword = async () => {
    await authService.loginUsingPassword(tKey, props.verifierMap, password);
  };

  //Init tkey instance
  React.useEffect(() => {
    const init = async () => {
      const tKeyResponse = await authService.init(props.directParams);
      setTKey(tKeyResponse);
    };
    init();
  }, [loginResponse]);

  const _renderLoggedInWalletDetails = () => {
    return (
      <div>
        <h3 style={{ color: "green" }}>
          Your wallet was logged in successfully!
        </h3>
        <p>
          <b>Public Address:</b> <br></br>
          {loginResponse.publicAddress}
        </p>
        <p>
          <b>Private Key:</b> <br></br>
          {loginResponse.privateKey}
        </p>
        <p>
          <b>User email:</b> <br></br> {loginResponse.userInfo?.email}
        </p>
      </div>
    );
  };

  const _renderPasswordInput = () => {
    return (
      <div>
        Provide your password to login:
        <br></br>
        <input
          type="password"
          placeholder="Type your password..."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={() => logInUsingPassword()}>
          Login & Recover with password
        </button>
        <br></br>
        {/* // TODO Set success msg here */}
      </div>
    );
  };

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality Login Google SSO</h3>
      <button onClick={logInUsingGoogleSSO}>Login with SSO</button>
      <br></br>

      <p>Or...</p>
      <br></br>
      <h3>Liquality Login with Password</h3>

      {_renderPasswordInput()}
      {loginResponse ? _renderLoggedInWalletDetails() : null}
    </div>
  );
};
