import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FontSelector from '@/components/chat/font-selector'

describe('FontSelector', () => {
  const mockOnFontChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with all font options', () => {
    render(<FontSelector selectedFont="Inter" onFontChange={mockOnFontChange} />)
    
    expect(screen.getByText('フォント選択')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays selected font correctly', () => {
    render(<FontSelector selectedFont="Noto Sans JP" onFontChange={mockOnFontChange} />)
    
    expect(screen.getByDisplayValue('Noto Sans JP')).toBeInTheDocument()
  })

  it('calls onFontChange when font is selected', async () => {
    const user = userEvent.setup()
    render(<FontSelector selectedFont="Inter" onFontChange={mockOnFontChange} />)
    
    const select = screen.getByRole('combobox')
    await user.click(select)
    
    const robotoOption = screen.getByText('Roboto')
    await user.click(robotoOption)
    
    expect(mockOnFontChange).toHaveBeenCalledWith('Roboto')
  })

  it('includes all expected font options', async () => {
    const user = userEvent.setup()
    render(<FontSelector selectedFont="Inter" onFontChange={mockOnFontChange} />)
    
    const select = screen.getByRole('combobox')
    await user.click(select)
    
    const expectedFonts = ['Inter', 'Noto Sans JP', 'Roboto', 'Lato', 'Open Sans', 'Source Code Pro']
    
    expectedFonts.forEach(font => {
      expect(screen.getByText(font)).toBeInTheDocument()
    })
  })

  it('applies correct font class when font changes', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FontSelector selectedFont="Inter" onFontChange={mockOnFontChange} />)
    
    // Initially should have Inter font class
    expect(document.documentElement).toHaveClass('font-inter')
    
    const select = screen.getByRole('combobox')
    await user.click(select)
    
    const notoOption = screen.getByText('Noto Sans JP')
    await user.click(notoOption)
    
    // Re-render with new font
    rerender(<FontSelector selectedFont="Noto Sans JP" onFontChange={mockOnFontChange} />)
    
    expect(document.documentElement).toHaveClass('font-noto-sans-jp')
  })
})