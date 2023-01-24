import { TransactionReceiptsBlockHash } from "alchemy-sdk";
import axios from "axios";
import { Wallet } from "ethers";
import { API_URL } from "../constants";
import { CreateERC1155CollectionRequest, CreateERC721CollectionRequest, MintERC1155Request, MintERC721Request, Nft, TransferRequest } from "../types";

  export async function getNfts(address: string): Promise<Nft[]> {
    const result = await axios.get(`${API_URL}/nft/collectibles/${address}`);
    return result.data;
  }

  export async function transferNft(transferRequest: TransferRequest, pk: string): Promise<string> {
    const unsignedTxResponse = await axios.post(`${API_URL}/nft/transfer/unsigned-transactions`, transferRequest);
    const signedTx =  new Wallet(pk).signTransaction(unsignedTxResponse.data);
    const txHashResponse = await axios.post(`${API_URL}/transactions/on-chain-transactions`, signedTx);
    return txHashResponse.data;
  }

  export async function createERC1155Collection(creationRequest: CreateERC1155CollectionRequest, pk: string): Promise<string> {
    const unsignedTxResponse = await axios.post(`${API_URL}/nft/erc1155/deployment/unsigned-transactions`, creationRequest);
    const signedTx =  new Wallet(pk).signTransaction(unsignedTxResponse.data);
    const txHashResponse = await axios.post(`${API_URL}/transactions/on-chain-transactions`, signedTx);
    return txHashResponse.data;
  }

  export async function createERC721Collection(creationRequest: CreateERC721CollectionRequest, pk: string): Promise<string> {
    const unsignedTxResponse = await axios.post(`${API_URL}/nft/erc721/deployment/unsigned-transactions`, creationRequest);
    const signedTx =  new Wallet(pk).signTransaction(unsignedTxResponse.data);
    const txHashResponse = await axios.post(`${API_URL}/transactions/on-chain-transactions`, signedTx);
    return txHashResponse.data;
  }

  export async function mintERC1155Token(mintRequest: MintERC1155Request, pk: string): Promise<string> {
    const unsignedTxResponse = await axios.post(`${API_URL}/nft/erc1155/mint/unsigned-transactions`, mintRequest);
    const signedTx =  new Wallet(pk).signTransaction(unsignedTxResponse.data);
    const txHashResponse = await axios.post(`${API_URL}/transactions/on-chain-transactions`, signedTx);
    return txHashResponse.data;
  }

  export async function mintERC721Token(mintRequest: MintERC721Request, pk: string): Promise<string> {
    const unsignedTxResponse = await axios.post(`${API_URL}/nft/erc721/deployment/unsigned-transactions`, mintRequest);
    const signedTx =  new Wallet(pk).signTransaction(unsignedTxResponse.data);
    const txHashResponse = await axios.post(`${API_URL}/transactions/on-chain-transactions`, signedTx);
    return txHashResponse.data;
  }