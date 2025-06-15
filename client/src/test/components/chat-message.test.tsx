import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChatMessage from '@/components/chat/chat-message'
import { ChatMessage as ChatMessageType } from '@shared/schema'

describe('ChatMessage', () => {
  const mockUserMessage: ChatMessageType = {
    id: 1,
    content: 'Hello, how are you?',
    sender: 'user',
    timestamp: new Date('2025-06-14T21:30:00Z'),
    model: 'llama3',
    mode: 'ollama'
  }

  const mockAiMessage: ChatMessageType = {
    id: 2,
    content: 'I am doing well, thank you!',
    sender: 'ai',
    timestamp: new Date('2025-06-14T21:30:05Z'),
    model: 'llama3',
    mode: 'ollama'
  }

  it('renders user message correctly', () => {
    render(<ChatMessage message={mockUserMessage} />)
    
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
    expect(screen.getByText('21:30')).toBeInTheDocument()
    
    // User messages should be aligned to the right
    const messageContainer = screen.getByText('Hello, how are you?').closest('.flex')
    expect(messageContainer).toHaveClass('justify-end')
  })

  it('renders AI message correctly', () => {
    render(<ChatMessage message={mockAiMessage} />)
    
    expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument()
    expect(screen.getByText('21:30')).toBeInTheDocument()
    
    // AI messages should be aligned to the left
    const messageContainer = screen.getByText('I am doing well, thank you!').closest('.flex')
    expect(messageContainer).toHaveClass('justify-start')
  })

  it('renders code blocks in AI messages', () => {
    const messageWithCode: ChatMessageType = {
      id: 3,
      content: 'Here is some code:\n```javascript\nconsole.log("Hello");\n```',
      sender: 'ai',
      timestamp: new Date(),
      model: 'llama3',
      mode: 'ollama'
    }

    render(<ChatMessage message={messageWithCode} />)
    
    // Should contain the code in a formatted block
    expect(screen.getByText('console.log("Hello");')).toBeInTheDocument()
  })

  it('displays correct timestamp format', () => {
    render(<ChatMessage message={mockUserMessage} />)
    
    // Should display time in HH:MM format
    expect(screen.getByText('21:30')).toBeInTheDocument()
  })

  it('shows appropriate styling for user messages', () => {
    render(<ChatMessage message={mockUserMessage} />)
    
    const messageContent = screen.getByText('Hello, how are you?')
    const messageBox = messageContent.closest('.bg-user-green')
    expect(messageBox).toBeInTheDocument()
  })

  it('shows appropriate styling for AI messages', () => {
    render(<ChatMessage message={mockAiMessage} />)
    
    const messageContent = screen.getByText('I am doing well, thank you!')
    const messageBox = messageContent.closest('.bg-gradient-to-br')
    expect(messageBox).toBeInTheDocument()
  })

  it('handles multiline messages', () => {
    const multilineMessage: ChatMessageType = {
      id: 4,
      content: 'Line 1\nLine 2\nLine 3',
      sender: 'user',
      timestamp: new Date(),
      model: 'llama3',
      mode: 'ollama'
    }

    render(<ChatMessage message={multilineMessage} />)
    
    expect(screen.getByText('Line 1\nLine 2\nLine 3')).toBeInTheDocument()
  })
})