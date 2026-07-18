# Unit Converter API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://unit-converter.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Convert between units -- length, weight, temperature, volume, speed, data storage. Formula included. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "unit-converter": {
      "url": "https://unit-converter.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://unit-converter.api.klymax402.com/api/convert" \
  -H "Content-Type: application/json" \
  -d '{"value":"1","from":"...","to":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `utility_convert_units` | POST | `/api/convert` | $0.003 | Convert a value between measurement units |

### `utility_convert_units`

Use this when you need to convert between measurement units. Returns the conversion result with formula in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `value` | number | yes | The numeric value to convert |
| `from` | string | yes | Source unit (e.g. km, lb, celsius, l, mph, MB) |
| `to` | string | yes | Target unit (e.g. mi, kg, fahrenheit, gal, km/h, GB) |
| `category` | string | no | Optional category hint: length, weight, temperature, volume, speed, data |

Example response:

```json
{"inputValue":100,"from":"km","to":"mi","result":62.1371,"formula":"100 km * 0.621371 = 62.1371 mi","category":"length"}
```

**When to use**: unit conversions in calculations, data analysis, scientific computing, recipe scaling, and engineering applications.

**Not for**: currency conversion (use `finance_convert_currency`), timezone conversion (use `utility_convert_timezone`), stock prices (use `finance_get_stock_price`).

## Example agent prompts

- "Convert between measurement units"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
