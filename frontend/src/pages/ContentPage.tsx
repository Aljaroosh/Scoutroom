import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getContentForUser } from "../lib/content";
import UpgradePrompt from "../components/UpgradePrompt";
import type { ContentForUser, ContentType } from "../types";
import "./ContentPage.css";

const TYPE_LABELS: Record<ContentType, string> = {
  PLAYER_PROFILE: "Spelarprofil",
  CLUB_REPORT: "Klubbrapport",
  ARTICLE: "Artikel",
};

type Result =
  | { kind: "ready"; content: ContentForUser }
  | { kind: "not-found" }
  | { kind: "error" };

export default function ContentPage() {
  const { slug } = useParams(); // läser :slug från URL:en
  const { user, loading: authLoading } = useAuth();
  const userLevel = user?.membershipLevel ?? null;

  const requestKey = `${slug}:${userLevel}`;
  const [loaded, setLoaded] = useState<{ key: string; result: Result } | null>(null);

  useEffect(() => {
    if (authLoading || !slug) return;

    let cancelled = false; 
    getContentForUser(slug, userLevel)
      .then((content) => {
        if (cancelled) return;
        setLoaded({
          key: requestKey,
          result: content ? { kind: "ready", content } : { kind: "not-found" },
        });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ key: requestKey, result: { kind: "error" } });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, userLevel, authLoading, requestKey]);

  if (authLoading || loaded?.key !== requestKey) {
    return <p className="content-page">Laddar…</p>;
  }

  const { result } = loaded;

  if (result.kind === "not-found") {
    return (
      <div className="content-page">
        <h1>Sidan finns inte</h1>
        <Link to="/">Till startsidan</Link>
      </div>
    );
  }

  if (result.kind === "error") {
    return <p className="content-page">Något gick fel. Försök igen senare.</p>;
  }

  const { content } = result;

  return (
    <article className="content-page">
      <span className="content-page__type">{TYPE_LABELS[content.type]}</span>
      <h1 className="content-page__title">{content.title}</h1>
      <p className="content-page__excerpt">{content.excerpt}</p>

      {content.locked ? (
        <UpgradePrompt requiredLevel={content.requiredLevel} isLoggedIn={user !== null} />
      ) : (
        // Här vet TypeScript att body finns, tack vare discriminated union
        <div className="content-page__body">{content.body}</div>
      )}
    </article>
  );
}