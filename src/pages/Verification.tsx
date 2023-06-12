import React, { useState, useEffect } from "react";
import VerificationForm from "./VerificationForm/VerificationForm";
import VerificationResult from "./VerificationResult/VerificationResult";
import "./Verification.scss";

export enum VerificationStatus {
  NotStarted = "не запускалась",
  InProgress = "в процессе",
  SuccessEnded = "успешно завершилась",
  ErrorEnded = "завершилась с ошибкой",
}

interface VerificationResultData {
  id: string;
  username: string;
  result: string;
  status: VerificationStatus;
}

const VERIFICATION_URL = "https://6479df1ea455e257fa63f39a.mockapi.io/parma-study";

const Verification = () => {
  const [username, setUsername] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>(VerificationStatus.NotStarted);
  const [statuses, setStatuses] = useState<VerificationStatus[]>();
  const [verificationResultData, setVerificationResultData] = useState<VerificationResultData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const fetchVerificationData = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Не удалось загрузить данные" + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchVerificationData(`${VERIFICATION_URL}/data`);
        setCurrentStatus(data?.[0]?.status ?? VerificationStatus.NotStarted);
        setStatuses(data);
      } catch (error) {
        console.error(error);
        throw new Error("Не удалось загрузить данные" + error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let loadInterval: ReturnType<typeof setTimeout>;
    if (currentStatus === VerificationStatus.InProgress) {
      const randomIndex = Math.floor(Math.random() * 3) + 1;
      loadInterval = setInterval(async () => {
        const data = await fetchVerificationData(`${VERIFICATION_URL}/result`);
        data && setCurrentStatus(getRandomStatus(randomIndex));
        setForceUpdate((prev) => !prev);
      }, 3000);
    }

    const fetchData = async () => {
      if (currentStatus !== VerificationStatus.NotStarted) {
        try {
          setIsLoading(true);
          const data = await fetchVerificationData(`${VERIFICATION_URL}/result`);
          setVerificationResultData(data?.slice(-1)[0]);
        } catch (error) {
          console.error(error);
          throw new Error("Не удалось загрузить данные" + error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      if (loadInterval) {
        clearInterval(loadInterval);
      }
    };
  }, [currentStatus, forceUpdate]);

  const getRandomStatus = (index: number): VerificationStatus => {
    switch (index) {
      case 1:
        return VerificationStatus.InProgress;
      case 2:
        return VerificationStatus.SuccessEnded;
      case 3:
        return VerificationStatus.ErrorEnded;
      default:
        return VerificationStatus.NotStarted;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const randomIndex = Math.floor(Math.random() * 3) + 1;
    if (username && result) {
      try {
        setIsLoading(true);
        await fetch(`${VERIFICATION_URL}/result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, result, status: statuses?.[randomIndex] }),
        });
        setCurrentStatus(getRandomStatus(randomIndex));
        setUsername("");
        setResult("");
        setForceUpdate((prev) => !prev);
      } catch (error) {
        console.error(error);
        throw new Error("Не удалось загрузить данные" + error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "result") {
      setResult(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3 className="form__title">Проверка статуса верификации</h3>
      <VerificationForm
        isLoading={isLoading}
        status={currentStatus}
        handleChange={handleChange}
        username={username}
        result={result}
      />
      <VerificationResult
        isLoading={isLoading}
        status={currentStatus ? currentStatus : verificationResultData?.status}
        username={verificationResultData?.username}
        result={verificationResultData?.result}
      />
    </form>
  );
};

export default Verification;
