import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = (
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
    function(set) {
      return ({
        type: 'none',
        authenticate: function(auth) {
          return set(auth) 
        },
        // eslint-disable-next-line functional/functional-parameters
        logout: function() {
          return set({ type: 'none' }) 
        },
      }) 
    },
    {
      name: 'octent-auth',
    },
  ),
)
