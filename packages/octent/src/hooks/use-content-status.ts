import { create } from 'zustand'

import type { ContentExplorer } from '@/lib/utils'

// eslint-disable-next-line functional/no-mixed-types
interface ContentStatusState {
  status: 'modified' | 'unmodified' | 'pushing'
  updateStatus: (data: ContentExplorer | ContentStatusState['status']) => void
}

export const useContentStatus = create<ContentStatusState>(
  function (set) {
    return ({
      status: 'unmodified',
      updateStatus: async function (data) {
        if (typeof data === 'object') {
          set({ status: await data.isModified() ? 'modified' : 'unmodified' })
        } else {
          set({ status: data })
        }
      },
    })
  },
)
