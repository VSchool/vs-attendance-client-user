import { Outlet } from "@tanstack/react-router";
import React from "react";

export const RootLayout: React.FC = () => (
  <div data-testid="root-layout" className="root-layout">
    <Outlet />
  </div>
);
