import type LightningFS from '@isomorphic-git/lightning-fs'

import type { Collection, Content } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.dataType The type of the data
 * @param parameters.contentPath The path to the content
 * @returns A function that commits and pushes the repository
 */
export function createGetContent(parameters: {
  fs: LightningFS.PromisifiedFS,
  dataType: string,
  contentPath: string,
}) {
  return async function getContent(path: string) {
    const file = await parameters.fs.readFile(
      `${parameters.contentPath}/${path}`,
      { encoding: 'utf8' },
    )

    const file_text = typeof file === 'string'
      ? file
      : new TextDecoder().decode(file)

    switch (parameters.dataType) {
      case 'json': {
        return JSON.parse(file_text) as Content<Collection>
      }
      default: {
        throw new Error(`Unknown data type: ${parameters.dataType}`)
      }
    }
  }
}
