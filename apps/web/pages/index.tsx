import { useState } from "react";

export default function Web() {
  const [address, setAddress] = useState<string>();

  async function updateNfts() {
    if (!address) throw new Error("set address first");
  }

  return (
    <div>
      <hr />
      <div>
        NFT address:
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
        <button onClick={() => updateNfts()}>Get NFTS</button>
      </div>
    </div>
  );
}
