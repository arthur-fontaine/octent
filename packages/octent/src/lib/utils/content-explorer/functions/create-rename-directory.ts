import type LightningFS from '@isomorphic-git/lightning-fs'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.contentPath The path to the content
 * @returns A function that renames a directory
 */
export function createRenameDirectory(parameters: {
  fs: LightningFS.PromisifiedFS,
  contentPath: string,
}) {
  return async function renameDirectory(
    directoryPath: string,
    newDirectoryPath: string,
  ): Promise<void> {
    await parameters.fs.rename(
      `${parameters.contentPath}/${directoryPath}`,
      `${parameters.contentPath}/${newDirectoryPath}`,
    )
  }
}
