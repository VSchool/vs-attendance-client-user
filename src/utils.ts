import { ACCESS_TOKEN_CACHE_KEY, ACCESS_TOKEN_URL_PARAM_KEY, USER_CACHE_KEY } from "./constants";
import { AttendanceFormFields, Entry } from "./types";
import * as  fns from 'date-fns';

export const getAccessTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get(ACCESS_TOKEN_URL_PARAM_KEY)
}

export const getCachedUserData = (): null | AttendanceFormFields => {
    const cache = localStorage.getItem(USER_CACHE_KEY);
    if (cache) return JSON.parse(cache);
    return null
}
export const cacheUserData = (fields: AttendanceFormFields) => { localStorage.setItem(USER_CACHE_KEY, JSON.stringify(fields)) }

export const getCachedAccessToken = () => localStorage.getItem(ACCESS_TOKEN_CACHE_KEY);
export const cacheAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_CACHE_KEY, token);

export const bypassTimeEntryProcess = () => {
    // after form submission, token is cached. If page is visited again with the same access token (which has a short expiration date), direct user that their time has been logged successfully until a new token has been generated 
    const urlParamAccessToken = getAccessTokenFromUrl();
    const cachedToken = getCachedAccessToken();
    return !!cachedToken && (urlParamAccessToken === cachedToken)
}

export const groupEntriesByWeek = (entries: Entry[]) => {
    const graph: Record<Entry['week_of'], Entry[]> = {};
    entries.forEach(entry => graph[entry.week_of] ? graph[entry.week_of].push(entry) : graph[entry.week_of] = [entry]);
    return Object.keys(graph).map(k => {
        const entries = graph[k].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()).map(entry => [
            new Date(entry.start),
            entry.end ? new Date(entry.end) : null,
            entry.end ? +(fns.differenceInMinutes(new Date(entry.end), new Date(entry.start))/60).toFixed(2) : 0]);
        return {
            week_of: new Date(k),
            entries,
            totals: entries.reduce((aggregate, entry) => {
                return ['', '', aggregate[2] as number + (entry[2] as number)]
            }, ['', '', 0])
        }
    }).sort((a, b) => b.week_of.getTime() - a.week_of.getTime())
}