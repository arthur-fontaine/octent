import ReactDOM from 'react-dom/server'

import App from './App'

export interface OctentOptions {
  repositoryUrl: string
  contentDirectory: string
  dataType: 'json' | 'mdx'
}

export function renderOctentAsString(props: OctentOptions) {
  return ReactDOM.renderToString(App(props))
}
