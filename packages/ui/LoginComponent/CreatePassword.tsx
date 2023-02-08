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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const checkPasswordLength = (password: string) => {
    return password.length >= 8;
  };

  const checkPasswordDigit = (password: string) => {
    return /\d/.test(password);
  };

  const checkPasswordUppercase = (password: string) => {
    return /[A-Z]/.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleAcceptTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

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

  //check to see if password is the same within the two input boxes
  const isPasswordMatch = password === confirmPassword;

  const renderInitialScreen = () => {
    return (
      <div>
        <p className="modalTitle">Create Password</p>

        <input
          type="password"
          className="passwordInputBox"
          placeholder="Choose Password..."
          value={password}
          onChange={handlePasswordChange}
        />
        <br></br>
        <br></br>
        <input
          type="password"
          className="passwordInputBox"
          placeholder="Confirm Password..."
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />

        <div className="verifyPasswordContainer">
          <div
            className={checkPasswordLength(password) ? "greenText" : "greyText"}
          >
            <svg
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.5L6.88889 10L13 1"
                stroke={checkPasswordLength(password) ? "#00B43C" : "#EBEBEB"}
                stroke-width="3"
              />
            </svg>{" "}
            8 characters or more
          </div>
          <div
            className={checkPasswordDigit(password) ? "greenText" : "greyText"}
          >
            <svg
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.5L6.88889 10L13 1"
                stroke={checkPasswordDigit(password) ? "#00B43C" : "#EBEBEB"}
                stroke-width="3"
              />
            </svg>{" "}
            At least one digit
          </div>
          <div
            className={
              checkPasswordUppercase(password) ? "greenText" : "greyText"
            }
          >
            <svg
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.5L6.88889 10L13 1"
                stroke={
                  checkPasswordUppercase(password) ? "#00B43C" : "#EBEBEB"
                }
                stroke-width="3"
              />
            </svg>{" "}
            At least one upper case letter
          </div>
        </div>

        <div className="userInfoContainer">
          <p className="userInfoText">
            [application name] uses tKey to securely set-up and access your
            in-game wallet with authentication factors. Keep your password safe.
          </p>
          <div></div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            {/*   <input type="checkbox" onChange={handleAcceptTermsChange} />
            <label style={{ fontSize: "12px", marginLeft: "5px" }}>
              Accept terms & conditions
            </label> */}

            <label className="container-checkbox modalOr">
              I Agree to the{" "}
              <a
                className="termsLink"
                rel="noreferrer"
                target="_blank"
                href="https://docs.liquality.io/"
              >
                Terms & Conditions
              </a>
              <input type="checkbox" onChange={handleAcceptTermsChange} />
              <span className="checkmark"></span>
            </label>
          </div>
          <button
            disabled={!acceptTerms}
            className={
              acceptTerms ? "modalButtonAcceptTerms" : "modalButtonSignIn"
            }
            style={{ marginTop: "15px", marginBottom: 10 }}
          >
            Set-up & Continue
          </button>
        </div>

        <p className="modalOr">Powered by [LOGO] Liquality</p>
      </div>
    );
  };

  return renderInitialScreen();
};
