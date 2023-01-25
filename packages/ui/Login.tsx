import * as React from "react";
import { useState } from "react";
import { auth } from "sdk";
import { DirectParams } from "sdk/src/types";

type Props = {
  directParams: DirectParams;
  verifierMap: Record<string, any>;
};

export const Login: React.FC<Props> = (props) => {
  const [loginResponse, setLoginResponse] = useState<any>({});
  const [tKey, setTKey] = useState<any>({});

  const [password, setPassword] = useState<string>("");

  const logInUsingGoogleSSO = async () => {
    const response = await auth.loginUsingLocalShare(
      tKey,
      props.directParams,
      props.verifierMap
    );
    setLoginResponse(response);
  };

  const logInUsingPassword = async () => {
    await auth.loginUsingPassword(tKey, password);
  };

  //Init tkey instance
  React.useEffect(() => {
    const init = async () => {
      const tKeyResponse = await auth.init(props.directParams);
      setTKey(tKeyResponse);
    };
    init();
  }, [loginResponse]);

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
    </div>
  );
};
