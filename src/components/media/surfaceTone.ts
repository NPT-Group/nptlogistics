import type { ImageProps } from "next/image";

export type SurfaceTone = "auto" | "none" | "light" | "dark";
export type ResolvedSurfaceTone = Exclude<SurfaceTone, "auto">;

function getSrcString(src: ImageProps["src"]): string | null {
  if (typeof src === "string") return src;
  if (src && typeof src === "object" && "src" in src && typeof src.src === "string") {
    return src.src;
  }
  return null;
}

export function resolveSurfaceTone(
  surfaceTone: SurfaceTone,
  src: ImageProps["src"],
): ResolvedSurfaceTone {
  if (surfaceTone !== "auto") return surfaceTone;

  const srcValue = getSrcString(src);
  if (!srcValue) return "light";

  const pathname = srcValue.split("#")[0]?.split("?")[0]?.toLowerCase() ?? "";

  if (pathname.endsWith(".png") || pathname.endsWith(".svg") || pathname.endsWith(".webp")) {
    return "none";
  }

  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
    return "light";
  }

  return "light";
}
