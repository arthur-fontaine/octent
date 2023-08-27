import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

interface BreadcrumbProperties {
  path: Readonly<string[]>
  className?: string
}

/**
 * @param properties The properties of the breadcrumb.
 * @returns The breadcrumb.
 */
export function Breadcrumb(properties: BreadcrumbProperties) {
  return (
    <div className={
      cn(
        'mb-4 flex items-center space-x-1 text-sm text-muted-foreground',
        properties?.className ?? '',
      )
    }>
      {
        properties.path.slice(0, -1).map(function (pathPart, index) {
          return ((
            <BreadcrumbItem
              key={index}
              pathPart={pathPart}
              link={
                (new URL(`${
                  location.href.replace(/\/$/, '')}/${
                  '../'.repeat(properties.path.length - index - 1)}`).pathname)
              }
            />
          ))
        })
      }
      <div className='font-medium text-foreground'>
        {properties.path.at(-1)}
      </div>
    </div>
  )
}

function BreadcrumbItem(
  { pathPart, link }: { pathPart: string; link: string },
) {
  return (
    <>
      <Link to={link} className='flex items-center space-x-1 hover:underline'>
        <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
          {pathPart}
        </div>
      </Link>
      <ChevronRight className='h-4 w-4' />
    </>
  )
}
