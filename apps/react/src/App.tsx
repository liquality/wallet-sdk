import { Login, CreateWallet, LoginModal } from "ui";
import { useState } from "react";
import { NftService } from "@liquality/wallet";
import { Nft } from "@liquality/wallet";
import Button from "react-bootstrap/Button";

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
  networkUrl: "https://goerli.infura.io/v3/a8684b771e9e4997a567bbd7189e0b27",
  network: "testnet" as any,
};

export default function Web() {
  const [address, setAddress] = useState<string>();
  const [showLiqualityModal, setShowLiqualityModal] = useState(false);
  const [loginResponse, setLoginResponse] = useState<any>(null);

  const [nfts, setNfts] = useState<Nft[] | null>([]);

  async function updateNfts() {
    if (!address) throw new Error("set address first");
    const nfts = await NftService.getNfts(address, 1);
    console.log(nfts, "NFTS in my addr");
    setNfts(nfts);
  }

  return (
    <div>
      <Login directParams={directParams} verifierMap={verifierMap} />
      <CreateWallet directParams={directParams} verifierMap={verifierMap} />
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
            <div>{nft.contract.name}</div>
          ))}
        </div>
      )}

      <br></br>
      <br></br>
      <br></br>
      <Button onClick={() => setShowLiqualityModal(true)}>
        Show Liq Modal
      </Button>

      <LoginModal
        showModal={showLiqualityModal}
        setShowModal={setShowLiqualityModal}
        directParams={directParams}
        verifierMap={verifierMap}
        loginResponse={loginResponse}
        setLoginResponse={setLoginResponse}
      ></LoginModal>

      {loginResponse ? (
        <p>
          You signed in using login component!{" "}
          <p>Public address: {loginResponse.loginResponse.publicAddress}</p>
        </p>
      ) : null}
    </div>
  );
}
