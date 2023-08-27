import type LightningFS from '@isomorphic-git/lightning-fs'

/**
 * @param fs The file system to use
 * @param path The path to the file
 * @returns A promise that resolves to true if the file exists, false otherwise
 */
export async function fileExists(fs: LightningFS.PromisifiedFS, path: string) {
  return (fs.stat(path)
    .then(function () {
      return true
    })
    .catch(function () {
      return false
    }))
}
