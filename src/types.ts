export interface AttendanceFormFields {
    firstName: string;
    lastName: string;
    email: string;
}

export enum SubmissionType {
    CheckIn = 'CHECK_IN',
    CheckOut = 'CHECK_OUT'
}

export interface Entry {
    _id: string,
    first_name: string;
    last_name: string;
    full_name: string;
    start: string;
    end: string;
    week_of: string
}