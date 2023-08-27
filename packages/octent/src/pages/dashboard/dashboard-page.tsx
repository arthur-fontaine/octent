import {
  FilePlusIcon,
  FolderPlusIcon,
  PlusIcon,
  FileIcon,
  FolderIcon,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Breadcrumb } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useContentStatus } from '@/hooks/use-content-status'
import { cn } from '@/lib/utils'
import type {
  ContentExplorer,
} from '@/lib/utils/content-explorer/content-explorer'

import { CollectionDialog } from './components/collection-dialog'
import { ContentDialog } from './components/content-dialog'
import { DashboardItem } from './components/dashboard-item'
import { NewCollectionDialog } from './components/new-collection-dialog'
import { useContentExplorer } from './hooks/use-content-explorer'

type FSDirectory = Awaited<
  ReturnType<ContentExplorer['listDirectories']>
>[0]
type FSContent = Awaited<
  ReturnType<ContentExplorer['listContent']>
>[0]

/**
 * @returns The dashboard page.
 */
export function DashboardPage() {
  const parameters = useParams()
  const current_path = '*' in parameters ? parameters['*'] as string : '/'

  const [contents, setContents] = useState<FSContent[] | null>(null)
  const [directories, setDirectories] = useState<FSDirectory[] | null>(null)
  const [collections, setCollections] = useState<string[] | null>(null)

  const [is_creating_directory, setIsCreatingDirectory] = useState(false)

  const content_status = useContentStatus(function (state) {
    return state.status
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const updateContentStatus = useContentStatus(function (state) {
    return state.updateStatus
  })

  const content_explorer = useContentExplorer()

  const updateContents = useCallback(async function () {
    if (content_explorer === null) {
      return
    }

    setContents(await content_explorer.listContent(current_path))
    setDirectories(await content_explorer.listDirectories(current_path))
    setCollections(await content_explorer.listCollections())
  }, [content_explorer, current_path])

  useEffect(function () {
    void updateContents()
  }, [updateContents, current_path])

  const createDirectory = useCallback(async function (
    name: string,
    callback?: () => void,
  ) {
    if (content_explorer === null) {
      return
    }

    void await content_explorer.createDirectory(`${current_path}/${name}`)
    void updateContents().then(callback)
  }, [content_explorer, current_path, updateContents])

  return (
    content_explorer === null
      ? null
      : (
        <div className='h-full mx-32 my-16 flex flex-col'>
          <header className='w-full flex flex-row-reverse mb-8'>
            <Button
              variant='secondary'
              onClick={function () {
                void updateContentStatus('pushing')
                void content_explorer.push().then(function () {
                  return updateContentStatus(content_explorer)
                })
              }}
              disabled={content_status !== 'modified'}
            >
              {content_status === 'pushing' ? 'Saving...' : 'Save'}
            </Button>
          </header>
          <div className='flex-1 flex flex-row justify-center'>
            <main className='flex-1 max-w-4xl'>
              <header className='mb-8'>
                <h1>Content</h1>
              </header>
              <div className='mt-2 mb-4 flex flex-row
                              justify-between items-center'>
                <Breadcrumb
                  className='mb-0'
                  path={
                    [
                      '/',
                      ...(current_path
                        .split('/')
                        .filter(function (pathPart) {
                          return pathPart.length > 0
                        })),
                    ]}
                />
                <div className='flex flex-row space-x-4'>
                  <Button variant='link' className='px-0'>
                    <FilePlusIcon size={16} />
                  </Button>
                  <Button variant='link' className='px-0' onClick={function () {
                    return setIsCreatingDirectory(true)
                  }}>
                    <FolderPlusIcon size={16} />
                  </Button>
                </div>
              </div>
              <ul className='w-full space-y-2'>
                {
                  (directories?.length ?? 0) + (contents?.length ?? 0) === 0 &&
                  <Label>No content found.</Label>
                }
                {directories?.map(function (directory) {
                  return ((
                    !directory.path.startsWith('__') &&
                    <div key={directory.path} className='space-y-2'>
                      <DashboardItem
                        name={directory.displayName}
                        label={
                          new Date(directory.lastModified).toLocaleDateString()
                        }
                        link={`/dashboard/${directory.path}`}
                        icon={FolderIcon}
                      />
                      <Separator />
                    </div>
                  ))
                })}
                {
                  is_creating_directory && (
                    <div className='space-y-2'>
                      <DashboardItem
                        name=''
                        edit={{
                          onBlur(value) {
                            if (value.length > 0) {
                              void createDirectory(value, function () {
                                return setIsCreatingDirectory(false)
                              })
                            } else {
                              setIsCreatingDirectory(false)
                            }
                          },
                        }}
                        icon={FolderIcon}
                      />
                      <Separator />
                    </div>
                  )
                }
                {contents?.map(function (content) {
                  return ((
                    <div key={content.path} className='space-y-2'>
                      <DashboardItem
                        name={content.displayName}
                        label={
                          new Date(content.lastModified).toLocaleDateString()
                        }
                        dialog={
                          <ContentDialog
                            contentPath={content.path}
                            contentExplorer={content_explorer}
                          />
                        }
                        icon={FileIcon}
                      />
                      <Separator />
                    </div>
                  ))
                })}
              </ul>
            </main>
            <aside className='w-64 ml-24'>
              <header className={
                cn(
                  'mb-8 flex flex-row justify-between items-center',
                  'border-b pb-2',
                )
              }>
                <h2 className='border-none p-0'>Collections</h2>
                <Dialog>
                  <DialogTrigger>
                    <PlusIcon size={16} />
                  </DialogTrigger>
                  <DialogContent>
                    <NewCollectionDialog contentExplorer={content_explorer} />
                  </DialogContent>
                </Dialog>
              </header>
              {
                (
                  collections?.length === 0 &&
                  <Label>No collections found.</Label>
                )
              }
              <ul>
                {collections?.map(function (collection) {
                  return ((
                    <DashboardItem
                      key={collection}
                      name={collection}
                      dialog={
                        <CollectionDialog
                          collectionName={collection}
                          contentExplorer={content_explorer}
                        />
                      }
                    />
                  ))
                })}
              </ul>
            </aside>
          </div>
        </div>
      )
  )
}
