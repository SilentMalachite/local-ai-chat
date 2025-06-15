import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { registerRoutes } from '../routes'
import { storage } from '../storage'

// Mock storage
vi.mock('../storage', () => ({
  storage: {
    getChatMessages: vi.fn(),
    createChatMessage: vi.fn(),
    getChatSettings: vi.fn(),
    updateChatSettings: vi.fn(),
  }
}))

// Mock fetch for AI API calls
global.fetch = vi.fn()

describe('API Routes', () => {
  let app: express.Application

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    await registerRoutes(app as any)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/messages', () => {
    it('should return chat messages', async () => {
      const mockMessages = [
        {
          id: 1,
          content: 'Hello',
          sender: 'user',
          timestamp: new Date(),
          model: 'llama3',
          mode: 'ollama'
        }
      ]

      vi.mocked(storage.getChatMessages).mockResolvedValue(mockMessages)

      const response = await request(app)
        .get('/api/messages')
        .expect(200)

      expect(response.body).toEqual(mockMessages)
      expect(storage.getChatMessages).toHaveBeenCalledOnce()
    })

    it('should handle errors when fetching messages', async () => {
      vi.mocked(storage.getChatMessages).mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .get('/api/messages')
        .expect(500)

      expect(response.body).toEqual({ error: 'Failed to fetch messages' })
    })
  })

  describe('POST /api/chat', () => {
    it('should send message and return AI response for Ollama', async () => {
      const mockAiResponse = {
        response: 'Hello! How can I help you today?'
      }

      const mockUserMessage = {
        id: 1,
        content: 'Hello',
        sender: 'user',
        timestamp: new Date(),
        model: 'llama3',
        mode: 'ollama'
      }

      const mockAiMessage = {
        id: 2,
        content: 'Hello! How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
        model: 'llama3',
        mode: 'ollama'
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAiResponse)
      } as Response)

      vi.mocked(storage.createChatMessage)
        .mockResolvedValueOnce(mockUserMessage)
        .mockResolvedValueOnce(mockAiMessage)

      const response = await request(app)
        .post('/api/chat')
        .send({
          content: 'Hello',
          mode: 'ollama',
          model: 'llama3'
        })
        .expect(200)

      expect(response.body.message).toEqual(mockAiMessage)
      expect(storage.createChatMessage).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: 'Hello',
          stream: false
        })
      })
    })

    it('should handle LM Studio API calls', async () => {
      const mockAiResponse = {
        choices: [{
          message: { content: 'Hello from LM Studio!' }
        }]
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAiResponse)
      } as Response)

      vi.mocked(storage.createChatMessage).mockResolvedValue({
        id: 1,
        content: 'Hello',
        sender: 'user',
        timestamp: new Date(),
        model: 'mistral',
        mode: 'lmstudio'
      })

      const response = await request(app)
        .post('/api/chat')
        .send({
          content: 'Hello',
          mode: 'lmstudio',
          model: 'mistral'
        })
        .expect(200)

      expect(fetch).toHaveBeenCalledWith('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          messages: [{ role: 'user', content: 'Hello' }],
          temperature: 0.7,
          max_tokens: 1000
        })
      })
    })

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ content: 'Hello' })
        .expect(400)

      expect(response.body).toEqual({ error: 'Missing required fields' })
    })

    it('should handle AI API errors gracefully', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      vi.mocked(storage.createChatMessage).mockResolvedValue({
        id: 1,
        content: 'Hello',
        sender: 'user',
        timestamp: new Date(),
        model: 'llama3',
        mode: 'ollama'
      })

      const response = await request(app)
        .post('/api/chat')
        .send({
          content: 'Hello',
          mode: 'ollama',
          model: 'llama3'
        })
        .expect(200)

      expect(response.body.message.content).toContain('Failed to connect to Ollama')
    })
  })

  describe('GET /api/models/:mode', () => {
    it('should return Ollama models when available', async () => {
      const mockResponse = {
        models: [
          { name: 'llama3' },
          { name: 'mistral' }
        ]
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      const response = await request(app)
        .get('/api/models/ollama')
        .expect(200)

      expect(response.body).toEqual({
        models: ['llama3', 'mistral'],
        connected: true
      })
    })

    it('should return LM Studio models when available', async () => {
      const mockResponse = {
        data: [
          { id: 'mistral-7b' },
          { id: 'llama3-8b' }
        ]
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      const response = await request(app)
        .get('/api/models/lmstudio')
        .expect(200)

      expect(response.body).toEqual({
        models: ['mistral-7b', 'llama3-8b'],
        connected: true
      })
    })

    it('should handle unavailable AI runtime', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Connection refused'))

      const response = await request(app)
        .get('/api/models/ollama')
        .expect(200)

      expect(response.body).toEqual({
        models: [],
        connected: false,
        error: 'Ollama not available'
      })
    })

    it('should return 400 for invalid mode', async () => {
      const response = await request(app)
        .get('/api/models/invalid')
        .expect(400)

      expect(response.body).toEqual({ error: 'Invalid mode' })
    })
  })

  describe('GET /api/settings', () => {
    it('should return chat settings', async () => {
      const mockSettings = {
        id: 1,
        selectedMode: 'ollama',
        selectedModel: 'llama3',
        isConnected: true,
        selectedFont: 'Inter'
      }

      vi.mocked(storage.getChatSettings).mockResolvedValue(mockSettings)

      const response = await request(app)
        .get('/api/settings')
        .expect(200)

      expect(response.body).toEqual(mockSettings)
    })
  })

  describe('POST /api/settings', () => {
    it('should update chat settings', async () => {
      const newSettings = {
        selectedMode: 'lmstudio',
        selectedModel: 'mistral',
        isConnected: false,
        selectedFont: 'Roboto'
      }

      const updatedSettings = {
        id: 1,
        ...newSettings
      }

      vi.mocked(storage.updateChatSettings).mockResolvedValue(updatedSettings)

      const response = await request(app)
        .post('/api/settings')
        .send(newSettings)
        .expect(200)

      expect(response.body).toEqual(updatedSettings)
      expect(storage.updateChatSettings).toHaveBeenCalledWith(newSettings)
    })

    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/settings')
        .send({ invalidField: 'invalid' })
        .expect(400)

      expect(response.body.error).toBe('Invalid settings data')
    })
  })
})