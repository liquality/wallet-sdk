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

  const logInUsingGoogleSSO = async () => {
    const response = await auth.initializeNewKey(
      props.directParams,
      props.verifierMap
    );
    setLoginResponse(response);
  };

  console.log(loginResponse, "LOGINRESPONSE IN REACT COMÅPNENT LOGIIIN");

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality Login Google SSO</h3>
      <button onClick={logInUsingGoogleSSO}>Login</button>
    </div>
  );
};
