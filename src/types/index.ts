export interface Player {
  userId:   string;
  username: string;
  avatar:   string;
  bebidas?: number;
  pecas?:   number;
  pelado?:  boolean;
  vez?:     boolean;
}

export interface GameState {
  estado:    "aguardando" | "jogando" | "fim";
  jogadores: Player[];
  gameState: any;
}

export interface Carta {
  tipo:     "verdade" | "desafio" | "desafio_privado" | "direto" | "punitiva" | "roleta" | "visual";
  texto:    string;
  jogador?: { userId: string; username: string };
  alvo?:    { userId: string; username: string } | null;
  privativo?: boolean;
}

export type Jogo = "eunca" | "vod" | "mestre";

export interface DiscordUser {
  id:       string;
  username: string;
  avatar:   string;
}
