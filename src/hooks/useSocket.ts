import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { DiscordUser, GameState, Carta } from "../types";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "/.proxy";

export function useSocket({ user, channelId, ready, jogo }: {
  user: DiscordUser | null;
  channelId: string | null;
  ready: boolean;
  jogo: string | null;
}) {
  const ref = useRef<Socket | null>(null);
  const [estado,   setEstado]   = useState<GameState | null>(null);
  const [carta,    setCarta]    = useState<Carta | null>(null);
  const [privado,  setPrivado]  = useState<Carta | null>(null);
  const [aviso,    setAviso]    = useState<string | null>(null);
  const [erro,     setErro]     = useState<string | null>(null);
  const [aposta,   setAposta]   = useState<any>(null);
  const [senha,    setSenha]    = useState<string | null>(null);
  const [fim,      setFim]      = useState<GameState | null>(null);

  useEffect(() => {
    if (!ready || !user || !channelId || !jogo) return;
    const s = io(BACKEND, { transports: ["websocket"] });
    ref.current = s;

    const p = jogo;

    // eventos comuns
    s.on(`${p}:estado`,  (e: GameState) => setEstado(e));
    s.on(`${p}:fim`,     (e: GameState) => setFim(e));
    s.on("erro",         (msg: string)  => { setErro(msg); setTimeout(() => setErro(null), 3000); });

    // eunca
    s.on("eunca:estado", (e) => setEstado(e));

    // vod
    s.on("vod:carta",         (e) => { setEstado(e); setCarta(e.carta); });
    s.on("vod:privado_aviso", ({ jogador, alvo }: any) =>
      setAviso(`🔒 ${jogador} e ${alvo} foram pra thread privada!`));
    s.on("vod:privado_carta", (c: Carta) => setPrivado(c));

    // mestre
    s.on("mestre:senha",        (s: string) => setSenha(s));
    s.on("mestre:carta",        (c: Carta)  => setCarta(c));
    s.on("mestre:privado_aviso",({ p1, p2 }: any) =>
      setAviso(`🔒 ${p1} e ${p2} foram pra thread privada!`));
    s.on("mestre:privado_carta",(c: Carta)  => setPrivado(c));
    s.on("mestre:aposta",       (r: any)    => setAposta(r));
    s.on("mestre:encerrado",    ()          => setFim({ estado: "fim", jogadores: [], gameState: null }));

    // entra na sala
    if (jogo === "mestre") {
      s.emit("mestre:criar", { channelId, userId: user.id, username: user.username, avatar: user.avatar });
    } else {
      s.emit(`${jogo}:entrar`, { channelId, userId: user.id, username: user.username, avatar: user.avatar });
    }

    return () => { s.disconnect(); };
  }, [ready, user, channelId, jogo]);

  const emit = useCallback((ev: string, data?: any) => ref.current?.emit(ev, data), []);

  return {
    estado, carta, privado, aviso, erro, aposta, senha, fim,
    setCarta, setPrivado, setAviso, setAposta,
    // eunca
    euncaIniciar: ()    => emit("eunca:iniciar"),
    euncaBeber:   ()    => emit("eunca:beber"),
    euncaProxima: ()    => emit("eunca:proxima"),
    // vod
    vodIniciar:   ()    => emit("vod:iniciar"),
    vodVerdade:   ()    => emit("vod:verdade"),
    vodDesafio:   ()    => emit("vod:desafio"),
    vodProxima:   ()    => emit("vod:proxima"),
    // mestre
    mestreEntrar:   (senha: string) => emit("mestre:entrar", { channelId, userId: user?.id, username: user?.username, avatar: user?.avatar, senha }),
    mestreIniciar:  ()              => emit("mestre:iniciar"),
    mestreCarta:    ()              => emit("mestre:carta"),
    mestrePelado:   ()              => emit("mestre:pelado"),
    mestreApostar:  (alvoId: string, tipo: string) => emit("mestre:apostar", { alvoId, tipo }),
    mestreEncerrar: ()              => emit("mestre:encerrar"),
  };
}
