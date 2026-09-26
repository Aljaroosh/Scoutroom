  import { useState, type FormEvent } from "react";
  import { Link, useNavigate } from "react-router";
  import { useAuth } from "../context/AuthContext";
  import { ApiError } from "../lib/api";
  import "./AuthForm.css";

  export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function validate(): string | null {
      if (name.trim().length < 2) return "Namnet måste vara minst 2 tecken.";
      if (password.length < 6) return "Lösenordet måste vara minst 6 tecken.";
      if (password !== confirmPassword) return "Lösenorden matchar inte.";
      return null;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSubmitting(true);

      try {
        await register(name.trim(), email, password);
        navigate("/tiers");
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setError("Det finns redan ett konto med den e-postadressen.");
        } else if (err instanceof ApiError && err.status === 400) {
          setError("Kontrollera att alla fält är korrekt ifyllda.");
        } else {
          setError("Kunde inte skapa kontot just nu. Försök igen om en stund.");
        }
      } finally {
        setSubmitting(false);
      }
    }

    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Skapa konto</h1>

        {error && <p className="auth-error">{error}</p>}

        <label>
          Namn
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>

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
            autoComplete="new-password"
            required
          />
        </label>

        <label>
          Bekräfta lösenord
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Skapar konto..." : "Skapa konto"}
        </button>

        <p className="auth-switch">
          Har du redan ett konto? <Link to="/login">Logga in</Link>
        </p>
      </form>
    );
  }