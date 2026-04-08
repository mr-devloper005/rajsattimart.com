'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { currentUser } from '@/data/mock-data'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { validateLocalLogin, addLocalAccount, loadLocalAccounts } from '@/lib/auth-local'

type AuthResult = { success: true } | { success: false; error: string }

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  /** True after localStorage session is read on the client (safe for auth-gated redirects). */
  isReady: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => void
  signup: (name: string, email: string, password: string, intent?: string) => Promise<AuthResult>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const userDefaults: User = {
  id: 'default',
  name: 'Member',
  email: '',
  avatar: '/placeholder.svg?height=80&width=80',
  bio: '',
  joinedDate: '',
  followers: 0,
  following: 0,
  isVerified: false,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = loadFromStorage<User | null>(storageKeys.user, null)
    if (storedUser) {
      setUser(storedUser)
    }
    setIsReady(true)
  }, [])

  const buildUser = useCallback((overrides: Partial<User>) => {
    const joinedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    const base = currentUser ? { ...userDefaults, ...currentUser } : userDefaults
    const nameFromEmail =
      typeof overrides.email === 'string'
        ? overrides.email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') || 'Member'
        : base.name
    return {
      ...base,
      id: `user-${Date.now()}`,
      joinedDate,
      followers: 0,
      following: 0,
      isVerified: false,
      name: overrides.name ?? nameFromEmail,
      ...overrides,
    } as User
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const check = validateLocalLogin(email, password)
        if (!check.ok) {
          return { success: false, error: check.error }
        }

        const trimmed = email.trim()
        const accounts = loadLocalAccounts()
        if (accounts.length === 0) {
          addLocalAccount(trimmed, password)
        }

        const storedUser = loadFromStorage<User | null>(storageKeys.user, null)
        const nextUser =
          storedUser && storedUser.email?.toLowerCase() === trimmed.toLowerCase()
            ? storedUser
            : buildUser({
                email: trimmed,
                name:
                  trimmed.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') ||
                  userDefaults.name,
              })

        setUser(nextUser)
        saveToStorage(storageKeys.user, nextUser)
        return { success: true }
      } finally {
        setIsLoading(false)
      }
    },
    [buildUser],
  )

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKeys.user)
    }
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string, intent?: string): Promise<AuthResult> => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))
        if (!name?.trim() || !email?.trim() || !password) {
          return { success: false, error: 'Please fill in all required fields.' }
        }
        const added = addLocalAccount(email, password)
        if (!added.ok) {
          return { success: false, error: added.error }
        }
        const nextUser = buildUser({
          name: name.trim(),
          email: email.trim(),
          bio: typeof intent === 'string' ? intent.trim() : '',
        })
        setUser(nextUser)
        saveToStorage(storageKeys.user, nextUser)
        return { success: true }
      } finally {
        setIsLoading(false)
      }
    },
    [buildUser],
  )

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const nextUser = { ...prev, ...updates }
      saveToStorage(storageKeys.user, nextUser)
      return nextUser
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isReady,
        isLoading,
        login,
        logout,
        signup,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
