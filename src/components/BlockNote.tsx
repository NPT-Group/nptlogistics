"use client";

import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import * as React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import { MantineProvider } from "@mantine/core";
import type { UploadResult } from "@/lib/utils/s3Helper";
import { useAdminTheme } from "@/components/admin/theme/AdminThemeProvider";

type Props = {
  initialContent?: PartialBlock[];
  onChange?: (doc: PartialBlock[]) => void;
  editable?: boolean;
  uploadFile?: (file: File) => Promise<UploadResult>;
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

export default function BlockNote({
  initialContent,
  onChange,
  editable = true,
  uploadFile,
}: Props) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

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

  return (
    <MantineProvider defaultColorScheme="light">
      <div className="bn-scope">
        <div
          className="rounded-3xl border p-4 shadow-[var(--dash-shadow)]/12"
          style={{
            borderColor: "var(--dash-border)",
            background: isDark ? "rgba(255,255,255,0.04)" : "white",
          }}
        >
          {/* Keep BlockNote itself on light theme for CSS stability */}
          <BlockNoteView editor={editor} editable={editable} theme="light" />
        </div>
      </div>
    </MantineProvider>
  );
}
