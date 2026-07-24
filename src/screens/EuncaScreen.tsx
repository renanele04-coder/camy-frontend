import type { GameState, DiscordUser } from "../types";

interface Props {
  estado: GameState | null;
  fim: GameState | null;
  user: DiscordUser | null;
  iniciar: () => void;
  beber: () => void;
  proxima: () => void;
}

export function EuncaScreen({ estado, fim, user, iniciar, beber, proxima }: Props) {
  const gs = estado?.gameState;
  const jogadores = gs?.jogadores ?? [];
  const eu = jogadores.find((j: any) => j.userId === user?.id);

  if (fim) return (
    <div style={s.center}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🍺</div>
        <div style={{ color: "#FFD700", fontSize: 22, fontWeight: "bold", marginTop: 10 }}>Fim!</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {[...jogadores].sort((a: any, b: any) => b.bebidas - a.bebidas).map((j: any) => (
            <div key={j.userId} style={{ color: "#ccc", fontSize: 14 }}>
              {j.username}: {j.bebidas} 🍺
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!gs || gs.estado === "aguardando") return (
    <div style={s.center}>
      <div style={s.lobby}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🍺</div>
        <h2 style={{ color: "#FFD700", margin: "0 0 4px" }}>Eu Nunca +18</h2>
        <p style={{ color: "#666", fontSize: 12, margin: "0 0 16px" }}>{jogadores.length} jogadores</p>
        {jogadores.map((j: any) => (
          <div key={j.userId} style={s.prow}>
            <img src={`https://cdn.discordapp.com/avatars/${j.userId}/${j.avatar}.png`}
                 style={s.av} onError={(e: any) => e.target.src="https://cdn.discordapp.com/embed/avatars/0.png"} />
            <span style={{ color: "#ddd", fontSize: 13 }}>{j.username}</span>
          </div>
        ))}
        {jogadores.length >= 2
          ? <button onClick={iniciar} style={s.btnP}>▶ Iniciar</button>
          : <p style={{ color: "#555", fontSize: 12, marginTop: 12 }}>Aguardando jogadores…</p>}
      </div>
    </div>
  );

  const jaBebeu = gs.beberam?.includes(user?.id);

  return (
    <div style={s.game}>
      {/* Placar */}
      <div style={s.placar}>
        {jogadores.map((j: any) => (
          <div key={j.userId} style={{ textAlign: "center" }}>
            <img src={`https://cdn.discordapp.com/avatars/${j.userId}/${j.avatar}.png`}
                 style={{ ...s.av, width: 28, height: 28 }}
                 onError={(e: any) => e.target.src="https://cdn.discordapp.com/embed/avatars/0.png"} />
            <div style={{ color: gs.beberam?.includes(j.userId) ? "#ef5350" : "#888", fontSize: 10 }}>
              {j.username.slice(0,8)}
            </div>
            <div style={{ color: "#FFD700", fontSize: 12, fontWeight: "bold" }}>{j.bebidas}🍺</div>
          </div>
        ))}
      </div>

      {/* Pergunta */}
      <div style={s.mesa}>
        <div style={{ color: "#666", fontSize: 11, marginBottom: 8 }}>
          Rodada {gs.idx + 1} / {gs.total}
        </div>
        <div style={s.card}>
          <div style={{ color: "#FFD700", fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
            🍺 Eu nunca…
          </div>
          <div style={{ color: "#fff", fontSize: 16, lineHeight: 1.5, textAlign: "center" }}>
            {gs.pergunta}
          </div>
        </div>

        {/* Quem bebeu */}
        {gs.beberam?.length > 0 && (
          <div style={{ color: "#ef5350", fontSize: 12, marginTop: 8 }}>
            {gs.beberam.map((uid: string) => {
              const j = jogadores.find((x: any) => x.userId === uid);
              return j ? `${j.username} bebeu 🍺 ` : "";
            })}
          </div>
        )}
      </div>

      {/* Ações */}
      <div style={s.acoes}>
        <button onClick={beber} disabled={jaBebeu}
          style={{ ...s.btn, background: jaBebeu ? "#333" : "#8B0000", flex: 1 }}>
          {jaBebeu ? "✓ Já bebi" : "🍺 Bebi!"}
        </button>
        <button onClick={proxima} style={{ ...s.btn, background: "#1a1a2e", flex: 1 }}>
          ➡️ Próxima
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  game:   { display:"flex", flexDirection:"column", height:"100vh", background:"#0a0a1a", fontFamily:"sans-serif" },
  center: { display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a1a" },
  lobby:  { background:"#111122", borderRadius:14, padding:28, display:"flex", flexDirection:"column", alignItems:"center", minWidth:260, border:"1px solid #1a1a2e" },
  placar: { display:"flex", justifyContent:"center", gap:14, padding:"10px 12px", background:"#111122", borderBottom:"1px solid #0d0d20", flexShrink:0, overflowX:"auto" },
  mesa:   { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 16px" },
  card:   { background:"#111122", borderRadius:14, padding:"24px 20px", border:"2px solid #8B0000", maxWidth:360, width:"100%", textAlign:"center" },
  acoes:  { display:"flex", gap:8, padding:"12px 16px", background:"#0d0d1f", borderTop:"1px solid #1a1a2e" },
  btn:    { border:"none", borderRadius:10, padding:"12px 0", cursor:"pointer", color:"#fff", fontWeight:"bold", fontSize:14 },
  btnP:   { marginTop:16, background:"#8B0000", color:"#fff", border:"none", borderRadius:10, padding:"11px 28px", cursor:"pointer", fontSize:14, fontWeight:"bold" },
  prow:   { display:"flex", alignItems:"center", gap:8, marginBottom:7 },
  av:     { width:30, height:30, borderRadius:"50%" },
};
