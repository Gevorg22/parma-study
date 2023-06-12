import React from "react";
import { VerificationStatus } from "../Verification";
import "./VerificationResult.scss";

interface VerificationStatusProps {
  isLoading: boolean;
  status: VerificationStatus | undefined;
  username?: string;
  result?: string;
}

const VerificationResult = ({ isLoading, status, username, result }: VerificationStatusProps) => {
  return (
    <div className="verification-result">
      <div className="verification-result__content">
        <div>
          {isLoading ? (
            <div
              className={`verification-result__loading-bar ${
                isLoading ? "verification-result__loading-bar--progress" : ""
              }`}></div>
          ) : (
            <div className={"verification-result__loaded-bar"} />
          )}
        </div>
        <span className="verification-result__item">Формула верификации: {status}</span>
      </div>
      <div className="verification-result__content">
        <span className="verification-result__item">Имя пользователя: {username}</span>
        <span className="verification-result__item">Сообщение: {result}</span>
      </div>
    </div>
  );
};

export default VerificationResult;
