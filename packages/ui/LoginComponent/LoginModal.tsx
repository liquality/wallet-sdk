import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../custom.css";
import { AuthService } from "@liquality/wallet";
import Web3 from "web3";

interface ModalProps {
  showModal: boolean;
  setShowModal: (params: boolean) => void;
  directParams: any;
  verifierMap: Record<string, any>;
  loginResponse: any;
  setLoginResponse: (params: any) => void;
}

export const LoginModal: React.FC<ModalProps> = (props) => {
  const {
    setShowModal,
    showModal,
    loginResponse,
    setLoginResponse,
    directParams,
    verifierMap,
  } = props;

  const [tKey, setTKey] = useState<any>({});
  const authService = new AuthService();

  useEffect(() => {
    const init = async () => {
      const tKeyResponse = await authService.init(directParams);
      setTKey(tKeyResponse);
    };
    init();
  }, [loginResponse]);

  const createNewWallet = async () => {
    const response = await authService.createWallet(tKey, verifierMap);
    setLoginResponse(response);
  };

  const metamaskLogin = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      await window.ethereum.enable();
      const accountFromMetaMask = await web3.eth.getAccounts();
      //Some data manipulation as loginresponse expects a certain format
      const defineLoginResponse = {
        loginResponse: { publicAddress: accountFromMetaMask[0] },
      };
      setLoginResponse(defineLoginResponse);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const renderInitialScreen = () => {
    return (
      <div>
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
    );
  };

  const renderCheckmarkScreen = () => {
    return (
      <div>
        <p className="modalTitle">Google Login</p>
        <br></br>

        <svg
          width="104"
          height="104"
          viewBox="0 0 104 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M52 102C79.6142 102 102 79.6142 102 52C102 24.3858 79.6142 2 52 2C24.3858 2 2 24.3858 2 52C2 79.6142 24.3858 102 52 102Z"
            stroke="url(#paint0_linear_118_870)"
            stroke-width="4"
          />
          <path
            d="M51.8133 70.7594L93.9695 34.3058C94.735 33.6439 95.99 33.6322 96.7725 34.2798C97.5551 34.9274 97.5688 35.989 96.8033 36.6509L53.2302 74.3297C52.4528 75.002 51.1738 75.002 50.3964 74.3297L31.0306 57.5836C30.265 56.9216 30.2788 55.86 31.0614 55.2124C31.8439 54.5648 33.0989 54.5765 33.8644 55.2385L51.8133 70.7594Z"
            fill="#2CD2CF"
            stroke="#2CD2CF"
          />
          <defs>
            <linearGradient
              id="paint0_linear_118_870"
              x1="2"
              y1="51.0909"
              x2="102"
              y2="51.0909"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2CD2CF" />
              <stop offset="1" stop-color="#9D4DFA" />
            </linearGradient>
          </defs>
        </svg>
        <br></br>
        <br></br>
        <br></br>

        <div className="verifierContainer">
          <div className="modalRow verifiedLogin">
            {" "}
            <svg
              width="22"
              height="21"
              viewBox="0 0 22 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 9.5L10 18L20 1" stroke="black" stroke-width="3" />
            </svg>{" "}
            Verified Login
          </div>

          <div className="modalRow verifiedLogin">
            {" "}
            <svg
              width="22"
              height="21"
              viewBox="0 0 22 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 9.5L10 18L20 1" stroke="black" stroke-width="3" />
            </svg>{" "}
            Authentication factor set
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <p className="modalOr">Powered by [LOGO] Liquality</p>
      </div>
    );
  };
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <div className="modalContainer">
        {loginResponse ? renderCheckmarkScreen() : renderInitialScreen()}
      </div>
    </Modal>
  );
};
