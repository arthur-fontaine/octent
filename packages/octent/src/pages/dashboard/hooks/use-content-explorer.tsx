import { useContext, useEffect, useMemo, useState } from 'react'

import { OctentOptionsContext } from '@/contexts/octent-options-context'
import { useAuth } from '@/hooks/use-auth'
import { ContentExplorer, createContentExplorer } from '@/lib/utils'

/**
 * @returns The content explorer.
 */
export function useContentExplorer() {
  const options = useContext(OctentOptionsContext)
  const auth = useAuth()

  const content_explorer_promise = useMemo(function () {
    return createContentExplorer({
      ...options,
      dataDirectory: options.contentDirectory,
      async onAuth() {
        if (auth.type !== 'http') {
          throw new Error('Doens\'t support auth type other than http')
        }

        return {
          username: auth.username,
          password: auth.password,
        }
      },
    })
  }, [options.repositoryUrl, options.contentDirectory, options.dataType])

  const [content_explorer, setContentExplorer] = (
    useState<ContentExplorer | null>(null)
  )

  useEffect(function () {
    void content_explorer_promise.then(setContentExplorer)
  }, [content_explorer_promise])

  return content_explorer
}