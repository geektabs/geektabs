import express from "express";
import fs from "fs";
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

  app.get("/api/maps-config", (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.json({
      apiKey:
        process.env.VITE_GOOGLE_MAPS_API_KEY ||
        process.env.GOOGLE_MAPS_API_KEY ||
        "",
    });
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

        const [invSettled, erSettled, ...spotSettled] = await Promise.allSettled([
          fetch("https://www.investing.com/currencies/streaming-forex-rates-majors", {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
            },
            signal: AbortSignal.timeout(2500),
          })
            .then((r) => (r.ok ? r.text() : ""))
            .catch(() => ""),
          fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(4000) }).then((r) => r.json()),
          ...spotDefs.map((def) =>
            fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${def.sym}?interval=1m&range=1d`, {
              headers: { "User-Agent": "Mozilla/5.0" },
              signal: AbortSignal.timeout(3500),
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

        if (invSettled.status === "fulfilled" && invSettled.value) {
          const html = invSettled.value;
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
              { signal: AbortSignal.timeout(4000) }
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
          const frankRes = await fetch("https://api.frankfurter.dev/v1/latest?base=USD", {
            signal: AbortSignal.timeout(4000),
          });
          if (frankRes.ok) {
            const frankJson = await frankRes.json();
            Object.assign(rates, frankJson.rates || {});
          }
        }

        payload = { timestamp: Date.now(), rates, majors, updatedAt, source };
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
              { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(2200) }
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

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.json({
        base: "USD",
        rates: payload.rates,
        majors: payload.majors,
        directRate,
        updatedAt: payload.updatedAt,
        fetchedAt: new Date(payload.timestamp).toISOString(),
        source: payload.source,
      });
    } catch (error: any) {
      console.error("Failed to fetch live forex rates:", error);
      res.status(502).json({ error: "Unable to load live forex rates" });
    }
  });

  const configuredAppUrl =
    process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL"
      ? process.env.APP_URL.replace(/\/+$/, "")
      : "";
  const isPrivateDevOrigin = (url: string) => /ais-dev-/i.test(url);

  app.get("/api/share-health", async (req, res) => {
    try {
      const requested = typeof req.query.url === "string" ? req.query.url.trim() : "";
      const fallbackShared = configuredAppUrl
        ? configuredAppUrl.replace(/^https?:\/\/ais-dev-/i, "https://ais-pre-")
        : "";
      const targetUrl = requested || fallbackShared;
      if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
        return res.json({ crawlable: false, reason: "invalid-url", status: 0 });
      }
      if (isPrivateDevOrigin(targetUrl)) {
        return res.json({ crawlable: false, reason: "private-dev", status: 302 });
      }
      const probe = await fetch(targetUrl, {
        method: "GET",
        redirect: "manual",
        headers: { "User-Agent": "LinkedInBot/1.0" },
        signal: AbortSignal.timeout(3500),
      });
      const location = probe.headers.get("location") || "";
      if (probe.status >= 300 && probe.status < 400 && /cookie_check/i.test(location)) {
        return res.json({ crawlable: false, reason: "cookie-check", status: probe.status });
      }
      if (probe.status === 404) {
        return res.json({ crawlable: false, reason: "not-published", status: 404 });
      }
      if (!probe.ok) {
        return res.json({ crawlable: false, reason: "unreachable", status: probe.status });
      }
      const html = await probe.text();
      const hasOgImage = /property=["']og:image["']/i.test(html);
      return res.json({
        crawlable: hasOgImage,
        reason: hasOgImage ? "ok" : "missing-og",
        status: probe.status,
      });
    } catch {
      return res.json({ crawlable: false, reason: "unreachable", status: 0 });
    }
  });

  // Bookmark Favicon Resolver Cache & Endpoint
  const faviconCache = new Map<string, { iconUrl: string | null; timestamp: number }>();
  const FAVICON_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

  const isDisallowedHostname = (hostname: string): boolean => {
    const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (!h || h === "localhost" || h === "0.0.0.0" || h === "::1" || h.endsWith(".local") || h.endsWith(".internal")) {
      return true;
    }
    if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) {
      return true;
    }
    const m172 = h.match(/^172\.(\d+)\./);
    if (m172) {
      const second = Number(m172[1]);
      if (second >= 16 && second <= 31) return true;
    }
    return false;
  };

  const verifyImageCandidate = async (candidateUrl: string): Promise<string | null> => {
    try {
      const parsed = new URL(candidateUrl);
      if (!["http:", "https:"].includes(parsed.protocol) || isDisallowedHostname(parsed.hostname)) {
        return null;
      }
      const res = await fetch(candidateUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5",
        },
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) return null;
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (ct.includes("text/html") || ct.includes("application/json")) return null;
      if (ct.startsWith("image/") || ct.includes("icon") || /\.(png|svg|ico|webp|jpg|jpeg|gif)(\?|$)/i.test(res.url)) {
        const buf = await res.arrayBuffer();
        if (buf.byteLength > 0) return res.url || candidateUrl;
      }
      return null;
    } catch {
      return null;
    }
  };

  const extractHtmlIconCandidates = (html: string, baseUrl: string): string[] => {
    const linkTags = html.match(/<link\b[^>]*>/gi) || [];
    const scored: Array<{ url: string; score: number }> = [];

    for (const tag of linkTags) {
      const relMatch = tag.match(/\brel\s*=\s*["']([^"']+)["']/i) || tag.match(/\brel\s*=\s*([^\s>]+)/i);
      const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i) || tag.match(/\bhref\s*=\s*([^\s>]+)/i);
      if (!relMatch || !hrefMatch) continue;

      const rel = relMatch[1].toLowerCase();
      if (!/\b(icon|apple-touch-icon|apple-touch-icon-precomposed|shortcut)\b/.test(rel)) continue;
      if (rel.includes("mask-icon")) continue;

      const rawHref = hrefMatch[1].trim();
      if (!rawHref || rawHref.startsWith("data:text")) continue;

      let resolved: string;
      try {
        resolved = new URL(rawHref, baseUrl).toString();
      } catch {
        continue;
      }

      let score = 10;
      if (rel === "icon" || rel === "shortcut icon") score += 20;
      if (rel.includes("apple-touch-icon")) score += 15;

      const mediaMatch = tag.match(/\bmedia\s*=\s*["']([^"']+)["']/i);
      if (mediaMatch && mediaMatch[1].toLowerCase().includes("prefers-color-scheme: dark")) {
        score -= 5;
      }

      if (/\.svg(\?|$)/i.test(resolved)) score += 30;
      else if (/\.png(\?|$)/i.test(resolved)) score += 25;
      else if (/\.webp(\?|$)/i.test(resolved)) score += 20;

      const sizesMatch = tag.match(/\bsizes\s*=\s*["']([^"']+)["']/i);
      if (sizesMatch) {
        const sizeNum = parseInt(sizesMatch[1], 10);
        if (Number.isFinite(sizeNum)) {
          if (sizeNum >= 128 && sizeNum <= 512) score += 25;
          else if (sizeNum >= 48) score += 18;
          else if (sizeNum >= 32) score += 10;
        }
      }

      scored.push({ url: resolved, score });
    }

    scored.sort((a, b) => b.score - a.score);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of scored) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        out.push(item.url);
      }
    }
    return out;
  };

  app.get("/api/favicon", async (req, res) => {
    try {
      const rawUrl = typeof req.query.url === "string" ? req.query.url.trim() : "";
      if (!rawUrl) return res.status(400).json({ iconUrl: null });

      let parsed: URL;
      try {
        parsed = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
      } catch {
        return res.status(400).json({ iconUrl: null });
      }

      if (!["http:", "https:"].includes(parsed.protocol) || isDisallowedHostname(parsed.hostname)) {
        return res.status(400).json({ iconUrl: null });
      }

      const cacheKey = `${parsed.origin}${parsed.pathname === "/" ? "" : parsed.pathname}`;
      const cached = faviconCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < FAVICON_CACHE_TTL_MS) {
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.json({ iconUrl: cached.iconUrl });
      }

      let resolvedIcon: string | null = null;

      // 1. Inspect target page HTML <link rel="icon"> / <link rel="apple-touch-icon">
      try {
        const pageRes = await fetch(parsed.toString(), {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
          signal: AbortSignal.timeout(4500),
        });
        if (pageRes.ok && (pageRes.headers.get("content-type") || "").toLowerCase().includes("text/html")) {
          const html = (await pageRes.text()).slice(0, 150_000);
          const candidates = extractHtmlIconCandidates(html, pageRes.url || parsed.toString()).slice(0, 4);
          for (const candidate of candidates) {
            const verified = await verifyImageCandidate(candidate);
            if (verified) {
              resolvedIcon = verified;
              break;
            }
          }
        }
      } catch {
        // Proceed to fallbacks
      }

      // 2. Fallback to standard origin icon paths, HTTP-200 gstatic, and DuckDuckGo icon service
      if (!resolvedIcon) {
        const fallbackCandidates = [
          `${parsed.origin}/favicon.svg`,
          `${parsed.origin}/apple-touch-icon.png`,
          `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(parsed.origin)}&size=256`,
          `https://icons.duckduckgo.com/ip3/${encodeURIComponent(parsed.hostname)}.ico`,
          `${parsed.origin}/favicon.ico`,
        ];
        const results = await Promise.all(fallbackCandidates.map((c) => verifyImageCandidate(c)));
        resolvedIcon = results.find((r) => Boolean(r)) || null;
      }

      if (faviconCache.size >= 1000) {
        const firstKey = faviconCache.keys().next().value;
        if (firstKey) faviconCache.delete(firstKey);
      }
      faviconCache.set(cacheKey, { iconUrl: resolvedIcon, timestamp: Date.now() });

      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.json({ iconUrl: resolvedIcon });
    } catch {
      return res.json({ iconUrl: null });
    }
  });

  const ROUTE_META: Record<string, { title: string; description: string }> = {
    "/": {
      title: "GeekTabs Dashboard",
      description:
        "A minimalist, aesthetic productivity dashboard with immersive wallpapers, smart widgets, and integrated search.",
    },
    "/bookmarks": {
      title: "Bookmarks & Quick Links – GeekTabs",
      description:
        "Organize favorite websites, office suites, AI tools, and personal shortcuts into categorized visual bookmarks.",
    },
    "/calendar": {
      title: "Calendar & Regional Holidays – GeekTabs",
      description:
        "Plan events, timed reminders, and track multi-country public holidays in a clean monthly calendar.",
    },
    "/calculator": {
      title: "Calculator & Live Currency Converter – GeekTabs",
      description:
        "Perform scientific calculations and convert currencies using live market exchange rates or custom manual rates.",
    },
    "/todo": {
      title: "To-Do List – GeekTabs",
      description: "Manage daily tasks, priorities, and checklists inside your GeekTabs workspace.",
    },
    "/notes": {
      title: "Notes – GeekTabs",
      description: "Write and organize rich formatted notes across customizable sections in GeekTabs.",
    },
    "/ip": {
      title: "IP Address & Connection Diagnostics – GeekTabs",
      description:
        "Inspect your public IPv4 and IPv6 addresses, ISP geolocation, ASN details, and network security diagnostics.",
    },
    "/speed": {
      title: "Broadband Speed Test – GeekTabs",
      description:
        "Measure real-time download speed, upload bandwidth, ping latency, jitter, and network quality scores.",
    },
    "/settings": {
      title: "Settings – GeekTabs",
      description: "Customize GeekTabs themes, wallpapers, card styles, language, and data backups.",
    },
    "/privacy": {
      title: "Privacy Policy – GeekTabs",
      description:
        "Learn how GeekTabs handles local browser storage, utility network requests, cookies, and Google AdSense disclosures.",
    },
    "/terms": {
      title: "Terms of Service – GeekTabs",
      description:
        "Read the GeekTabs Terms of Service covering acceptable use, local data backups, and third-party links.",
    },
    "/about": {
      title: "About GeekTabs – Minimalist Productivity Workspace",
      description:
        "Discover GeekTabs: an all-in-one productivity dashboard featuring bookmarks, calendar, calculator, notes, and network tools.",
    },
    "/contact": {
      title: "Contact Us – GeekTabs",
      description:
        "Get in touch with the GeekTabs team for support, feedback, bug reports, or privacy inquiries.",
    },
  };

  const PUBLIC_SITEMAP_ROUTES = [
    "/",
    "/bookmarks",
    "/calendar",
    "/calculator",
    "/ip",
    "/speed",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ];

  const resolveRequestOrigin = (req: express.Request) => {
    const forwardedProto =
      typeof req.headers["x-forwarded-proto"] === "string"
        ? req.headers["x-forwarded-proto"].split(",")[0].trim()
        : req.protocol;
    const host = req.get("host") || "";
    const isLocalHost = /^localhost(?::|$)|^127\.0\.0\.1(?::|$)/.test(host);
    const proto = !isLocalHost && forwardedProto === "http" ? "https" : forwardedProto;
    const requestOrigin = host ? `${proto}://${host}` : "";
    const publicConfiguredUrl =
      configuredAppUrl && !isPrivateDevOrigin(configuredAppUrl) ? configuredAppUrl : "";
    return (
      (requestOrigin && !isPrivateDevOrigin(requestOrigin) ? requestOrigin : "") ||
      publicConfiguredUrl ||
      requestOrigin
    );
  };

  app.get("/robots.txt", (req, res) => {
    const origin = resolveRequestOrigin(req).replace(/\/+$/, "");
    const sitemapLine = origin ? `Sitemap: ${origin}/sitemap.xml` : "Sitemap: /sitemap.xml";
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /todo\nDisallow: /notes\nDisallow: /settings\n\n${sitemapLine}\n`
    );
  });

  app.get("/sitemap.xml", (req, res) => {
    const origin = resolveRequestOrigin(req).replace(/\/+$/, "");
    const today = new Date().toISOString().split("T")[0];
    const urls = PUBLIC_SITEMAP_ROUTES.map((routePath) => {
      const loc = origin ? `${origin}${routePath}` : routePath;
      const priority = routePath === "/" ? "1.0" : ["/about", "/privacy", "/terms", "/contact"].includes(routePath) ? "0.6" : "0.8";
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }).join("\n");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    );
  });

  const escapeHtmlAttr = (val: string) =>
    val.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const injectShareMetaUrls = (html: string, origin: string, reqPath = "/") => {
    let updated = html;
    const normalizedPath = reqPath.replace(/\/+$/, "") || "/";
    const routeMeta = ROUTE_META[normalizedPath];
    if (routeMeta) {
      updated = updated
        .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(routeMeta.title)}</title>`)
        .replace(
          /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
          `<meta name="description" content="${escapeHtmlAttr(routeMeta.description)}" />`
        );
    }

    const isNoIndexRoute = ["/todo", "/notes", "/settings"].includes(normalizedPath);
    if (!/name=["']robots["']/i.test(updated)) {
      updated = updated.replace(
        "</head>",
        `    <meta name="robots" content="${isNoIndexRoute ? "noindex, nofollow" : "index, follow"}" />\n  </head>`
      );
    }

    if (origin) {
      const cleanOrigin = origin.replace(/\/+$/, "");
      const canonicalUrl = `${cleanOrigin}${normalizedPath}`;
      updated = updated
        .replaceAll('content="/og-share.png"', `content="${cleanOrigin}/og-share.png"`)
        .replaceAll('href="/og-share.png"', `href="${cleanOrigin}/og-share.png"`);
      if (!updated.includes('property="og:url"')) {
        const secureImageTag = cleanOrigin.startsWith("https://")
          ? `\n    <meta property="og:image:secure_url" content="${cleanOrigin}/og-share.png" />`
          : "";
        updated = updated.replace(
          "</head>",
          `    <meta property="og:url" content="${canonicalUrl}" />${secureImageTag}\n    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
        );
      }
    }
    return updated;
  };

  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.argv.some((arg) => arg.endsWith("server.cjs"));

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: "spa",
      plugins: [
        {
          name: "disable-hmr-websocket",
          enforce: "post",
          transform(code, id) {
            const normalizedId = id.replace(/\\/g, "/");
            if (normalizedId.endsWith("/vite/dist/client/client.mjs") || normalizedId === "/@vite/client") {
              return code
                .replace(
                  "wsTransport.send(data);",
                  "return Promise.resolve();"
                )
                .replace(
                  "transport.connect(createHMRHandler(handleMessage));",
                  "/* HMR WebSocket disabled */"
                );
            }
          },
        },
        {
          name: "inject-absolute-og-urls",
          transformIndexHtml(html, ctx) {
            const targetOrigin =
              configuredAppUrl && !isPrivateDevOrigin(configuredAppUrl) ? configuredAppUrl : "";
            let reqPath = "/";
            if (ctx?.originalUrl) {
              try {
                reqPath = new URL(ctx.originalUrl, "http://localhost").pathname;
              } catch {
                reqPath = "/";
              }
            }
            return injectShareMetaUrls(html, targetOrigin, reqPath);
          },
        },
      ],
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const distIndexPath = path.join(distPath, 'index.html');
    app.use(
      express.static(distPath, {
        index: false,
        setHeaders(res, filePath) {
          if (filePath.endsWith("og-share.png")) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cache-Control", "public, max-age=3600");
          } else if (filePath.endsWith("ads.txt") || filePath.endsWith("robots.txt")) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.setHeader("Cache-Control", "public, max-age=3600");
          }
        },
      })
    );
    app.get('*', (req, res) => {
      const origin = resolveRequestOrigin(req);
      const rawHtml = fs.readFileSync(distIndexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(injectShareMetaUrls(rawHtml, origin, req.path));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
