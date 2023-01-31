import { getAlchemyProvider } from "../factory/alchemy-provider";
import BigNumber from 'bignumber.js';

export abstract class ERC20 {

  public static async listAccountTokens(address: string, chainID: number) {
    
    const alchemyProvider = getAlchemyProvider(chainID);

    const balances = await alchemyProvider.core.getTokenBalances(address);
  
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });
    
    const accountTokens = [];
    for (let token of nonZeroBalances) {
      let balance = token.tokenBalance;
  
      // Get metadata of token
      const metadata = await alchemyProvider.core.getTokenMetadata(token.contractAddress);
  
      // Compute token balance in human-readable format
      let formattedBalance;
      if(balance && metadata.decimals) {
        formattedBalance = new BigNumber(balance).div(Math.pow(10, metadata.decimals));
        formattedBalance = formattedBalance.toFixed(2);
      }

      accountTokens.push({
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
        rawBalance: balance,
        formattedBalance,
      })
    }

    return accountTokens;
  }

  public static async getBalance(contractAddress: string, ownerAddress: string, chainID: number) {
    
    const alchemyProvider = getAlchemyProvider(chainID);

    const balance = (await alchemyProvider.core.getTokenBalances(ownerAddress, [contractAddress])).tokenBalances[0].tokenBalance;
    
      // Get metadata of token
      const metadata = await alchemyProvider.core.getTokenMetadata(contractAddress);

      // Compute token balance in human-readable format
      let formattedBalance;
      if(balance && metadata.decimals) {
        formattedBalance = new BigNumber(balance).div(Math.pow(10, metadata.decimals));
        formattedBalance = formattedBalance.toFixed(2);
      }

      return {
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
        rawBalance: balance,
        formattedBalance,
      }; 
  }
}
