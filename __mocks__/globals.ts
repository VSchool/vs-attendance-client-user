import { vi } from "vitest";

export const __fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve() }))

vi.stubGlobal('fetch', __fetch)
