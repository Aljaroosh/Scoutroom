import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { scoutListApi } from "../lib/api";
import type { MembershipLevel, ScoutListEntry } from "../types";
import "./ListPage.css";

const LIMITS: Record<MembershipLevel, number | null> = {
  BASIC: 5,
  PLUS: 15,
  FULL: null, 
};

type RowProps = {
  entry: ScoutListEntry;
  canNote: boolean;
  canRate: boolean;
  onRemove: (playerId: string) => void;
};


function ScoutListRow({ entry, canNote, canRate, onRemove }: RowProps) {
  const [note, setNote] = useState(entry.note ?? "");
  const [rating, setRating] = useState(entry.rating ?? 0);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    try {
      await scoutListApi.update(entry.playerId, {

        note: canNote ? note : undefined,
        rating: canRate && rating > 0 ? rating : undefined,
      });
      setStatus("Sparat");
    } catch {
      setStatus("Kunde inte spara");
    }
  }

  const { player } = entry;

  return (
    <li>
      <strong>
        {player.firstName} {player.lastName}
      </strong>{" "}
      – {player.position}
      {player.club && `, ${player.club.name}`}

      {canNote && (
        <div>
          <label>
            Anteckning <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>
      )}

      {canRate && (
        <div>
          <label>
            Betyg{" "}
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={0}>Inget betyg</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div>
        {(canNote || canRate) && <button onClick={handleSave}>Spara</button>}{" "}
        <button onClick={() => onRemove(entry.playerId)}>Ta bort</button> {status}
      </div>
    </li>
  );
}

export default function ScoutListPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ScoutListEntry[]>([]);

  useEffect(() => {
    scoutListApi.list().then((res) => setEntries(res.scoutList));
  }, []);


  if (!user) return null;

  const level = user.membershipLevel;
  const limit = LIMITS[level];
  const canNote = level !== "BASIC";
  const canRate = level === "FULL";

  async function handleRemove(playerId: string) {
    await scoutListApi.remove(playerId);
    setEntries((prev) => prev.filter((e) => e.playerId !== playerId));
  }

  return (
    <section className="list-page">
      <h1>Min scoutlista</h1>

      <p>
        {entries.length} av {limit ?? "obegränsat antal"} spelare.
      </p>

      {}
      {level === "BASIC" && (
        <p>
          Med <Link to="/tiers">Head Scout</Link> får du plats med 15 spelare och kan skriva
          anteckningar. Med Chief Scout får du obegränsat antal och kan sätta betyg.
        </p>
      )}
      {level === "PLUS" && (
        <p>
          Med <Link to="/tiers">Chief Scout</Link> får du obegränsat antal spelare och kan sätta
          betyg.
        </p>
      )}

      {entries.length === 0 ? (
        <p>
          Din scoutlista är tom. <Link to="/players">Hitta spelare</Link>
        </p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <ScoutListRow
              key={entry.id}
              entry={entry}
              canNote={canNote}
              canRate={canRate}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}