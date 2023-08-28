import type LightningFS from '@isomorphic-git/lightning-fs'
import * as git from 'isomorphic-git'

import type { GitRepoOptions } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.fs The file system to use
 * @param parameters.gitRepoOptions The options to pass to git
 * @returns A function that pulls the repository
 */
export function createReset(parameters: {
  fs: LightningFS.PromisifiedFS,
  gitRepoOptions: Readonly<GitRepoOptions>
}) {
  // eslint-disable-next-line functional/functional-parameters
  return async function reset() {
    const branch = await git.currentBranch(parameters.gitRepoOptions)

    if (branch === undefined) {
      return
    }

    await parameters.fs.unlink(
      `${parameters.gitRepoOptions.dir}/.git/refs/heads/${branch}`,
    )

    await git.checkout({
      ...parameters.gitRepoOptions,
      ref: branch,
      force: true,
    })
  }
}
