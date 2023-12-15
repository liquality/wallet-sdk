import { random } from "lodash";
import { getChainProvider } from "../factory/chain-provider";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Wallet } from "ethers";

export async function withInterval<T>(
  func: () => Promise<T | undefined>
): Promise<T> {
  const updates = await func();
  if (updates) {
    return updates;
  }
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const updates = await func();
      if (updates) {
        clearInterval(interval);
        if(updates instanceof Error) reject(updates)
        else resolve(updates);
      }
    }, random(5000, 10000));
  });
}


export async function fetchGet(url: string, params?: any) {
  if(params) url =  `${url}?${(new URLSearchParams(params)).toString()}`;
  const response: any = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return response.json();
}

export async function getWallet(pkOrProvider: string | ExternalProvider, chainID: number) {
  if(typeof pkOrProvider === 'string') 
    return new Wallet(pkOrProvider, (await getChainProvider(chainID)));
 
  return (await getChainProvider(chainID, pkOrProvider) as Web3Provider).getSigner()
}

export async function getChainID(pkOrProvider: string | ExternalProvider, chainID?: number): Promise<number> {
  if(typeof pkOrProvider === 'string') return chainID!;
  
  const hexChainID = await (pkOrProvider as ExternalProvider).request!({method: 'eth_chainId'});
  return parseInt(hexChainID);
}


