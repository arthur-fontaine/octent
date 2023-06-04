import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = (
  | {
    type: 'github'
    token: string
  }
  | {
    type: 'ssh'
    email: string
    privateKey: string
  }
  | {
    type: 'http'
    username: string
    password: string
  }
  | {
    type: 'none'
  }
)

interface AuthActions {
  authenticate: (auth: Exclude<AuthState, { type: 'none' }>) => void
  logout: () => void
}

export const useAuth = create<AuthState & AuthActions>()(
  persist(
    set => ({
      type: 'none',
      authenticate: auth => set(auth),
      logout: () => set({ type: 'none' }),
    }),
    {
      name: 'octent-auth',
    },
  ),
)
