// src/components/BlockNote.tsx
"use client";

import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import * as React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import { MantineProvider } from "@mantine/core";
import type { UploadResult } from "@/lib/utils/s3Helper";

type Props = {
  initialContent?: PartialBlock[];
  onChange?: (doc: PartialBlock[]) => void;
  editable?: boolean;

  /**
   * Upload handler must return full UploadResult.
   * BlockNote will use result.url to render, and will inject result into block props.
   */
  uploadFile?: (file: File) => Promise<UploadResult>;
};

function injectAssetsIntoBlocks(blocks: PartialBlock[], urlToAsset: Map<string, UploadResult>): PartialBlock[] {
  const walk = (b: PartialBlock[]): PartialBlock[] =>
    b.map((block) => {
      const next: PartialBlock = {
        ...block,
        props: { ...(block.props as any) },
        children: Array.isArray((block as any).children) ? walk((block as any).children) : [],
      };

      // BlockNote media blocks typically store URL on props.url
      const props: any = next.props || {};
      const url: string | undefined = typeof props.url === "string" ? props.url : undefined;

      // Inject full asset shape if we have it and it's not already present
      if (url && !props.asset) {
        const asset = urlToAsset.get(url);
        if (asset) {
          props.asset = asset;
          next.props = props;
        }
      }

      return next;
    });

  return walk(blocks);
}

export default function BlockNote({ initialContent, onChange, editable = true, uploadFile }: Props) {
  // Cache uploaded assets by URL so we can inject the full shape back into JSON
  const urlToAssetRef = React.useRef<Map<string, UploadResult>>(new Map());

  const editor = useCreateBlockNote({
    initialContent: initialContent ?? undefined,
    uploadFile: async (file) => {
      if (!uploadFile) {
        throw new Error("Uploads are disabled (no uploadFile handler provided).");
      }
      const result = await uploadFile(file);
      urlToAssetRef.current.set(result.url, result);
      return result.url; // BlockNote requires a URL string
    },
  });

  React.useEffect(() => {
    if (!onChange) return;

    const unsubscribe = editor.onChange(() => {
      const raw = editor.document as PartialBlock[];
      const withAssets = injectAssetsIntoBlocks(raw, urlToAssetRef.current);
      onChange(withAssets);
    });

    return () => unsubscribe();
  }, [editor, onChange]);

  return (
    <MantineProvider defaultColorScheme="light">
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
