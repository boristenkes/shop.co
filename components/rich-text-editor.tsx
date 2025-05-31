'use client'

import { cn } from '@/lib/utils'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
	BoldIcon,
	ItalicIcon,
	LinkIcon,
	ListIcon,
	ListOrderedIcon,
	QuoteIcon,
	StrikethroughIcon,
	UnderlineIcon
} from 'lucide-react'

const headingLevels = [3, 4] as const

export type RichTextEditorProps = {
	onChange: (html: string) => void
	disabled?: boolean
}

export default function RichTextEditor({
	onChange,
	disabled = false
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [...headingLevels] }
			}),
			Underline,
			Link.configure({ openOnClick: false })
		],
		content: '',
		onUpdate({ editor }) {
			onChange(editor.getHTML()) // Send HTML to parent
		},
		immediatelyRender: false
	})

	if (!editor) return null

	return (
		<div className='border p-2 rounded-lg'>
			{/* Toolbar */}
			<div className='flex flex-wrap gap-1 p-1 rounded-md'>
				{/* Headings */}
				{headingLevels.map(level => (
					<button
						type='button'
						disabled={disabled}
						key={level}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level }).run()
						}
						className={`px-2 py-1 text-sm border rounded ${
							editor.isActive('heading', { level }) ? 'bg-black text-white' : ''
						}`}
					>
						H{level - 2}
					</button>
				))}

				{/* Styling */}
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={btnClass(editor.isActive('bold'))}
				>
					<BoldIcon
						className='size-4'
						strokeWidth={3}
					/>
				</button>
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={btnClass(editor.isActive('italic'))}
				>
					<ItalicIcon className='size-4' />
				</button>
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					className={btnClass(editor.isActive('underline'))}
				>
					<UnderlineIcon className='size-4' />
				</button>
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={btnClass(editor.isActive('strike'))}
				>
					<StrikethroughIcon className='size-4' />
				</button>

				{/* Lists */}
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={btnClass(editor.isActive('bulletList'))}
				>
					<ListIcon className='size-4' />
				</button>
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={btnClass(editor.isActive('orderedList'))}
				>
					<ListOrderedIcon className='size-4' />
				</button>

				{/* Links */}
				<button
					type='button'
					disabled={disabled}
					onClick={() => {
						const url = prompt('Enter URL')
						if (url) editor.chain().focus().setLink({ href: url }).run()
					}}
					className={btnClass(editor.isActive('link'))}
				>
					<LinkIcon className='size-4' />
				</button>

				{/* Other */}
				<button
					type='button'
					disabled={disabled}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={btnClass(editor.isActive('blockquote'))}
				>
					<QuoteIcon className='size-4' />
				</button>
				<button
					type='button'
					disabled={disabled}
					onClick={() =>
						editor.chain().focus().unsetAllMarks().clearNodes().run()
					}
					className={cn(btnClass(false), 'ml-auto')}
				>
					Clear
				</button>
			</div>

			{/* Editor */}
			<div className='border p-4 rounded min-h-[200px] h-full rich-text'>
				<EditorContent
					editor={editor}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}

const btnClass = (active: boolean) =>
	`px-2 py-1 text-sm border rounded ${active ? 'bg-black text-white' : ''}`
