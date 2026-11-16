type IconName = 'plane' | 'search' | 'calendar' | 'chevron' | 'arrow' | 'globe' | 'user'

type IconProps = {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18 }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    plane: <path d="M2 19h20M4.5 16.5l4.25-5.2L7 3.75a1 1 0 0 1 1.7-.7l4.35 5.3 4.65-1.6a2 2 0 0 1 1.3 3.78l-4.45 1.53 1.1 5.34a1 1 0 0 1-1.77.72l-3.1-3.91-3.4 1.17a2 2 0 0 1-2.88-1.88Z" />,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9h18" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  }

  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">{paths[name]}</svg>
}
