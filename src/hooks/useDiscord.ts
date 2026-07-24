import { useEffect, useState } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import type { DiscordUser } from "../types";

const sdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

export function useDiscord() {
  const [user,      setUser]      = useState<DiscordUser | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [ready,     setReady]     = useState(false);

  useEffect(() => {
    (async () => {
      await sdk.ready();
      const { code } = await sdk.commands.authorize({
        client_id:     import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: "code",
        state: "", prompt: "none", scope: ["identify"],
      });
      const r = await fetch("/.proxy/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const { access_token } = await r.json();
      const auth = await sdk.commands.authenticate({ access_token });
      setUser({ id: auth.user.id, username: auth.user.username, avatar: auth.user.avatar ?? "" });
      setChannelId(sdk.channelId);
      setReady(true);
    })().catch(console.error);
  }, []);

  return { user, channelId, ready };
}
