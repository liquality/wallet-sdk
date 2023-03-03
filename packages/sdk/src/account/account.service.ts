import { ethers } from "ethers";
import { getChainProvider } from "src/factory/chain-provider";


export abstract class AccountService {

    public static async getBalance(address: string, chainID: number)  {
        let balance = await getChainProvider(chainID).getBalance(address)
        return balance.toString()
    }
}