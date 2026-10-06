# Açaí Showdown

A complete multiplayer website for 2–6 players, with three 105-second decorating rounds and 20-second anonymous voting windows.

## Play step by step

1. Open the published website on your phone or computer.
2. Try **Try the bowl studio solo** to learn the controls.
3. Enter your chef name and choose **Create a room**.
4. Choose **Copy invite link** and send it to your friends. They enter a name and join; no game account is required on a public deployment.
5. Once at least two players have joined, the host chooses **Start the showdown**.
6. Pick a base, then a fruit, crunch topping, flower, or drizzle. Choose Single, Arc, Row, or Scatter and tap the bowl. Undo and Clear let you adjust your design.
7. Name your bowl and choose **Finish bowl**, or let the 105-second timer end. Bowls save automatically as you decorate.
8. Vote for another chef’s bowl within 20 seconds. Names stay hidden until results. Every vote earns one point.
9. The host starts each next round. After three rounds, the highest total wins; tied players share the crown.

With two players, each can only vote for the other, so a tie is normal. Three or more players makes voting more competitive.

## Included

- 24 original themes, three different themes selected per game.
- 23 ingredient choices: three bases, 16 photographic toppings, and four drizzles.
- Classic açaí, pink pitaya, and blue spirulina bases.
- Strawberry, banana, mango, blueberry, kiwi, raspberry, pineapple, dragonfruit, granola, coconut flakes, almond slivers, cacao nibs, chia, pistachio, chocolate chips, edible flowers.
- Honey, chocolate sauce, peanut butter, and vanilla yogurt drizzles.
- Photographic food assets composited into the same ceramic bowl renderer on your canvas, voting cards, and results.
- Four placement modes, ingredient landing animations, animated drizzles, undo, clear, and a 64-piece limit.
- Edit toppings: select or drag a piece, adjust rotation and size, nudge its position, duplicate, bring forward, or remove it. Edits save to the shared game.
- Round-winner badges and a personal confetti celebration, including tied wins. Reduced-motion preferences disable these animations.
- A shared server-controlled clock and server-validated votes and scores.
- Anonymous session cookie; refreshing in the same browser restores your current room. Each player needs a separate browser session/device.
- Automatic host handoff after 45 seconds disconnected, when another connected player is present.
- Rooms expire after 12 hours. The app keeps at most 10 active rooms per creating session.

## Hosting and data

This version uses Sites hosting with a Cloudflare Worker and a D1 database. You do not need to configure Firebase, Socket.IO, or a separate database account. Game state is synchronized by short polling every 1.2 seconds, with shared server deadlines, rather than a per-frame action-game network loop.

Names, bowl designs, and game scores are kept in the room until expiration. Session credentials use HttpOnly cookies; credentials are not exposed in room responses. Room codes are invitation secrets: share them only with intended players. Public hosting allows anyone with the website URL to create their own room.

## Developer guide

Source entry points:
- `app/page.tsx`: screens and client interactions.
- `app/globals.css`: responsive design.
- `components/bowl.tsx`: photographic bowl renderer and arrangement tools.
- `lib/game.ts`: ingredients, themes, validation, clock, scoring, and public response shape.
- `app/api/game/route.ts`: room API, anonymous sessions, authorization, and optimistic concurrency.
- `db/schema.ts` and `drizzle/`: database schema and migration.
- `public/images/`: original generated photographic assets.

Install Node.js 22.13 or newer, then run `npm ci` and `npm run dev`. Build with `npm run build`. See the bundled scripts for the local Cloudflare binding setup. After the first build, apply `drizzle/0000_purple_hobgoblin.sql` to the LOCAL D1 database once:

```text
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_purple_hobgoblin.sql
```

`node scripts/check-multiplayer.mjs` checks three actual 105-second rounds against the local server at port 5173 using three separate session cookies. It also checks simultaneous joins, reconnecting, private drafts, submission locks, self-voting and duplicate-vote prevention, scoring, and rematches.

## Future options

For a larger public launch, add infrastructure rate limiting and load testing. This release is built for small private friend groups sharing room codes, not tournament-scale matchmaking.
