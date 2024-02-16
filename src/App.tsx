import { useEffect, useState } from "react";
import { useAuth } from "./hooks"
import { AttendanceForm } from "./components/AttendanceForm";

const App = () => {
  const [loading, setIsLoading] = useState(true)
  const { authenticate, error, complete, setComplete } = useAuth();

  useEffect(() => {
    if (complete) return;
    authenticate()
      .then(() => setIsLoading(false))
  }, [authenticate, setIsLoading])

  if (complete) return (
    <div>Time Logged Successfully</div>
  )

  if (loading) return (
    <div>...loading</div>
  )

  if (error) return (
    <div>{error}</div>
  )

  return (
    <div>
      <AttendanceForm onSuccess={() => setComplete(true)} />
    </div>
  )
}

export default App
