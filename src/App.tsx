import { useEffect, useState } from "react";
import { useAuth } from "./hooks"
import { AttendanceForm } from "./components/AttendanceForm";
import { bypassTimeEntryProcess } from "./utils";

const App = () => {
  const [loading, setIsLoading] = useState(true)
  const { authenticate, error } = useAuth();
  const [complete, setComplete] = useState(bypassTimeEntryProcess());

  useEffect(() => {
    if (complete) return;
    authenticate()
      .then(() => setIsLoading(false))
  }, [authenticate, setIsLoading, complete])

  if (complete) return (
    <div data-testid='app-success'>Time Logged Successfully</div>
  )

  if (loading) return (
    <div data-testid='app-loading'>...loading</div>
  )

  if (error) return (
    <div data-testid='app-error'>{error}</div>
  )

  return (
    <div data-testid="app-loaded">
      <AttendanceForm onSuccess={() => setComplete(true)} />
    </div>
  )
}

export default App
