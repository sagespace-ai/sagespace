/**
 * Tests for SageOrb component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SageOrb } from '@/components/SageOrb'

describe('SageOrb', () => {
  it('should render sage name', () => {
    render(<SageOrb sageName="Test Sage" description="Test description" />)
    expect(screen.getByText('Test Sage')).toBeInTheDocument()
  })

  it('should display description', () => {
    render(<SageOrb sageName="Test Sage" description="Test description" />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('should be clickable when onClick provided', () => {
    const handleClick = vi.fn()
    render(<SageOrb sageName="Test Sage" description="Test" onClick={handleClick} />)
    
    const orb = screen.getByRole('button')
    orb.click()
    
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
