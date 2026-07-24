import { useState }        from "react";
import { useDiscord }      from "./hooks/useDiscord";
import { useSocket }       from "./hooks/useSocket";
import { Menu }            from "./screens/Menu";
import { EuncaScreen }     from "./screens/EuncaScreen";
import { VoDScreen }       from "./screens/VoDScreen";
import { MestreScreen }    from "./screens/MestreScreen";
import type { Jogo }       from "./types";

export default function App() {
  const { user, channelId, ready } = useDiscord();
  const [jogo, setJogo] = useState<Jogo | null>(null);

  const {
    estado, carta, privado, aviso, aposta, senha, fim,
    setCarta, setPrivado, setAviso, setAposta,
    euncaIniciar, euncaBeber, euncaProxima,
    vodIniciar, vodVerdade, vodDesafio, vodProxima,
    mestreEntrar, mestreIniciar, mestreCarta, mestrePelado,
    mestreApostar, mestreEncerrar,
  } = useSocket({ user, channelId, ready, jogo });

  if (!ready) return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"center",
      height:"100vh", background:"#0a0a1a", color:"#FFD700",
      flexDirection:"column", gap:12, fontFamily:"sans-serif",
    }}>
      <div style={{ fontSize:44 }}>🎰</div>
      <div style={{ fontSize:16, fontWeight:"bold" }}>Conectando…</div>
    </div>
  );

  if (!jogo) return <Menu user={user} onEscolher={setJogo} />;

  if (jogo === "eunca") return (
    <EuncaScreen
      estado={estado} fim={fim} user={user}
      iniciar={euncaIniciar} beber={euncaBeber} proxima={euncaProxima}
    />
  );

  if (jogo === "vod") return (
    <VoDScreen
      estado={estado} carta={carta} privado={privado} aviso={aviso} user={user}
      iniciar={vodIniciar} verdade={vodVerdade} desafio={vodDesafio} proxima={vodProxima}
      onClearPrivado={() => setPrivado(null)}
    />
  );

  if (jogo === "mestre") return (
    <MestreScreen
      estado={estado} carta={carta} privado={privado} aviso={aviso}
      aposta={aposta} senha={senha} fim={fim} user={user}
      iniciar={mestreIniciar} puxarCarta={mestreCarta} pelado={mestrePelado}
      apostar={mestreApostar} encerrar={mestreEncerrar}
      onClearPrivado={() => setPrivado(null)}
      onClearAposta={() => setAposta(null)}
      mestreEntrar={mestreEntrar}
    />
  );

  return null;
}
