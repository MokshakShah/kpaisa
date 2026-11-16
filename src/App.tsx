import { useState } from 'react'
import { Icon } from './components/Icon'
import { Header } from './components/Header'
import { formatPrice, getSeatPrice } from './utils/seatPricing'
import './styles.css'

type SeatStatus = 'available' | 'selected' | 'occupied' | 'extra'

type Passenger = {
  id: number
  name: string
  seat: string | null
}

type Meal = {
  id: string
  name: string
  description: string
  category: 'Vegetarian' | 'Non-vegetarian'
  price: number
}

type SeatLayout = '3-2' | '2-3-2'

const seatGroups: Record<SeatLayout, string[][]> = {
  '3-2': [['A', 'B', 'C'], ['D', 'E']],
  '2-3-2': [['A', 'B'], ['C', 'D', 'E'], ['F', 'G']],
}
const occupiedSeats = new Set(['1C', '3D', '4A', '5F'])
const extraLegroomSeats = new Set(['2A', '6G'])
const meals: Meal[] = [
  { id: 'veg', name: 'Garden vegetable wrap', description: 'Fresh vegetables and hummus', category: 'Vegetarian', price: 0 },
  { id: 'chicken', name: 'Roasted chicken meal', description: 'Herb chicken with seasonal sides', category: 'Non-vegetarian', price: 350 },
  { id: 'fruit', name: 'Fresh fruit bowl', description: 'Seasonal fruit selection', category: 'Vegetarian', price: 150 },
]

function SeatMap({ layout, selectedSeat, assignedSeats, hasActivePassenger, onSelect }: { layout: SeatLayout; selectedSeat: string | null; assignedSeats: string[]; hasActivePassenger: boolean; onSelect: (seat: string | null) => void }) {
  const groups = seatGroups[layout]
  return (
    <div className={`aircraft aircraft-${layout}`} aria-label={`${layout} aircraft seat map`}>
      <div className="aircraft-nose"><span>Front of aircraft</span></div>
      <div className="seat-map-scroll" tabIndex={0} aria-label="Scroll to view the full seat map">
        <div className="seat-map">
          <div className="seat-columns" aria-hidden="true">
            <span className="row-number"> </span>
            {groups.map((group, groupIndex) => <span className="seat-group" key={groupIndex}>{group.map((label) => <span key={label}>{label}</span>)}</span>)}
          </div>
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <div className="seat-row" key={rowIndex}>
              <span className="row-number">{rowIndex + 1}</span>
              {groups.map((group, groupIndex) => <span className="seat-group" key={groupIndex}>
                {group.map((seatLabel) => {
                  const label = `${rowIndex + 1}${seatLabel}`
                  const isAssignedToAnotherPassenger = assignedSeats.includes(label) && selectedSeat !== label
                  const unavailable = occupiedSeats.has(label)
                  const currentStatus = selectedSeat === label ? 'selected' : isAssignedToAnotherPassenger || unavailable ? 'occupied' : extraLegroomSeats.has(label) ? 'extra' : 'available'
                  const seatPrice = getSeatPrice(label)
                  return <span className={`seat seat-${currentStatus}`} key={label}>
                    <button aria-label={`${label}, ${seatPrice.category} seat, ${formatPrice(seatPrice.amount)}`} disabled={!hasActivePassenger || unavailable || isAssignedToAnotherPassenger} onClick={() => onSelect(selectedSeat === label ? null : label)} title={hasActivePassenger ? `${seatPrice.category} · ${formatPrice(seatPrice.amount)}` : 'Select a passenger first'}>{seatLabel}</button>
                  </span>
                })}
              </span>)}
            </div>
          ))}
          <div className="seat-map-note">Rows 1–6 · {layout} economy cabin</div>
        </div>
      </div>
      <div className="aircraft-tail" />
    </div>
  )
}

function App() {
  const [layout, setLayout] = useState<SeatLayout>('3-2')
  const [passengerCount, setPassengerCount] = useState(1)
  const [activePassengerId, setActivePassengerId] = useState<number | null>(null)
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: 1, name: 'Alex Morgan', seat: null },
  ])
  const [passengerMeals, setPassengerMeals] = useState<Record<number, string | null>>({ 1: null })
  const activePassenger = activePassengerId === null ? null : passengers.find((passenger) => passenger.id === activePassengerId) ?? null
  const assignedSeats = passengers.map((passenger) => passenger.seat).filter((seat): seat is string => seat !== null)

  const updatePassengerCount = (nextCount: number) => {
    const nextPassengers = Array.from({ length: nextCount }, (_, index) => {
      const existing = passengers[index]
      return existing ?? { id: index + 1, name: `Passenger ${index + 1}`, seat: null }
    })
    setPassengerCount(nextCount)
    setPassengers(nextPassengers)
    setPassengerMeals((currentMeals) => Object.fromEntries(
      Array.from({ length: nextCount }, (_, index) => [index + 1, currentMeals[index + 1] ?? null]),
    ))
    if (activePassengerId !== null && activePassengerId > nextCount) setActivePassengerId(null)
  }

  const assignSeat = (seat: string | null) => {
    if (activePassenger === null) return
    setPassengers((currentPassengers) => currentPassengers.map((passenger) => (
      passenger.id === activePassenger.id ? { ...passenger, seat } : passenger
    )))
  }

  const uniqueAssignedSeats = new Set(assignedSeats)
  const seatTotal = Array.from(uniqueAssignedSeats).reduce((total, seat) => total + getSeatPrice(seat).amount, 0)
  const mealTotal = Object.values(passengerMeals).reduce((total, mealId) => total + (meals.find((meal) => meal.id === mealId)?.price ?? 0), 0)
  const totalPrice = 18490 * passengerCount + seatTotal + mealTotal
  const allPassengersSeated = passengers.every((passenger) => passenger.seat !== null)
  const selectMeal = (mealId: string | null) => {
    if (activePassenger === null) return
    setPassengerMeals((currentMeals) => ({ ...currentMeals, [activePassenger.id]: mealId }))
  }

  return (
    <div className="app-shell booking-app">
      <Header />
      <main>
        <section className="booking-intro">
          <div>
            <p className="eyebrow"><span /> Complete your booking</p>
            <h1>Choose your <em>seat.</em></h1>
            <p className="intro-copy">Select a seat for your journey from New Delhi to Dubai.</p>
          </div>
          <div className="flight-route">
            <strong>DEL</strong><span className="route-stroke"><Icon name="plane" size={16} /></span><strong>DXB</strong>
            <small>Fri, 12 Sep 2025 · 3h 25m</small>
          </div>
        </section>

        <nav className="booking-progress" aria-label="Booking progress">
          <div className="progress-step complete"><span>1</span><strong>Flight</strong></div>
          <i /><div className="progress-step complete"><span>2</span><strong>Passengers</strong></div>
          <i /><div className="progress-step active"><span>3</span><strong>Seats</strong></div>
          <i /><div className="progress-step"><span>4</span><strong>Payment</strong></div>
        </nav>

        <div className="booking-layout">
          <div className="booking-main">
            <section className="content-section passenger-section">
              <div className="section-title">
                <div><p className="section-kicker">Passenger details</p><h2>Who is travelling?</h2></div>
                <div className="passenger-count">
                  <button aria-label="Remove passenger" disabled={passengerCount === 1} onClick={() => updatePassengerCount(passengerCount - 1)}>−</button>
                  <span>{passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'}</span>
                  <button aria-label="Add passenger" disabled={passengerCount === 4} onClick={() => updatePassengerCount(passengerCount + 1)}>+</button>
                </div>
              </div>
              <div className="passenger-list">
                {passengers.map((passenger) => (
                  <button className={`passenger-detail ${passenger.id === activePassenger?.id ? 'active-passenger' : ''}`} key={passenger.id} onClick={() => setActivePassengerId(passenger.id)}>
                    <span className="passenger-avatar"><Icon name="user" size={18} /></span>
                    <span className="passenger-copy"><strong>{passenger.name}</strong><span>Passenger {passenger.id} · Economy</span></span>
                    <span className="assigned-seat">{passenger.seat ? <>Seat <strong>{passenger.seat}</strong></> : 'No seat selected'}</span>
                    <span className="passenger-status">{passenger.id === activePassenger?.id ? 'Selected' : 'Select'}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="content-section seat-section">
              <div className="section-title seat-title">
                <div><p className="section-kicker">Seat selection</p><h2>Where would you like to sit?</h2><p className="active-seat-note">{activePassenger ? <>Selecting for <strong>{activePassenger.name}</strong>. Click their seat again to remove it.</> : <strong>Select a passenger above to choose a seat.</strong>}</p></div>
                <div className="layout-switch" role="group" aria-label="Aircraft seating layout">
                  <span>Layout</span>
                  {(['3-2', '2-3-2'] as SeatLayout[]).map((option) => <button className={layout === option ? 'selected-layout' : ''} key={option} onClick={() => setLayout(option)}>{option}</button>)}
                </div>
              </div>
              <div className="legend" aria-label="Seat legend">
                <span><i className="legend-seat legend-available" />Available</span>
                <span><i className="legend-seat legend-selected" />Selected</span>
                <span><i className="legend-seat legend-premium" />Premium <b>+₹250</b></span>
                <span><i className="legend-seat legend-extra" />Extra legroom <b>+₹350</b></span>
                <span><i className="legend-seat legend-occupied" />Unavailable</span>
              </div>
              <SeatMap layout={layout} selectedSeat={activePassenger?.seat ?? null} assignedSeats={assignedSeats} hasActivePassenger={activePassenger !== null} onSelect={assignSeat} />
            </section>
            <section className="content-section meal-section">
              <div className="section-title">
                <div><p className="section-kicker">On-board dining</p><h2>Choose a meal</h2><p className="active-seat-note">{activePassenger ? <>Meal for <strong>{activePassenger.name}</strong>. Optional, one per passenger.</> : <strong>Select a passenger to choose a meal.</strong>}</p></div>
                <span className="cabin-label">Optional</span>
              </div>
              <div className="meal-options">
                {meals.map((meal) => {
                  const selected = activePassenger !== null && passengerMeals[activePassenger.id] === meal.id
                  return <button className={`meal-option ${selected ? 'selected-meal' : ''}`} disabled={activePassenger === null} key={meal.id} onClick={() => selectMeal(selected ? null : meal.id)}>
                    <span className={`meal-dot ${meal.category === 'Vegetarian' ? 'veg-dot' : 'nonveg-dot'}`} />
                    <span className="meal-copy"><strong>{meal.name}</strong><small>{meal.description} · {meal.category}</small></span>
                    <b>{meal.price === 0 ? 'Free' : `+${formatPrice(meal.price)}`}</b>
                  </button>
                })}
              </div>
            </section>
          </div>

          <aside className="booking-summary">
            <p className="section-kicker">Your selection</p>
            <h2>Trip summary</h2>
            <div className="summary-flight"><span>DEL</span><i /><span>DXB</span><small>SK 214 · Economy</small></div>
            <div className="summary-divider" />
            <div className="summary-passengers">
              {passengers.map((passenger) => {
                const seatPrice = passenger.seat ? getSeatPrice(passenger.seat) : null
                return <div className="summary-passenger" key={passenger.id}>
                  <span className="summary-seat-icon">{passenger.seat ? passenger.seat.slice(1) : '—'}<small>{passenger.seat?.slice(0, 1) ?? ''}</small></span>
                  <div><strong>{passenger.name}</strong><span>{passenger.seat ? `${passenger.seat} · ${seatPrice?.category}` : 'No seat assigned'}</span></div>
                  <b>{formatPrice(seatPrice?.amount ?? 0)}</b>
                </div>
              })}
            </div>
            <div className="summary-meals">
              <p className="summary-label">Meals</p>
              {passengers.map((passenger) => {
                const meal = meals.find((item) => item.id === passengerMeals[passenger.id])
                return <div key={passenger.id}><span>{passenger.name}</span><b>{meal ? `${meal.name} · ${meal.price === 0 ? 'Free' : formatPrice(meal.price)}` : 'No meal selected'}</b></div>
              })}
            </div>
            <div className="fare-lines"><div><span>Flight fare</span><b>{formatPrice(17290 * passengerCount)}</b></div><div><span>Seat selection</span><b>{formatPrice(seatTotal)}</b></div><div><span>Taxes & fees</span><b>{formatPrice(1200 * passengerCount)}</b></div></div>
            <div className="fare-lines meal-charge"><div><span>Meal selection</span><b>{formatPrice(mealTotal)}</b></div></div>
            <div className="total-price"><span>Total price <small>for {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'}</small></span><strong>{formatPrice(totalPrice)}</strong></div>
            <button className="continue-button" disabled={!allPassengersSeated}>Continue to payment <Icon name="arrow" size={17} /></button>
            <p className={`secure-note ${allPassengersSeated ? '' : 'validation-note'}`}>{allPassengersSeated ? 'Prices include all taxes and fees' : 'Assign a seat to every passenger to continue'}</p>
          </aside>
        </div>
      </main>
      <footer><span>© 2025 Skyward Airlines</span><span>Need help? <a href="#help">Contact support</a></span></footer>
    </div>
  )
}

export default App
