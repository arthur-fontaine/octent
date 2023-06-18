import { ContentExplorer } from '@/lib/utils'
import { create } from 'zustand'

interface ContentStatusState {
  status: 'modified' | 'unmodified' | 'pushing'
  updateStatus: (data: ContentExplorer | ContentStatusState['status']) => void
}

export const useContentStatus = create<ContentStatusState>(
  set => ({
    status: 'unmodified',
    updateStatus: async (data) => {
      if (data instanceof ContentExplorer)
        set({ status: await data.isModified() ? 'modified' : 'unmodified' })
      else
        set({ status: data })
    }
  })
)
