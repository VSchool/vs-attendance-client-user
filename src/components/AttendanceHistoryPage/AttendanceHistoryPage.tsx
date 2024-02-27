import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../LoadingIndicator";
import { useAttendanceLogs } from "../../hooks";
import { useNavigate } from "@tanstack/react-router";
import { groupEntriesByWeek } from "../../utils";
import * as fns from "date-fns";
import styles from "./AttendanceHistoryPage.module.css";

export const AttendanceHistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { getEntries, error, setError, entries } = useAttendanceLogs();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      getEntries()
        .then(() => setLoading(false))
        .catch((err) => {
          console.error(err);
          setError("There was an issue retrieving attendance logs");
        })
        .finally(() => setLoading(false));
    }
  }, [loading, getEntries, setError]);

  useEffect(() => {
    if (error) {
      console.error(error);
      navigate({ to: "/error-page", search: { error } });
    }
  }, [error, navigate]);

  const renderEntries = useCallback(() => {
    if (!entries.length)
      return (
        <p
          data-testid="attendance-history-no-logs"
          className="typography text-center"
        >
          No entries found
        </p>
      );
    return (
      <div data-testid="attendance-history-logs">
        {groupEntriesByWeek(entries).map((week) => {
          return (
            <div className="typography" key={week.week_of.toISOString()}>
              <h5>Week of {week.week_of.toLocaleDateString()}</h5>
              <table className={styles["attendance-history-log-table"]}>
                <thead>
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {week.entries.map(([start, end, duration]) => (
                    <tr key={(start as Date).toString()}>
                      <td>{fns.format(start as Date, "M/dd p")}</td>
                      <td>{end ? fns.format(end as Date, "M/dd p") : "N/A"}</td>
                      <td align="center">{duration as number}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Total: {week.totals[2]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }, [entries]);

  return (
    <div data-testid="attendance-history-page">
      {loading ? <LoadingIndicator /> : <div>{renderEntries()}</div>}
    </div>
  );
};
