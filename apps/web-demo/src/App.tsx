// import { Login, CreateWallet } from "ui";
import { useState, useEffect } from "react";
import {ethers} from "ethers";
import * as ethers5 from "ethers5";
// import { NftService, setup } from "@liquality/wallet-sdk";
// import WormholeBridge, { WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect';
// import {WormholeConnectConfig} from '@wormhole-foundation/wormhole-connect';
// import {Workflow} from "x-flow"
import * as MyCollectives from "@koderholic/my-collectives"
import {Config} from "@koderholic/my-collectives"
export default function App() {

// const verifierMap: Record<string, any> = {
//   google: {
//     name: "Google",
//     typeOfLogin: "google",
//     clientId:
//       "852640103435-0qhvrgpkm66c9hu0co6edkhao3hrjlv3.apps.googleusercontent.com",
//     verifier: "liquality-google-testnet",
//   },
// };

// 1. Setup Service Provider
// const directParams = {
//   baseUrl: `http://localhost:3005/serviceworker`,
//   enableLogging: true,
//   networkUrl: "https://goerli.infura.io/v3/a8684b771e9e4997a567bbd7189e0b27",
//   network: "testnet" as any,
// };

  


  // let workflow = new Workflow("testnet")
  // let workflowData = {
  //   action: [],
  //   dAppChain: ""
  //   amount: bigint
  //   fromChain: string
  //   sender: string
  //   recipient: string
  //   dAppToken: TokenId,
  //   toNativeToken: string
  // }
  // workflow.start()

  // const config: WormholeConnectConfig = {
  //   env: "testnet",
  //   networks: ["ethereum", "ethereum"],
  //   tokens: ["ETH"],
  //   rpcs: {
  //     goerli: "https://rpc.ankr.com/eth",
  //     mumbai: "https://rpc.ankr.com/solana",
  //   }
  // }


  // .setup({
  //   alchemyApiKey:'',
  //   etherscanApiKey:"-",
  //   infuraProjectId:"-",
  //   pocketNetworkApplicationID:"-",
  //   quorum:1,
  //   slowGasPriceMultiplier:1,
  //   averageGasPriceMultiplier:1.5,
  //   fastGasPriceMultiplier:2,
  //   gasLimitMargin:2000,
  //   gelatoApiKey:"",
  // });

  // const [address, setAddress] = useState<string>();
  /*  const [nfts, setNfts] = useState<Nft[] | null>([]);

  async function updateNfts() {
    if (!address) throw new Error("set address first");
    //const nfts = await NftService.getNfts(address, 1);
    console.log(nfts, "NFTS in my addr");
    setNfts(nfts);
  } */

  // async function updateNfts() {
  //   // if (!address) throw new Error("set address first");
  //   // alert(window.ethereum.address)
  //   const hash = await NftService.createERC721Collection({tokenName: "gaslessNft", tokenSymbol:"gnft"}, 80001,"", true);
  //       // const hash = await NftService.mintERC721Token({contractAddress: "0x276d843c8c7f3aa6518b6ba119d92c6262dd3577", recipient:"0x97542289b1453eb8e9c0f4af562ef7eb354db75c", uri:"spark"}, 80001,"<private key>", true);

  //   console.log("hash => ",hash);
  //   // console.log(nfts, "NFTS in my addr");
  //   // setNfts(nfts);
  // }
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState({} as ethers5.providers.Web3Provider);
  const [cAddress, setCAddress] = useState("");
  const [cWallet, setCWallet] = useState("");
  const [nonceKey, setNonceKey] = useState(BigInt(0));
  const [isMember, setIsMember] = useState(false);

    useEffect(() => {
      async function loadWeb3() {
        if ((window as any).ethereum) {
          try { 
            (window as any).ethereum.enable().then(async function() {
                // User has allowed account access to DApp...
                const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                setAccounts(accounts);
                console.log(" accounts => ", accounts)
                setWeb3(new ethers5.providers.Web3Provider((window as any).ethereum))
                setCAddress("0xbb9077712ee90363dDE89E096e2CDb3422cb2c29")
                setCWallet("0x2F6f72c1B8C41f19BD553D2c567736d980064bE6")
                setNonceKey(BigInt("7770406593368469"))

            });
          } catch(e) {
            // User has denied account access to DApp...
          }
        }
      }
      loadWeb3()
    }, []);

// cAddress
// : 
// "0xeFF491FFAB85Bb15D7BCF64ca9E2d6165c95a049"
// cWallet
// : 
// "0xd6efC618660082D443576CfAb76E0DA288896170"
// nonce
// : 
// 1553171750399979n
// userOp hash: "0xb528ab313493dbeae231589e970bfdec207540b3054cf812fa78a05a7f694750"
// ====== New ========
// cAddress: "0xc3Cb13c52b0dad0717FfF0b4D0D81307f7fC6f9B"
// cWallet: "0xd59fC701a45FE39c033B2014E9da9B04c9C793F2"
// nonce: 7770406593368469n
// userOpHash: "0x9fed14cb1000f9f36f0dffe9dce62120e015b1726cb597a955f1ae466f1ca224"

  async function createWallet() {
    MyCollectives.setConfig({} as Config)
    const response = await MyCollectives.Collectives.create(web3, {tokenContracts: [accounts[1]], honeyPots: [accounts[2]] }, 1204570) //1202270 312270 319570 219570 119570 119587 119567
    console.log("!!!!! response => ", response)
    setCAddress(response.cAddress)
    setCWallet(response.cWallet)
    setNonceKey(response.nonce!)
  }

  // "0xb2bb96cc74a61b562d9a86792f3985888586d553d1506cf37d5536bb057b05e3"
  async function createPools() {
    MyCollectives.setConfig({} as Config)
    const response = await MyCollectives.Collectives.createPools(web3, {address: cAddress, wallet:cWallet, nonceKey}, {tokenContracts: [accounts[1]], honeyPots: [accounts[2]] })
    console.log("!!!!! response => ", response)
  }

  async function joinCollective() {
    MyCollectives.setConfig({} as Config)
    const inviteId = ethers.randomBytes(16);
    console.log("inviteId >> ", inviteId.toString())

    // Hash the inviteId
    let messageHash = ethers5.utils.solidityKeccak256(
        ["bytes16"],
        [inviteId]
    );
    // Sign the inviteID hash to get the inviteSig from the initiator
    let messageHashBinary = ethers5.utils.arrayify(messageHash);
    let inviteSig = await web3.getSigner().signMessage(messageHashBinary);
    console.log("inviteSig >> ", inviteSig)
      alert(inviteSig)
    const response = await MyCollectives.Collectives.join(web3, {address: cAddress, wallet:cWallet, nonceKey}, {inviteSignature: inviteSig, inviteCode: inviteId})
    console.log("!!!!! response => ", response)
  }

  async function leaveCollective() {
    MyCollectives.setConfig({} as Config)
    const response = await MyCollectives.Collectives.leave(web3, {address: cAddress, wallet:cWallet, nonceKey})
    console.log("!!!!! response => ", response)
  }

  async function checkMembership() {
    MyCollectives.setConfig({} as Config)
    const response = await MyCollectives.Collectives.isMember(web3, {address: cAddress, wallet:cWallet, nonceKey}, await web3.getSigner().getAddress())
    setIsMember(response.isMember)
    console.log("!!!!! response => ", response)
  }
  

  return (
    <div>
    <div>
      <div>
        <button onClick={createWallet}>Create Collective</button>
        <p>{cAddress}</p>
        <p>{cWallet}</p>
      </div>
      <button onClick={createPools}>Create Pools</button>
      <div>
        <button onClick={joinCollective}>Join Collective</button>
      </div>
      <div>
        <button onClick={leaveCollective}>Leave Collective</button>
      </div>
      <div>
        <button onClick={checkMembership}>Check Membership</button>
        <p>is member?: {isMember}</p>
      </div>
    </div>
    </div>
  );
}

