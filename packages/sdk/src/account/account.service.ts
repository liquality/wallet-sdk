import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { getChainProvider } from "../factory/chain-provider";


export abstract class AccountService {

    public static async getBalance(address: string, chainID: number)  {
        let balance = await (await getChainProvider(chainID)).getBalance(address)
        return {
            rawBalance: balance.toString(),
            formattedBalance: formatEther(balance)
        }
    }
}