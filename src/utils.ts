import { ACCESS_TOKEN_CACHE_KEY, ACCESS_TOKEN_URL_PARAM_KEY, USER_CACHE_KEY } from "./constants";
import { AttendanceFormFields } from "./types";

export const getAccessTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get(ACCESS_TOKEN_URL_PARAM_KEY)
}

export const getCachedUserDate = () => JSON.parse(localStorage.getItem(USER_CACHE_KEY) || '{}');
export const cacheUserData = (fields: AttendanceFormFields) => { localStorage.setItem(USER_CACHE_KEY, JSON.stringify(fields)) }

export const getCachedAccessToken = () => localStorage.getItem(ACCESS_TOKEN_CACHE_KEY);
export const cacheAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_CACHE_KEY, token);

export const bypassTimeEntryProcess = () => {
    // after form submission, token is cached. If page is visited again with the same access token (which has a short expiration date), direct user that their time has been logged successfully until a new token has been generated 
    const urlParamAccessToken = getAccessTokenFromUrl();
    const cachedToken = getCachedAccessToken();
    return !!cachedToken && (urlParamAccessToken === cachedToken)
}