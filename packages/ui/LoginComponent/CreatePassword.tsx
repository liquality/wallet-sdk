import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "../custom.css";
import { AuthService } from "@liquality/wallet";
import { SpinningLoader } from "./SpinningLoader";

interface ModalProps {}

export const CreatePassword: React.FC<ModalProps> = (props) => {
  const {} = props;

  const [tKey, setTKey] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);

  const authService = new AuthService();

  useEffect(() => {
    /*   const init = async () => {
      const tKeyResponse = await authService.init(directParams);
      setTKey(tKeyResponse);
    };
    init(); */
  }, []);

  const createNewWallet = async () => {
    /* setLoading(true);
    const response = await authService.createWallet(tKey, verifierMap);
    setLoading(false);
    setLoginResponse(response); */
  };

  const renderInitialScreen = () => {
    return (
      <div>
        <p className="modalTitle">Create Password</p>

        <p className="modalOr">Powered by [LOGO] Liquality</p>
        <p className="modalTerms">Terms & Conditions</p>
      </div>
    );
  };

  return renderInitialScreen();
};
