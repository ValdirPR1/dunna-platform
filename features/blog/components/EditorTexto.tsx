"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  conteudo: string;
  onChange: (html: string) => void;
}

export default function EditorTexto({ conteudo, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      ImageExtension,
    ],
    content: conteudo,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[320px] rounded-b-xl border border-t-0 border-slate-200 bg-white p-5 font-sans outline-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  function Botao({
    onClick,
    ativo,
    children,
    titulo,
  }: {
    onClick: () => void;
    ativo?: boolean;
    children: React.ReactNode;
    titulo: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={titulo}
        className={`rounded-lg p-2 transition ${
          ativo
            ? "bg-navy text-white"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        {children}
      </button>
    );
  }

  function adicionarLink() {
    const url = window.prompt("Cole o link:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }

  function adicionarImagem() {
    const url = window.prompt("Cole o link da imagem:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div>

      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-slate-200 bg-slate-50 p-2">

        <Botao
          onClick={() => editor.chain().focus().toggleBold().run()}
          ativo={editor.isActive("bold")}
          titulo="Negrito"
        >
          <Bold size={17} />
        </Botao>

        <Botao
          onClick={() => editor.chain().focus().toggleItalic().run()}
          ativo={editor.isActive("italic")}
          titulo="Itálico"
        >
          <Italic size={17} />
        </Botao>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <Botao
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          ativo={editor.isActive("heading", { level: 2 })}
          titulo="Título"
        >
          <Heading2 size={17} />
        </Botao>

        <Botao
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          ativo={editor.isActive("heading", { level: 3 })}
          titulo="Subtítulo"
        >
          <Heading3 size={17} />
        </Botao>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <Botao
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          ativo={editor.isActive("bulletList")}
          titulo="Lista"
        >
          <List size={17} />
        </Botao>

        <Botao
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          ativo={editor.isActive("orderedList")}
          titulo="Lista numerada"
        >
          <ListOrdered size={17} />
        </Botao>

        <Botao
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          ativo={editor.isActive("blockquote")}
          titulo="Citação"
        >
          <Quote size={17} />
        </Botao>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <Botao onClick={adicionarLink} titulo="Link">
          <LinkIcon size={17} />
        </Botao>

        <Botao onClick={adicionarImagem} titulo="Imagem">
          <ImageIcon size={17} />
        </Botao>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <Botao onClick={() => editor.chain().focus().undo().run()} titulo="Desfazer">
          <Undo size={17} />
        </Botao>

        <Botao onClick={() => editor.chain().focus().redo().run()} titulo="Refazer">
          <Redo size={17} />
        </Botao>

      </div>

      <EditorContent editor={editor} />

    </div>
  );
}
