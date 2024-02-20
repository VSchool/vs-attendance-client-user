import styles from "./LoadingIndicator.module.css";
import loadingIcon from "../../assets/loading-icon.png";
import React from "react";

export const LoadingIndicator: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div className={styles["loading-indicator"]}>
      <img
        src={loadingIcon}
        alt="loading-icon"
        style={{ width: size + "px", height: size + "px" }}
        className={styles["loading-icon"]}
      />
    </div>
  );
};
