import React from 'react'

import { Checkbox } from '@/components/ui/checkbox'

import { ContentInputProperties } from './content-input'

/**
 * @param properties The properties of the content input.
 * @returns The content input number.
 */
export function ContentInputBoolean(
  properties: ContentInputProperties,
) {
  return <Checkbox
    {...properties}
    defaultChecked={properties.defaultValue as boolean}
  />
}
