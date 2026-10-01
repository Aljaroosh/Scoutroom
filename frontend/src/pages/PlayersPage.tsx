import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError, playerApi, scoutListApi } from "../lib/api";
import type { Player } from "../types";
import "./ListPage.css";

type Message = { text: string; showUpgrade: boolean };

export default function PlayersPage() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    playerApi.list().then(setPlayers);
  }, []);

  async function handleAdd(player: Player) {
    const name = `${player.firstName} ${player.lastName}`;

    try {
      await scoutListApi.add(player.id);
      setMessage({ text: `${name} har lagts till i din scoutlista.`, showUpgrade: false });
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {

        setMessage({ text: "Din scoutlista är full för din nivå.", showUpgrade: true });
      } else if (error instanceof ApiError && error.status === 400) {
        setMessage({ text: `${name} finns redan i din scoutlista.`, showUpgrade: false });
      } else {
        setMessage({ text: "Kunde inte lägga till spelaren. Försök igen.", showUpgrade: false });
      }
    }
  }

  return (
    <section className="list-page">
      <h1>Spelare</h1>

      {!user && (
        <p>
          <Link to="/login">Logga in</Link> för att lägga till spelare i din scoutlista.
        </p>
      )}

      {message && (
        <p role="status">
          {message.text}{" "}
          {message.showUpgrade && <Link to="/tiers">Uppgradera för fler spelare</Link>}
        </p>
      )}

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.firstName} {player.lastName} – {player.position}
            {player.club && `, ${player.club.name}`}{" "}
            {user && <button onClick={() => handleAdd(player)}>Lägg till i scoutlista</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}