import { createContext } from 'react'

import type { OctentOptions } from '@/index'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const OctentOptionsContext = createContext<OctentOptions>({
  repositoryUrl: '',
  contentDirectory: '',
  dataType: 'json',
})

// eslint-disable-next-line @typescript-eslint/naming-convention
export const OctentOptionsProvider = OctentOptionsContext.Provider
