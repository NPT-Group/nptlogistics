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
   * BlockNote will use result.url to render, and we'll inject result into block props.
   */
  uploadFile?: (file: File) => Promise<UploadResult>;

  /**
   * Optional wrapper styling overrides (admin can pass these; public pages can ignore).
   */
  chrome?: {
    /** Outer wrapper class for the editor container */
    className?: string;
    /** Inline styles for the editor container */
    style?: React.CSSProperties;
    /** Border color (inline) */
    borderColor?: string;
    /** Background color (inline) */
    background?: string;
  };
};

function injectAssetsIntoBlocks(
  blocks: PartialBlock[],
  urlToAsset: Map<string, UploadResult>,
): PartialBlock[] {
  const walk = (b: PartialBlock[]): PartialBlock[] =>
    b.map((block) => {
      const next: PartialBlock = {
        ...block,
        props: { ...(block.props as any) },
        children: Array.isArray((block as any).children) ? walk((block as any).children) : [],
      };

      const props: any = next.props || {};
      const url: string | undefined = typeof props.url === "string" ? props.url : undefined;

      // If we have a url and no asset yet, inject it (your existing behavior)
      if (url && !props.asset) {
        const asset = urlToAsset.get(url);
        if (asset) {
          props.asset = asset;
        }
      }

      // if asset exists and has a better URL, ensure props.url matches it
      if (props.asset && typeof props.asset.url === "string" && props.asset.url) {
        if (typeof props.url !== "string" || props.url !== props.asset.url) {
          props.url = props.asset.url;
        }
      }

      next.props = props;
      return next;
    });

  return walk(blocks);
}

export default function BlockNote({
  initialContent,
  onChange,
  editable = true,
  uploadFile,
  chrome,
}: Props) {
  const urlToAssetRef = React.useRef<Map<string, UploadResult>>(new Map());

  const editor = useCreateBlockNote({
    initialContent: initialContent ?? undefined,
    uploadFile: async (file) => {
      if (!uploadFile) throw new Error("Uploads are disabled (no uploadFile handler provided).");
      const result = await uploadFile(file);
      urlToAssetRef.current.set(result.url, result);
      return result.url;
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

  const borderColor = chrome?.borderColor ?? "var(--dash-border)";
  const background = chrome?.background ?? "white";

  return (
    <MantineProvider defaultColorScheme="light">
      <div className="bn-scope">
        <div
          className={chrome?.className}
          style={{
            ...(chrome?.style ?? {}),
            borderColor,
            background,
          }}
        >
          {/* Keep BlockNote itself on light theme for CSS stability */}
          <BlockNoteView editor={editor} editable={editable} theme="light" />
        </div>
      </div>
    </MantineProvider>
  );
}
