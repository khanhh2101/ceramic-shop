import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import toast from 'react-hot-toast';
import { uploadImageToMinio } from '@/utils/upload';
import { 
  MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatStrikethrough,
  MdFormatListBulleted, MdFormatListNumbered, MdFormatQuote, 
  MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify,
  MdLink, MdLinkOff, MdFormatColorText, MdHighlight,
  MdUndo, MdRedo, MdImage 
} from 'react-icons/md';

const MenuBar = ({ editor }) => {
  const fileInputRef = useRef(null);

  if (!editor) {
    return null;
  }

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const toastId = toast.loading('Đang tải ảnh lên...');
      try {
        const url = await uploadImageToMinio(file);
        editor.chain().focus().setImage({ src: url }).run();
        toast.success('Tải ảnh thành công', { id: toastId });
      } catch (error) {
        toast.error('Lỗi khi tải ảnh', { id: toastId });
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('bold') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="In đậm"
      >
        <MdFormatBold size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('italic') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="In nghiêng"
      >
        <MdFormatItalic size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('strike') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Gạch ngang"
      >
        <MdFormatStrikethrough size={20} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <input
        type="color"
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-7 h-7 p-0 border-0 mx-1 rounded cursor-pointer bg-transparent"
        title="Màu chữ"
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('highlight') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Đánh dấu (Highlight)"
      >
        <MdHighlight size={20} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-primary-600' : ''}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-primary-600' : ''}`}
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Danh sách không thứ tự"
      >
        <MdFormatListBulleted size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Danh sách có thứ tự"
      >
        <MdFormatListNumbered size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Trích dẫn"
      >
        <MdFormatQuote size={20} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Căn trái"
      >
        <MdFormatAlignLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Căn giữa"
      >
        <MdFormatAlignCenter size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Căn phải"
      >
        <MdFormatAlignRight size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Căn đều"
      >
        <MdFormatAlignJustify size={20} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Nhập đường dẫn liên kết:', previousUrl);
          
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={`p-1.5 rounded hover:bg-gray-200 text-gray-700 ${editor.isActive('link') ? 'bg-gray-200 text-primary-600' : ''}`}
        title="Chèn Link"
      >
        <MdLink size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
        title="Gỡ Link"
      >
        <MdLinkOff size={20} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
        title="Chèn ảnh"
      >
        <MdImage size={20} />
      </button>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={addImage} 
        className="hidden" 
      />

      <div className="flex-grow"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        <MdUndo size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        <MdRedo size={20} />
      </button>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder = 'Nhập nội dung...' }) => {
  
  // Custom logic xử lý sự kiện dán (Paste) và kéo thả (Drop) ảnh
  const handleDropAndPaste = useCallback((view, event, slice, moved) => {
    let files = [];

    // Xử lý Paste
    if (event.clipboardData && event.clipboardData.files.length > 0) {
      files = Array.from(event.clipboardData.files);
    }
    
    // Xử lý Drop
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      files = Array.from(event.dataTransfer.files);
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      event.preventDefault(); // Ngăn hành vi mặc định (ví dụ base64)

      // Xử lý từng ảnh
      imageFiles.forEach(async (file) => {
        const toastId = toast.loading('Đang tải ảnh lên...');
        try {
          const url = await uploadImageToMinio(file);
          
          // Chèn ảnh vào vị trí con trỏ hiện tại
          const { schema } = view.state;
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
          
          const node = schema.nodes.image.create({ src: url });
          const transaction = view.state.tr.insert(coordinates?.pos || view.state.selection.to, node);
          view.dispatch(transaction);

          toast.success('Tải ảnh thành công', { id: toastId });
        } catch (error) {
          toast.error('Lỗi khi tải ảnh', { id: toastId });
        }
      });
      return true; // Báo hiệu đã xử lý xong event
    }
    
    return false; // Để Tiptap xử lý tiếp (nếu dán text thường)
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 rounded px-1',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#b5624a] underline cursor-pointer',
        },
      }),
      ImageResize.configure({
        inline: true,
        allowBase64: false, // Bắt buộc dùng URL
        HTMLAttributes: {
          class: 'rounded-md shadow-sm border border-gray-100',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base prose-p:my-1 prose-headings:my-2 prose-li:my-0 focus:outline-none min-h-[300px] max-w-none p-4',
      },
      handlePaste: handleDropAndPaste,
      handleDrop: handleDropAndPaste,
    },
  });

  // Đồng bộ props.value -> Editor content (khi edit có API trả về)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <div className="max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
