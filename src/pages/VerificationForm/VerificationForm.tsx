import React, { useEffect, useRef } from "react";
import { VerificationStatus } from "../Verification";
import "./VerificationForm.scss";

interface VerificationFormProps {
  isLoading: boolean;
  status: VerificationStatus | undefined;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  username: string;
  result: string;
}

const VerificationForm = ({ isLoading, status, handleChange, username, result }: VerificationFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isDisabled = !username || !result || isLoading || status === VerificationStatus.InProgress;

  useEffect(() => {
    !isLoading && status !== VerificationStatus.InProgress && inputRef.current?.focus();
  }, [isLoading, status]);

  return (
    <div className="verification-form">
      <div className="verification-form__block">
        <label htmlFor="username" className="verification-form__label">
          Имя пользователя:
        </label>
        <input
          ref={inputRef}
          type="text"
          name="username"
          className="verification-form__value"
          value={username}
          onChange={handleChange}
          disabled={isLoading || status === VerificationStatus.InProgress}
          required
        />
      </div>
      <div className="verification-form__block">
        <label htmlFor="result" className="verification-form__label">
          Формула верификации:
        </label>
        <textarea
          name="result"
          className="verification-form__value"
          value={result}
          onChange={handleChange}
          disabled={isLoading || status === VerificationStatus.InProgress}
          required
        />
      </div>
      <button type="submit" disabled={isDisabled} className="verification-form__button">
        Запустить верификацию
      </button>
    </div>
  );
};

export default VerificationForm;
