import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { resolveSurfaceTone, type SurfaceTone } from "./surfaceTone";

type SectionImageProps = Omit<
  ImageProps,
  "alt" | "sizes" | "quality" | "fill" | "width" | "height"
> & {
  alt: string;
  className?: string;
  wrapperClassName?: string;
  surfaceTone?: SurfaceTone;
  quality?: number;
  sizes?: string;
} & (
    | { fill: true; width?: never; height?: never; aspectRatioClassName?: string }
    | { fill?: false; width: number; height: number; aspectRatioClassName?: never }
  );

export function SectionImage({
  alt,
  className,
  wrapperClassName,
  surfaceTone = "auto",
  quality = 78,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  ...props
}: SectionImageProps) {
  const resolvedSurfaceTone = resolveSurfaceTone(surfaceTone, props.src);
  const surfaceClass =
    resolvedSurfaceTone === "none"
      ? undefined
      : resolvedSurfaceTone === "dark"
        ? "bg-[color:var(--color-surface-1)]"
        : "bg-[color:var(--color-surface-1-light)]";

  if (!alt.trim()) {
    throw new Error("SectionImage requires a non-empty alt value.");
  }

  if (props.fill) {
    return (
      <div
        className={cn(
          "relative overflow-hidden",
          surfaceClass,
          props.aspectRatioClassName ?? "h-full w-full",
          wrapperClassName,
        )}
      >
        <Image {...props} alt={alt} sizes={sizes} quality={quality} className={className} />
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      sizes={sizes}
      quality={quality}
      className={cn(surfaceClass, className)}
    />
  );
}
