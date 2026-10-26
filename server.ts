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
