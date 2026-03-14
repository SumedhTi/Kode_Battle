import { Navigate } from "react-router-dom";
import { useUser } from "../data/userContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    // send user back to home (where they can open login modal)
    return <Navigate to="/" replace />;
  }
  return children;
}
