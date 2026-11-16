import { Icon } from './Icon'

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Skyward home">
        <span className="brand-mark"><Icon name="plane" size={19} /></span>
        <span>skyward</span>
      </a>
      <nav className="main-nav booking-nav" aria-label="Booking navigation">
        <span>Booking reference <strong>SKY-4821</strong></span>
        <span className="header-route">New Delhi <b>→</b> Dubai</span>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Choose language"><Icon name="globe" size={18} /></button>
        <button className="profile-button"><Icon name="user" size={17} /> Sign in</button>
      </div>
    </header>
  )
}
