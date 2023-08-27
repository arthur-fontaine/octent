import type LightningFS from '@isomorphic-git/lightning-fs'

import type { Collection, Content } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.contentPath The path to the content
 * @param parameters.formatContent The function to format the content
 * @returns A function that commits and pushes the repository
 */
export function createUpdateContent(parameters: {
  fs: LightningFS.PromisifiedFS,
  contentPath: string,
  formatContent: (content: Readonly<Content<Collection>>) => string,
}) {
  return async function updateContent(
    content: Readonly<Content<Collection>>,
    path: string,
  ) {
    await parameters.fs.writeFile(
      `${parameters.contentPath}/${path}`,
      parameters.formatContent(content),
    )
  }
}
