import React, { useEffect, useState } from 'react'

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import type { ContentExplorer } from '@/lib/utils'
import type { Field } from '@/lib/utils/content-explorer/content-explorer'

interface CollectionDialogProperties {
  collectionName: string
  contentExplorer: ContentExplorer
}

/**
 *
 * @param properties The properties of the collection dialog.
 * @param properties.collectionName The name of the collection to show.
 * @param properties.contentExplorer The content explorer to use.
 * @returns The collection dialog.
 */
export function CollectionDialog(properties: CollectionDialogProperties) {
  const [collection_fields, setCollectionFields] = useState<Field[] | null>()

  useEffect(function () {
    void (properties.contentExplorer.getCollection(properties.collectionName)
      .then(function ({ fields }) {
        void setCollectionFields(fields)
      }))
  }, [properties.collectionName, properties.contentExplorer])

  const collection_name_without_extension = (properties.collectionName
    .split('.').slice(0, -1).join('.'))

  return (
    <div className='py-4'>
      <h3 className='mb-4'>
        {collection_name_without_extension}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            collection_fields?.map(function (field) {
              return ((
                <TableRow key={field.name}>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.type}</TableCell>
                </TableRow>
              ))
            })
          }
        </TableBody>
      </Table>
    </div>
  )
}