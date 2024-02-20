import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { AttendanceForm } from "../AttendanceForm";
import { bypassTimeEntryProcess } from "../../utils";
import successIcon from "../../assets/success-icon.svg";
import errorIcon from "../../assets/error-icon.png";
import styles from "./App.module.css";
import { LoadingIndicator } from "../LoadingIndicator";

export const App: React.FC = () => {
  const [loading, setIsLoading] = useState(true);
  const { authenticate, error } = useAuth();
  const [complete, setComplete] = useState(bypassTimeEntryProcess());

  useEffect(() => {
    if (complete) return;
    authenticate().then(() => setIsLoading(false));
  }, [authenticate, setIsLoading, complete]);

  if (complete)
    return (
      <div data-testid="app-success" className={styles.app}>
        <img src={successIcon} alt="success-icon" width={64} height={64} />
        <p className="typography body-lg">Success!</p>
      </div>
    );

  if (loading)
    return (
      <div data-testid="app-loading" className={styles.app}>
        <LoadingIndicator size={64}/>
      </div>
    );

  if (error)
    return (
      <div data-testid="app-error" className={styles.app}>
        <img src={errorIcon} alt="error-icon" width={64} height={64} />
        <p className="typography body-sm text-center">{error}</p>
      </div>
    );

  return (
    <div data-testid="app-loaded" className={styles.app}>
      <AttendanceForm onSuccess={() => setComplete(true)} />
    </div>
  );
};
