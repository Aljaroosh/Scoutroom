import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ApiError, contentApi } from "../lib/api";
import { slugify } from "../lib/slugify";
import { TIERS } from "../lib/tiers";
import type { MembershipLevel } from "../types";
import "./AdminPage.css";

type FormState = {
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  requiredLevel: MembershipLevel;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  description: "",
  content: "",
  imageUrl: "",
  requiredLevel: "BASIC",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; slug: string; title: string }
  | { kind: "error"; message: string };

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (form.title.trim().length < 2) {
    errors.title = "Rubriken måste ha minst 2 tecken.";
  }
  if (form.slug.length < 2) {
    errors.slug = "Sluggen måste ha minst 2 tecken.";
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) {
    errors.slug = "Endast små bokstäver a–z, siffror och bindestreck.";
  }
  if (form.content.trim().length === 0) {
    errors.content = "Innehållet får inte vara tomt.";
  }

  return errors;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) return "Backenden godkände inte uppgifterna. Kontrollera fälten.";
    if (error.status === 401) return "Du är inte inloggad längre. Logga in igen.";
    if (error.status === 403) return "Du har inte behörighet att skapa innehåll.";
  }
  return "Kunde inte spara sidan. Kontrollera att sluggen inte redan används.";
}

export default function AdminPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugEdited ? prev.slug : slugify(title),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); 

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus({ kind: "submitting" });

    try {
      const res = await contentApi.create({
        title: form.title.trim(),
        slug: form.slug,
        content: form.content,
        requiredLevel: form.requiredLevel,
        description: form.description.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
      });

      setStatus({ kind: "success", slug: res.page.slug, title: res.page.title });
      setForm(EMPTY_FORM);
      setSlugEdited(false);
    } catch (error) {
      setStatus({ kind: "error", message: getErrorMessage(error) });
    }
  }

  const isSubmitting = status.kind === "submitting";

  return (
    <div className="admin-page">
      <h1>Ny innehållssida</h1>

      {status.kind === "success" && (
        <p className="admin-page__message admin-page__message--success" role="status">
          Sidan "{status.title}" är skapad.{" "}
          <Link to={`/content/${status.slug}`}>Visa sidan</Link>
        </p>
      )}
      {status.kind === "error" && (
        <p className="admin-page__message admin-page__message--error" role="alert">
          {status.message}
        </p>
      )}

      <form className="admin-page__form" onSubmit={handleSubmit} noValidate>
        <label className="admin-page__field">
          Rubrik
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          {errors.title && <span className="admin-page__error">{errors.title}</span>}
        </label>

        <label className="admin-page__field">
          Slug
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true);
              updateField("slug", e.target.value);
            }}
          />
          <span className="admin-page__hint">Adress: /content/{form.slug || "…"}</span>
          {errors.slug && <span className="admin-page__error">{errors.slug}</span>}
        </label>

        <label className="admin-page__field">
          Beskrivning (valfri)
          <input
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
          <span className="admin-page__hint">Kort ingress som visas under rubriken.</span>
        </label>

        <label className="admin-page__field">
          Innehåll
          <textarea
            rows={14}
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
          />
          <span className="admin-page__hint">
            Markdown stöds: ## rubrik, **fet**, - lista och tabeller.
          </span>
          {errors.content && <span className="admin-page__error">{errors.content}</span>}
        </label>

        <label className="admin-page__field">
          Bild-URL (valfri)
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
          />
        </label>

        <label className="admin-page__field">
          Nivå som krävs
          <select
            value={form.requiredLevel}
            onChange={(e) => updateField("requiredLevel", e.target.value as MembershipLevel)}
          >
            {TIERS.map((tier) => (
              <option key={tier.level} value={tier.level}>
                {tier.name} ({tier.level})
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="admin-page__submit" disabled={isSubmitting}>
          {isSubmitting ? "Sparar…" : "Skapa sida"}
        </button>
      </form>
    </div>
  );
}