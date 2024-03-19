import { Underline as TipTapUnderline } from '@tiptap/extension-underline'
import {
  type ChainedCommands, type Editor, type CanCommands,
  EditorProvider, useCurrentEditor,
} from '@tiptap/react'
import { StarterKit as TipTapStarterKit } from '@tiptap/starter-kit'
import {
  type LucideIcon,
  BoldIcon, ItalicIcon, UnderlineIcon, ListOrderedIcon, ListIcon,
} from 'lucide-react'
import React from 'react'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { ContentInputProperties } from './content-input'

const TIPTAP_EXTENSIONS = [
  TipTapStarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  TipTapUnderline,
]


/**
 * @param properties The properties of the content input.
 * @returns The content input string.
 */
export function ContentInputRichText(properties: ContentInputProperties) {
  return (
    <div
      className='flex flex-col w-full rounded-md border border-input
                 bg-background text-sm h-60 [&>*:last-child]:flex-1'
    >
      <EditorProvider
        extensions={TIPTAP_EXTENSIONS}
        content={properties.defaultValue as string}
        slotBefore={<MenuBar />}
        onUpdate={function ({ editor }) {
          console.log(editor.getHTML())
        }}
        editorProps={{
          attributes: {
            class: 'px-3 py-2 ring-offset-background rounded-md h-full ' +
              'prose-focus:outline-none prose-focus:ring-2 ' +
              'prose-focus:ring-ring prose-focus:ring-offset-2 ' +
              'disabled:cursor-not-allowed disabled:opacity-50 ' +
              '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:list-inside ' +
              '[&_ol]:list-inside [&_li>*]:inline',
          },
        }} children={undefined}      >
      </EditorProvider>
    </div>
  )
}

const MenuBar = function () {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-row flex-wrap gap-2 bg-input/50 px-3 py-2'>
      <MenuItem
        icon={BoldIcon}
        action_name='toggleBold'
        is_active={'bold'}
      />
      <MenuItem
        icon={ItalicIcon}
        action_name='toggleItalic'
        is_active={'italic'}
      />
      <MenuItem
        icon={UnderlineIcon}
        action_name='toggleUnderline'
        is_active='underline'
      />

      <Separator orientation='vertical' className='h-auto' />

      <MenuItem
        icon={ListOrderedIcon}
        action_name='toggleOrderedList'
        is_active='orderedList'
      />
      <MenuItem
        icon={ListIcon}
        action_name='toggleBulletList'
        is_active='bulletList'
      />
    </div>
  )
}

interface MenuItemProperties<A extends keyof ChainedCommands> {
  icon: LucideIcon
  action_name: A
  action_arguments?: Parameters<ChainedCommands[A]>
  is_active: Parameters<Editor['isActive']>[0]
}

const MenuItem = function <A extends keyof ChainedCommands>(
  // eslint-disable-next-line functional/prefer-immutable-types
  properties: MenuItemProperties<A>,
) {
  const { editor } = useCurrentEditor()

  if (editor === null) {
    return null
  }

  const action_name = properties.action_name
  const action_arguments = properties.action_arguments ?? []

  // eslint-disable-next-line functional/prefer-immutable-types
  const getEditorChain = function (editor: Editor | CanCommands) {
    // eslint-disable-next-line lines-around-comment
    // @ts-expect-error -- TS doesn't like the spread operator here.
    const chain = editor.chain().focus()[action_name](...action_arguments)

    if (typeof chain === 'boolean') {
      return undefined
    }

    return chain
  }

  return <button
    onClick={function () {
      return getEditorChain(editor)?.run()
    }}
    disabled={
      (function () {
        return !getEditorChain(editor.can())?.run()
      })()
    }
    className={
      cn(
        editor.isActive(properties.is_active)
          ? 'bg-input'
          : '',
        'p-1 rounded-md hover:bg-input',
      )
    }
  >
    <properties.icon className='w-5 h-5' />
  </button>
}

