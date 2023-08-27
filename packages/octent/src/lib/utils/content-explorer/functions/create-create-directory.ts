import type LightningFS from '@isomorphic-git/lightning-fs'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.contentPath The path to the content
 * @returns A function that creates a directory
 */
export function createCreateDirectory(parameters: {
  fs: LightningFS.PromisifiedFS,
  contentPath: string,
}) {
  return async function createDirectory(directoryPath: string): Promise<void> {
    await parameters.fs.mkdir(`${parameters.contentPath}/${directoryPath}`)
  }
}
