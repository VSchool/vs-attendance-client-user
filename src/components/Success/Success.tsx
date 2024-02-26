import React from "react";
import successIcon from "../../assets/success-icon.svg";
import { Link } from "@tanstack/react-router";

export const Success: React.FC = () => {
  return (
    <div data-testid="success-page" className='page'>
      <img src={successIcon} alt="success-icon" width={64} height={64} />
      <p className="typography body-lg">Success!</p>
      <Link to="/">
        <button>View Attendance History</button>
      </Link>
    </div>
  );
};
