import LightningFS from '@isomorphic-git/lightning-fs'
import http from 'isomorphic-git/http/web'

import { createCreateCollection } from './functions/create-create-collection'
import { createCreateContent } from './functions/create-create-content'
import { createCreateDirectory } from './functions/create-create-directory'
import { createDeleteCollection } from './functions/create-delete-collection'
import { createDeleteContent } from './functions/create-delete-content'
import { createDeleteDirectory } from './functions/create-delete-directory'
import { createFormatContent } from './functions/create-format-content'
import { createGetCollection } from './functions/create-get-collection'
import { createGetContent } from './functions/create-get-content'
import { createIsModified } from './functions/create-is-modified'
import { createListCollections } from './functions/create-list-collections'
import { createListContent } from './functions/create-list-content'
import { createListDirectories } from './functions/create-list-directory'
import { createPull } from './functions/create-pull'
import { createPush } from './functions/create-push'
import { createRenameDirectory } from './functions/create-rename-directory'
import { createUpdateCollection } from './functions/create-update-collection'
import { createUpdateContent } from './functions/create-update-content'

export const AVAILABLE_FIELD_TYPES = [
  'string', 'number', 'boolean',
] as const

export interface Field {
  name: string
  type: typeof AVAILABLE_FIELD_TYPES[number]
}

type InferFieldType<T extends Field['type']> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never
type InferField<T extends Field> = {
  [K in T['name']]: InferFieldType<T['type']>
}
type InferFields<
  T extends Readonly<Field[]>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Result = {}
> = T extends Readonly<[infer F, ...infer R]>
  ? F extends Field
  ? R extends Field[]
  ? InferFields<R, InferField<F> & Result>
  : InferField<F> & Result
  : never
  : Result

export interface Collection {
  name: string
  fields: Field[]
}

export interface Content<T extends Collection> {
  name: string
  collection: T['name']
  data: InferFields<T['fields']>
}

export interface ContentExplorer {
  isModified: () => Promise<boolean>

  push: () => Promise<void>
  pull: () => Promise<void>

  formatContent: (content: Readonly<Content<Collection>>) => string
  getContent: (contentPath: string) => Promise<Content<Collection>>
  listContent: (path: string) => Promise<{
    path: string
    displayName: string
    lastModified: Date
  }[]>
  createContent: (content: Readonly<Content<Collection>>) => Promise<void>
  updateContent: (
    content: Readonly<Content<Collection>>,
    path: string
  ) => Promise<void>
  deleteContent: (content: Readonly<Content<Collection>>) => Promise<void>

  createDirectory: (path: string) => Promise<void>
  deleteDirectory: (path: string) => Promise<void>
  renameDirectory: (path: string, newPath: string) => Promise<void>
  listDirectories: (path: string) => Promise<{
    path: string
    displayName: string
    lastModified: Date
  }[]>

  getCollection: (collectionName: string) => Promise<Collection>
  listCollections: () => Promise<string[]>
  createCollection: (collection: Readonly<Collection>) => Promise<void>
  updateCollection: (collection: Readonly<Collection>) => Promise<void>
  deleteCollection: (collectionName: string) => Promise<void>
}

const CORS_PROXY = 'https://cors.isomorphic-git.org'

const fs = new LightningFS('fs').promises
const directory = '/octent'

// eslint-disable-next-line functional/no-mixed-types
interface ContentExplorerOptions {
  repositoryUrl: string
  dataDirectory: string
  dataType: string
  onAuth: () => Promise<{
    username: string
    password: string
  }>
}

export interface GitRepoOptions {
  fs: typeof fs
  http: typeof http
  dir: string
  corsProxy: string
  url: string
  onAuth: ContentExplorerOptions['onAuth']
  author: {
    name: string
  }
  commiter: {
    name: string
  }
}

/**
 * @param options The options to create the ContentExplorer
 * @param options.repositoryUrl The URL of the git repository
 * @param options.dataDirectory The directory where the data is stored
 * @param options.dataType The type of the data
 * @param options.onAuth A function that returns the
 *                       username and password to authenticate with
 * @returns A new instance of ContentExplorer
 */
export async function createContentExplorer(
  options: ContentExplorerOptions,
): Promise<ContentExplorer> {
  const ROOT_PATH = (
    `${directory}/${options.dataDirectory}`.replaceAll(/\/{2,}/g, '/')
  )
  const CONTENT_PATH = `${ROOT_PATH}`
  const COLLECTION_PATH = `${ROOT_PATH}/__collections`

  const GIT_REPO_OPTIONS: GitRepoOptions = {
    fs,
    http,
    dir: directory,
    corsProxy: CORS_PROXY,
    url: options.repositoryUrl,
    onAuth: options.onAuth,
    author: {
      name: await options.onAuth().then(function (auth) {
        return auth.username
      }),
    },
    commiter: {
      name: 'Octent',
    },
  }

  const content_explorer: ContentExplorer = {
    isModified: createIsModified({ gitRepoOptions: GIT_REPO_OPTIONS }),

    push: createPush({ gitRepoOptions: GIT_REPO_OPTIONS }),
    pull: createPull({ gitRepoOptions: GIT_REPO_OPTIONS }),

    formatContent: createFormatContent({ dataType: options.dataType }),
    getContent: createGetContent({
      fs,
      dataType: options.dataType,
      contentPath: CONTENT_PATH,
    }),
    listContent: createListContent({ fs, contentPath: CONTENT_PATH }),
    createContent: createCreateContent({
      fs,
      dataType: options.dataType,
      contentPath: CONTENT_PATH,
      formatContent(content) {
        return content_explorer.formatContent(content)
      },
    }),
    updateContent: createUpdateContent({
      fs,
      contentPath: CONTENT_PATH,
      formatContent(content) {
        return content_explorer.formatContent(content)
      },
    }),
    deleteContent: createDeleteContent({
      fs,
      contentPath: CONTENT_PATH,
      dataType: options.dataType,
    }),

    createDirectory: createCreateDirectory({
      fs,
      contentPath: CONTENT_PATH,
    }),
    deleteDirectory: createDeleteDirectory({
      fs,
      contentPath: CONTENT_PATH,
    }),
    renameDirectory: createRenameDirectory({
      fs,
      contentPath: CONTENT_PATH,
    }),
    listDirectories: createListDirectories({
      fs,
      contentPath: CONTENT_PATH,
    }),

    getCollection: createGetCollection({
      fs,
      collectionPath: COLLECTION_PATH,
    }),
    listCollections: createListCollections({
      fs,
      collectionPath: COLLECTION_PATH,
    }),
    createCollection: createCreateCollection({
      fs,
      collectionPath: COLLECTION_PATH,
    }),
    updateCollection: createUpdateCollection({
      fs,
      collectionPath: COLLECTION_PATH,
    }),
    deleteCollection: createDeleteCollection({
      fs,
      collectionPath: COLLECTION_PATH,
    }),
  }

  return content_explorer
}
