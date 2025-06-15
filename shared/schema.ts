import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' | 'ai'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  model: text("model"),
  mode: text("mode"), // 'ollama' | 'lmstudio'
});

export const chatSettings = pgTable("chat_settings", {
  id: serial("id").primaryKey(),
  selectedMode: text("selected_mode").notNull().default('ollama'),
  selectedModel: text("selected_model").notNull().default(''),
  isConnected: boolean("is_connected").notNull().default(false),
  selectedFont: text("selected_font").notNull().default('Inter'),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  content: true,
  sender: true,
  model: true,
  mode: true,
});

export const insertChatSettingsSchema = createInsertSchema(chatSettings).pick({
  selectedMode: true,
  selectedModel: true,
  isConnected: true,
  selectedFont: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatSettings = typeof chatSettings.$inferSelect;
export type InsertChatSettings = z.infer<typeof insertChatSettingsSchema>;
