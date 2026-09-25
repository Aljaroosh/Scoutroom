  import { NavLink, Outlet } from "react-router";
  import { useAuth } from "../context/AuthContext";

  export default function Layout() {
    const { user } = useAuth();

    return (
      <>
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <NavLink to="/">Hem</NavLink>
          <NavLink to="/tiers">Nivåer</NavLink>
          <NavLink to="/account">Mitt konto</NavLink>
          <NavLink to="/login">Logga in</NavLink>
          <NavLink to="/register">Skapa konto</NavLink>
          {user && <span>Inloggad som {user.name ?? user.email}</span>}
        </nav>

        <main style={{ padding: "1rem" }}>
          <Outlet />
        </main>
      </>
    );
  }