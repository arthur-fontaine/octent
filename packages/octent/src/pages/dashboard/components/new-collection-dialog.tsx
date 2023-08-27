import React, { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useContentStatus } from '@/hooks/use-content-status'
import { cn, ContentExplorer } from '@/lib/utils'
import {
  AVAILABLE_FIELD_TYPES, Field,
} from '@/lib/utils/content-explorer/content-explorer'

interface NewCollectionDialogProperties {
  contentExplorer: ContentExplorer
}

/**
 *
 * @param properties The properties of the new collection dialog.
 * @param properties.contentExplorer The content explorer to use.
 * @returns The new collection dialog.
 */
export function NewCollectionDialog(properties: NewCollectionDialogProperties) {
  const [collection_name, setCollectionName] = useState('')
  const [collection_fields, setCollectionFields] = useState<Field[]>([])
  const [new_field, setNewField] = useState<Partial<Field>>({})

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const updateContentStatus = useContentStatus(function (state) {
    return state.updateStatus
  })

  const checkIfFieldIsCompleted = useCallback(
    function (field: Partial<Field>): field is Field {
      return (
        field.name !== undefined &&
        field.name.length > 0 &&
        field.type !== undefined
      )
    },
    [],
  )

  const is_valid = (
    collection_name.length > 0 &&
    collection_fields.length > 0 &&
    (new_field.name === undefined || checkIfFieldIsCompleted(new_field))
  )

  const addField = useCallback(function (newField: Field) {
    setCollectionFields(function (previous) {
      return [...previous, newField]
    })
    setNewField({})
  }, [setCollectionFields, new_field, setNewField])

  if (checkIfFieldIsCompleted(new_field)) {
    addField(new_field)
  }

  const updateField = useCallback(
    function (index: number, updatedField: Readonly<Partial<Field>>) {
      if (index === collection_fields.length) {
        setNewField(function (previous) {
          return { ...previous, ...updatedField }
        })
      } else {
        setCollectionFields(function (previous) {
          const field = previous[index]

          if (field === undefined) {
            return previous
          }

          return [
            ...previous.slice(0, index),
            { ...field, ...updatedField },
            ...previous.slice(index + 1),
          ]
        })
      }
    },
    [collection_fields, setCollectionFields, new_field, setNewField],
  )

  return (
    <div className='py-4'>
      <Input
        className={cn(
          'mb-4 border-none outline-none focus-visible:ring-offset-8 p-0',
          'text-2xl font-semibold tracking-tight h-auto leading-7 w-[15ch]',
        )}
        placeholder='Collection Name'
        value={collection_name}
        onChange={function (event) {
          return setCollectionName(event.currentTarget.value)
        }}
      />
      <Table>
        <TableBody>
          {
            [...collection_fields, new_field].map(function (field, index) {
              return ((
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      className={cn(
                        'border-none outline-none focus-visible:ring-offset-4',
                        'p-0 h-auto leading-7',
                      )}
                      defaultValue={field.name}
                      placeholder='Field Name'
                      onChange={function (event) {
                        updateField(index, { name: event.currentTarget.value })
                      }}
                    />
                  </TableCell>
                  <TableCell className='w-[20ch]'>
                    <Select
                      {...(field.type && { defaultValue: field.type })}
                      onValueChange={function (value: Field['type']) {
                        if (!AVAILABLE_FIELD_TYPES.includes(value)) {
                          return
                        }

                        updateField(index, { type: value })
                      }}
                    >
                      <SelectTrigger className={cn(
                        'w-full border-none outline-none',
                        'focus-visible:ring-offset-4 focus:ring-offset-4',
                        'p-0 h-auto leading-7',
                      )}>
                        <SelectValue placeholder='Select a type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='string'>String</SelectItem>
                        <SelectItem value='number'>Number</SelectItem>
                        <SelectItem value='boolean'>Boolean</SelectItem>
                        <SelectItem value='rich-text'>Rich Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            })
          }
        </TableBody>
      </Table>
      <div className='flex justify-end mt-4'>
        <Button
          disabled={!is_valid}
          onClick={async function () {
            void await properties.contentExplorer.createCollection({
              name: collection_name,
              fields: collection_fields,
            })
            void updateContentStatus(properties.contentExplorer)
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}