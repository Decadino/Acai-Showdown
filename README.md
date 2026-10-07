# Açaí Showdown

A complete multiplayer website for 2–6 players, with three 105-second decorating rounds and 40-second anonymous voting windows.

## Play step by step

1. Open the published website on your phone or computer.
2. Try **Try the bowl studio solo** to learn the controls.
3. Enter your chef name and choose **Create a room**.
4. Choose **Copy invite link** and send it to your friends. They enter a name and join; no game account is required on a public deployment.
5. Choose the three theme cards in the lobby. Once at least two players have joined, the host chooses **Start the showdown**. Round two has a 60-coin budget; each placed topping or drizzle costs 1–4 coins. Bases are free, and removing pieces refunds coins.
6. Pick a base, then a fruit, crunch topping, flower, or drizzle. Choose Single, Arc, Row, or Scatter and tap the bowl. Undo and Clear let you adjust your design.
7. Name your bowl and choose **Finish bowl**, or let the 105-second timer end. Bowls save automatically as you decorate.
8. Vote within 40 seconds for the best bowl and two separate audience awards: Most creative and Would actually eat. Names stay hidden until results. Only best-bowl votes earn points.
9. The host starts each next round. After three rounds, the highest total wins; tied players share the crown.

With two players, each can only vote for the other, so a tie is normal. Three or more players makes voting more competitive.

## Included

- Stylized 3D ceramic bowls and all 20 topping/drizzle models, with camera orbit, zoom, ray-based placement, dragging, landing animations, and raised drizzles that follow the food.
- A persistent 2D/3D switch keeps the original photographic design available. Both views use the same bowl and multiplayer data.
- 3D renders on demand, shares ingredient geometry, limits device pixel ratio, pauses offscreen scenes, cleans up GPU resources, and falls back to 2D when WebGL is unavailable.

- Mystery ingredients are chosen separately for each player, hidden until placement, and protected against removal.
- Color Lock shows a rough color estimate and awards one bonus point at 55% dominance.
- One-Handed allows one base and two topping or drizzle types, with the normal piece limit.
- No Repeats gives the first successful server claim exclusive use of an ingredient for the round. Claims persist if pieces are removed and reset next round.
- The solo practice mutation selector lets players learn each rule; shared ingredient claims apply in multiplayer.

- 27 theme cards, including Beach day, Dessert monster, and Fancy café. Hosts can choose each round’s theme.
- 23 ingredient choices: three bases, 16 photographic toppings, and four drizzles.
- Classic açaí, pink pitaya, and blue spirulina bases.
- Strawberry, banana, mango, blueberry, kiwi, raspberry, pineapple, dragonfruit, granola, coconut flakes, almond slivers, cacao nibs, chia, pistachio, chocolate chips, edible flowers.
- Honey, chocolate sauce, peanut butter, and vanilla yogurt drizzles.
- Photographic food assets composited into the same ceramic bowl renderer on your canvas, voting cards, and results.
- Four placement modes, ingredient landing animations, animated drizzles, undo, clear, and a 150-piece limit.
- Edit toppings: select or drag a piece, adjust rotation and size, nudge its position, duplicate, bring forward, or remove it. Edits save to the shared game.
- Round-winner badges and a personal confetti celebration, including tied wins. Reduced-motion preferences disable these animations.
- A 60-coin budget challenge in round two, with live balance, per-piece prices, placement costs, server validation, and solo budget practice.
- Separate Most creative and Would actually eat ballots and result awards, including ties. Awards do not change the main score.
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

`node --experimental-strip-types scripts/check-mutations.mjs` checks the mutation API logic with a simulated database and clock, including simultaneous claims, validation, privacy, scores, and round resets; it also confirms the local Worker creates a real room.

`node --experimental-strip-types scripts/check-round-features.mjs` verifies budget boundaries, 150-piece limits, refunds, private ballots, tied awards, score isolation, timeout transitions, and two real multiplayer rounds using three separate session cookies on the local server at port 5173.

## Future options

For a larger public launch, add infrastructure rate limiting and load testing. This release is built for small private friend groups sharing room codes, not tournament-scale matchmaking.

## Party features
Hosts choose 45/60/105-second timers and a mode for each round: Creative studio, 60-coin Budget battle, 45-second Quick serve, or Mirror menu. Mirror menu disables mutations and awards +2 for at least 75% similarity. Private server-assigned goals earn +1. A halfway Signature serve surprise earns +1 for a bowl title of at least three trimmed characters. Server scoring runs once per round.

Reveal reactions are shared, limited to one per other player bowl, and do not award points. The collection unlocks cosmetic bowl finishes after 1, 3, 5, and 10 completed multiplayer games; completion and selection are saved in localStorage on the player device. Rematches have distinct IDs, so refreshing results cannot double-count completion. All ingredients remain available.
