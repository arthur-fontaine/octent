import React from 'react'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'

import './globals.css'

import { OctentOptionsProvider } from './contexts/octent-options-context'
import { HttpsGitAuthenticationPage } from './pages/authentication/https-git-authentication-page'
import { DashboardPage } from './pages/dashboard/dashboard-page'

import type { OctentOptions } from '.'

// import { GithubAuthenticationPage } from './pages/authentication/github-authentication-page'

const router = createBrowserRouter([
  {
    path: '/authentication/other',
    element: <HttpsGitAuthenticationPage />,
  },
  {
    path: '/dashboard/*?',
    element: <DashboardPage />,
  },
])

function App(props: OctentOptions) {
  return <div className="App bg-background text-foreground w-auto h-auto">
    <OctentOptionsProvider value={props}>
      <RouterProvider router={router} />
    </OctentOptionsProvider>
  </div>
}

export default App
