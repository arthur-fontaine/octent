import React, { useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'
import { useContentStatus } from '@/hooks/use-content-status'
import type { ContentExplorer } from '@/lib/utils'
import type {
  Collection, Content,
} from '@/lib/utils/content-explorer/content-explorer'

import { ContentInput } from './content-inputs/content-input'

interface ContentDialogProperties {
  contentPath: string
  contentExplorer: ContentExplorer
}

/**
 *
 * @param properties The properties of the content dialog.
 * @param properties.contentPath The path of the content to show.
 * @param properties.contentExplorer The content explorer to use.
 * @returns The content dialog.
 */
export function ContentDialog(properties: ContentDialogProperties) {
  const [content, setContent] = useState<Content<Collection> | null>(null)
  const [collection, setCollection] = useState<Collection | null>(null)

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const updateContentStatus = useContentStatus(function (state) {
    return state.updateStatus
  })

  useEffect(function () {
    void (properties.contentExplorer.getContent(properties.contentPath)
      .then(function (content) {
        setContent(content)
        return properties.contentExplorer.getCollection(content.collection)
      })
      .then(function (collection) {
        setCollection(collection)
      }))
  }, [])

  useEffect(function () {
    if (content) {
      void (properties.contentExplorer
        .updateContent(content, properties.contentPath)
        .then(function () {
          return updateContentStatus(properties.contentExplorer)
        }))
    }
  }, [content])

  return (
    <div className='py-4'>
      {
        (content === null || collection === null)
          ? <Label>Loading...</Label>
          : <>
            <Label className='mb-4 block text-base'>
              Content belonging to {content.collection} collection
            </Label>
            {
              Object.entries(content.data ?? {}).map(function ([key, value]) {
                const field = collection.fields.find(function (field) {
                  return field.name === key
                })

                if (field === undefined) {
                  return null
                }

                return ((
                  <div key={key} className='flex flex-col mb-4 last:mb-0'>
                    <Label className='mb-2'>{key}</Label>
                    <ContentInput
                      defaultValue={value}
                      field={field}
                      onChange={function (event) {
                        setContent({
                          ...content,
                          data: {
                            ...content?.data,
                            [key]: event.target.value,
                          },
                        })
                      }}
                    />
                  </div>
                ))
              })
            }
          </>
      }
    </div>
  )
}
