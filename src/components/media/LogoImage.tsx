import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

type LogoImageProps = Omit<ImageProps, "sizes" | "quality" | "alt"> & {
  alt: string;
  className?: string;
  wrapperClassName?: string;
  quality?: number;
  sizes?: string;
  surfaceTone?: "none" | "light" | "dark";
};

export function LogoImage({
  alt,
  className,
  wrapperClassName,
  quality = 90,
  sizes = "(min-width: 1024px) 160px, 120px",
  surfaceTone = "none",
  ...props
}: LogoImageProps) {
  const surfaceClass =
    surfaceTone === "none"
      ? undefined
      : surfaceTone === "dark"
        ? "bg-[color:var(--color-surface-1)]"
        : "bg-[color:var(--color-surface-1-light)]";

  if (props.fill) {
    return (
      <div className={cn("relative overflow-hidden", surfaceClass, "h-full w-full", wrapperClassName)}>
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
