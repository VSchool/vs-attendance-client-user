import {
  RouterProvider as TanStackRouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import * as React from "react";
import { App } from "../App";
import { Success } from "../Success";
import { ErrorPage } from "../ErrorPage";
import { RootLayout } from "../RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  path: "/",
  component: () => <div>history</div>,
  getParentRoute: () => rootRoute,
});

const logRoute = createRoute({
  path: "/log",
  component: App,
  getParentRoute: () => rootRoute,
});

const successRoute = createRoute({
  path: "/success",
  component: Success,
  getParentRoute: () => rootRoute,
});

const errorPageRoute = createRoute({
  path: "/error-page",
  component: ErrorPage,
  validateSearch: (search: Record<string, string>) => ({ error: search.error }),
  getParentRoute: () => rootRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  logRoute,
  successRoute,
  errorPageRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const RouterProvider: React.FC = () => (
  <TanStackRouterProvider router={router} />
);
