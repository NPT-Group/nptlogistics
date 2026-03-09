import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

type HeroImageProps = Omit<
  ImageProps,
  "alt" | "sizes" | "quality" | "fill" | "width" | "height"
> & {
  alt: string;
  className?: string;
  wrapperClassName?: string;
  surfaceTone?: "none" | "light" | "dark";
  quality?: number;
  sizes?: string;
} & (
    | { fill: true; width?: never; height?: never; aspectRatioClassName?: string }
    | { fill?: false; width: number; height: number; aspectRatioClassName?: never }
  );

export function HeroImage({
  alt,
  className,
  wrapperClassName,
  surfaceTone = "none",
  quality = 84,
  sizes = "100vw",
  ...props
}: HeroImageProps) {
  const surfaceClass =
    surfaceTone === "none"
      ? undefined
      : surfaceTone === "dark"
        ? "bg-[color:var(--color-surface-1)]"
        : "bg-[color:var(--color-surface-1-light)]";

  if (!alt.trim()) {
    throw new Error("HeroImage requires a non-empty alt value.");
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
