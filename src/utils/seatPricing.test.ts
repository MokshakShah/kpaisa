import { describe, expect, it } from 'vitest'
import { formatPrice, getSeatPrice } from './seatPricing'

describe('seat pricing', () => {
  it('prices standard, premium, and extra-legroom seats', () => {
    expect(getSeatPrice('4B')).toEqual({ category: 'Standard', amount: 0 })
    expect(getSeatPrice('3B')).toEqual({ category: 'Premium', amount: 250 })
    expect(getSeatPrice('1A')).toEqual({ category: 'Extra legroom', amount: 350 })
  })

  it('formats free seats as ₹0', () => {
    expect(formatPrice(0)).toBe('₹0')
    expect(formatPrice(350)).toBe('₹350')
  })
})
