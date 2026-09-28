  import { Navigate, Outlet, useLocation } from "react-router";
  import { useAuth } from "../context/AuthContext";

  export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
      return <p style={{ textAlign: "center", marginTop: "3rem" }}>Laddar...</p>;
    }

    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
  }