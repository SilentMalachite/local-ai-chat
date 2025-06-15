import { 
  users, 
  chatMessages, 
  chatSettings,
  type User, 
  type InsertUser,
  type ChatMessage,
  type InsertChatMessage,
  type ChatSettings,
  type InsertChatSettings
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  getChatSettings(): Promise<ChatSettings | undefined>;
  updateChatSettings(settings: InsertChatSettings): Promise<ChatSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, ChatMessage>;
  private settings: ChatSettings | undefined;
  private currentUserId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.settings = {
      id: 1,
      selectedMode: 'ollama',
      selectedModel: '',
      isConnected: false,
      selectedFont: 'Inter',
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.messages.values()).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = {
      id,
      content: insertMessage.content,
      sender: insertMessage.sender,
      timestamp: new Date(),
      model: insertMessage.model || null,
      mode: insertMessage.mode || null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getChatSettings(): Promise<ChatSettings | undefined> {
    return this.settings;
  }

  async updateChatSettings(newSettings: InsertChatSettings): Promise<ChatSettings> {
    this.settings = {
      id: 1,
      selectedMode: newSettings.selectedMode || this.settings?.selectedMode || 'ollama',
      selectedModel: newSettings.selectedModel || this.settings?.selectedModel || '',
      isConnected: newSettings.isConnected !== undefined ? newSettings.isConnected : this.settings?.isConnected || false,
      selectedFont: newSettings.selectedFont || this.settings?.selectedFont || 'Inter',
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
