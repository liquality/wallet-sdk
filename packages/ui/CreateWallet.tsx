import * as React from "react";
import { useState } from "react";
import { auth } from "sdk";
import { DirectParams } from "sdk/src/types";

type Props = {
  directParams: DirectParams;
  verifierMap: Record<string, any>;
};

export const CreateWallet: React.FC<Props> = (props) => {
  const [shareToggle, setShareToggle] = useState<string>("split");
  const [loginResponse, setLoginResponse] = useState<any>({});

  const initializeNewKey = async () => {
    const response = await auth.initializeNewKey(
      props.directParams,
      props.verifierMap
    );
    setLoginResponse(response);
  };

  console.log(loginResponse, "LOGINRESPONSE IN REACT COMÅPNENT");
  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality & tKey Create Wallet</h3>
      <button onClick={initializeNewKey}>Create Wallet</button>
    </div>
  );
};
