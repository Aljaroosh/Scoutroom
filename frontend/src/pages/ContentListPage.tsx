import { useEffect, useState } from "react";
import { Link } from "react-router";
import { contentApi } from "../lib/api";
import type { ContentSummary } from "../types";
import "./ListPage.css";
export default function ContentListPage() {
  const [pages, setPages] = useState<ContentSummary[]>([]);

  useEffect(() => {
    contentApi.list().then((res) => setPages(res.pages));
  }, []);

  return (
    <section className="list-page">
      <h1>Innehåll</h1>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <Link to={`/content/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}