import { isVideoSrc } from "@/lib/media";

type Props = {
  src: string;
  alt: string;
  className?: string;
  controls?: boolean;
};

export function SafeImage({ src, alt, className, controls }: Props) {
  if (!src) {
    return <div className={`bg-cream-dark ${className ?? ""}`} aria-hidden />;
  }
  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        className={className}
        muted={!controls}
        playsInline
        loop={!controls}
        autoPlay={!controls}
        controls={Boolean(controls)}
        aria-label={alt}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
