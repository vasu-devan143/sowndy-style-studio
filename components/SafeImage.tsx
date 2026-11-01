type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function SafeImage({ src, alt, className }: Props) {
  if (!src) {
    return <div className={`bg-cream-dark ${className ?? ""}`} aria-hidden />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
