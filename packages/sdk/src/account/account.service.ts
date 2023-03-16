import { ethers } from "ethers";
import { getChainProvider } from "../factory/chain-provider";


export abstract class AccountService {

    public static async getBalance(address: string, chainID: number)  {
        let balance = await (await getChainProvider(chainID)).getBalance(address)
        return balance.toString()
    }
}