import type LightningFS from '@isomorphic-git/lightning-fs'

import { fileExists } from '../../file-exists'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.contentPath The path to the content
 * @returns A function that pulls the repository
 */
export function createListContent(parameters: {
  fs: LightningFS.PromisifiedFS,
  contentPath: string,
}) {
  return async function listContent(_path: string = parameters.contentPath) {
    const path = _path.startsWith(parameters.contentPath)
      ? _path
      : `${parameters.contentPath}/${_path}`

    if (!(await fileExists(parameters.fs, path))) {
      return []
    }

    const children = await parameters.fs.readdir(path)

    const files = await (
      Promise.all(
        children.map(async function (child) {
          const stats = await parameters.fs.stat(`${path}/${child}`)

          if (stats.isDirectory()) {
            return undefined
          }

          const file_path = `${path}/${child}`
          const normalized_file_path = (file_path
            .replaceAll(/\/{2,}/g, '/')
            .replace(new RegExp(`^${parameters.contentPath}/`), ''))

          const file_name = normalized_file_path.split('/').at(-1) ?? ''
          const file_name_without_extension = (file_name
            .split('.').slice(0, -1).join('.'))

          return {
            path: normalized_file_path,
            displayName: file_name_without_extension,
            lastModified: new Date(stats.mtimeMs),
          }
        }),
      ).then(function (files) {
        return files.filter(function (file): file is NonNullable<typeof file> {
          return file !== undefined
        })
      })
    )

    return files
  }
}
