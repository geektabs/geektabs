import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up body parser
  app.use(express.json());

  // Initialize Gemini if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }

  // API routes FIRST
  app.get("/api/inspiration", async (req, res) => {
    try {
      const activeApiKey = process.env.GEMINI_API_KEY || apiKey;
      if (!activeApiKey) {
        return res.json({
          quote: "Focus on being productive instead of busy.",
          author: "Tim Ferriss"
        });
      }

      if (!ai && activeApiKey) {
        ai = new GoogleGenAI({ apiKey: activeApiKey });
      }

      if (!ai) {
        return res.json({
          quote: "Focus on being productive instead of busy.",
          author: "Tim Ferriss"
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Generate a short, powerful, and deeply inspiring quote for a productivity dashboard. Return ONLY JSON with 'quote' and 'author' fields. No other text.",
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "";
      const parsed = JSON.parse(text || '{"quote": "The best way to predict the future is to create it.", "author": "Peter Drucker"}');
      res.json(parsed);
    } catch (error: any) {
      console.error("Server failed to generate content:", error);
      res.status(200).json({ 
        quote: "Focus on being productive instead of busy.", 
        author: "Tim Ferriss" 
      });
    }
  });

  // Live Forex Rates Cache & Endpoint
  let forexCache: {
    timestamp: number;
    rates: Record<string, number>;
    majors: Array<{ pair: string; price: number; changePct: number }>;
    updatedAt: string;
    source: string;
  } | null = null;

  app.get("/api/forex-rates", async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === "1";
      const from = typeof req.query.from === "string" ? req.query.from.toUpperCase().replace(/[^A-Z]/g, "") : "";
      const to = typeof req.query.to === "string" ? req.query.to.toUpperCase().replace(/[^A-Z]/g, "") : "";

      const now = Date.now();
      let payload = forexCache;

      if (!payload || forceRefresh || now - payload.timestamp > 30_000) {
        const rates: Record<string, number> = { USD: 1 };
        const majors: Array<{ pair: string; price: number; changePct: number }> = [];
        let updatedAt = new Date().toISOString();
        let source = "Streaming Forex Majors";

        // 1. Attempt Investing.com streaming-forex-rates-majors directly if accessible
        try {
          const invRes = await fetch("https://www.investing.com/currencies/streaming-forex-rates-majors", {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
            },
            signal: AbortSignal.timeout(3500),
          });
          if (invRes.ok) {
            const html = await invRes.text();
            const pairPatterns = [
              "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
              "EUR/GBP", "EUR/JPY", "GBP/JPY", "USD/CNY", "USD/HKD", "USD/SGD",
            ];
            for (const pair of pairPatterns) {
              const escaped = pair.replace("/", "\\/");
              const regex = new RegExp(`${escaped}[\\s\\S]{0,450}?>([0-9]+\\.[0-9]+)<`, "i");
              const match = html.match(regex);
              if (match && match[1]) {
                const val = parseFloat(match[1]);
                if (Number.isFinite(val) && val > 0) {
                  majors.push({ pair, price: val, changePct: 0 });
                  const [base, quote] = pair.split("/");
                  if (base === "USD") rates[quote] = val;
                  else if (quote === "USD") rates[base] = 1 / val;
                }
              }
            }
            if (majors.length >= 5) {
              source = "Investing.com Streaming Forex Majors";
            }
          }
        } catch {
          // Proceed cleanly to global FX feed
        }

        // 2. Fetch full 160+ currency table + real-time spot major pairs in parallel
        const spotDefs = [
          { pair: "EUR/USD", sym: "EURUSD=X", base: "EUR", quote: "USD" },
          { pair: "GBP/USD", sym: "GBPUSD=X", base: "GBP", quote: "USD" },
          { pair: "USD/JPY", sym: "USDJPY=X", base: "USD", quote: "JPY" },
          { pair: "USD/CHF", sym: "USDCHF=X", base: "USD", quote: "CHF" },
          { pair: "AUD/USD", sym: "AUDUSD=X", base: "AUD", quote: "USD" },
          { pair: "USD/CAD", sym: "USDCAD=X", base: "USD", quote: "CAD" },
          { pair: "NZD/USD", sym: "NZDUSD=X", base: "NZD", quote: "USD" },
          { pair: "USD/CNY", sym: "USDCNY=X", base: "USD", quote: "CNY" },
          { pair: "EUR/GBP", sym: "EURGBP=X", base: "EUR", quote: "GBP" },
          { pair: "EUR/JPY", sym: "EURJPY=X", base: "EUR", quote: "JPY" },
        ];

        const [erSettled, ...spotSettled] = await Promise.allSettled([
          fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(5000) }).then((r) => r.json()),
          ...spotDefs.map((def) =>
            fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${def.sym}?interval=1m&range=1d`, {
              headers: { "User-Agent": "Mozilla/5.0" },
              signal: AbortSignal.timeout(4500),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((json) => {
                const meta = json?.chart?.result?.[0]?.meta;
                const price = Number(meta?.regularMarketPrice);
                const prev = Number(meta?.chartPreviousClose || meta?.previousClose);
                const changePct = prev > 0 && price > 0 ? ((price - prev) / prev) * 100 : 0;
                return price > 0 ? { ...def, price, changePct, time: meta?.regularMarketTime } : null;
              })
              .catch(() => null)
          ),
        ]);

        if (erSettled.status === "fulfilled" && erSettled.value?.rates) {
          for (const [code, val] of Object.entries(erSettled.value.rates)) {
            if (typeof val === "number" && val > 0 && !rates[code]) {
              rates[code] = val;
            }
          }
          if (erSettled.value.time_last_update_unix) {
            updatedAt = new Date(erSettled.value.time_last_update_unix * 1000).toISOString();
          }
        }

        const existingPairs = new Set(majors.map((m) => m.pair));
        for (const item of spotSettled) {
          if (item.status === "fulfilled" && item.value) {
            const { pair, base, quote, price, changePct, time } = item.value;
            if (!existingPairs.has(pair)) {
              majors.push({ pair, price, changePct });
              existingPairs.add(pair);
            }
            if (base === "USD") {
              rates[quote] = price;
            } else if (quote === "USD") {
              rates[base] = 1 / price;
            }
            if (time) {
              updatedAt = new Date(time * 1000).toISOString();
            }
          }
        }

        if (Object.keys(rates).length <= 1) {
          try {
            const cdnRes = await fetch(
              "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
              { signal: AbortSignal.timeout(5000) }
            );
            if (cdnRes.ok) {
              const cdnJson = await cdnRes.json();
              if (cdnJson?.usd && typeof cdnJson.usd === "object") {
                for (const [k, v] of Object.entries(cdnJson.usd)) {
                  if (typeof v === "number" && v > 0) {
                    rates[k.toUpperCase()] = v;
                  }
                }
              }
            }
          } catch {
            // Try Frankfurter next
          }
        }

        if (Object.keys(rates).length <= 1) {
          // Last-resort Frankfurter fallback
          const frankRes = await fetch("https://api.frankfurter.dev/v1/latest?base=USD", {
            signal: AbortSignal.timeout(5000),
          });
          if (frankRes.ok) {
            const frankJson = await frankRes.json();
            Object.assign(rates, frankJson.rates || {});
          }
        }

        payload = { timestamp: now, rates, majors, updatedAt, source };
        forexCache = payload;
      }

      // If caller asks for a specific cross-pair, fetch direct spot quote when available
      let directRate: number | null = null;
      if (from && to && from.length === 3 && to.length === 3) {
        if (from === to) {
          directRate = 1;
        } else {
          try {
            const pairRes = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${from}${to}=X?interval=1m&range=1d`,
              { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(3000) }
            );
            if (pairRes.ok) {
              const pairJson = await pairRes.json();
              const p = Number(pairJson?.chart?.result?.[0]?.meta?.regularMarketPrice);
              if (Number.isFinite(p) && p > 0) {
                directRate = p;
              }
            }
          } catch {
            // Fall back to base-USD cross rate
          }
          if (!directRate && payload.rates[from] && payload.rates[to]) {
            directRate = payload.rates[to] / payload.rates[from];
          }
        }
      }

      res.json({
        base: "USD",
        rates: payload.rates,
        majors: payload.majors,
        directRate,
        updatedAt: payload.updatedAt,
        source: payload.source,
      });
    } catch (error: any) {
      console.error("Failed to fetch live forex rates:", error);
      res.status(502).json({ error: "Unable to load live forex rates" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
