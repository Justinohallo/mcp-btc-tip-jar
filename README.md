# mcp-btc-tip-jar

An MCP server that renders an interactive Bitcoin Lightning tip jar inside an AI chat client. Instead of answering with text, the tools return UI resources (via [`@mcp-ui/server`](https://github.com/idosal/mcp-ui)) that the client draws as a widget: pick an amount, get an invoice, check whether it was paid.

Built as a demo for the Bitcoin Builders Vancouver meetup, to show what agent-native payment UI could look like. **Invoices are mocked**: the BOLT11 strings are generated locally and no Lightning node or payment provider is involved, so nothing here moves real sats.

## Tools

| Tool | Input | Returns |
|---|---|---|
| `show_tip_jar` | none | The tip-jar widget with preset and custom amounts |
| `generate_invoice` | `amount` (sats, positive number, validated with Zod) | An invoice card with the BOLT11 string |
| `check_payment` | none | The payment status of the current invoice |

## Two transports

- `server.ts` runs over **stdio**, for local clients such as Claude Desktop.
- `server-http.ts` runs over **HTTP + SSE** (Express) for remote deployment: `GET /sse` opens the stream, `POST /messages` carries client calls, and `GET /health` is a health check.

## Run it

```bash
npm install
npm start                   # stdio
npx tsx server-http.ts      # HTTP + SSE on $PORT (default 3000)
```

For a stdio client, point its MCP config at `npx tsx /path/to/server.ts`. For a remote client, use `http://<host>:3000/sse`.

## Stack

TypeScript, the official MCP TypeScript SDK, `@mcp-ui/server`, Zod and Express 5.
