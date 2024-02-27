import { httpClient } from "./http";
import { AttendanceFormFields, Entry, SubmissionType } from "./types";

export const logEntry = async (fields: AttendanceFormFields, type: SubmissionType) => {
    const { success } = await httpClient<{ success: boolean }>('/api/attendance/log-entry', {
        method: 'POST',
        body: JSON.stringify({ fields, type })
    })
    if (!success) throw Error('There was a problem processing your entry. Please scan again or contact the administrator')
    return { success }
}

export const validateAccessToken = async () => {
    const { success } = await httpClient<{ success: boolean }>('/api/qr-code/validate');
    if (!success) throw Error('Unauthorized')
    return { success }
}

export const getAttendanceLogsForUser = async (email: string) => {
    if (!email) throw Error('Unauthorized');
    const { entries, success } = await httpClient<{ entries: Entry[], success: boolean }>(`/api/attendance/entries?email=${email}`);
    if (!success) throw Error('An error occurred while trying to retrieve attendance history.')
    return { entries }
}