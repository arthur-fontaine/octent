import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      repositoryUrl='https://github.com/arthur-fontaine/octent-example'
      contentDirectory='/data'
      dataType='json'
    />
  </React.StrictMode>,
)
