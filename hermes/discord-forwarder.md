# Discord → Worker forwarder (Mac side, Hermes)

Reads new posts from a Discord job channel with a **bot you own** and forwards them to the
growth Worker, where they become hot `discord` jobs, get scored, and reach Telegram as cards
with a DM draft and a thread-reply fallback. Reading only. Nothing here ever writes as Dan.

## One-time setup (Dan)

1. **Bot.** https://discord.com/developers/applications → New Application `growth-reader` →
   Bot → Reset Token (copy it once) → Privileged Gateway Intents: enable **Message Content**.
2. **Your server.** Create a small Discord server (e.g. `dan-hunt`). Invite the bot with the
   OAuth2 URL generator: scope `bot`, permissions `View Channels`, `Read Message History`.
3. **The source channel.** Two cases:
   - The source channel shows a **Follow** button (announcement channel): open it, Follow, pick
     your server and a channel (e.g. `#effect-jobs`). New posts are copied into your channel.
   - No Follow button: only a server admin can invite your bot there. Ask in the server, or
     rely on the Effect job directory (already ingested daily) and the HN/Djinni sources.
4. Put into `~/.hermes/.env` (never into the repo): `DISCORD_BOT_TOKEN=…`,
   `GROWTH_ADMIN_TOKEN=<ADMIN_TOKEN from worker/.env>`, `GROWTH_URL=https://growth.danyaolekhq.workers.dev`,
   `DISCORD_WATCH_CHANNELS=<channelId>[,<channelId>…]` (your own channel ids; right-click → Copy ID
   with Developer Mode on).

## What the forwarder does

Every 10 minutes while the Mac is awake, and once on wake (Hermes cron with catch-up):

```
for each channel id:
  last = state[channel] ?? null
  GET https://discord.com/api/v10/channels/{channel}/messages?limit=100&after={last}
      Authorization: Bot $DISCORD_BOT_TOKEN
  posts = messages with content, oldest first
  POST $GROWTH_URL/api/admin/ingest-discord  (Authorization: Bearer $GROWTH_ADMIN_TOKEN)
    { "posts": [ { "id", "channel", "author": username, "authorId": author.id,
                   "content", "url": "https://discord.com/channels/<guild>/<channel>/<id>"
                   (for followed copies use message_reference.{guild_id,channel_id,message_id}),
                   "createdAt": timestamp } ] }
  state[channel] = newest id   (persisted in ~/.hermes/state/discord-forwarder.json)
```

The Worker dedupes by message id, so re-sending is harmless. Followed copies arrive as webhook
messages whose `author` is the webhook; the original author name is in `author.username` of the
copy and the original message link is `message_reference`. A direct DM deep link needs the
original author's user id, which followed copies do not carry; cards therefore open the message
and Dan taps the author.

## Hermes cron (one-off)

In a Hermes session: "create a cron job every 10 minutes named discord-forwarder that runs the
forwarder described in ~/growth/hermes/discord-forwarder.md using the tokens in ~/.hermes/.env;
catch up missed runs on wake." Hermes writes the job to `~/.hermes/cron/jobs.json`; the script
itself is a short Bun file it can generate from this spec (`~/growth/hermes/discord-forwarder.ts`).
