import { useState } from "react";
import type { GameState, Carta, DiscordUser } from "../types";

interface Props {
  estado: GameState | null;
  carta: Carta | null;
  privado: Carta | null;
  aviso: string | null;
  aposta: any;
  senha: string | null;
  fim: any;
  user: DiscordUser | null;
  iniciar: () => void;
  puxarCarta: () => void;
  pelado: () => void;
  apostar: (alvoId: string, tipo: string) => void;
  encerrar: () => void;
  onClearPrivado: () => void;
  onClearAposta: () => void;
  mestreEntrar: (senha: string) => void;
}

export function MestreScreen({ estado, carta, privado, aviso, aposta, senha, fim, user,
  iniciar, puxarCarta, pelado, apostar, encerrar, onClearPrivado, onClearAposta, mestreEntrar }: Props) {

  const [inputSenha, setInputSenha] = useState("");
  const [alvoId,     setAlvoId]     = useState("");
  const [tipoAposta, setTipoAposta] = useState("dados");
  const [showAposta, setShowAposta] = useState(false);

  const gs        = estado?.gameState;
  const jogadores = gs?.jogadores ?? [];
  const eu        = jogadores.find((j: any) => j.userId === user?.id);
  const isCriador = gs?.criador === user?.id;

  // Fim
  if (fim) return (
    <div style={s.center}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48 }}>🎰</div>
        <div style={{ color:"#FFD700", fontSize:20, fontWeight:"bold", marginTop:10 }}>
          Sala encerrada 😈
        </div>
      </div>
    </div>
  );

  // Modal carta privada
  if (privado) return (
    <div style={s.center}>
      <div style={{ ...s.modal, borderColor:"#4B0082" }}>
        <div style={{ fontSize:28, marginBottom:8 }}>🔒</div>
        <div style={{ color:"#FFD700", fontWeight:"bold", fontSize:14, marginBottom:10 }}>
          Desafio Privado
        </div>
        <div style={{ color:"#fff", fontSize:15, lineHeight:1.6, textAlign:"center", marginBottom:18 }}>
          {privado.texto}
        </div>
        <button onClick={onClearPrivado} style={s.btnP}>✅ Concluído</button>
      </div>
    </div>
  );

  // Modal aposta resultado
  if (aposta) return (
    <div style={s.center}>
      <div style={s.modal}>
        <div style={{ fontSize:28, marginBottom:8 }}>🎲</div>
        <div style={{ color:"#FFD700", fontWeight:"bold", fontSize:14, marginBottom:10 }}>
          Resultado da Aposta
        </div>
        <div style={{ color:"#ccc", fontSize:13, marginBottom:8 }}>{aposta.resultado}</div>
        {aposta.perdedor && (
          <div style={{ color:"#ef5350", fontSize:14, fontWeight:"bold", marginBottom:16 }}>
            {aposta.perdedor} perde uma peça! ({aposta.pecas} restantes)
          </div>
        )}
        {!aposta.perdedor && (
          <div style={{ color:"#66bb6a", fontSize:14, marginBottom:16 }}>Empate!</div>
        )}
        <button onClick={onClearAposta} style={s.btnP}>OK</button>
      </div>
    </div>
  );

  // Entrada na sala (não criador)
  if (!gs && !senha) return (
    <div style={s.center}>
      <div style={s.lobby}>
        <div style={{ fontSize:36, marginBottom:8 }}>🎰</div>
        <h2 style={{ color:"#FFD700", margin:"0 0 14px" }}>Mestre do Strip</h2>
        <input
          value={inputSenha}
          onChange={e => setInputSenha(e.target.value.toUpperCase())}
          placeholder="Digite a senha da sala"
          style={s.input}
          maxLength={6}
        />
        <button onClick={() => mestreEntrar(inputSenha)} style={s.btnP}>
          🔑 Entrar
        </button>
      </div>
    </div>
  );

  // Aguardando jogadores
  if (!gs || gs.estado === "aguardando") return (
    <div style={s.center}>
      <div style={s.lobby}>
        <div style={{ fontSize:36, marginBottom:8 }}>🎰</div>
        <h2 style={{ color:"#FFD700", margin:"0 0 4px" }}>Mestre do Strip</h2>
        {senha && (
          <div style={{ background:"#1a1a2e", borderRadius:8, padding:"6px 14px", marginBottom:12 }}>
            <span style={{ color:"#888", fontSize:11 }}>Senha: </span>
            <span style={{ color:"#FFD700", fontWeight:"bold", fontSize:16, letterSpacing:2 }}>{senha}</span>
          </div>
        )}
        <p style={{ color:"#666", fontSize:12, margin:"0 0 14px" }}>{jogadores.length} jogadores</p>
        {jogadores.map((j: any) => (
          <div key={j.userId} style={s.prow}>
            <img src={`https://cdn.discordapp.com/avatars/${j.userId}/${j.avatar}.png`}
                 style={s.av} onError={(e: any) => e.target.src="https://cdn.discordapp.com/embed/avatars/0.png"} />
            <span style={{ color:"#ddd", fontSize:13 }}>{j.username}</span>
            <span style={{ color:"#888", fontSize:11 }}>({j.pecas} peças)</span>
          </div>
        ))}
        {isCriador && jogadores.length >= 2
          ? <button onClick={iniciar} style={s.btnP}>▶ Iniciar</button>
          : <p style={{ color:"#555", fontSize:12, marginTop:12 }}>
              {isCriador ? "Aguardando mais jogadores…" : "Aguardando o criador iniciar…"}
            </p>}
      </div>
    </div>
  );

  return (
    <div style={s.game}>
      {/* Status jogadores */}
      <div style={s.topo}>
        {jogadores.map((j: any) => (
          <div key={j.userId} style={s.playerCard}>
            <img src={`https://cdn.discordapp.com/avatars/${j.userId}/${j.avatar}.png`}
                 style={{ ...s.av, width:26, height:26 }}
                 onError={(e: any) => e.target.src="https://cdn.discordapp.com/embed/avatars/0.png"} />
            <div style={{ color:"#ccc", fontSize:9 }}>{j.username.slice(0,8)}</div>
            <div style={{ color: j.pelado?"#ef5350":"#FFD700", fontSize:11, fontWeight:"bold" }}>
              {j.pelado ? "🩲 PELADO" : `👕 ${j.pecas}`}
            </div>
          </div>
        ))}
      </div>

      {/* Mesa */}
      <div style={s.mesa}>
        {aviso && <div style={s.aviso}>{aviso}</div>}

        {carta ? (
          <div style={{ ...s.card, borderColor: {
            direto:"#8B0000", punitiva:"#FF6600", roleta:"#4B0082", visual:"#C62828"
          }[carta.tipo] ?? "#8B0000" }}>
            <div style={{ color:"#FFD700", fontSize:12, fontWeight:"bold", marginBottom:8 }}>
              {{ direto:"💋 Desafio Direto", punitiva:"⚡ Punição Coletiva",
                 roleta:"🎰 Roleta Russa", visual:"👁️ Desafio Visual" }[carta.tipo] ?? "🃏 Carta"}
            </div>
            <div style={{ color:"#fff", fontSize:15, lineHeight:1.6, textAlign:"center" }}>
              {carta.texto}
            </div>
          </div>
        ) : (
          <div style={{ color:"#555", fontSize:14 }}>
            Rodada {gs.rodada} — puxe uma carta 😈
          </div>
        )}
      </div>

      {/* Painel de ações */}
      <div style={s.painel}>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <button onClick={puxarCarta} style={{ ...s.btn, background:"#8B0000", flex:2 }}>
            🃏 Puxar Carta
          </button>
          <button onClick={pelado}
            style={{ ...s.btn, background: eu?.pelado?"#333":"#C62828", flex:1 }}
            disabled={eu?.pelado}>
            {eu?.pelado ? "🩲 Pelado" : "🩲 Tô Pelado!"}
          </button>
        </div>

        {!showAposta ? (
          <button onClick={() => setShowAposta(true)}
            style={{ ...s.btn, background:"#4B0082", width:"100%" }}>
            🎲 Fazer Aposta
          </button>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <select value={alvoId} onChange={e => setAlvoId(e.target.value)} style={s.select}>
              <option value="">Escolha o adversário</option>
              {jogadores.filter((j: any) => j.userId !== user?.id).map((j: any) => (
                <option key={j.userId} value={j.userId}>{j.username}</option>
              ))}
            </select>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => setTipoAposta("dados")}
                style={{ ...s.btn, flex:1, background: tipoAposta==="dados"?"#4B0082":"#1a1a2e" }}>
                🎲 Dados
              </button>
              <button onClick={() => setTipoAposta("moeda")}
                style={{ ...s.btn, flex:1, background: tipoAposta==="moeda"?"#4B0082":"#1a1a2e" }}>
                🪙 Moeda
              </button>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => { apostar(alvoId, tipoAposta); setShowAposta(false); }}
                style={{ ...s.btn, background:"#2E7D32", flex:2 }} disabled={!alvoId}>
                ✅ Apostar
              </button>
              <button onClick={() => setShowAposta(false)}
                style={{ ...s.btn, background:"#333", flex:1 }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {isCriador && (
          <button onClick={encerrar}
            style={{ ...s.btn, background:"transparent", color:"#555", width:"100%", marginTop:4, fontSize:12 }}>
            Encerrar Sala
          </button>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  game:       { display:"flex", flexDirection:"column", height:"100vh", background:"#0a0a1a", fontFamily:"sans-serif" },
  center:     { display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a1a", fontFamily:"sans-serif" },
  lobby:      { background:"#111122", borderRadius:14, padding:26, display:"flex", flexDirection:"column", alignItems:"center", minWidth:260, border:"1px solid #1a1a2e" },
  modal:      { background:"#111122", borderRadius:14, padding:26, display:"flex", flexDirection:"column", alignItems:"center", maxWidth:320, border:"2px solid #8B0000", margin:"0 16px" },
  topo:       { display:"flex", justifyContent:"center", gap:10, padding:"8px 10px", background:"#111122", borderBottom:"1px solid #0d0d20", flexShrink:0, overflowX:"auto" },
  playerCard: { display:"flex", flexDirection:"column", alignItems:"center", gap:2 },
  mesa:       { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"12px 16px" },
  card:       { background:"#111122", borderRadius:14, padding:"20px 16px", border:"2px solid", maxWidth:360, width:"100%", textAlign:"center" },
  aviso:      { background:"#4B0082", color:"#fff", borderRadius:10, padding:"6px 14px", fontSize:12, marginBottom:12, textAlign:"center" },
  painel:     { padding:"10px 14px 14px", background:"#0d0d1f", borderTop:"1px solid #1a1a2e", flexShrink:0 },
  btn:        { border:"none", borderRadius:10, padding:"11px 0", cursor:"pointer", color:"#fff", fontWeight:"bold", fontSize:13 },
  btnP:       { marginTop:12, background:"#8B0000", color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", cursor:"pointer", fontSize:14, fontWeight:"bold" },
  input:      { background:"#1a1a2e", border:"1px solid #333", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:16, width:"100%", outline:"none", marginBottom:10, textAlign:"center", letterSpacing:3 },
  select:     { background:"#1a1a2e", border:"1px solid #333", borderRadius:8, padding:"8px 10px", color:"#fff", fontSize:13, width:"100%" },
  prow:       { display:"flex", alignItems:"center", gap:8, marginBottom:7 },
  av:         { width:28, height:28, borderRadius:"50%" },
};
