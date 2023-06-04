import { createContext } from 'react'

import type { OctentOptions } from '@/index'

export const OctentOptionsContext = createContext<OctentOptions>({
  repositoryUrl: '',
  contentDirectory: '',
  dataType: 'json',
})

export const OctentOptionsProvider = OctentOptionsContext.Provider
