import { formatScore } from "../game/engine.js";

// Top 5 + la fila de la jugadora si quedó más abajo
function Ranking({ entries, highlightId, limit = 5 }) {
  const top = entries.slice(0, limit);
  const mine = entries.findIndex((e) => e.id === highlightId);
  const showMine = mine >= limit;

  const row = (e, i) => (
    <li key={e.id} className={e.id === highlightId ? "ranking-row you" : "ranking-row"}>
      <span className="pos">{i + 1}</span>
      <span className="name">{e.name}</span>
      <span className="pts">{formatScore(e.score)}</span>
    </li>
  );

  return (
    <aside className="ranking" aria-label="Ranking de puntajes">
      <h2 className="ranking-title">RANKING</h2>
      <ol className="ranking-list">
        {top.map(row)}
        {showMine && (
          <>
            <li className="ranking-gap" aria-hidden="true">
              ···
            </li>
            {row(entries[mine], mine)}
          </>
        )}
      </ol>
    </aside>
  );
}

export default Ranking;
