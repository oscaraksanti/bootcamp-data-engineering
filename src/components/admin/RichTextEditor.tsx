"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export function RichTextEditor({
  name,
  initialHtml,
}: {
  name: string;
  initialHtml?: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, ImageExtension, LinkExtension.configure({ openOnClick: false })],
    content: initialHtml || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (hiddenInputRef.current) hiddenInputRef.current.value = editor.getHTML();
    },
  });

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const supabase = createClient();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("lesson-media").upload(path, file);
    if (error) {
      alert(`Échec de l'upload : ${error.message}`);
      return;
    }
    const { data } = supabase.storage.from("lesson-media").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
    if (hiddenInputRef.current) hiddenInputRef.current.value = editor.getHTML();
    e.target.value = "";
  }

  return (
    <div className="border border-line-strong rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 border-b border-line bg-surface-2 px-2 py-1.5 flex-wrap">
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")}>
          Gras
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")}>
          Italique
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor?.isActive("heading", { level: 3 })}
        >
          Titre
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")}>
          Liste
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("URL du lien :");
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          active={editor?.isActive("link")}
        >
          Lien
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()}>Image</ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-3.5 py-3 min-h-[220px] text-ink [&_.ProseMirror]:outline-none [&_img]:rounded-lg [&_img]:max-w-full"
      />
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={initialHtml ?? ""} />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-medium rounded-md px-2.5 py-1.5 ${
        active ? "bg-accent-soft text-accent-ink" : "text-ink-soft hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}
