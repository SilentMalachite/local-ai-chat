import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatMessageSchema, insertChatSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get chat messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message to AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { content, mode, model } = req.body;
      
      if (!content || !mode || !model) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Save user message
      await storage.createChatMessage({
        content,
        sender: 'user',
        model,
        mode,
      });

      let aiResponse = "";
      
      if (mode === 'ollama') {
        // Call Ollama API
        try {
          const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: model,
              prompt: content,
              stream: false,
            }),
          });

          if (!ollamaResponse.ok) {
            throw new Error(`Ollama API error: ${ollamaResponse.statusText}`);
          }

          const data = await ollamaResponse.json();
          aiResponse = data.response || "Sorry, I couldn't generate a response.";
        } catch (error) {
          console.error('Ollama API error:', error);
          aiResponse = "Failed to connect to Ollama. Please ensure Ollama is running on localhost:11434.";
        }
      } else if (mode === 'lmstudio') {
        // Call LM Studio API
        try {
          const lmStudioResponse = await fetch('http://localhost:1234/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: 'user',
                  content: content,
                }
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          });

          if (!lmStudioResponse.ok) {
            throw new Error(`LM Studio API error: ${lmStudioResponse.statusText}`);
          }

          const data = await lmStudioResponse.json();
          aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        } catch (error) {
          console.error('LM Studio API error:', error);
          aiResponse = "Failed to connect to LM Studio. Please ensure LM Studio is running on localhost:1234.";
        }
      }

      // Save AI response
      const aiMessage = await storage.createChatMessage({
        content: aiResponse,
        sender: 'ai',
        model,
        mode,
      });

      res.json({ message: aiMessage });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // Get available models
  app.get("/api/models/:mode", async (req, res) => {
    const { mode } = req.params;
    
    try {
      if (mode === 'ollama') {
        try {
          const response = await fetch('http://localhost:11434/api/tags');
          if (!response.ok) {
            throw new Error('Ollama not available');
          }
          const data = await response.json();
          const models = data.models?.map((model: any) => model.name) || [];
          res.json({ models, connected: true });
        } catch (error) {
          res.json({ models: [], connected: false, error: "Ollama not available" });
        }
      } else if (mode === 'lmstudio') {
        try {
          const response = await fetch('http://localhost:1234/v1/models');
          if (!response.ok) {
            throw new Error('LM Studio not available');
          }
          const data = await response.json();
          const models = data.data?.map((model: any) => model.id) || [];
          res.json({ models, connected: true });
        } catch (error) {
          res.json({ models: [], connected: false, error: "LM Studio not available" });
        }
      } else {
        res.status(400).json({ error: "Invalid mode" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Get/Update chat settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getChatSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedSettings = insertChatSettingsSchema.parse(req.body);
      const settings = await storage.updateChatSettings(validatedSettings);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid settings data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
