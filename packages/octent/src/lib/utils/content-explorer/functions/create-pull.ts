import * as git from 'isomorphic-git'

import type { GitRepoOptions } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.gitRepoOptions The options to pass to git
 * @returns A function that pulls the repository
 */
export function createPull(parameters: {
  gitRepoOptions: Readonly<GitRepoOptions>
}) {
  // eslint-disable-next-line functional/functional-parameters
  return async function pull() {
    await git.pull({
      ...parameters.gitRepoOptions,
      ref: 'main',
      singleBranch: true,
    })
  }
}
