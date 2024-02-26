import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { AttendanceForm } from "../AttendanceForm";
import { bypassTimeEntryProcess } from "../../utils";
import { LoadingIndicator } from "../LoadingIndicator";
import { useNavigate } from "@tanstack/react-router";

export const App: React.FC = () => {
  const [loading, setIsLoading] = useState(true);
  const { authenticate, error } = useAuth();
  const [complete, setComplete] = useState(bypassTimeEntryProcess());
  const navigate = useNavigate();

  useEffect(() => {
    if (!complete) authenticate().then(() => setIsLoading(false));
  }, [authenticate, setIsLoading, complete]);

  useEffect(() => {
    if (complete) navigate({ to: "/success" });
    if (error) navigate({ to: "/error-page", search: () => ({ error }) });
  }, [complete, error, navigate]);

  return (
    <div data-testid="app" className='page'>
      {loading ? (
        <LoadingIndicator size={64} />
      ) : (
        <AttendanceForm onSuccess={() => setComplete(true)} />
      )}
    </div>
  );
};
