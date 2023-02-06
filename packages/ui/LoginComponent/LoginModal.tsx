import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../custom.css";

interface ModalProps {
  children: React.ReactNode;
  show: boolean;
  onAction: (params: boolean) => void;
}

export const LoginModal: React.FC<ModalProps> = (props) => {
  const { children, onAction, show } = props;

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

        <Button className="modalButtonSignIn">[Social Login] tKey </Button>
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
