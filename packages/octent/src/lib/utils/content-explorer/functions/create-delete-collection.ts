import type LightningFS from '@isomorphic-git/lightning-fs'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.collectionPath The path to the collection
 * @returns A function that deletes a collection
 */
export function createDeleteCollection(parameters: {
  fs: LightningFS.PromisifiedFS,
  collectionPath: string,
}) {
  return async function deleteCollection(collectionName: string) {
    await parameters.fs.unlink(
      `${parameters.collectionPath}/${collectionName}.json`,
    )
  }
}
