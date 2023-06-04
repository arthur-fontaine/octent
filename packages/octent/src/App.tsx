import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
} from '@tanstack/router'
import React, { useCallback, useContext } from 'react'

import './globals.css'

import { OctentOptionsContext, OctentOptionsProvider } from './contexts/octent-options-context'
import { useAuth } from './hooks/use-auth'
import { HttpsGitAuthenticationPage } from './pages/authentication/https-git-authentication-page'

import type { OctentOptions } from '.'

// import { GithubAuthenticationPage } from './pages/authentication/github-authentication-page'

function navigate(url: Exclude<Parameters<typeof router.getRoute>[0], '__root__'>) {
  location.href = url
}

function Root() {
  const renavigate = useCallback((type: string) => {
    if (type !== 'none')
      // navigate('/dashboard')
      console.log('Navigate to dashboard')
    else
      navigate('/')
  }, [])

  useAuth.subscribe((state) => {
    renavigate(state.type)
  })

  const authenticationType = useAuth(state => state.type)
  renavigate(authenticationType)

  return <Outlet />
}

const rootRoute = new RootRoute({
  component: Root,
})

function Index() {
  const options = useContext(OctentOptionsContext)

  const parsedRepositoryUrl = new URL(options.repositoryUrl)

  switch (parsedRepositoryUrl.hostname) {
    // case 'github.com': {
    //   console.error('GitHub authentication is not supported yet')
    // }
    default: {
      if (parsedRepositoryUrl.protocol === 'https:')
        navigate('/authentication/other')

      if (parsedRepositoryUrl.protocol === 'ssh:')
        console.error('SSH authentication is not supported yet')
    }
  }

  return <></>
}

const indexRoute = new Route({
  path: '/',
  component: Index,
  getParentRoute: () => rootRoute,
})

const httpsGitAuthenticationRoute = new Route({
  path: '/authentication/other',
  component: HttpsGitAuthenticationPage,
  getParentRoute: () => rootRoute,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  httpsGitAuthenticationRoute,
])

const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}

function App(props: OctentOptions) {
  return <div className="App bg-background text-foreground h-screen w-screen">
    <OctentOptionsProvider value={props}>
      <RouterProvider router={router} />
    </OctentOptionsProvider>
  </div>
}

export default App
