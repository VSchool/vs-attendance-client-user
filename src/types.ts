export interface AttendanceFormFields {
    firstName: string;
    lastName: string;
    email: string;
}

export enum SubmissionType {
    CheckIn = 'CHECK_IN',
    CheckOut = 'CHECK_OUT'
}