import React, { ChangeEvent, FormEvent, useCallback } from "react"
import { useAttendanceForm } from "../hooks";
import { AttendanceFormFields, SubmissionType } from "../types";

interface AttendanceFormProps {
    onSuccess: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ onSuccess }) => {

    const { submit, fields, updateField, submitting, disableFields, setError, setIsSubmitting, error } = useAttendanceForm();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        setIsSubmitting(true);
        try {
            await submit(submitter.name as SubmissionType);
            onSuccess();
        } catch (err) {
            console.error(err)
            setError('There was a problem logging your time, please scan again');
        }
        setIsSubmitting(false)
    }, [submit, onSuccess, setError])

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateField(name as keyof AttendanceFormFields, value)
    }, [updateField])
   
    return (
        <form onSubmit={handleSubmit} name='attendance-form'>
            <div>
                Timestamp: <time>{new Date().toLocaleString()}</time>
            </div>
            <div>
                <label htmlFor="first-name">First Name</label>
                <input id='first-name' type="text" name='firstName' value={fields.firstName} onChange={handleChange} disabled={!error && disableFields} required />
            </div>
            <div>
                <label htmlFor="last-name">Last Name</label>
                <input id='last-name' type="text" name='lastName' value={fields.lastName} onChange={handleChange} disabled={!error && disableFields} required />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id='email' type="email" name='email' value={fields.email} onChange={handleChange} disabled={!error && disableFields} required />
            </div>

            <button type='submit' name={SubmissionType.CheckIn}>Check In</button>
            <button type='submit' name={SubmissionType.CheckOut}>Check Out</button>
            {error && (
                <p>{error}</p>
            )}
            {submitting && (
                <p>...submitting</p>
            ) }
        </form>
    )
}