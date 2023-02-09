import { OwnedNft } from "alchemy-sdk"; // This is temporary, probably need custom types
import axios from "axios";

export type { OwnedNft };

//END OF THIS WORKS AS EXPECTED
const API_URL = "http://localhost:3001";
export const nft = {
  async getNfts(address: string): Promise<OwnedNft[]> {
    let url = `${API_URL}/nft/${address}`;
    const result = await axios.get(url);
    return result.data;
  },
};

//export default nft
