import type { DiscordUser, Jogo } from "../types";

const JOGOS: { id: Jogo; emoji: string; nome: string; desc: string; cor: string }[] = [
  { id: "eunca",  emoji: "🍺", nome: "Eu Nunca",           desc: "2–10 jogadores",  cor: "#8B0000" },
  { id: "vod",    emoji: "🎲", nome: "Verdade ou Desafio", desc: "2–10 jogadores",  cor: "#4B0082" },
  { id: "mestre", emoji: "🎰", nome: "Mestre do Strip",    desc: "2–8 jogadores",   cor: "#8B0000" },
];

export function Menu({ user, onEscolher }: { user: DiscordUser | null; onEscolher: (j: Jogo) => void }) {
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        {user?.avatar && (
          <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
               style={s.av} onError={(e: any) => e.target.style.display="none"} />
        )}
        <div>
          <div style={{ color: "#FFD700", fontWeight: "bold", fontSize: 16 }}>🎰 Camy</div>
          <div style={{ color: "#888", fontSize: 12 }}>{user?.username}</div>
        </div>
      </div>

      <div style={{ color: "#666", fontSize: 12, marginBottom: 14 }}>escolha um jogo 😈</div>

      <div style={s.grid}>
        {JOGOS.map(j => (
          <button key={j.id} onClick={() => onEscolher(j.id)}
            style={{ ...s.card, borderColor: j.cor }}>
            <div style={{ fontSize: 34, marginBottom: 6 }}>{j.emoji}</div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>{j.nome}</div>
            <div style={{ color: "#666", fontSize: 11, marginTop: 3 }}>{j.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    height: "100vh", background: "#0a0a1a", fontFamily: "sans-serif",
    padding: "20px 16px",
  },
  header: {
    display: "flex", alignItems: "center", gap: 10,
    width: "100%", marginBottom: 20,
    background: "#111122", borderRadius: 12, padding: "10px 14px",
    border: "1px solid #1a1a2e",
  },
  av: { width: 38, height: 38, borderRadius: "50%" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" },
  card: {
    background: "#111122", border: "2px solid",
    borderRadius: 14, padding: "18px 10px",
    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
  },
};
