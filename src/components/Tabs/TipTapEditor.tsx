import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, Mark, Node as TiptapNode, Extension, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Palette,
  Check,
  ImagePlus,
  Link2,
  Upload,
  Unlink,
  X,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  statusActions?: React.ReactNode;
}

export interface NotepadFontPreset {
  id: string;
  label: string;
  fontSize: string;
  fontWeight: string;
  previewSize: string;
}

export const NOTEPAD_FONT_PRESETS: NotepadFontPreset[] = [
  { id: 'title', label: 'Title', fontSize: '32px', fontWeight: '700', previewSize: '20px' },
  { id: 'subtitle', label: 'Subtitle', fontSize: '26px', fontWeight: '600', previewSize: '18px' },
  { id: 'heading', label: 'Heading', fontSize: '22px', fontWeight: '700', previewSize: '16px' },
  { id: 'subheading', label: 'Subheading', fontSize: '19px', fontWeight: '600', previewSize: '15px' },
  { id: 'section', label: 'Section', fontSize: '17px', fontWeight: '600', previewSize: '14px' },
  { id: 'subsection', label: 'Subsection', fontSize: '16px', fontWeight: '500', previewSize: '13.5px' },
  { id: 'body', label: 'Body', fontSize: '', fontWeight: '', previewSize: '13px' },
];

export const TEXT_COLOR_PALETTE = [
  { label: 'Default', value: '' },
  { label: 'Slate', value: '#475569' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Pink', value: '#db2777' },
];

const TextColorMark = Mark.create({
  name: 'textColor',
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.color || null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            style: `color: ${attributes.color}; -webkit-text-fill-color: ${attributes.color};`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const color = (element as HTMLElement).style?.color;
          return color ? { color } : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

const FontSizeMark = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
      },
      weight: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.fontWeight || null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const size = el.style?.fontSize;
          if (!size) return false;
          return { size, weight: el.style?.fontWeight || null };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { size, weight, ...rest } = HTMLAttributes;
    const styleParts: string[] = [];
    if (size) styleParts.push(`font-size: ${size}`);
    if (weight) styleParts.push(`font-weight: ${weight}`);
    if (size) styleParts.push('line-height: 1.35');
    return [
      'span',
      mergeAttributes(rest, styleParts.length ? { style: styleParts.join('; ') } : {}),
      0,
    ];
  },
});

const ImageNode = TiptapNode.create({
  name: 'noteImage',
  group: 'block',
  inline: false,
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      textAlign: {
        default: 'left',
        parseHTML: (element) => {
          const el = element as HTMLElement;
          if (el.style.marginLeft === 'auto' && el.style.marginRight === 'auto') return 'center';
          if (el.style.marginLeft === 'auto') return 'right';
          return 'left';
        },
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'img[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes.textAlign || 'left';
    const alignMargin =
      align === 'center'
        ? 'margin-left: auto; margin-right: auto;'
        : align === 'right'
        ? 'margin-left: auto; margin-right: 0;'
        : '';
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        referrerpolicy: 'no-referrer',
        style: `max-width: 100%; height: auto; display: block; ${alignMargin}`,
        class: 'max-w-full max-h-[420px] rounded-xl my-3 object-contain border border-black/10 shadow-xs block',
      }),
    ];
  },
});

const TextAlignExtension = Extension.create({
  name: 'textAlign',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'listItem'],
        attributes: {
          textAlign: {
            default: 'left',
            parseHTML: (element) => (element as HTMLElement).style.textAlign || 'left',
            renderHTML: (attributes) => {
              if (!attributes.textAlign || attributes.textAlign === 'left') {
                return {};
              }
              return { style: `text-align: ${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
});

const IMAGE_URL_EXT_REGEX = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?|#|$)/i;

function isLikelyImageUrl(url: string): boolean {
  const clean = url.trim();
  return /^data:image\//i.test(clean) || IMAGE_URL_EXT_REGEX.test(clean);
}

function compressNoteImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const rawUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 960;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/webp', 0.82);
        if (compressed && compressed.startsWith('data:image/webp')) {
          resolve(compressed);
        } else {
          resolve(canvas.toDataURL('image/jpeg', 0.84));
        }
      };
      img.onerror = () => resolve(rawUrl);
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

const MenuBar = ({ editor, statusActions }: { editor: any; statusActions?: React.ReactNode }) => {
  const [openMenu, setOpenMenu] = useState<'size' | 'color' | 'photo' | 'link' | null>(null);
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkTextInput, setLinkTextInput] = useState('');

  const toolbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const activeFontAttrs = editor.getAttributes('fontSize') || {};
  const activePreset =
    NOTEPAD_FONT_PRESETS.find((p) => p.fontSize && p.fontSize === activeFontAttrs.size) ||
    NOTEPAD_FONT_PRESETS[NOTEPAD_FONT_PRESETS.length - 1];

  const activeColorAttrs = editor.getAttributes('textColor') || {};
  const activeColor: string = activeColorAttrs.color || '';

  const activeAlign: 'left' | 'center' | 'right' =
    editor.getAttributes('paragraph')?.textAlign ||
    editor.getAttributes('heading')?.textAlign ||
    editor.getAttributes('listItem')?.textAlign ||
    editor.getAttributes('noteImage')?.textAlign ||
    'left';

  const applyTextAlign = (alignment: 'left' | 'center' | 'right') => {
    editor
      .chain()
      .focus()
      .command(({ tr, state }) => {
        const { from, to } = state.selection;
        let updated = false;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (['paragraph', 'heading', 'listItem', 'noteImage'].includes(node.type.name)) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, textAlign: alignment });
            updated = true;
          }
        });
        return updated;
      })
      .run();
  };

  const applyFontPreset = (preset: NotepadFontPreset) => {
    if (!preset.fontSize) {
      editor.chain().focus().unsetMark('fontSize').run();
    } else {
      editor
        .chain()
        .focus()
        .setMark('fontSize', { size: preset.fontSize, weight: preset.fontWeight })
        .run();
    }
    setOpenMenu(null);
  };

  const applyTextColor = (colorValue: string) => {
    if (!colorValue) {
      editor.chain().focus().unsetMark('textColor').run();
    } else {
      editor.chain().focus().setMark('textColor', { color: colorValue }).run();
    }
    setOpenMenu(null);
  };

  const insertPhotoSrc = (src: string) => {
    const clean = src.trim();
    if (!clean) return;
    editor
      .chain()
      .focus()
      .insertContent([
        { type: 'noteImage', attrs: { src: clean, alt: 'Note photo' } },
        { type: 'paragraph' },
      ])
      .run();
    setOpenMenu(null);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await compressNoteImageDataUrl(file);
      insertPhotoSrc(dataUrl);
    } catch (err) {
      console.error('Failed to add photo to note', err);
    }
  };

  const openLinkPopover = () => {
    if (openMenu === 'link') {
      setOpenMenu(null);
      return;
    }
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    const currentHref = editor.getAttributes('link')?.href || '';
    setLinkTextInput(selectedText);
    setLinkUrlInput(currentHref);
    setOpenMenu('link');
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    let url = linkUrlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url) && !/^data:image\//i.test(url)) {
      url = `https://${url}`;
    }

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    const displayText = linkTextInput.trim() || url;
    const knownPhotoLink = isLikelyImageUrl(url);

    const contentToInsert: any[] = [
      {
        type: 'text',
        text: displayText,
        marks: [{ type: 'link', attrs: { href: url } }],
      },
      { type: 'text', text: ' ' },
    ];

    if (hasSelection) {
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(contentToInsert)
        .run();
    } else {
      editor.chain().focus().insertContent(contentToInsert).run();
    }

    if (knownPhotoLink) {
      editor
        .chain()
        .focus()
        .insertContent([
          { type: 'noteImage', attrs: { src: url, alt: displayText } },
          { type: 'paragraph' },
        ])
        .run();
    } else if (/^https?:\/\//i.test(url)) {
      const probe = new window.Image();
      probe.referrerPolicy = 'no-referrer';
      probe.onload = () => {
        if (probe.naturalWidth > 0 && !editor.isDestroyed) {
          editor
            .chain()
            .focus()
            .insertContent([
              { type: 'noteImage', attrs: { src: url, alt: displayText } },
              { type: 'paragraph' },
            ])
            .run();
        }
      };
      probe.src = url;
    }

    setLinkUrlInput('');
    setLinkTextInput('');
    setOpenMenu(null);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkUrlInput('');
    setLinkTextInput('');
    setOpenMenu(null);
  };

  return (
    <div
      ref={toolbarRef}
      className="flex flex-wrap items-center justify-between gap-2 mb-4 pt-1 pb-2.5 border-b border-black/10 sticky top-[7.5rem] z-10 bg-white w-full"
    >
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {/* Microsoft Notepad-style Font Size Presets ("Aa" design) */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpenMenu((prev) => (prev === 'size' ? null : 'size'))}
          className="h-9 lg:h-8 px-2.5 rounded-lg border border-black/10 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          title="Font Size"
        >
          <span className="text-[13px] font-black tracking-tight text-indigo-600 shrink-0 leading-none">
            Aa
          </span>
          <span className="min-w-[66px] text-left truncate">{activePreset.label}</span>
          <ChevronDown size={13} className="opacity-60 shrink-0" />
        </button>

        {openMenu === 'size' && (
          <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-black/10 shadow-xl py-1.5 z-40">
            {NOTEPAD_FONT_PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFontPreset(preset)}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span
                    style={{
                      fontSize: preset.previewSize,
                      fontWeight: preset.fontWeight || '400',
                      lineHeight: 1.25,
                    }}
                  >
                    {preset.label}
                  </span>
                  {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Text Color Picker ("A" without underline) */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpenMenu((prev) => (prev === 'color' ? null : 'color'))}
          className="h-9 lg:h-8 px-2.5 rounded-lg border border-black/10 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          title="Text Color"
        >
          <span
            className="text-[14px] font-black leading-none"
            style={{ color: activeColor || '#0f172a' }}
          >
            A
          </span>
          <ChevronDown size={13} className="opacity-60 shrink-0" />
        </button>

        {openMenu === 'color' && (
          <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl bg-white border border-black/10 shadow-xl p-3 z-40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Palette size={11} />
                Text Color
              </span>
              {activeColor && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextColor('')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1.5 mb-2.5">
              {TEXT_COLOR_PALETTE.map((swatch) => {
                const swatchColor = swatch.value || '#0f172a';
                const isSelected =
                  (!swatch.value && !activeColor) ||
                  (swatch.value && activeColor.toLowerCase() === swatch.value.toLowerCase());
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyTextColor(swatch.value)}
                    title={swatch.label}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 border-white' : 'border-black/15'
                    }`}
                    style={{ backgroundColor: swatchColor }}
                  >
                    {isSelected && <Check size={11} className="text-white" style={{ stroke: '#ffffff' }} />}
                  </button>
                );
              })}
            </div>
            <label className="flex items-center justify-between gap-2 pt-2 border-t border-black/10 cursor-pointer">
              <span className="text-[11px] font-semibold text-slate-700">Custom Color</span>
              <input
                type="color"
                value={activeColor.startsWith('#') ? activeColor : '#2563eb'}
                onChange={(e) => applyTextColor(e.target.value)}
                className="w-7 h-6 rounded border border-black/15 cursor-pointer bg-transparent p-0"
              />
            </label>
          </div>
        )}
      </div>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Bold / Italic / Underline */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('bold') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Bold"
      >
        <Bold size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('italic') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Italic"
      >
        <Italic size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('underline') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Underline"
      >
        <UnderlineIcon size={17} />
      </button>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Bullet List & Numbered List */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('bulletList') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('orderedList') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Text Align: Left / Center / Right */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign('left')}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          activeAlign === 'left' ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Align Left"
      >
        <AlignLeft size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign('center')}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          activeAlign === 'center' ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Align Center"
      >
        <AlignCenter size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign('right')}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          activeAlign === 'right' ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title="Align Right"
      >
        <AlignRight size={17} />
      </button>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Add Photo */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpenMenu((prev) => (prev === 'photo' ? null : 'photo'))}
          className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
            openMenu === 'photo' ? 'bg-black/10' : 'hover:bg-black/5 opacity-75 hover:opacity-100'
          }`}
          title="Add Photo"
        >
          <ImagePlus size={17} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoFileChange}
          className="hidden"
        />

        {openMenu === 'photo' && (
          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-52 rounded-xl bg-white border border-black/10 shadow-xl p-3 z-40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Add Photo
              </span>
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="p-0.5 rounded hover:bg-black/5 text-slate-400 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload size={14} />
              <span>Upload Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Link */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkPopover}
          className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
            editor.isActive('link') || openMenu === 'link'
              ? 'bg-black/10 text-indigo-600'
              : 'hover:bg-black/5 opacity-75 hover:opacity-100'
          }`}
          title="Add Link"
        >
          <Link2 size={17} />
        </button>

        {openMenu === 'link' && (
          <form
            onSubmit={handleApplyLink}
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-64 rounded-xl bg-white border border-black/10 shadow-xl p-3 z-40 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Add Link
              </span>
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="p-0.5 rounded hover:bg-black/5 text-slate-400 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
            <input
              type="text"
              value={linkTextInput}
              onChange={(e) => setLinkTextInput(e.target.value)}
              placeholder="Enter link text"
              autoFocus
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-black/15 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <input
              type="text"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              placeholder="Enter link"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-black/15 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <div className="flex items-center justify-end gap-1.5 pt-1">
              {editor.isActive('link') && (
                <button
                  type="button"
                  onClick={handleRemoveLink}
                  className="mr-auto px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Unlink size={12} />
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!linkUrlInput.trim()}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold disabled:opacity-45 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>
        )}
      </div>
      </div>

      {statusActions && (
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          {statusActions}
        </div>
      )}
    </div>
  );
};

const Extensions = [
  StarterKit.configure({
    underline: false,
    link: {
      openOnClick: true,
      autolink: true,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'text-indigo-600 underline hover:text-indigo-800 cursor-pointer',
      },
    },
  }),
  Underline,
  TextColorMark,
  FontSizeMark,
  TextAlignExtension,
  ImageNode,
];

export default function TipTapEditor({ content, onChange, statusActions }: TipTapEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: Extensions,
    content,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'prose-mirror focus:outline-none min-h-[320px] text-[15px] leading-relaxed font-sans text-slate-900',
        style: 'font-family: Arial, Helvetica, sans-serif; color: #0f172a;',
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const isEditorEmpty = editor.isEmpty || editor.getHTML() === '<p></p>' || editor.getHTML() === '<p><br></p>';
    const isContentEmpty = !content || content === '<p></p>' || content === '<p><br></p>';

    if (isEditorEmpty && isContentEmpty) return;

    if (content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col flex-1 font-sans mt-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <MenuBar editor={editor} statusActions={statusActions} />
      <div className="flex-1 pb-12" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
