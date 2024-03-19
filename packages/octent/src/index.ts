import ReactDOM from 'react-dom/server'

import { App } from './app'

export interface OctentOptions {
  repositoryUrl: string
  contentDirectory: string
  dataType: 'json' | 'mdx'
}

/**
 * @param options The options to render the Octent app
 * @returns A string of the Octent app
 */
export function renderOctentAsString(options: OctentOptions) {
  return ReactDOM.renderToString(App(options))
}
