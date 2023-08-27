import * as git from 'isomorphic-git'

import type { GitRepoOptions } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.gitRepoOptions The options to pass to git
 * @returns A function that commits and pushes the repository
 */
export function createPush(parameters: {
  gitRepoOptions: Readonly<GitRepoOptions>
}) {
  // eslint-disable-next-line functional/functional-parameters
  return async function push() {
    void await git.add({ ...parameters.gitRepoOptions, filepath: '.' })
    void await git.commit({
      ...parameters.gitRepoOptions,
      message: 'Update content',
    })
    void await git.push({
      ...parameters.gitRepoOptions,
      remote: 'origin',
      ref: 'main',
    })
  }
}
