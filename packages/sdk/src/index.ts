import { OwnedNft } from "alchemy-sdk"; // This is temporary, probably need custom types
import axios from "axios";

export type { OwnedNft };

const API_URL = "http://localhost:3001/v1";

const sdk = {
  async getNfts(address: string): Promise<OwnedNft[]> {
    const result = await axios.get(`${API_URL}/nfts/get`, {
      params: { address },
    });
    return result.data;
  },
};

export default sdk;
