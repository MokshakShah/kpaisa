export type SeatCategory = 'Standard' | 'Premium' | 'Extra legroom'

export type SeatPrice = {
  category: SeatCategory
  amount: number
}

const categoryPrices: Record<SeatCategory, number> = {
  Standard: 0,
  Premium: 250,
  'Extra legroom': 350,
}

export function getSeatPrice(seat: string): SeatPrice {
  const row = Number.parseInt(seat, 10)
  const letter = seat.slice(-1)

  if (row === 1 || (row === 2 && (letter === 'A' || letter === 'G'))) {
    return { category: 'Extra legroom', amount: categoryPrices['Extra legroom'] }
  }

  if (row <= 3) {
    return { category: 'Premium', amount: categoryPrices.Premium }
  }

  return { category: 'Standard', amount: categoryPrices.Standard }
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
