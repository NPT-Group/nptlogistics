// src/components/BlockNote.tsx
"use client";

import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import * as React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import { MantineProvider } from "@mantine/core";

type Props = {
  initialContent?: PartialBlock[]; // JSON from DB
  onChange?: (doc: PartialBlock[]) => void;
  editable?: boolean;
};

async function uploadToYourServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/uploads", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");

  const data = (await res.json()) as { url: string };
  return data.url; // must be a public URL that the editor can load
}

export default function BlockNote({ initialContent, onChange, editable = true }: Props) {
  const editor = useCreateBlockNote({
    initialContent: initialContent ?? undefined,
    uploadFile: async (file) => {
      return await uploadToYourServer(file);
    },
    // BlockNote already includes the demo-style “+” inserter + 6-dot handle UI.
  });

  React.useEffect(() => {
    if (!onChange) return;

    const unsubscribe = editor.onChange(() => {
      // Persistable JSON (store this in your DB)
      onChange(editor.document as PartialBlock[]);
    });

    return () => unsubscribe();
  }, [editor, onChange]);

  return (
    <MantineProvider defaultColorScheme="light">
      {/* Scope wrapper: helpful if you later need scoped CSS overrides */}
      <div className="bn-scope">
        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            background: "white",
            padding: 18,
          }}
        >
          <BlockNoteView editor={editor} editable={editable} theme="light" />
        </div>
      </div>
    </MantineProvider>
  );
}
