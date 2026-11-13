import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List } from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-4 pb-2 border-b border-black/10 sticky top-0 z-10 bg-white w-full">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-lg transition-colors text-slate-800 ${editor.isActive('bold') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-lg transition-colors text-slate-800 ${editor.isActive('italic') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded-lg transition-colors text-slate-800 ${editor.isActive('underline') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'}`}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>
      <div className="w-[1px] h-6 bg-black/10 my-auto mx-2" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-lg transition-colors text-slate-800 ${editor.isActive('bulletList') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
    </div>
  );
};

const Extensions = [
  StarterKit,
  Underline,
];

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: Extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose-mirror focus:outline-none min-h-[200px] text-lg leading-relaxed font-sans text-slate-900',
        style: 'font-family: Arial, Helvetica, sans-serif; color: #0f172a;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Normalize empty or default values to avoid infinite update loops
    const isEditorEmpty = editor.isEmpty || editor.getHTML() === '<p></p>' || editor.getHTML() === '<p><br></p>';
    const isContentEmpty = !content || content === '<p></p>' || content === '<p><br></p>';

    if (isEditorEmpty && isContentEmpty) return;

    if (content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden font-sans mt-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto pb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
