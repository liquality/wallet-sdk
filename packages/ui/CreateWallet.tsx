import * as React from "react";
import { useState } from "react";
import sdk from "sdk";

export const CreateWallet = () => {
  const [shareToggle, setShareToggle] = useState<string>("split");

  const initializeNewKey = async () => {
    const verifierMap: Record<string, any> = {
      google: {
        name: "Google",
        typeOfLogin: "google",
        clientId:
          "852640103435-0qhvrgpkm66c9hu0co6edkhao3hrjlv3.apps.googleusercontent.com",
        verifier: "liquality-google-testnet",
      },
    };

    // 1. Setup Service Provider
    const directParams = {
      baseUrl: `http://localhost:3005/serviceworker`,
      enableLogging: true,
      networkUrl:
        "https://goerli.infura.io/v3/a8684b771e9e4997a567bbd7189e0b27",
      network: "testnet" as any,
    };
    sdk.initializeNewKey(verifierMap, directParams);
  };

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality & tKey Create Wallet</h3>
      <button onClick={initializeNewKey}>Create Wallet</button>
    </div>
  );
};
