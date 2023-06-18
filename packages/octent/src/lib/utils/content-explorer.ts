import LightningFS from '@isomorphic-git/lightning-fs'
import * as git from 'isomorphic-git'
import http from 'isomorphic-git/http/web'

import { fileExists } from './file-exists'

export const AVAILABLE_FIELD_TYPES = ['string', 'number', 'boolean'] as const

export interface Field {
  name: string
  type: typeof AVAILABLE_FIELD_TYPES[number]
}

type InferFieldType<T extends Field['type']> = T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never
type InferField<T extends Field> = { [K in T['name']]: InferFieldType<T['type']> }
type InferFields<T extends Readonly<Field[]>, Res = object> = T extends Readonly<[infer F, ...infer R]>
  ? F extends Field
    ? R extends Field[]
      ? InferFields<R, InferField<F> & Res>
      : InferField<F> & Res
    : never
  : Res

export interface Collection {
  name: string
  fields: Field[]
}

export interface Content<T extends Collection> {
  name: string
  collection: T['name']
  data: InferFields<T['fields']>
}

const CORS_PROXY = 'https://cors.isomorphic-git.org'

const { promises: fs } = new LightningFS('fs')
const directory = '/octent'

export class ContentExplorer {
  private get GIT_REPO_OPTIONS() {
    return {
      fs,
      http,
      dir: directory,
      url: this.repositoryUrl,
      corsProxy: CORS_PROXY,
      author: {
        name: this.onAuth().username,
      },
      commiter: {
        name: 'Octent',
      },
      onAuth: this.onAuth,
    }
  }

  constructor(
    protected repositoryUrl: string,
    protected dataDirectory: string,
    protected dataType: string,
    private onAuth: () => {
      username: string
      password: string
    },
  ) {
    this.clone().then(() => this.pull())
  }

  protected async clone() {
    await git.clone(this.GIT_REPO_OPTIONS)
  }

  protected get path() {
    return `${directory}${this.dataDirectory}`
  }

  protected get CONTENT_PATH() {
    return `${this.path}`
  }

  protected get COLLECTION_PATH() {
    return `${this.path}/__collections`
  }

  public async isModified() {
    const status = await git.statusMatrix(this.GIT_REPO_OPTIONS)

    return status.some(([, ...flags]) => (
      !flags.every(flag => flag === 1)
    ))
  }

  public async push() {
    await git.add({ ...this.GIT_REPO_OPTIONS, filepath: '.' })
    await git.commit({ ...this.GIT_REPO_OPTIONS, message: 'Update content' })
    await git.push({
      ...this.GIT_REPO_OPTIONS,
      remote: 'origin',
      ref: 'main',
    })
  }

  public async pull() {
    await git.pull({
      ...this.GIT_REPO_OPTIONS,
      ref: 'main',
      singleBranch: true,
    })
  }

  public formatContent(content: Content<Collection>) {
    switch (this.dataType) {
      case 'json': {
        return JSON.stringify(content)
      }
      case 'mdx': {
        return [
          '---',
          ...Object.entries(content).map(([key, value]) => `${key}: ${value}`),
          '---',
        ].join('\n')
      }
      default: {
        throw new Error(`Unknown data type: ${this.dataType}`)
      }
    }
  }

  public async createContent(content: Content<Collection>) {
    await fs.writeFile(
      `${this.CONTENT_PATH}/${content.name}.${this.dataType}`,
      this.formatContent(content),
    )
  }

  public async updateContent(content: Content<Collection>, contentPath: string) {
    console.log(`${this.CONTENT_PATH}/${content.name}.${this.dataType} -> ${this.formatContent(content)}`)
    await fs.writeFile(
      `${this.CONTENT_PATH}/${contentPath}`,
      this.formatContent(content),
    )
  }

  public async deleteContent(content: Content<Collection>) {
    await fs.unlink(`${this.CONTENT_PATH}/${content.name}.${this.dataType}`)
  }

  public async listContentsInPath(path: string | null = null) {
    if (path === null)
      path = this.CONTENT_PATH

    if (!(path.startsWith(this.CONTENT_PATH)))
      path = `${this.CONTENT_PATH}/${path}`

    if (!(await fileExists(fs, path)))
      return []

    const children = await fs.readdir(path)

    const files = await Promise.all(
      children.flatMap(async (child) => {
        const stats = await fs.stat(`${path}/${child}`)

        if (stats.isDirectory())
          return []

        return { path: `${path}/${child}`, lastModified: stats.mtimeMs as number }
      }),
    ).then(files => files.flat())

    return files.map(file => ({
      ...file,
      path: file.path
        .replace(/\/{2,}/g, '/')
        .replace(new RegExp(`^${this.CONTENT_PATH}/`), ''),
      displayName: (
        file.path
          .split('/')
          .filter(part => part !== '')
          .at(-1) ?? file.path
      ).replace(/(^\/)|(\/$)/g, ''),
    }))
  }

  public async getContent(path: string) {
    const file = await fs.readFile(`${this.CONTENT_PATH}/${path}`, { encoding: 'utf8' })

    const fileText = typeof file === 'string' ? file : new TextDecoder().decode(file)

    switch (this.dataType) {
      case 'json': {
        return JSON.parse(fileText) as Content<Collection>
      }
      case 'mdx': {
        throw new Error('Not implemented') // TODO
      }
      default: {
        throw new Error(`Unknown data type: ${this.dataType}`)
      }
    }
  }

  public async createDirectory(path: string) {
    await fs.mkdir(`${this.CONTENT_PATH}/${path}`)
  }

  public async deleteDirectory(path: string) {
    await fs.rmdir(`${this.CONTENT_PATH}/${path}`)
  }

  public async renameDirectory(path: string, newPath: string) {
    await fs.rename(`${this.CONTENT_PATH}/${path}`, `${this.CONTENT_PATH}/${newPath}`)
  }

  public async listDirectoriesInPath(path: string | null = null) {
    if (path === null)
      path = this.CONTENT_PATH

    if (!(path.startsWith(this.CONTENT_PATH)))
      path = `${this.CONTENT_PATH}/${path}`

    if (!(await fileExists(fs, path)))
      return []

    const children = await fs.readdir(path)

    const directories = await Promise.all(
      children.flatMap(async (child) => {
        const stats = await fs.stat(`${path}/${child}`)

        if (stats.isDirectory())
          return { path: `${path}/${child}`, lastModified: stats.mtimeMs as number }

        return []
      }),
    ).then(directories => directories.flat())

    return directories.map(directory => ({
      ...directory,
      path: directory.path
        .replace(/\/{2,}/g, '/')
        .replace(new RegExp(`^${this.CONTENT_PATH}/`), ''),
      displayName: (
        directory.path
          .split('/')
          .filter(part => part !== '')
          .at(-1) ?? directory.path
      ).replace(/(^\/)|(\/$)/g, ''),
    }))
  }

  public async createCollection(collection: Collection) {
    await fs.writeFile(
      `${this.COLLECTION_PATH}/${collection.name}.json`,
      JSON.stringify(collection),
    )
  }

  public async updateCollection(collection: Collection) {
    await fs.writeFile(
      `${this.COLLECTION_PATH}/${collection.name}.json`,
      JSON.stringify(collection),
    )
  }

  public async deleteCollection(collectionName: string) {
    await fs.unlink(`${this.COLLECTION_PATH}/${collectionName}`)
  }

  public async listCollections() {
    if (!(await fileExists(fs, this.COLLECTION_PATH)))
      return []

    return await fs.readdir(this.COLLECTION_PATH)
  }

  public async getCollection(collectionName: string) {
    const file = await fs.readFile(`${this.COLLECTION_PATH}/${collectionName}`, { encoding: 'utf8' })

    const fileText = typeof file === 'string' ? file : new TextDecoder().decode(file)

    return JSON.parse(fileText) as Collection
  }
}
