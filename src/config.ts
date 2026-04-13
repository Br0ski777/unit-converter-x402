import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "unit-converter",
  slug: "unit-converter",
  description: "Convert between units of length, weight, temperature, volume, speed, and data.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/convert",
      price: "$0.001",
      description: "Convert a value between measurement units",
      toolName: "utility_convert_units",
      toolDescription: "Use this when you need to convert between measurement units. Supports length (m, km, mi, ft, in, cm, mm, yd), weight (kg, g, lb, oz, mg, ton), temperature (celsius, fahrenheit, kelvin), volume (l, ml, gal, qt, pt, cup, fl_oz), speed (m/s, km/h, mph, knots), and data (B, KB, MB, GB, TB, PB). Returns the converted value, source and target units, and conversion formula. Do NOT use for currency conversion — use finance_convert_currency instead. Do NOT use for timezone conversion — use utility_convert_timezone instead.",
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
    },
  ],
};
