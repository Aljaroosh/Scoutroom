import { Link } from "react-router";
import { TIERS } from "../lib/tiers";
import type { MembershipLevel } from "../types";
import "./UpgradePrompt.css";

type UpgradePromptProps = {
  requiredLevel: MembershipLevel | null; // null = okänt (användaren är inte inloggad)
  isLoggedIn: boolean;
};

export default function UpgradePrompt({ requiredLevel, isLoggedIn }: UpgradePromptProps) {
  // TIERS används här för VISNING (namn, pris, förmåner) – inte för behörighet
  const tier = requiredLevel ? TIERS.find((t) => t.level === requiredLevel) : undefined;

  return (
    <section className="upgrade-prompt" aria-labelledby="upgrade-prompt-title">
      <span className="upgrade-prompt__icon" aria-hidden="true">🔒</span>
      <h2 id="upgrade-prompt-title" className="upgrade-prompt__title">
        {isLoggedIn ? "Lås upp hela rapporten" : "Logga in för att läsa"}
      </h2>

      {isLoggedIn ? (
        <>
          <p>
            Det här innehållet ingår i <strong>{tier?.name ?? requiredLevel}</strong>
            {tier && ` för ${tier.priceKr} kr`}.
          </p>
          {tier && (
            <ul className="upgrade-prompt__features">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
          <Link to="/tiers" className="upgrade-prompt__cta">
            Se medlemsnivåer
          </Link>
        </>
      ) : (
        <>
          <p>Skapa ett gratis konto för att komma åt spelarprofiler och scoutingartiklar.</p>
          <div className="upgrade-prompt__actions">
            <Link to="/register" className="upgrade-prompt__cta">
              Skapa konto
            </Link>
            <Link to="/login">Logga in</Link>
          </div>
        </>
      )}
    </section>
  );
}