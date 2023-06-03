import React from 'react'

import type { OctentOptions } from '.'

function App(props: OctentOptions) {
  return (
    <div className="App">
      {JSON.stringify(props)}
    </div>
  )
}

export default App
