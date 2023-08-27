import type { LucideIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface DashboardItemCommonProperties {
  name: string
  label?: string
  icon?: LucideIcon
}

interface DashboardItemDialogProperties extends DashboardItemCommonProperties {
  dialog: React.ReactNode
  link?: never
  edit?: never
}

interface DashboardItemLinkProperties extends DashboardItemCommonProperties {
  link: string
  dialog?: never
  edit?: never
}

interface DashboardItemEditProperties extends DashboardItemCommonProperties {
  edit: {
    onBlur: (value: string) => void
  }
  dialog?: never
  link?: never
}

type DashboardItemProperties =
  | DashboardItemDialogProperties
  | DashboardItemLinkProperties
  | DashboardItemEditProperties

/**
 *
 * @param properties The properties of the dashboard item.
 * @param properties.name The name of the dashboard item.
 * @param [properties.label] The label of the dashboard item.
 * @param [properties.icon] The icon of the dashboard item.
 * @param [properties.dialog] The dialog to show when
 *                            the dashboard item is clicked.
 * @param [properties.link] The link to navigate to when
 *                          the dashboard item is clicked.
 * @param [properties.edit] A function to call when the name
 *                          of the dashboard item is edited.
 * @returns The dashboard item.
 */
export function DashboardItem(properties: DashboardItemProperties) {
  const name_parts = properties.name.split('.')
  const name_without_extension = name_parts.length > 1
    ? name_parts.slice(0, -1).join('.')
    : name_parts[0]

  const content_row = (
    <>
      <div className='flex-1 flex items-center'>
        {/* If the icon is provided, render it. */}
        {properties.icon && <properties.icon className='mr-2 h-4 w-4' />}

        {/* If there is an edit function, render an input.
            Else, render a paragraph. */}
        {
          properties.edit
            ? (
              <Input
                className={cn(
                  'border-none outline-none focus-visible:ring-0 p-0 text-base',
                  'h-auto leading-7',
                )}
                defaultValue={name_without_extension}
                autoFocus
                onBlur={function (event) {
                  if (event.currentTarget === null) {
                    return
                  }

                  const target = event.currentTarget
                  return properties.edit.onBlur(target.value)
                }}
              />
            )
            : <p className='!m-0 select-none'>{name_without_extension}</p>
        }
      </div>

      {/* If there is a label, render it. */}
      {properties.label && <Label>{properties.label}</Label>}
    </>
  )

  const class_name = cn(
    'w-full py-2 px-4 rounded-sm flex items-center justify-between',

    // If there is an edit function, make the background "transparent" on hover.
    !properties.edit && 'hover:bg-muted/50 cursor-pointer',
  )

  return (
    <li className='w-full'>
      {
        properties.dialog && (
          <Dialog>
            <DialogTrigger className={class_name}>
              {content_row}
            </DialogTrigger>
            <DialogContent>
              {properties.dialog}
            </DialogContent>
          </Dialog>
        )
      }
      
      {
        properties.link && (
          <Link to={properties.link} className={class_name}>
            {content_row}
          </Link>
        )
      }

      {
        properties.edit && (
          <div className={class_name}>
            {content_row}
          </div>
        )
      }
    </li>
  )
}
