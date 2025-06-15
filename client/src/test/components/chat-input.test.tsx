import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInput from '@/components/chat/chat-input'

describe('ChatInput', () => {
  const mockOnSendMessage = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default placeholder', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    expect(screen.getByPlaceholderText('メッセージを入力してください...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} placeholder="Type your message here..." />)
    
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument()
  })

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    const sendButton = screen.getByRole('button', { name: /送信/i })
    
    await user.type(input, 'Hello, world!')
    await user.click(sendButton)
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello, world!')
  })

  it('calls onSendMessage when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    
    await user.type(input, 'Hello, world!')
    await user.keyboard('{Enter}')
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello, world!')
  })

  it('does not submit when Shift+Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    
    await user.type(input, 'Hello')
    await user.keyboard('{Shift>}{Enter}{/Shift}')
    
    expect(mockOnSendMessage).not.toHaveBeenCalled()
    expect(input).toHaveValue('Hello\n')
  })

  it('clears input after sending message', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    
    await user.type(input, 'Hello, world!')
    await user.keyboard('{Enter}')
    
    expect(input).toHaveValue('')
  })

  it('does not send empty messages', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const sendButton = screen.getByRole('button', { name: /送信/i })
    
    await user.click(sendButton)
    
    expect(mockOnSendMessage).not.toHaveBeenCalled()
  })

  it('does not send whitespace-only messages', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    
    await user.type(input, '   \n\t  ')
    await user.keyboard('{Enter}')
    
    expect(mockOnSendMessage).not.toHaveBeenCalled()
  })

  it('disables input when disabled prop is true', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={true} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    const sendButton = screen.getByRole('button', { name: /送信/i })
    
    expect(input).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  it('auto-resizes textarea based on content', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    
    const longMessage = 'This is a very long message that should cause the textarea to expand in height. '.repeat(5)
    await user.type(input, longMessage)
    
    // The textarea should have grown in height
    expect(input.scrollHeight).toBeGreaterThan(40) // Initial height is typically around 40px
  })

  it('maintains focus after sending message', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    
    await user.type(input, 'Hello')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(input).toHaveFocus()
    })
  })

  it('handles long messages properly', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSendMessage={mockOnSendMessage} />)
    
    const input = screen.getByPlaceholderText('メッセージを入力してください...')
    const longMessage = 'A'.repeat(1000)
    
    await user.type(input, longMessage)
    await user.keyboard('{Enter}')
    
    expect(mockOnSendMessage).toHaveBeenCalledWith(longMessage)
  })
})