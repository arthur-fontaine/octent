import React from 'react'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'

import './globals.css'

import { OctentOptionsProvider } from './contexts/octent-options-context'
import {
  HttpsGitAuthenticationPage,
} from './pages/authentication/https-git-authentication-page'
import { DashboardPage } from './pages/dashboard/dashboard-page'

import type { OctentOptions } from '.'

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

/**
 * @param options The Octent application options
 * @returns The Octent application
 */
export function App(options: OctentOptions) {
  return <div className='App bg-background text-foreground w-auto h-auto'>
    <OctentOptionsProvider value={options}>
      <RouterProvider router={router} />
    </OctentOptionsProvider>
  </div>
}
