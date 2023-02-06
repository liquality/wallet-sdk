import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../custom.css";
import { AuthService } from "@liquality/wallet";

interface ModalProps {
  children: React.ReactNode;
  show: boolean;
  onAction: (params: boolean) => void;
  //TODO
  //directParams should also be here since users will need to register SW on their side?
  //same thing with verifierMap
}

const directParams = {
  baseUrl: `http://localhost:3005/serviceworker`,
  enableLogging: true,
  networkUrl: "https://goerli.infura.io/v3/a8684b771e9e4997a567bbd7189e0b27",
  network: "testnet" as any,
};

const verifierMap: Record<string, any> = {
  google: {
    name: "Google",
    typeOfLogin: "google",
    clientId:
      "852640103435-0qhvrgpkm66c9hu0co6edkhao3hrjlv3.apps.googleusercontent.com",
    verifier: "liquality-google-testnet",
  },
};

export const LoginModal: React.FC<ModalProps> = (props) => {
  const { children, onAction, show } = props;
  const [tKey, setTKey] = useState<any>({});
  const [loginResponse, setLoginResponse] = useState<any>({});

  const authService = new AuthService();

  useEffect(() => {
    const init = async () => {
      const tKeyResponse = await authService.init(directParams);
      setTKey(tKeyResponse);
    };
    init();
  }, []);

  const createNewWallet = async () => {
    const response = await authService.createWallet(tKey, verifierMap);
    setLoginResponse(response);
  };

  const metamaskLogin = async () => {
    try {
      const provider = "PROVIDER STRING HERE";
      //TODO: install ethers in this package
      const web3Provider = new ethers.providers.Web3Provider(provider!);
      const signer = web3Provider.getSigner();
      const gotAccount = await signer.getAddress();
      const network = await web3Provider.getNetwork();
      console.info(`EOA Address ${gotAccount}\nNetwork: ${network}`);
      //this.provider = provider;
      return provider;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <Modal show={show} onHide={() => onAction(false)}>
      <div className="modalContainer">
        <p className="modalTitle">Sign-in or register</p>

        <Button className="modalButtonSignIn" onClick={createNewWallet}>
          [Social Login] tKey{" "}
        </Button>
        <br></br>
        <br></br>

        <Button className="modalButtonSignIn">[Social Login] tKey </Button>
        <br></br>
        <br></br>
        <p className="modalOr">or</p>

        <p className="modalConnectWallet">Connect a Wallet</p>
        <div className="modalRow">
          <Button onClick={metamaskLogin}>MM</Button>{" "}
          <Button onClick={metamaskLogin}>WC</Button>
        </div>
        <p className="modalOr">Powered by [LOGO] Liquality</p>
        <p className="modalTerms">Terms & Conditions</p>
      </div>
    </Modal>
  );
};
