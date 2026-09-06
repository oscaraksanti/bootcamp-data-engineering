"use client";

import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";

export function SqlCode({ text, caption }: { text: string; caption?: string }) {
  return (
    <div className="my-4 border border-line rounded-lg overflow-hidden">
      <CodeMirror
        value={text}
        editable={false}
        theme={oneDark}
        extensions={[sql({ dialect: PostgreSQL }), EditorView.editable.of(false)]}
        basicSetup={{ lineNumbers: false, foldGutter: false, highlightActiveLine: false }}
        style={{ fontSize: 13 }}
      />
      {caption && (
        <p className="text-[11.5px] text-ink-faint px-3.5 py-2 border-t border-line bg-surface-2">{caption}</p>
      )}
    </div>
  );
}
