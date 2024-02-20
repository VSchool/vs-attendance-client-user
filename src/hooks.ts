import { useCallback, useMemo, useState } from "react"
import { httpClient } from "./http";
import { AttendanceFormFields, SubmissionType } from "./types";
import { cacheAccessToken, cacheUserData, getAccessTokenFromUrl, getCachedUserDate } from "./utils";

export const useAuth = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const authenticate = useCallback(async () => {
        try {
            const { success } = await httpClient<{ success: boolean }>('/api/qr-code/validate');
            if (!success) throw Error('Unauthorized')
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

    const cache = getCachedUserDate();
    const disableFields = !error && (!!Object.keys(cache).length || submitting);

    const [fields, setFields] = useState<AttendanceFormFields>({
        firstName: cache.firstName || '',
        lastName: cache.lastName || '',
        email: cache.email || '',
    });

    const updateField = useCallback((k: keyof AttendanceFormFields, value: string) => {
        setFields(prev => ({ ...prev, [k]: value }))
    }, [setFields]);

    const submit = useCallback(async (type: SubmissionType) => {
        if(error) setError('');
        setIsSubmitting(true);
        cacheUserData(fields);
        const { success } = await httpClient<{ success: boolean }>('/api/attendance/log-entry', {
            method: 'POST',
            body: JSON.stringify({ fields, type })
        })
        if (!success) throw Error('There was an issue processing logging your entry, please see the administrator');
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