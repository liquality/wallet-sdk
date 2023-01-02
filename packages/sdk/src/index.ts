import { OwnedNft } from "alchemy-sdk"; // This is temporary, probably need custom types
import axios from "axios";

export type { OwnedNft };

const API_URL = "http://localhost:3001";

const sdk = {
  async getNfts(address: string): Promise<OwnedNft[]> {
    let url = `${API_URL}/nft/${address}`
    const result = await axios.get(url);
    return result.data;
  },
};

export default sdk;
