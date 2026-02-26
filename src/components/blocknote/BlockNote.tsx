// src/components/BlockNote.tsx
"use client";

import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import "./blocknote.css";
import * as React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import { MantineProvider } from "@mantine/core";

import type { IFileAsset } from "@/types/shared.types";
import { isTempKey } from "@/lib/utils/s3Helper/shared";

type Props = {
  initialContent?: PartialBlock[];
  onChange?: (doc: PartialBlock[]) => void;
  editable?: boolean;

  /**
   * Upload handler must return an IFileAsset.
   * BlockNote will use asset.url to render, and we'll inject the asset into block props.
   *
   * IMPORTANT: callers should use `uploadToS3PresignedPublic(...)` and return its result.
   */
  uploadFile?: (file: File) => Promise<IFileAsset>;

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
  urlToAsset: Map<string, IFileAsset>,
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

      // If we have a url and no asset yet, inject it
      if (url && !props.asset) {
        const asset = urlToAsset.get(url);
        if (asset) props.asset = asset;
      }

      // If asset exists, ensure props.url matches the asset's url
      if (props.asset && typeof props.asset.url === "string" && props.asset.url) {
        if (typeof props.url !== "string" || props.url !== props.asset.url) {
          props.url = props.asset.url;
        }
      }

      // Soft guard: if asset says it's FINAL but url doesn't match, prefer asset.url.
      // (No `publicUrlForKey` on the client; the server/client upload already returns the canonical URL.)
      if (props.asset?.s3Key && !isTempKey(props.asset.s3Key) && props.asset?.url) {
        props.url = props.asset.url;
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
  const urlToAssetRef = React.useRef<Map<string, IFileAsset>>(new Map());

  const editor = useCreateBlockNote({
    initialContent: initialContent ?? undefined,
    uploadFile: async (file) => {
      if (!uploadFile) throw new Error("Uploads are disabled (no uploadFile handler provided).");

      const asset = await uploadFile(file);

      // Map by URL so we can inject later when BlockNote only stores the URL in props
      if (asset?.url) urlToAssetRef.current.set(asset.url, asset);

      return asset.url;
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
      <div className="bn-scope w-full min-w-0">
        <div
          className={["w-full min-w-0", editable ? "bn-editable" : "bn-readonly", chrome?.className]
            .filter(Boolean)
            .join(" ")}
          style={{
            ...(chrome?.style ?? {}),
            borderColor,
            background,
          }}
        >
          <BlockNoteView editor={editor} editable={editable} theme="light" />
        </div>
      </div>
    </MantineProvider>
  );
}
