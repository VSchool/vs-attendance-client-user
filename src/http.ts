import { getAccessTokenFromUrl } from "./utils";

export const httpClient = <D>(path: string, options: RequestInit & { requireAuth?: boolean } = { method: 'GET' }): Promise<D> => {
    const accessToken = getAccessTokenFromUrl();
    return fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        ...options
    }).then(res => res.json()).then(data => data as D)
}

