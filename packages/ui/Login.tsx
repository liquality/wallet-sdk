import * as React from "react";
import { auth } from "sdk";
import { DirectParams } from "sdk/src/types";

type Props = {
  directParams: DirectParams;
  verifierMap: Record<string, any>;
};

export const Login: React.FC<Props> = (props) => {
  const logInUsingGoogleSSO = async () => {
    await auth.initializeNewKey(props.directParams, props.verifierMap);
  };

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality Login Google SSO</h3>
      <button onClick={logInUsingGoogleSSO}>Login</button>
    </div>
  );
};
