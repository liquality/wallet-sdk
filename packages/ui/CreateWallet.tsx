import * as React from "react";
import { useState } from "react";
import sdk from "sdk";

export const CreateWallet = () => {
  const [shareToggle, setShareToggle] = useState<string>("split");

  const initializeNewKey = async () => {
    sdk.initializeNewKey();
  };

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <h3>Liquality & tKey Create Wallet</h3>
      <button onClick={initializeNewKey}>Create Wallet</button>
    </div>
  );
};
