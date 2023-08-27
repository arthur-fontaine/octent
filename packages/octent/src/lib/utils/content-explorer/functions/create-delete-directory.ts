import type LightningFS from '@isomorphic-git/lightning-fs'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.contentPath The path to the content
 * @returns A function that deletes a directory
 */
export function createDeleteDirectory(parameters: {
  fs: LightningFS.PromisifiedFS,
  contentPath: string,
}) {
  return async function deleteDirectory(directoryPath: string): Promise<void> {
    await parameters.fs.rmdir(`${parameters.contentPath}/${directoryPath}`)
  }
}
