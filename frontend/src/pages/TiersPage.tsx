  import { Link } from "react-router";
  import { useAuth } from "../context/AuthContext";
  import { TIERS, type Tier } from "../lib/tiers";
  import "./TiersPage.css";

  export default function TiersPage() {
    const { user } = useAuth();

    function renderAction(tier: Tier) {
      if (user?.membershipLevel === tier.level) {
        return <span className="tier-button tier-button--muted">Din nuvarande nivå</span>;
      }

      if (tier.priceKr === 0) {
        return user ? (
          <span className="tier-button tier-button--muted">Ingår i alla konton</span>
        ) : (
          <Link to="/register" className="tier-button">Kom igång gratis</Link>
        );
      }

      return (
        <Link to={`/checkout?level=${tier.level}`} className="tier-button">
          Välj {tier.name}
        </Link>
      );
    }

    return (
      <section className="tiers">
        <h1>Välj din nivå</h1>
        <p className="tiers-intro">Från första spaning till färdig trupp: välj verktygen du behöver.</p>

        <div className="tiers-grid">
          {TIERS.map((tier) => (
            <article
              key={tier.level}
              className={`tier-card ${tier.level === "PLUS" ? "tier-card--featured" : ""}`}
            >
              {tier.level === "PLUS" && <span className="tier-badge">Populärast</span>}
              <h2>{tier.name}</h2>
              <p className="tier-tagline">{tier.tagline}</p>
              <p className="tier-price">{tier.priceKr === 0 ? "Gratis" : `${tier.priceKr} kr/mån`}</p>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {renderAction(tier)}
            </article>
          ))}
        </div>
      </section>
    );
  }