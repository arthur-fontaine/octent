import type LightningFS from '@isomorphic-git/lightning-fs'

/**
 * @param fs The file system to use
 * @param path The path to the directory
 * @returns A promise that resolves to a list of files
 */
export async function listDeepFiles(
  fs: LightningFS.PromisifiedFS,
  path: string,
): Promise<string[]> {
  const children = await fs.readdir(path)

  const files = await (Promise.all(
    children.flatMap(async function(child) {
      const stats = await fs.stat(`${path}/${child}`)

      if (stats.isDirectory()) {
        return listDeepFiles(fs, `${path}/${child}`)
      }

      return `${path}/${child}`
    }),
  ).then(function(files) {
    return files.flat() 
  }))

  return files
}
