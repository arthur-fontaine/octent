import React from 'react'

import { Input } from '@/components/ui/input'

import { ContentInputProperties } from './content-input'


/**
 * @param properties The properties of the content input.
 * @returns The content input string.
 */
export function ContentInputString(properties: ContentInputProperties) {
  return <Input
    {...properties}
    type='text'
    defaultValue={properties.defaultValue as string}
  />
}
