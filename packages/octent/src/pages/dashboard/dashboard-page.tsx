import type { LucideIcon } from 'lucide-react'
import { File, Folder } from 'lucide-react'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Breadcrumb } from '@/components/breadcrumb'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OctentOptionsContext } from '@/contexts/octent-options-context'
import type { Collection, Content, Field } from '@/lib/utils/content-explorer'
import { ContentExplorer } from '@/lib/utils/content-explorer'
import { useContentStatus } from '@/hooks/use-content-status'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

type FSDirectory = Awaited<ReturnType<ContentExplorer['listDirectoriesInPath']>>[0]
type FSContent = Awaited<ReturnType<ContentExplorer['listContentsInPath']>>[0]

export function DashboardPage() {
  const options = useContext(OctentOptionsContext)

  const params = useParams()
  const currentPath = '*' in params ? params['*'] as string : '/'

  const [contents, setContents] = useState<FSContent[] | null>(null)
  const [directories, setDirectories] = useState<FSDirectory[] | null>(null)
  const [collections, setCollections] = useState<string[] | null>(null)

  const auth = useAuth()

  const contentStatus = useContentStatus((state) => state.status)
  const updateContentStatus = useContentStatus((state) => state.updateStatus)

  const contentExplorer = useMemo(() => new ContentExplorer(
    options.repositoryUrl,
    options.contentDirectory, 
    options.dataType,
    () => {
      if (auth.type !== 'http')
        throw new Error('Doens\'t support auth type other than http')

      return {
        username: auth.username,
        password: auth.password,
      }
    },
  ), [options.repositoryUrl, options.contentDirectory, options.dataType])

  const updateContents = useCallback(async () => {
    setContents(await contentExplorer.listContentsInPath(currentPath))
    setDirectories(await contentExplorer.listDirectoriesInPath(currentPath))
    setCollections(await contentExplorer.listCollections())
  }, [contentExplorer, currentPath])

  useEffect(function () {
    updateContents()
  }, [updateContents, currentPath])

  return (
    <div className="h-full mx-32 my-16 flex flex-col">
      <header className="w-full flex flex-row-reverse mb-8">
        <Button
          variant="secondary"
          onClick={() => {
            updateContentStatus('pushing')
            contentExplorer.push().then(() => updateContentStatus(contentExplorer))
          }}
          disabled={contentStatus !== 'modified'}
        >
          {contentStatus === 'pushing' ? 'Saving...' : 'Save'}
        </Button>
      </header>
      <div className="flex-1 flex flex-row justify-center">
        <main className="flex-1 max-w-4xl">
          <header className="mb-8">
            <h1>Content</h1>
            <Breadcrumb
              className='ml-[1ch] mt-2'
              path={
                [
                  '/',
                  ...currentPath
                    .split('/')
                    .filter(pathPart => pathPart.length > 0),
                ]}
            />
          </header>
          <ul className="w-full space-y-2">
            {
              (directories?.length ?? 0) + (contents?.length ?? 0) === 0 && <Label>No content found.</Label>
            }
            {directories?.map(directory => (
              !directory.path.startsWith('__') && <div key={directory.path} className="space-y-2">
                <DashboardItem
                  name={directory.displayName}
                  label={new Date(directory.lastModified).toLocaleDateString()}
                  link={`/dashboard/${directory.path}`}
                  icon={Folder}
                />
                <Separator />
              </div>
            ))}
            {contents?.map(content => (
              <div key={content.path} className="space-y-2">
                <DashboardItem
                  name={content.displayName}
                  label={new Date(content.lastModified).toLocaleDateString()}
                  dialog={<ContentDialog contentPath={content.path} contentExplorer={contentExplorer} />}
                  icon={File}
                />
                <Separator />
              </div>
            ))}
          </ul>
        </main>
        <aside className="w-64 ml-24">
          <header className="mb-8">
            <h2>Collections</h2>
          </header>
          {
            collections?.length === 0 && <Label>No collections found.</Label>
          }
          <ul>
            {collections?.map(collection => (
              <DashboardItem
                key={collection}
                name={collection}
                dialog={<CollectionDialog collection={collection} contentExplorer={contentExplorer} />}
              />
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

function DashboardItem({
  name,
  label,
  dialog,
  link,
  icon: Icon,
}: { name: string; label?: string; icon?: LucideIcon } & (
  | { dialog?: React.ReactNode; link?: never }
  | { link: string; dialog?: never }
)) {
  const nameParts = name.split('.')
  const nameWithoutExtension = nameParts.length > 1 ? nameParts.slice(0, -1).join('.') : nameParts[0]

  const ContentRow = (
    <>
      <div className="flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        <p className="!m-0 select-none">{nameWithoutExtension}</p>
      </div>
      {label && <Label>{label}</Label>}
    </>
  )

  const className = 'w-full py-2 px-4 rounded-sm hover:bg-muted/50 flex items-center justify-between cursor-pointer'

  return (
    <li className="w-full">
      {dialog
        && <Dialog>
          <DialogTrigger className={className}>
            {ContentRow}
          </DialogTrigger>
          <DialogContent>
            {dialog}
          </DialogContent>
        </Dialog>
      }
      {
        link
        && <Link to={link} className={className}>
          {ContentRow}
        </Link>
      }
    </li>
  )
}

function CollectionDialog({ collection, contentExplorer }: { collection: string; contentExplorer: ContentExplorer }) {
  const [collectionFields, setCollectionFields] = useState<Field[] | null>(null)

  useEffect(() => {
    contentExplorer.getCollection(collection).then(({ fields }) => {
      setCollectionFields(fields)
    })
  }, [collection, contentExplorer])

  return (
    <div className="py-4">
      <h3 className="mb-4">Fields</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            collectionFields?.map(field => (
              <TableRow key={field.name}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.type}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

function ContentDialog({ contentPath, contentExplorer }: { contentPath: string; contentExplorer: ContentExplorer }) {
  const [content, setContent] = useState<Content<Collection> | null>(null)
  const updateContentStatus = useContentStatus((state) => state.updateStatus)

  useEffect(() => {
    contentExplorer.getContent(contentPath).then((content) => {
      setContent(content)
    })
  }, [])

  useEffect(() => {
    if (content) {
      contentExplorer.updateContent(content, contentPath)
        .then(() => updateContentStatus(contentExplorer))
    }
  }, [content])

  return (
    <div className="py-4">
      {
        content === null
          ? <Label>Loading...</Label>
          : Object.entries(content.data ?? {}).map(([key, value]) => (
            <div key={key} className="flex flex-col mb-4 last:mb-0">
              <Label className='mb-2'>{key}</Label>
              <Input defaultValue={value} onChange={(e) => {
                setContent({
                  ...content,
                  data: {
                    ...content?.data,
                    [key]: e.target.value,
                  },
                })
              }} />
            </div>
          ))
      }
    </div>
  )
}
