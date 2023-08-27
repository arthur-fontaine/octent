import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @param inputs The class names to merge
 * @returns A string of merged class names
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line functional/functional-parameters, functional/prefer-immutable-types
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
