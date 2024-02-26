import React from "react";
import errorIcon from "../../assets/error-icon.png";
import { getRouteApi } from "@tanstack/react-router";

export const ErrorPage: React.FC = () => {
  const route = getRouteApi("/error-page");
  const { error } = route.useSearch();
  return (
    <div data-testid="error-page" className='page'>
      <img src={errorIcon} alt="error-icon" width={64} height={64} />
      <p className="typography body-sm text-center">{error}</p>
    </div>
  );
};
