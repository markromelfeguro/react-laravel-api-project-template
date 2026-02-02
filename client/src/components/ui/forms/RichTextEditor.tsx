import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { MaterialIcon } from '../MaterialIcon';
import { Button } from '../button/Button';

interface RichTextEditorProps {
  label?: string;
  value: string;
  name: string;
  onChange: (content: string) => void;
  error?: string;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const actions = [
    { icon: 'format_bold', action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
    { icon: 'format_italic', action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
    { icon: 'format_list_bulleted', action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
    { icon: 'format_list_numbered', action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
    { icon: 'format_quote', action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
    { icon: 'code', action: () => editor.chain().focus().toggleCodeBlock().run(), active: 'codeBlock' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-main-bg/50">
      {actions.map((item, index) => (
        <Button
          key={index}
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0! ${editor.isActive(item.active) ? 'bg-primary/20 text-primary' : ''}`}
          onClick={item.action}>
          <MaterialIcon iconName={item.icon} size={18} />
        </Button>
      ))}
    </div>
  );
};

export const RichTextEditor = ({ label, name, value, placeholder, onChange, error }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-main-text',
        name: name
      },
    },
  });

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-primary font-black uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <div className={`
        rounded-4xl border overflow-hidden bg-surface transition-all duration-300
        ${error ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : 'border-border focus-within:border-primary shadow-main'}`}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      {error && (
        <p className="text-[10px] font-bold italic text-red-500 ml-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};