/**
 * PageBackground is the app's ambient chrome: a faint cartographic contour
 * grid with a single soft accent wash, matching the landing redesign. It is
 * token-driven, so it adapts across the loci/classic/modern theme families
 * and light/dark without per-route color. Static — nothing to reduce for
 * prefers-reduced-motion.
 */
export default function PageBackground() {
  return (
    <div class="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* contour grid */}
      <div
        class="absolute inset-0"
        style={{
          "background-image":
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          "background-size": "48px 48px",
          "background-position": "-1px -1px",
          "-webkit-mask-image": "radial-gradient(115% 85% at 50% 0%, black 28%, transparent 72%)",
          "mask-image": "radial-gradient(115% 85% at 50% 0%, black 28%, transparent 72%)",
          opacity: "0.6",
        }}
      />
      {/* soft accent wash, top */}
      <div
        class="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 38% at 50% -4%, hsl(var(--accent) / 0.10), transparent 62%)",
        }}
      />
    </div>
  );
}
