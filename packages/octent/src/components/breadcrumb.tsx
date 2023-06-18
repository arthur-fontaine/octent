import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export function Breadcrumb({ path, className = '' }: { path: string[]; className?: string }) {
  return (
    <div className={
      cn(
        'mb-4 flex items-center space-x-1 text-sm text-muted-foreground',
        className,
      )
    }>
      {
        path.slice(0, -1).map((pathPart, index) => (
          <BreadcrumbItem
            key={index}
            pathPart={pathPart}
            link={
              new URL(`${location.href.replace(/\/$/, '')}/${'../'.repeat(path.length - index - 1)}`).pathname
            }
          />
        ))
      }
      <div className="font-medium text-foreground">{path.at(-1)}</div>
    </div>
  )
}

function BreadcrumbItem({ pathPart, link }: { pathPart: string; link: string }) {
  return (
    <>
      <Link to={link} className="flex items-center space-x-1 hover:underline">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {pathPart}
        </div>
      </Link>
      <ChevronRight className="h-4 w-4" />
    </>
  )
}
