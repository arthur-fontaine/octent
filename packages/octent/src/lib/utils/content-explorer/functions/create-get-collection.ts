import type LightningFS from '@isomorphic-git/lightning-fs'

import type { Collection } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.collectionPath The path to the content
 * @returns A function that returns a collection
 */
export function createGetCollection(parameters: {
  fs: LightningFS.PromisifiedFS,
  collectionPath: string,
}) {
  return async function getCollection(collectionName: string) {
    const file = await parameters.fs.readFile(
      `${parameters.collectionPath}/${collectionName}.json`,
      { encoding: 'utf8' },
    )

    const file_text = typeof file === 'string'
      ? file
      : new TextDecoder().decode(file)

    return JSON.parse(file_text) as Collection
  }
}
