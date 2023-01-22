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

  const initializeNewKey = async () => {
    const response = await auth.initializeNewKey(directParams, verifierMap);
    setLoginResponse(response);
  };

  const _renderPasswordInput = () => {
    return (
      <div>
        Set password minimum 10 characters:
        <input
          type="text"
          placeholder="Address"
          value={password}
          onChange={(e) => {
            e.target.value.length >= 10;
            setPassword(e.target.value);
          }}
        />
        <button
          onClick={() =>
            auth.generateNewShareWithPassword(loginResponse.tkey, password)
          }
        >
          Set password
        </button>
      </div>
    );
  };

  const _renderCreatedWalletDetails = () => {
    return (
      <div>
        <h3 style={{ color: "green" }}>
          Your wallet was created successfully!
        </h3>
      </div>
    );
  };
  console.log(loginResponse, "LOGINRESPONSE IN REACT COMÅPNENT");
  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality & tKey Create Wallet</h3>
      <button onClick={initializeNewKey}>Create Wallet</button>
      {loginResponse.tkey ? _renderCreatedWalletDetails() : null}
      {loginResponse.tkey ? _renderPasswordInput() : null}
    </div>
  );
};
