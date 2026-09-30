    import { useState, type FormEvent } from "react";
    import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
    import { useAuth } from "../context/AuthContext";
    import { ApiError, paymentApi } from "../lib/api";
    import { TIERS, TIER_RANK } from "../lib/tiers";
    import {
      formatCardNumber,
      formatExpiry,
      isValidCardNumber,
      isValidCvv,
      isValidExpiry,
    } from "../lib/card";
    import "./AuthForm.css";
    import "./CheckoutPage.css";

    export default function CheckoutPage() {
      const { user, refreshUser } = useAuth();
      const navigate = useNavigate();
      const [searchParams] = useSearchParams();

      const [cardName, setCardName] = useState("");
      const [cardNumber, setCardNumber] = useState("");
      const [expiry, setExpiry] = useState("");
      const [cvv, setCvv] = useState("");
      const [error, setError] = useState<string | null>(null);
      const [submitting, setSubmitting] = useState(false);

      const tier = TIERS.find((t) => t.level === searchParams.get("level"));

      if (!tier || tier.priceKr === 0) {
        return <Navigate to="/tiers" replace />;
      }

      if (user && TIER_RANK[user.membershipLevel] >= TIER_RANK[tier.level]) {
        return (
          <section className="auth-form">
            <h1>Du har redan den här nivån 🎉</h1>
            <p>Ditt konto har redan tillgång till allt i {tier.name}.</p>
            <Link to="/account">Till mitt konto</Link>
          </section>
        );
      }

      function validate(): string | null {
        if (cardName.trim().length < 2) return "Fyll i namnet på kortet.";
        if (!isValidCardNumber(cardNumber)) return "Kortnumret är inte giltigt.";
        if (!isValidExpiry(expiry)) return "Utgångsdatumet är ogiltigt eller har passerat.";
        if (!isValidCvv(cvv)) return "CVV ska vara 3 siffror.";
        return null;
      }

      async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!tier) return;

        const validationError = validate();
        if (validationError) {
          setError(validationError);
          return;
        }

        setError(null);
        setSubmitting(true);

        try {
          // Liten fördröjning så att det känns som en riktig betalning
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await paymentApi.upgrade(tier.level);
          await refreshUser();
          navigate(`/thank-you?level=${tier.level}`, { replace: true });
        } catch (err) {
          if (err instanceof ApiError && err.status === 400) {
            setError("Du kan bara uppgradera till en högre nivå.");
          } else {
            setError("Betalningen kunde inte genomföras. Försök igen.");
          }
        } finally {
          setSubmitting(false);
        }
      }

      return (
        <>
          <div className="checkout-summary">
            <div className="checkout-summary-row">
              <strong>{tier.name}</strong>
              <strong>{tier.priceKr} kr/mån</strong>
            </div>
            <p className="checkout-note">
              Det här är en låtsasbetalning, inga pengar dras. Testa med kortnumret
              4242 4242 4242 4242.
            </p>
          </div>

          <form className="auth-form checkout-form" onSubmit={handleSubmit}>
            <h1>Betalning 💳</h1>

            {error && <p className="auth-error">{error}</p>}

            <label>
              Namn på kortet
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                autoComplete="cc-name"
                required
              />
            </label>

            <label>
              Kortnummer
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                autoComplete="cc-number"
                required
              />
            </label>

            <div className="checkout-row">
              <label>
                Utgångsdatum
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/ÅÅ"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  autoComplete="cc-exp"
                  required
                />
              </label>

              <label>
                CVV
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  autoComplete="cc-csc"
                  required
                />
              </label>
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Behandlar betalning..." : `Betala ${tier.priceKr} kr`}
            </button>
          </form>
        </>
      );
    }