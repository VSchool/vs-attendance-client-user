import { vi } from "vitest";

export const mockNavigate = vi.fn()

export const useNavigate = vi.fn(() => mockNavigate);
export const createRootRoute = vi.fn(() => ({ addChildren: vi.fn() }));
export const useNcreateRouteavigate = vi.fn();
export const createRouter = vi.fn();
export const RouterProvider = vi.fn();
export const Link = vi.fn();
export const Outlet = vi.fn();
export const useSearch = vi.fn(() => ({}));
export const getRouteApi = vi.fn(() => ({ useSearch }));