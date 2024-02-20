import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAttendanceForm } from "../../hooks";
import { AttendanceFormFields, SubmissionType } from "../../types";
import { format } from "date-fns";
import styles from "./AttendanceForm.module.css";
import { LoadingIndicator } from "../LoadingIndicator";
import errorIcon from "../../assets/error-icon.png";

interface AttendanceFormProps {
  onSuccess: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  onSuccess,
}) => {
  const {
    submit,
    fields,
    updateField,
    submitting,
    disableFields,
    setError,
    setIsSubmitting,
    error,
  } = useAttendanceForm();

  const [currentTime, setCurrentTime] = useState(new Date());
  const formattedDate = useMemo(() => {
    return format(currentTime, "cccc, MMM M p");
  }, [currentTime]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const submitter = (e.nativeEvent as SubmitEvent)
        .submitter as HTMLButtonElement;
      setIsSubmitting(true);
      try {
        await submit(submitter.name as SubmissionType);
        onSuccess();
      } catch (err) {
        console.error(err);
        setError("There was a problem logging your time, please scan again");
      }
      setIsSubmitting(false);
    },
    [submit, onSuccess, setError, setIsSubmitting]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateField(name as keyof AttendanceFormFields, value);
    },
    [updateField]
  );

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [setCurrentTime]);

  return (
    <form
      onSubmit={handleSubmit}
      name="attendance-form"
      data-testid="attendance-form"
      className={styles["attendance-form"]}
    >
      <header className={styles["attendance-form-header"]}>
        <code>{formattedDate}</code>
      </header>
      <div className={styles["attendance-form-fieldset"]}>
        <div className={styles["attendance-form-field"]}>
          <label htmlFor="first-name" className="typography input-label">
            First Name
          </label>
          <input
            data-testid="first-name"
            id="first-name"
            type="text"
            name="firstName"
            value={fields.firstName}
            onChange={handleChange}
            disabled={disableFields}
            required
          />
        </div>
        <div className={styles["attendance-form-field"]}>
          <label htmlFor="last-name" className="typography input-label">
            Last Name
          </label>
          <input
            data-testid="last-name"
            id="last-name"
            type="text"
            name="lastName"
            value={fields.lastName}
            onChange={handleChange}
            disabled={disableFields}
            required
          />
        </div>
        <div className={styles["attendance-form-field"]}>
          <label htmlFor="email" className="typography input-label">
            Email
          </label>
          <input
            data-testid="email"
            id="email"
            type="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            disabled={disableFields}
            required
          />
        </div>
      </div>

      <div className={styles["attendance-form-button-group"]}>
        <button
          type="submit"
          data-testid="check-in"
          className="typography button-label"
          name={SubmissionType.CheckIn}
          disabled={submitting}
        >
          Check In
        </button>
        <button
          type="submit"
          data-testid="check-out"
          className="typography button-label"
          name={SubmissionType.CheckOut}
          disabled={submitting}
        >
          Check Out
        </button>
      </div>
      {error && (
        <footer
          data-testid="form-error"
          className={styles["attendance-form-footer"]}
        >
          <img src={errorIcon} alt="form-error-msg" style={{width: 24, height:24 }}/>
          <span className="typography body-sm text-center">
            {error}
          </span>
        </footer>
      )}
      {submitting && (
        <footer
          data-testid="form-submitting"
          className={styles["attendance-form-footer"]}
        >
          <LoadingIndicator size={24}/>
          <span className="typography body">Submitting...</span>
        </footer>
      )}
    </form>
  );
};
