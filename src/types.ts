export type Passenger = {
  id: number
  name: string
  seat: string | null
}

export type Meal = {
  id: string
  name: string
  description: string
  category: 'Vegetarian' | 'Non-vegetarian'
  price: number
}

export type SeatLayout = '3-2' | '2-3-2'

export type BookingSnapshot = {
  passengers: Passenger[]
  passengerMeals: Record<number, string | null>
}
