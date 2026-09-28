  import { useState, type FormEvent } from "react";
  import { Link, useLocation, useNavigate } from "react-router";
  import { useAuth } from "../context/AuthContext";
  import { ApiError } from "../lib/api";
  import "./AuthForm.css";

  export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string; search: string } } | null)?.from;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setError(null);
      setSubmitting(true);

      try {
        await login(email, password);
        navigate(from ? from.pathname + from.search : "/account", { replace: true });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError("Fel e-post eller lösenord.");
        } else if (err instanceof ApiError && err.status === 400) {
          setError("Fyll i en giltig e-post och ett lösenord på minst 6 tecken.");
        } else {
          setError("Kunde inte logga in just nu. Försök igen om en stund.");
        }
      } finally {
        setSubmitting(false);
      }
    }

    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Logga in</h1>

        {error && <p className="auth-error">{error}</p>}

        <label>
          E-post
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Loggar in..." : "Logga in"}
        </button>

        <p className="auth-switch">
          Inget konto än? <Link to="/register">Skapa ett här</Link>
        </p>
      </form>
    );
  }