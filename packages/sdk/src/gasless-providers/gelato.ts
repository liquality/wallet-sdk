import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import { Wallet } from "ethers";
import { GELATO_RELAY_ADDRESS } from "../common/constants";
import { withInterval, fetchGet, getWallet } from "../common/utils";
import { GelatoRelay } from "@gelatonetwork/relay-sdk";
import { Config } from "../common/config";

export abstract class Gelato{

    static async sendTx(chainID: number, contractAddress:string, sender: string, data: string, pkOrProvider: string | ExternalProvider) {
        let walletOrProvider;
        if(typeof pkOrProvider === 'string' ) walletOrProvider = await getWallet(pkOrProvider, chainID) as Wallet;
        else walletOrProvider = new Web3Provider(pkOrProvider) ;

        const request = {
            chainId: chainID,
            target: contractAddress,
            data,
            user: sender
          };
          
          const relay = new GelatoRelay();
          const relayResponse = await relay.sponsoredCallERC2771(request, walletOrProvider, Config.GELATO_API_KEY);
          const taskID = relayResponse.taskId;
      
      
          const hash = await withInterval( async () => {
            const response = await fetchGet(`https://relay.gelato.digital/tasks/status/${taskID}`);
            const task = response.task;
            const badStates = ["Cancelled","ExecReverted"];
            if(task?.taskState === "CheckPending" || response.message === "Status not found") return null;
            else if(badStates.includes(task.taskState)) {
              return new Error("Gasless transaction Failed");
            }else{
              return task.transactionHash
            }
          })    
      
          return hash;
    
    }
}
