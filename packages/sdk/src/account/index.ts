import { utils } from "ethers";
import { Config } from "../common/config";
import { getChainProvider } from "../factory/chain-provider";


export abstract class Account {

    public static generateAddresses(mnemonic: string, accountIndex = 0, numberOfAddresses = Config.ADDRESS_GENERATION_COUNT) {
        const hdNode = utils.HDNode.fromMnemonic(mnemonic);

        const addresses = [];
        for(let addressIndex = 0; addressIndex < numberOfAddresses; addressIndex++) {
            const {privateKey, address} = hdNode.derivePath(`m/44'/60'/${accountIndex}'/0/${addressIndex}`);
            addresses.push({privateKey, address});
        }

        return addresses;

    }

    public static async getBalance(addresses: string[], chainID: number) {
        const chainProvider = getChainProvider(chainID);
        return addresses.map(address => chainProvider.getBalance(address));
    }
}