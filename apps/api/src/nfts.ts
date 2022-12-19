import { Router } from "express";
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "ht2e6QuagEoss6f2fjTV7WQZnXYhC8Hs",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const router = Router();

router.get("/get", async (req, res, next) => {
  // Get all the NFTs owned by an address
  const address = req.query.address as string;
  const nfts = await alchemy.nft.getNftsForOwner(address);
  res.status(200).json(nfts.ownedNfts);
});

export default router;
