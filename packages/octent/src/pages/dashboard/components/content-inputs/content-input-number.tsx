import React from 'react'

import { Input } from '@/components/ui/input'

import { ContentInputProperties } from './content-input'

/**
 * @param properties The properties of the content input.
 * @returns The content input number.
 */
export function ContentInputNumber(properties: ContentInputProperties) {
  return <Input
    {...properties}
    type='number'
    defaultValue={properties.defaultValue as number}
  />
}
