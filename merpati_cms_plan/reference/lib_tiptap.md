# Reference: TipTap Editor

## Overview
TipTap is a headless wrapper around ProseMirror. It provides the core rich text editing capabilities without enforcing a specific UI, allowing us to build a completely custom toolbar that matches the WordPress Classic Editor feel but heavily styled with Tailwind CSS v4 and `shadcn/ui`.

## Installation
```bash
pnpm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

## Basic Setup Component
```tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

export default function ClassicEditor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Extract HTML for saving
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none',
      },
    }
  });

  return (
    <div className="border rounded-md p-4">
      {/* Custom Toolbar goes here */}
      <MenuBar editor={editor} />
      {/* Editable Area */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

## Custom Image Extension Integration
When the user clicks the "Add Media" button on our custom toolbar, it should open our Media Library Dialog (built in Module 5). Upon selecting an image, we call:
```typescript
editor.chain().focus().setImage({ src: selectedImageUrl, alt: altText }).run()
```

## HTML Toggle Mode
To support a raw HTML view, the editor UI component can maintain a state `isHtmlMode`. When toggled, we swap out the `<EditorContent>` for a standard `<textarea>` bound to the raw HTML string. When toggled back, we feed the raw HTML back into TipTap via `editor.commands.setContent(newHtml)`.
