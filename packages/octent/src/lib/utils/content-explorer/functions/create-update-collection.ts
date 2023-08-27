import type LightningFS from '@isomorphic-git/lightning-fs'

import type { Collection } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.collectionPath The path to the collection
 * @returns A function that updates a collection
 */
export function createUpdateCollection(parameters: {
  fs: LightningFS.PromisifiedFS,
  collectionPath: string,
}) {
  return async function updateCollection(collection: Readonly<Collection>) {
    await parameters.fs.writeFile(
      `${parameters.collectionPath}/${collection.name}.json`,
      JSON.stringify(collection),
    )
  }
}
