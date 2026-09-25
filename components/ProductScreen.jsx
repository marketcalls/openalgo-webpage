// Static product screenshot from public/screens/<id>.webp, referenced by URL
// string (never imported) so it adds nothing to the Worker bundle.
export default function ProductScreen({ id, alt, rounded = "rounded-2xl", className = "" }) {
  return (
    <div className={`overflow-hidden border bg-surface-low ${rounded} ${className}`}>
      <img
        src={`/screens/${id}.webp`}
        alt={alt}
        width={1538}
        height={945}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  )
}
