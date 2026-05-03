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

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: 'rgba(11,16,20,0.88)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderTop: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
      }}
    >
      {items.map(({ href, icon: Icon, label }) => {
        const active = path === href
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] transition-all
              ${active ? 'text-[#8bc34a]' : 'text-white/38'}`}
          >
            <Icon
              className="w-5 h-5"
              style={active ? {
                filter: 'drop-shadow(0 0 5px rgba(139,195,74,0.5))',
              } : undefined}
            />
            <span style={active ? { color: '#8bc34a' } : undefined}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
