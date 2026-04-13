import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "unit-converter",
  slug: "unit-converter",
  description: "Convert between units -- length, weight, temperature, volume, speed, data storage. Formula included.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/convert",
      price: "$0.001",
      description: "Convert a value between measurement units",
      toolName: "utility_convert_units",
      toolDescription: `Use this when you need to convert between measurement units. Returns the conversion result with formula in JSON.

Returns: 1. result (converted value) 2. from and to units 3. inputValue 4. formula (human-readable conversion formula) 5. category (length/weight/temperature/volume/speed/data). Supports: length (m, km, mi, ft, in, cm, mm, yd), weight (kg, g, lb, oz, mg, ton), temperature (celsius, fahrenheit, kelvin), volume (l, ml, gal, qt, pt, cup, fl_oz), speed (m/s, km/h, mph, knots), data (B, KB, MB, GB, TB, PB).

Example output: {"inputValue":100,"from":"km","to":"mi","result":62.1371,"formula":"100 km * 0.621371 = 62.1371 mi","category":"length"}

Use this FOR unit conversions in calculations, data analysis, scientific computing, recipe scaling, and engineering applications.

Do NOT use for currency conversion -- use finance_convert_currency instead. Do NOT use for timezone conversion -- use utility_convert_timezone instead. Do NOT use for stock prices -- use finance_get_stock_price instead.`,
      inputSchema: {
        type: "object",
        properties: {
          value: { type: "number", description: "The numeric value to convert" },
          from: { type: "string", description: "Source unit (e.g. km, lb, celsius, l, mph, MB)" },
          to: { type: "string", description: "Target unit (e.g. mi, kg, fahrenheit, gal, km/h, GB)" },
          category: { type: "string", description: "Optional category hint: length, weight, temperature, volume, speed, data" },
        },
        required: ["value", "from", "to"],
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "input": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "number"
                },
                "unit": {
                  "type": "string"
                }
              }
            },
            "output": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "number"
                },
                "unit": {
                  "type": "string"
                }
              }
            },
            "category": {
              "type": "string",
              "description": "Unit category (length, weight, temperature, etc.)"
            },
            "formula": {
              "type": "string",
              "description": "Conversion formula"
            }
          },
          "required": [
            "input",
            "output",
            "category"
          ]
        },
    },
  ],
};
