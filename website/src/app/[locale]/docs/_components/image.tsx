import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface DocsImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
  alt: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  className?: string;
  fill?: boolean | undefined;
  //　loader?: import("../shared/lib/get-img-props").ImageLoader | undefined;
  quality?: number | `${number}` | undefined;
  priority?: boolean | undefined;
  loading?: "eager" | "lazy" | undefined;
  //   placeholder?: PlaceholderValue | undefined;
  blurDataURL?: string | undefined;
  unoptimized?: boolean | undefined;
  overrideSrc?: string | undefined;
  //   onLoadingComplete?: OnLoadingComplete | undefined;
  layout?: string | undefined;
  objectFit?: string | undefined;
  objectPosition?: string | undefined;
  lazyBoundary?: string | undefined;
  lazyRoot?: string | undefined;
}

function DocsImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: DocsImageProps) {
  return (
    <Image
      className={cn("rounded-lg drop-shadow-lg", className)}
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
}

export default DocsImage;
