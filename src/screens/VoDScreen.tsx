import { useState } from "react";
import type { GameState, Carta, DiscordUser } from "../types";

interface Props {
  estado: GameState | null;
  carta: Carta | null;
  privado: Carta | null;
  aviso: string | null;
  user: DiscordUser | null;
  iniciar: () => void;
  verdade: () => void;
  desafio: () => void;
  proxima: () => void;
  onClearPrivado: () => void;
}

const COR: Record<string, string> = {
  verdade:         "#4169E1",
  desafio:         "#8B0000",
  desafio_privado: "#4B0082",
};

export function VoDScreen({ estado, carta, privado, aviso, user, iniciar, verdade, desafio, proxima, onClearPrivado }: Props) {
  const gs        = estado?.gameState;
  const jogadores = gs?.jogadores ?? [];
  const minhaVez  = gs?.vezDeId === user?.id;

  // Modal carta privada
  if (privado) return (
    <div style={s.center}>
      <div style={{ ...s.modal, borderColor: "#4B0082" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
        <div style={{ color: "#FFD700", fontWeight: "bold", fontSize: 15, marginBottom: 12 }}>
          Desafio Privado
        </div>
        <div style={{ color: "#fff", fontSize: 15, lineHeight: 1.6, marginBottom: 20, textAlign: "center" }}>
          {privado.texto}
        </div>
        <button onClick={onClearPrivado} style={s.btnP}>✅ Concluído</button>
      </div>
    </div>
  );

  if (!gs || gs.estado === "aguardando") return (
    <div style={s.center}>
      <div style={s.lobby}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎲</div>
        <h2 style={{ color: "#FFD700", margin: "0 0 4px" }}>Verdade ou Desafio</h2>
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

  return (
    <div style={s.game}>
      {/* Jogadores */}
      <div style={s.topo}>
        {jogadores.map((j: any) => (
          <div key={j.userId} style={{
            ...s.player,
            border: gs.vezDeId===j.userId ? "2px solid #FFD700" : "2px solid transparent"
          }}>
            <img src={`https://cdn.discordapp.com/avatars/${j.userId}/${j.avatar}.png`}
                 style={{ ...s.av, width:26, height:26 }}
                 onError={(e: any) => e.target.src="https://cdn.discordapp.com/embed/avatars/0.png"} />
            <div style={{ color: gs.vezDeId===j.userId?"#FFD700":"#aaa", fontSize:10 }}>
              {j.username.slice(0,8)}
            </div>
          </div>
        ))}
      </div>

      {/* Mesa */}
      <div style={s.mesa}>
        {aviso && (
          <div style={s.aviso}>{aviso}</div>
        )}

        {carta ? (
          <div style={{ ...s.card, borderColor: COR[carta.tipo] ?? "#8B0000" }}>
            <div style={{ color: COR[carta.tipo]??"#8B0000", fontSize:12, fontWeight:"bold", marginBottom:8 }}>
              {carta.tipo === "verdade" ? "🗣️ VERDADE" : "💪 DESAFIO"}
              {carta.jogador && ` • ${carta.jogador.username}`}
            </div>
            <div style={{ color:"#fff", fontSize:16, lineHeight:1.6, textAlign:"center" }}>
              {carta.texto}
            </div>
          </div>
        ) : (
          <div style={{ color: "#555", fontSize: 14 }}>
            {minhaVez ? "Sua vez — escolha abaixo!" : `Vez de ${gs.vezDe}`}
          </div>
        )}
      </div>

      {/* Ações */}
      <div style={s.acoes}>
        {!carta ? (
          minhaVez ? (
            <>
              <button onClick={verdade} style={{ ...s.btn, background:"#4169E1", flex:1 }}>🗣️ Verdade</button>
              <button onClick={desafio} style={{ ...s.btn, background:"#8B0000", flex:1 }}>💪 Desafio</button>
            </>
          ) : (
            <div style={{ color:"#666", fontSize:13, textAlign:"center", width:"100%" }}>
              Aguardando {gs.vezDe}…
            </div>
          )
        ) : (
          <button onClick={() => { proxima(); }} style={{ ...s.btn, background:"#2E7D32", flex:1 }}>
            ➡️ Próximo
          </button>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  game:   { display:"flex", flexDirection:"column", height:"100vh", background:"#0a0a1a", fontFamily:"sans-serif" },
  center: { display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a1a", fontFamily:"sans-serif" },
  lobby:  { background:"#111122", borderRadius:14, padding:28, display:"flex", flexDirection:"column", alignItems:"center", minWidth:260, border:"1px solid #1a1a2e" },
  modal:  { background:"#111122", borderRadius:14, padding:28, display:"flex", flexDirection:"column", alignItems:"center", maxWidth:320, border:"2px solid", margin:"0 16px" },
  topo:   { display:"flex", justifyContent:"center", gap:10, padding:"8px 12px", background:"#111122", borderBottom:"1px solid #0d0d20", flexShrink:0, overflowX:"auto" },
  player: { display:"flex", flexDirection:"column", alignItems:"center", background:"#111122", borderRadius:8, padding:"4px 8px" },
  mesa:   { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px" },
  card:   { background:"#111122", borderRadius:14, padding:"22px 18px", border:"2px solid", maxWidth:360, width:"100%", textAlign:"center" },
  aviso:  { background:"#4B0082", color:"#fff", borderRadius:10, padding:"8px 16px", fontSize:13, marginBottom:16, textAlign:"center" },
  acoes:  { display:"flex", gap:8, padding:"12px 16px", background:"#0d0d1f", borderTop:"1px solid #1a1a2e" },
  btn:    { border:"none", borderRadius:10, padding:"12px 0", cursor:"pointer", color:"#fff", fontWeight:"bold", fontSize:14 },
  btnP:   { marginTop:14, background:"#4B0082", color:"#fff", border:"none", borderRadius:10, padding:"10px 26px", cursor:"pointer", fontSize:14, fontWeight:"bold" },
  prow:   { display:"flex", alignItems:"center", gap:8, marginBottom:7 },
  av:     { width:28, height:28, borderRadius:"50%" },
};
