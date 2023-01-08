import { Login, CreateWallet } from "ui";
import sdk, { OwnedNft } from "sdk";
import { useState } from "react";

export default function Web() {
  const [address, setAddress] = useState<string>();
  const [nfts, setNfts] = useState<OwnedNft[]>();

  async function updateNfts() {
    if (!address) throw new Error("set address first");
    const nfts = await sdk.getNfts(address);
    setNfts(nfts);
  }

  return (
    <div>
      <Login />
      <CreateWallet />
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
      {nfts && (
        <div>
          <h2>Nft list</h2>
          {nfts.map((nft) => (
            <div>{nft.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
