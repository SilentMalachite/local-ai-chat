import { describe, it, expect, beforeEach } from 'vitest'
import { MemStorage } from '../storage'

describe('MemStorage', () => {
  let storage: MemStorage

  beforeEach(() => {
    storage = new MemStorage()
  })

  describe('User operations', () => {
    it('should create and retrieve users', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      }

      const user = await storage.createUser(userData)

      expect(user).toMatchObject({
        id: expect.any(Number),
        username: 'testuser',
        password: 'password123'
      })

      const retrievedUser = await storage.getUser(user.id)
      expect(retrievedUser).toEqual(user)
    })

    it('should find users by username', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      }

      const user = await storage.createUser(userData)
      const foundUser = await storage.getUserByUsername('testuser')

      expect(foundUser).toEqual(user)
    })

    it('should return undefined for non-existent user', async () => {
      const user = await storage.getUser(999)
      expect(user).toBeUndefined()

      const userByUsername = await storage.getUserByUsername('nonexistent')
      expect(userByUsername).toBeUndefined()
    })
  })

  describe('Chat message operations', () => {
    it('should create and retrieve chat messages', async () => {
      const messageData = {
        content: 'Hello, world!',
        sender: 'user' as const,
        model: 'llama3',
        mode: 'ollama'
      }

      const message = await storage.createChatMessage(messageData)

      expect(message).toMatchObject({
        id: expect.any(Number),
        content: 'Hello, world!',
        sender: 'user',
        timestamp: expect.any(Date),
        model: 'llama3',
        mode: 'ollama'
      })

      const messages = await storage.getChatMessages()
      expect(messages).toHaveLength(1)
      expect(messages[0]).toEqual(message)
    })

    it('should handle null model and mode', async () => {
      const messageData = {
        content: 'Test message',
        sender: 'ai' as const
      }

      const message = await storage.createChatMessage(messageData)

      expect(message.model).toBeNull()
      expect(message.mode).toBeNull()
    })

    it('should return messages in chronological order', async () => {
      const firstMessage = await storage.createChatMessage({
        content: 'First message',
        sender: 'user',
        model: 'llama3',
        mode: 'ollama'
      })

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1))

      const secondMessage = await storage.createChatMessage({
        content: 'Second message',
        sender: 'ai',
        model: 'llama3',
        mode: 'ollama'
      })

      const messages = await storage.getChatMessages()
      expect(messages).toHaveLength(2)
      expect(messages[0].timestamp.getTime()).toBeLessThanOrEqual(messages[1].timestamp.getTime())
    })
  })

  describe('Chat settings operations', () => {
    it('should have default settings', async () => {
      const settings = await storage.getChatSettings()

      expect(settings).toEqual({
        id: 1,
        selectedMode: 'ollama',
        selectedModel: '',
        isConnected: false,
        selectedFont: 'Inter'
      })
    })

    it('should update chat settings', async () => {
      const newSettings = {
        selectedMode: 'lmstudio' as const,
        selectedModel: 'mistral-7b',
        isConnected: true,
        selectedFont: 'Roboto'
      }

      const updatedSettings = await storage.updateChatSettings(newSettings)

      expect(updatedSettings).toEqual({
        id: 1,
        selectedMode: 'lmstudio',
        selectedModel: 'mistral-7b',
        isConnected: true,
        selectedFont: 'Roboto'
      })

      const retrievedSettings = await storage.getChatSettings()
      expect(retrievedSettings).toEqual(updatedSettings)
    })

    it('should handle partial settings updates', async () => {
      // First update
      await storage.updateChatSettings({
        selectedMode: 'ollama',
        selectedModel: 'llama3',
        isConnected: true,
        selectedFont: 'Inter'
      })

      // Partial update
      const partialUpdate = await storage.updateChatSettings({
        selectedModel: 'gemma',
        selectedFont: 'Noto Sans JP'
      })

      expect(partialUpdate).toEqual({
        id: 1,
        selectedMode: 'ollama', // Should retain previous value
        selectedModel: 'gemma',
        isConnected: true, // Should retain previous value
        selectedFont: 'Noto Sans JP'
      })
    })
  })

  describe('Data persistence', () => {
    it('should maintain incremental IDs for users', async () => {
      const user1 = await storage.createUser({ username: 'user1', password: 'pass1' })
      const user2 = await storage.createUser({ username: 'user2', password: 'pass2' })

      expect(user2.id).toBe(user1.id + 1)
    })

    it('should maintain incremental IDs for messages', async () => {
      const message1 = await storage.createChatMessage({
        content: 'Message 1',
        sender: 'user'
      })

      const message2 = await storage.createChatMessage({
        content: 'Message 2',
        sender: 'ai'
      })

      expect(message2.id).toBe(message1.id + 1)
    })
  })
})