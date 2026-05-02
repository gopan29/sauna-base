'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PenLine, Sparkles, BarChart2, User } from 'lucide-react'

const items = [
  { href: '/',        icon: Home,     label: 'ホーム' },
  { href: '/record',  icon: PenLine,  label: '記録' },
  { href: '/ai',      icon: Sparkles, label: 'AIレコメンド' },
  { href: '/stats',   icon: BarChart2,label: '統計' },
  { href: '/profile', icon: User,     label: 'マイページ' },
]

export function BottomNavigation() {
  const path = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: 'rgba(8,20,6,0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {items.map(({ href, icon: Icon, label }) => {
        const active = path === href
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] transition-colors
              ${active ? 'text-[#a5d63a]' : 'text-white/45'}`}
          >
            <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_rgba(165,214,58,0.6)]' : ''}`} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
