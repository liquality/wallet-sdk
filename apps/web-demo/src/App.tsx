// import { Login, CreateWallet } from "ui";
import { useState, useEffect } from "react";
import {ethers, id} from "ethers";
import * as ethers5 from "ethers5";
// import { NftService, setup } from "@liquality/wallet-sdk";
// import WormholeBridge, { WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect';
// import {WormholeConnectConfig} from '@wormhole-foundation/wormhole-connect';
// import {Workflow} from "x-flow"
import * as MyCollectives from "@liquality/my-collectives-sdk"
import {AAProviders, Config, SupportedPlatforms} from "@liquality/my-collectives-sdk"
import { sign } from "crypto";


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
  const [poolAddr, setPool] = useState("");
  const [mockToken, setMockToken] = useState("");
  const [honeyPot, setHoneyPot] = useState("");
  const [topContributor, setTopContributor] = useState("");
  const [reward, setReward] = useState("");
  const [poolReward, setPoolReward] = useState("");
  const [totalPoolContributions, setTotalPoolContributions] = useState("");
  const [poolParticipation, setPoolParticipation] = useState({participant:"", contribution:"", reward:"", availableReward: ""});
  const [mockTokenLocal, setMockTokenLocal] = useState("");
  const [honeyPotLocal, setHoneyPotLocal] = useState("");
  const [network, setNetwork] = useState(""); // State to store user-selected network
  const [rpc, setRPC] = useState(""); // State to store chain ID



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
                setCAddress("0x417b83Ea65EBaB8864235df08d6c97f3b5a6e7C4")
                setCWallet("0xaEc4D067b4b99b9113577b9B904560a4F7f688BA")
                setNonceKey(BigInt("7597334088966139"))
                setMockTokenLocal("0x8bc07A56032D4caCb7A4516c016c9120908E7eab") //Local old- 0x288fFC62c3f4142C618B7D109E0Cf0405766F25E
                setMockToken("0x288fFC62c3f4142C618B7D109E0Cf0405766F25E")  // Zora Goerli- 0xa3b59a1080f2ae8efbe902bb03c15cb342d648fd // mumbai - 0xE646f9783246D0Af8280A5C212486cC4091D0F8C            
                setHoneyPot("0x6C61D2D1e54e6b2a2AcFab3cCA8B85AD01F9e7c3") // Zora - 0xF64A284F04B5cF17dCa2e75501d8e835E3b25388
                setHoneyPotLocal("0x3374A9EcD75a7b8FFD6ebC5B19CeAf2330aCF246") // LOCAL token - 0x6C61D2D1e54e6b2a2AcFab3cCA8B85AD01F9e7c3 // Zora => 0xF64A284F04B5cF17dCa2e75501d8e835E3b25388
                setPool("0x336c0f451640fba29b9e32d5758fd7921ba945d4")//0xFD60494AD110E522aDd5ACcE07500D327F61c5a0-for mockToken // Local token pool - 0x3b1E7B7754C074B807a845fBa18198574Da03068 // Zora - 0xae3B9D4BEd0C5687e90A0D1a18C105CDB5C72ccf
                // setCAddress("0xbb9077712ee90363dDE89E096e2CDb3422cb2c29")
                // setCWallet("0x2F6f72c1B8C41f19BD553D2c567736d980064bE6")
                // setNonceKey(BigInt("7770406593368469"))
            });
          } catch(e) {
            // User has denied account access to DApp...
          }
        }
      }
      loadWeb3()
    }, []);

  


  async function createWallet() {
    const response = await MyCollectives.Collective.create(web3, {tokenContracts: [mockToken], honeyPots: [honeyPot] }, 5099094) //last(119570)1202270 312270 319570 219570 119570 119587 119567
    console.log("!!!!! response => ", response)
    setCAddress(response.cAddress)
    setCWallet(response.cWallet)
    setNonceKey(response.nonce!)
  }

  // "0xb2bb96cc74a61b562d9a86792f3985888586d553d1506cf37d5536bb057b05e3"
  async function createPools() {
    const response = await MyCollectives.Collective.createPools(web3, {address: cAddress, wallet:cWallet, nonceKey}, {tokenContracts: [mockTokenLocal], honeyPots: [honeyPotLocal] })
    console.log("!!!!! response => ", response)
  }

  async function joinCollective() {
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
    const response = await MyCollectives.Collective.join(web3, {address: cAddress, wallet:cWallet, nonceKey}, {inviteSignature: inviteSig, inviteCode: inviteId})
    console.log("!!!!! response => ", response)
  }

  async function leaveCollective() {
    const response = await MyCollectives.Collective.leave(web3, {address: cAddress, wallet:cWallet, nonceKey})
    console.log("!!!!! response => ", response)
  }

  async function checkMembership() {
    const response = await MyCollectives.Collective.isMember(web3, {address: cAddress, wallet:cWallet, nonceKey}, await web3.getSigner().getAddress())
    setIsMember(response.isMember)
    console.log("!!!!! response => ", response)
  }

  async function getPools() {
    const response = await MyCollectives.Collective.getPoolByHoneyPot(web3, {address: cAddress, wallet:cWallet, nonceKey}, honeyPotLocal)
    setPool(response)
    console.log("!!!!! response => ", response)
  }
  
  async function poolMint() {
    const response = await MyCollectives.Pool.mint(web3, {address: cAddress, wallet:cWallet, nonceKey}, {
      recipient: await web3.getSigner().getAddress(),
      tokenID: 11,
      amount: ethers.parseEther("0.000001"),//("0.000777"),
      quantity: 1,
      platform: SupportedPlatforms.LOCAL,
      tokenContract: mockTokenLocal,
      poolAddress: poolAddr,

    })
    // setPool(response.pools)

    console.log("!!!!! response => ", response)
  }

   // Function to set the user-selected network
   function handleNetworkChange(selectedNetwork: string) {
    setNetwork(selectedNetwork);

    if (selectedNetwork == "goerli") {
      setRPC("https://goerli.infura.io/v3/a8684b771e9e4997a567bbd7189e0b27");
    } else if (network == "mumbai") {
      setRPC("https://polygon-mumbai.g.alchemy.com/v2/H0uohgB1uBNmypvvHtAS-s5dd7Oj7Y6C");
    }
    console.log(">> rpc => ", rpc)
    MyCollectives.setConfig({
      RPC_URL: rpc,//"https://eth-goerli.g.alchemy.com/v2/NoipFVjRtyObPoZ1n35BPiLqY8DWsqZA",// 
      PIMLICO_API_KEY: "60dd09aa-ef22-4c57-9ca8-d3f25d7ec047",
      AA_PROVIDER: AAProviders.PIMLICO,
      // BICONOMY_PAYMASTER: "https://paymaster.biconomy.io/api/v1/5/Ss9NO7p3y.ad8caffd-7726-49bf-a68e-b7fe86ad1883", 
      // BICONOMY_BUNDLER_API_KEY: "nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    } as Config);
    // You can also set the chainId based on the selected network if necessary
    // setChainId(selectedChainId);
  }

  // get participant data
  async function getParticipantData() {
    const response = await MyCollectives.Pool.getParticipation(poolAddr, await web3.getSigner().getAddress())
    setPoolParticipation({participant: response.participant, contribution: response.contribution.toString(), reward: response.reward.toString(), availableReward: response.rewardAvailable.toString()})
    // const token = new ethers5.Contract(mockToken, ["function balanceOf(address owner) view returns (uint256)"], web3.getSigner())
    // const bal = await token.balanceOf(accounts[2])
    // console.log("!!!!! bal => ", bal)
    // setPool(response.pools)
    console.log("!!!!! response => ", response)

    // get balance of signer in cwallet 
    const cWalletContract = new ethers5.Contract(cWallet, ["function balance(address) view returns (uint256)"], web3.getSigner())
    const balance = await cWalletContract.balance(await web3.getSigner().getAddress())
    console.log("balance 2 >>> ", ethers5.utils.formatEther(balance))

  }


  async function createHoneyPot() {
    const response = await MyCollectives.HoneyPot.create(web3, 182226)
    setHoneyPot(response.honeyPot)
    console.log("!!!!! response => ", response)
  }

  // Add missing functions
  async function getHoneyPot() {
    const response = await MyCollectives.HoneyPot.get(web3, 182226)
    setHoneyPot(response.honeyPot)
    console.log("!!!!! response => ", response)
  }

  // forwardValue from mockToken to honeyPot
  // async function forwardValue() {
  //   const response = await MyCollectives.HoneyPot.forwardValue(web3, {address: cAddress, wallet:cWallet, nonceKey}, [mockToken, honeyPot], ethers.parseEther("0.0003"))
  //   console.log("!!!!! response => ", response)
  // }

  async function sendreward() {
    const response = await MyCollectives.HoneyPot.sendReward(web3, {address: cAddress, wallet:cWallet, nonceKey}, [honeyPot])
    console.log("!!!!! response => ", response)
  }

  // get pool info from sdk function
  async function getPoolInfo() {
    const response = await MyCollectives.Pool.getPoolInfo(poolAddr)
    console.log("!!!!! response => ", response)
  }

  async function setTopContributorInHoneyPot() {
    const response = await MyCollectives.HoneyPot.setTopContributor(web3, honeyPot, cWallet)
    console.log("!!!!! response => ", response)
  }

  async function getTopContributor() {
    const response = await MyCollectives.HoneyPot.getTopContributor(honeyPot)
    setTopContributor(response)
    console.log("!!!!! response => ", response)
  }

  async function withdrawRewards() {
    const response = await MyCollectives.Pool.withdrawRewards(web3, {address: cAddress, wallet:cWallet, nonceKey}, [poolAddr], await web3.getSigner().getAddress())
    console.log("!!!!! response => ", response)
  }

  async function distributeReward() {
    const response = await MyCollectives.Pool.distributeRewards(web3, {address: cAddress, wallet:cWallet, nonceKey}, [poolAddr])
    console.log("!!!!! response => ", response)
  }

  async function getPoolReward() {
    const reward = await MyCollectives.Pool.getPoolReward(poolAddr)
    setPoolReward(reward)
    console.log("!!!!! response => ", reward)
  }

  async function getTotalPoolContributions() {
    const totalContributions = await MyCollectives.Pool.getTotalContributions(poolAddr)
    setTotalPoolContributions(totalContributions.toString())
    console.log("!!!!! response => ", totalContributions)
  }

  //getPoolParticipants  from sdk function
  async function getPoolParticipants() {
    const response = await MyCollectives.Pool.getPoolParticipants(web3, poolAddr)
    console.log("!!!!! response => ", response)
  }
  

  return (
    //
    <div>
    <div>
      <div>NETWORK USED: {network}</div>
      <div>CURRENT RPC USED: {rpc}</div>
      <div>
        <button onClick={() => handleNetworkChange("goerli")}>Select Goerli Network</button>
        <button onClick={() => handleNetworkChange("mumbai")}>Select Mumbai Network</button>
      </div>
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
      <div>
        <button onClick={getPools}>Get Created Pools</button>
        <p>Pools: {poolAddr}</p>
      </div>
      <div>
        <button onClick={poolMint}>Pool mint</button>
      </div>
      <div>
        <button onClick={getParticipantData}>Pool Participation</button>
        <p>Participant Address: {poolParticipation.participant}</p>
        <p>Participant Contribution: {poolParticipation["contribution"]}</p>
        <p>Participant Reward: {poolParticipation["reward"]}</p>
        <p>Participant Available Reward: {poolParticipation["availableReward"]}</p>
      </div>
      <div>
        <button onClick={createHoneyPot}>Create HoneyPot</button>
        <p>{honeyPot}</p>
      </div>
      <div>
        <button onClick={getHoneyPot}>Get HoneyPot</button>
        <p>{honeyPot}</p>
      </div>
      <div>
        <button onClick={sendreward}>Send HoneyPot reward To TopContributor</button>
      </div>
      <div>
        <button onClick={setTopContributorInHoneyPot}>Set TopContributor</button>
      </div>
      <div>
        <button onClick={getTopContributor}>Get TopContributor</button>
        <p>{topContributor}</p>
      </div>
      <div>
        <button onClick={withdrawRewards}>Withdraw Reward Across Pools</button>
      </div>
      <div>
        <button onClick={distributeReward}>Distribute Reward Across Pools</button>
      </div>
      <div>
        <button onClick={getPoolReward}>Get Pool Reward</button>
        <p>{poolReward}</p>
      </div>
      <div>
        <button onClick={getTotalPoolContributions}>Total contributions In Pool</button>
        <p>{totalPoolContributions}</p>
      </div>
      <div>
        <button onClick={getPoolInfo}>Get Pool Info</button>
      </div>
      <div>
        <button onClick={getPoolParticipants}>Get Pool Participants</button>
      </div>
      
    </div>
    </div>
  );
}

