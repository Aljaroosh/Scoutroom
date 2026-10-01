  import { NavLink, Outlet, useNavigate } from "react-router";
  import { useAuth } from "../context/AuthContext";

  export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
      await logout();
      navigate("/");
    }

    return (
      <>
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem", alignItems: "center" }}>
          <NavLink to="/">Hem</NavLink>
          <NavLink to="/content">Innehåll</NavLink>
          <NavLink to="/tiers">Nivåer</NavLink>
        {user?.role === "ADMIN" && <NavLink to="/admin">Admin</NavLink>}

          <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
            {user ? (
              <>
                <NavLink to="/account">{user.name ?? user.email}</NavLink>
                <button onClick={handleLogout}>Logga ut</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Logga in</NavLink>
                <NavLink to="/register">Skapa konto</NavLink>
              </>
            )}
          </div>
        </nav>

        <main style={{ padding: "1rem" }}>
          <Outlet />
        </main>
      </>
    );
  }