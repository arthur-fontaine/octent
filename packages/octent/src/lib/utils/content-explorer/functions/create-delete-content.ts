import type LightningFS from '@isomorphic-git/lightning-fs'

import type { Collection, Content } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.contentPath The path to the content
 * @param parameters.dataType The type of the data
 * @returns A function that commits and pushes the repository
 */
export function createDeleteContent(parameters: {
  fs: LightningFS.PromisifiedFS,
  contentPath: string,
  dataType: string,
}) {
  return async function deleteContent(content: Readonly<Content<Collection>>) {
    await parameters.fs.unlink(
      `${parameters.contentPath}/${content.name}.${parameters.dataType}`,
    )
  }
}
