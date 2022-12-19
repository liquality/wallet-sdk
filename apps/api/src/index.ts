import express, { json, urlencoded } from "express";
import cors from "cors";
import nfts from "./nfts";

const app = express();
const port = 3001;

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use(cors());

// @ts-ignore
app.use("/v1/nfts/", nfts);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
