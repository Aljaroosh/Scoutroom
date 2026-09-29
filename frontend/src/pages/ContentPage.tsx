import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getContent } from "../lib/content";
import { TIERS } from "../lib/tiers";
import UpgradePrompt from "../components/UpgradePrompt";
import type { ContentResult } from "../types";
import "./ContentPage.css";


type PageState = ContentResult | { status: "error" };

export default function ContentPage() {
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuth();


  const requestKey = `${slug}:${user?.id ?? "guest"}:${user?.membershipLevel ?? ""}`;
  const [loaded, setLoaded] = useState<{ key: string; state: PageState } | null>(null);

  useEffect(() => {
    if (authLoading || !slug) return;

    let cancelled = false; 

    getContent(slug)
      .then((result) => {
        if (!cancelled) setLoaded({ key: requestKey, state: result });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ key: requestKey, state: { status: "error" } });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, authLoading, requestKey]);

  if (authLoading || loaded?.key !== requestKey) {
    return <p className="content-page">Laddar…</p>;
  }

  const { state } = loaded;

  switch (state.status) {
    case "not-found":
      return (
        <div className="content-page">
          <h1 className="content-page__title">Sidan finns inte</h1>
          <Link to="/">Till startsidan</Link>
        </div>
      );

    case "error":
      return <p className="content-page">Något gick fel. Försök igen senare.</p>;

    case "login-required":
      return (
        <div className="content-page">
          <UpgradePrompt requiredLevel={null} isLoggedIn={false} />
        </div>
      );

    case "upgrade-required":
      return (
        <div className="content-page">
          <UpgradePrompt requiredLevel={state.requiredLevel} isLoggedIn={true} />
        </div>
      );

    case "ok": {
      const { page } = state;
      const tierName = TIERS.find((t) => t.level === page.requiredLevel)?.name;

      return (
        <article className="content-page">
          {tierName && <span className="content-page__type">{tierName}</span>}
          <h1 className="content-page__title">{page.title}</h1>
          {page.description && <p className="content-page__excerpt">{page.description}</p>}
          <div className="content-page__body">{page.content}</div>
        </article>
      );
    }
  }
}