import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../custom.css";
import { AuthService } from "@liquality/wallet";
import Web3 from "web3";
import { VerificationSuccess } from "./VerificationSuccess";
import { SpinningLoader } from "./SpinningLoader";

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
  const [loading, setLoading] = useState<any>(false);

  const authService = new AuthService();

  useEffect(() => {
    const init = async () => {
      const tKeyResponse = await authService.init(directParams);
      setTKey(tKeyResponse);
    };
    init();
  }, [loginResponse]);

  const createNewWallet = async () => {
    setLoading(true);
    const response = await authService.createWallet(tKey, verifierMap);
    setLoading(false);
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

        {loading ? (
          <div>
            <SpinningLoader />
            <br></br>
            <br></br>
            <br></br>
            <br></br> <br></br>
            <br></br>
          </div>
        ) : (
          <div>
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
          </div>
        )}

        <p className="modalOr">Powered by [LOGO] Liquality</p>
        <p className="modalTerms">Terms & Conditions</p>
      </div>
    );
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <div className="modalContainer">
        {loginResponse ? <VerificationSuccess /> : renderInitialScreen()}
      </div>
    </Modal>
  );
};
