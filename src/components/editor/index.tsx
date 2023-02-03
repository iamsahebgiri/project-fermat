import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import React from "react";
import MenuBar from "./menu-bar";

const Editor = ({ onChange, content, label, helperText }: any) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class: "prose max-w-none p-4 prose-slate dark:prose-dark outline-none",
      },
    },
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <>
      <div>
        {label && (
          <label className="block font-medium text-md text-gray-700">
            {label}
          </label>
        )}
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
      <div className="shadow-sm  block w-full sm:text-sm border border-gray-300 rounded-md mt-1">
        <div className="p-1 border-b">
          <MenuBar editor={editor} />
        </div>
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Editor;
