import type { BookingSnapshot, Passenger } from '../types'

const STORAGE_KEY = 'skyward-booking'
const fallbackPassengers: Passenger[] = [{ id: 1, name: 'Alex Morgan', seat: null }]

function isSnapshot(value: unknown): value is BookingSnapshot {
  if (!value || typeof value !== 'object') return false
  const snapshot = value as Partial<BookingSnapshot>
  return Array.isArray(snapshot.passengers) && typeof snapshot.passengerMeals === 'object' && snapshot.passengerMeals !== null
}

export function loadBooking(): BookingSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { passengers: fallbackPassengers, passengerMeals: { 1: null } }
    const parsed: unknown = JSON.parse(raw)
    return isSnapshot(parsed) ? parsed : { passengers: fallbackPassengers, passengerMeals: { 1: null } }
  } catch {
    return { passengers: fallbackPassengers, passengerMeals: { 1: null } }
  }
}

export function saveBooking(snapshot: BookingSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Persistence is optional; the in-memory booking remains usable.
  }
}
