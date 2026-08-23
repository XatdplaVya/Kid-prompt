import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.post("/api/generate", async (req, res) => {
    try {
      const { model = "gemini-2.5-flash", prompt, schema, systemInstruction, temperature = 0.7 } = req.body;
      const apiKeyHeader = req.headers["x-gemini-api-key"];
      
      const apiKey = apiKeyHeader && typeof apiKeyHeader === 'string' ? apiKeyHeader : process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(401).json({ error: "Gemini API key is missing. Please configure it in settings." });
      }

      const ai = new GoogleGenAI({ apiKey });

      const config: any = {
        temperature,
        systemInstruction,
      };

      if (schema) {
        config.responseMimeType = "application/json";
        config.responseSchema = schema;
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for all non-API routes (SPA fallback)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
