export class Config {
  public static ALCHEMY_API_KEY: string; 
  public static ETHERSCAN_API_KEY: string;
  public static INFURA_PROJECT_ID: string;  
  public static POCKET_NETWORK_APPLICATION_ID: string;
  public static QUORUM: number = 1;
  public static SLOW_GAS_PRICE_MULTIPLIER: number = 1;
  public static AVERAGE_GAS_PRICE_MULTIPLIER: number = 1.5;
  public static FAST_GAS_PRICE_MULTIPLIER: number = 2;
  public static GAS_LIMIT_MARGIN: number = 2000;
  public static ADDRESS_GENERATION_COUNT: number = 5;
}
