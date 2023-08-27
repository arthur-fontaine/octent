import type LightningFS from '@isomorphic-git/lightning-fs'

import { fileExists } from '../../file-exists'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.collectionPath The path to the content
 * @returns A function that returns a list of collections
 */
export function createListCollections(parameters: {
  fs: LightningFS.PromisifiedFS,
  collectionPath: string,
}) {
  // eslint-disable-next-line functional/functional-parameters
  return async function listCollections() {
    if (!(await fileExists(parameters.fs, parameters.collectionPath))) {
      return []
    }

    return parameters.fs.readdir(parameters.collectionPath)
  }
}
