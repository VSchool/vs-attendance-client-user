import React, { useMemo } from "react";
import successIcon from "../../assets/success-icon.svg";
import { Link } from "@tanstack/react-router";
import { getCachedUserData } from "../../utils";

export const Success: React.FC = () => {
  const showLinkToLogHistory = useMemo(() => !!getCachedUserData()?.email, []);
  return (
    <div data-testid="success-page" className="page">
      <img src={successIcon} alt="success-icon" width={64} height={64} />
      <p className="typography body-lg">Success!</p>
      {showLinkToLogHistory && (
        <Link to="/">
          <button>View Attendance History</button>
        </Link>
      )}
    </div>
  );
};
