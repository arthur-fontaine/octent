import * as git from 'isomorphic-git'

import type { GitRepoOptions } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.gitRepoOptions The options to pass to git
 * @returns A function that returns true if the repository is modified
 */
export function createIsModified(parameters: {
  gitRepoOptions: Readonly<GitRepoOptions>
}) {
  // eslint-disable-next-line functional/functional-parameters
  return async function isModified() {
    const status = await git.statusMatrix(parameters.gitRepoOptions)

    return status.some(function (statusRow) {
      const flags = statusRow.slice(1)

      return ((
        !flags.every(function (flag) {
          return flag === 1
        })
      ))
    })
  }
}
