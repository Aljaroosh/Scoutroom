  import { Link, useSearchParams } from "react-router";
  import { TIERS } from "../lib/tiers";

  export default function ThankYouPage() {
    const [searchParams] = useSearchParams();
    const tier = TIERS.find((t) => t.level === searchParams.get("level"));

    return (
      <section style={{ maxWidth: 500, margin: "3rem auto", textAlign: "center" }}>
        <h1>Tack för ditt köp! 🎉</h1>
        <p>
          {tier
            ? `Välkommen till ${tier.name}. Dina nya verktyg är upplåsta direkt.`
            : "Ditt konto har uppgraderats."}
        </p>
        <p>Kvittot hittar du under Mitt konto.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
          <Link to="/account">Till mitt konto</Link>
          <Link to="/">Till startsidan</Link>
        </div>
      </section>
    );
  }