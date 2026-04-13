import type { Hono } from "hono";

// Conversion tables: all values relative to a base unit per category
const LENGTH: Record<string, number> = {
  m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254,
};
const WEIGHT: Record<string, number> = {
  kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, ton: 1000,
};
const VOLUME: Record<string, number> = {
  l: 1, ml: 0.001, gal: 3.785411784, qt: 0.946352946, pt: 0.473176473, cup: 0.2365882365, fl_oz: 0.0295735296,
};
const SPEED: Record<string, number> = {
  "m/s": 1, "km/h": 0.277777778, mph: 0.44704, knots: 0.514444,
};
const DATA: Record<string, number> = {
  B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624,
};

interface Category { name: string; units: Record<string, number> }

const CATEGORIES: Category[] = [
  { name: "length", units: LENGTH },
  { name: "weight", units: WEIGHT },
  { name: "volume", units: VOLUME },
  { name: "speed", units: SPEED },
  { name: "data", units: DATA },
];

function normalizeUnit(u: string): string {
  return u.toLowerCase().replace(/\s+/g, "");
}

function findCategory(from: string, to: string, hint?: string): Category | null {
  const f = normalizeUnit(from);
  const t = normalizeUnit(to);
  if (hint) {
    const cat = CATEGORIES.find((c) => c.name === hint.toLowerCase());
    if (cat) {
      const keys = Object.keys(cat.units).map(normalizeUnit);
      if (keys.includes(f) && keys.includes(t)) return cat;
    }
  }
  for (const cat of CATEGORIES) {
    const keys = Object.keys(cat.units).map(normalizeUnit);
    if (keys.includes(f) && keys.includes(t)) return cat;
  }
  return null;
}

function findUnitKey(units: Record<string, number>, input: string): string | null {
  const norm = normalizeUnit(input);
  for (const key of Object.keys(units)) {
    if (normalizeUnit(key) === norm) return key;
  }
  return null;
}

function convertTemperature(value: number, from: string, to: string): number | null {
  const f = normalizeUnit(from);
  const t = normalizeUnit(to);
  // Normalize aliases
  const alias = (s: string) => {
    if (s === "c" || s === "celsius" || s === "°c") return "c";
    if (s === "f" || s === "fahrenheit" || s === "°f") return "f";
    if (s === "k" || s === "kelvin") return "k";
    return s;
  };
  const a = alias(f);
  const b = alias(t);
  if (a === b) return value;
  // Convert to celsius first
  let celsius: number;
  if (a === "c") celsius = value;
  else if (a === "f") celsius = (value - 32) * 5 / 9;
  else if (a === "k") celsius = value - 273.15;
  else return null;
  // Convert from celsius to target
  if (b === "c") return celsius;
  if (b === "f") return celsius * 9 / 5 + 32;
  if (b === "k") return celsius + 273.15;
  return null;
}

function isTemperatureUnit(u: string): boolean {
  const norm = normalizeUnit(u);
  return ["c", "celsius", "°c", "f", "fahrenheit", "°f", "k", "kelvin"].includes(norm);
}

export function registerRoutes(app: Hono) {
  app.post("/api/convert", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (body?.value === undefined || !body?.from || !body?.to) {
      return c.json({ error: "Missing required fields: value, from, to" }, 400);
    }

    const value = Number(body.value);
    if (isNaN(value)) {
      return c.json({ error: "Invalid value: must be a number" }, 400);
    }

    const from: string = body.from;
    const to: string = body.to;

    // Temperature special case
    if (isTemperatureUnit(from) && isTemperatureUnit(to)) {
      const result = convertTemperature(value, from, to);
      if (result !== null) {
        return c.json({
          input: { value, unit: from },
          output: { value: Math.round(result * 1e10) / 1e10, unit: to },
          category: "temperature",
          formula: `${from} → ${to}`,
        });
      }
    }

    // Standard conversion
    const category = findCategory(from, to, body.category);
    if (!category) {
      const allUnits = CATEGORIES.map((c) => `${c.name}: ${Object.keys(c.units).join(", ")}`).join(" | ");
      return c.json({
        error: `Cannot convert from '${from}' to '${to}'. Supported: temperature: celsius, fahrenheit, kelvin | ${allUnits}`,
      }, 400);
    }

    const fromKey = findUnitKey(category.units, from);
    const toKey = findUnitKey(category.units, to);
    if (!fromKey || !toKey) {
      return c.json({ error: `Unit not found in ${category.name}` }, 400);
    }

    const baseValue = value * category.units[fromKey];
    const result = baseValue / category.units[toKey];

    return c.json({
      input: { value, unit: fromKey },
      output: { value: Math.round(result * 1e10) / 1e10, unit: toKey },
      category: category.name,
      formula: `1 ${fromKey} = ${Math.round((category.units[fromKey] / category.units[toKey]) * 1e10) / 1e10} ${toKey}`,
    });
  });
}
