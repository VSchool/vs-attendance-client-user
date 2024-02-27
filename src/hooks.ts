import { useCallback, useMemo, useState } from "react"
import { AttendanceFormFields, Entry, SubmissionType } from "./types";
import { cacheAccessToken, cacheUserData, getAccessTokenFromUrl, getCachedUserData } from "./utils";
import { getAttendanceLogsForUser, logEntry, validateAccessToken } from "./client";

export const useAuth = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const authenticate = useCallback(async () => {
        try {
            await validateAccessToken()
            setSuccess(true)
        } catch (err) {
            console.error(err);
            setError('There was a problem. Please scan again')
        }
    }, [])

    return useMemo(() => ({
        authenticate,
        success,
        error,
    }), [authenticate, success, error])
}

export const useAttendanceForm = () => {
    const [submitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const cache = getCachedUserData();
    const disableFields = !error && (!!cache || submitting);

    const [fields, setFields] = useState<AttendanceFormFields>(cache || {
        firstName: '',
        lastName: '',
        email: '',
    });

    const updateField = useCallback((k: keyof AttendanceFormFields, value: string) => {
        setFields(prev => ({ ...prev, [k]: value }))
    }, [setFields]);

    const submit = useCallback(async (type: SubmissionType) => {
        if (error) setError('');
        setIsSubmitting(true);
        cacheUserData(fields);
        await logEntry(fields, type);
        setSuccess(true);
        setIsSubmitting(false);
        cacheAccessToken(getAccessTokenFromUrl() as string)
    }, [fields, setIsSubmitting, setError, setSuccess, error])

    return useMemo(() => ({
        fields,
        updateField,
        submitting,
        setIsSubmitting,
        setError,
        success,
        error,
        disableFields,
        submit
    }), [fields, updateField, submitting, success, error, submit, disableFields])
}

export const useAttendanceLogs = () => {
    const cache = useMemo(() => getCachedUserData(), []);
    const [error, setError] = useState(cache?.email ? '' : 'Unable to retrieve entries');
    const [entries, setEntries] = useState<Entry[]>([]);

    const getEntries = useCallback(async () => {
        if (error) setError('');
        const { entries } = await getAttendanceLogsForUser(cache?.email || '');
        setEntries(entries);
    }, [error, setError, cache])

    return useMemo(() => ({
        error,
        setError,
        entries,
        getEntries,
    }), [error, setError, getEntries, entries])

}