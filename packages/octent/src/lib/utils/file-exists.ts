import type LightningFS from '@isomorphic-git/lightning-fs'

export async function fileExists(fs: LightningFS.PromisifiedFS, path: string) {
  try {
    await fs.stat(path)
    return true
  }
  catch (e) {
    return false
  }
}
