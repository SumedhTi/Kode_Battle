import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../data/userContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    // Once user is authenticated and loading is done, redirect to dashboard
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg">Signing you in...</p>
    </div>
  );
}
