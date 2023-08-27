import React from 'react'

import type { InputProps } from '@/components/ui/input'
import type { Field } from '@/lib/utils/content-explorer/content-explorer'

import { ContentInputBoolean } from './content-input-boolean'
import { ContentInputNumber } from './content-input-number'
import { ContentInputString } from './content-input-string'

// eslint-disable-next-line @typescript-eslint/naming-convention
interface _ContentInputProperties extends Omit<InputProps, 'defaultValue'> {
  field: Field
  defaultValue?: unknown
}
export type ContentInputProperties = Readonly<_ContentInputProperties>

/**
 * @param properties The properties of the content input.
 * @returns The content input.
 */
export function ContentInput(properties: ContentInputProperties) {
  switch (properties.field.type) {
    case 'string': {
      return <ContentInputString {...properties} />
    }
    case 'number': {
      return <ContentInputNumber {...properties} />
    }
    case 'boolean': {
      return <ContentInputBoolean {...properties} />
    }
  }
}
