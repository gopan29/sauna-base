'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PenLine, Sparkles, BarChart2, User } from 'lucide-react'

const items = [
  { href: '/',        icon: Home,      label: 'ホーム' },
  { href: '/record',  icon: PenLine,   label: '記録' },
  { href: '/ai',      icon: Sparkles,  label: 'AI' },
  { href: '/stats',   icon: BarChart2, label: '統計' },
  { href: '/profile', icon: User,      label: 'マイページ' },
]

export function BottomNavigation() {
  const path = usePathname()

  if (path.startsWith('/admin') || path.startsWith('/onboarding')) return null

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: 'rgba(242,236,228,0.92)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderTop: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '0 -1px 0 rgba(44,32,22,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
    >
      {items.map(({ href, icon: Icon, label }) => {
        const active = path === href
        return (
          <Link key={href} href={href}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] transition-all"
            style={{
              color: active ? '#4d8a28' : 'rgba(44,32,22,0.42)',
            }}
          >
            <Icon
              className="w-5 h-5"
              style={active ? {
                filter: 'drop-shadow(0 0 4px rgba(77,138,40,0.45))',
              } : undefined}
            />
            <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
