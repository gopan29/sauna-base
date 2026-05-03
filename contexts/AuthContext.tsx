'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'

type AuthContextType = {
  user: User | null
  displayName: string | null
}

const AuthContext = createContext<AuthContextType>({ user: null, displayName: null })

export function AuthProvider({
  children,
  initialUser,
  initialDisplayName,
}: {
  children: React.ReactNode
  initialUser: User | null
  initialDisplayName: string | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [displayName, setDisplayName] = useState<string | null>(initialDisplayName)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      if (newUser) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', newUser.id)
          .single()
        setDisplayName(
          (data as { display_name: string | null } | null)?.display_name
          ?? newUser.user_metadata?.display_name
          ?? null
        )
      } else {
        setDisplayName(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, displayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
