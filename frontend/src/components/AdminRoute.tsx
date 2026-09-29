import { Link, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";


export default function AdminRoute() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h1>Ingen behörighet</h1>
        <p>Den här sidan är bara för administratörer.</p>
        <Link to="/">Till startsidan</Link>
      </div>
    );
  }

  return <Outlet />;
}