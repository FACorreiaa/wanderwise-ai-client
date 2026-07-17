/** Shimmer placeholder mirroring StopCard's exact geometry so the
 *  skeleton → enriched swap causes zero layout shift. */
export default function StopCardSkeleton(props: { index?: number }) {
  return (
    <div
      class="editorial-card stop-enter p-3 sm:p-4 flex gap-4"
      style={{ "--i": String(props.index ?? 0) }}
    >
      <div class="shimmer shrink-0 rounded-xl w-[88px] h-[88px] sm:w-28 sm:h-28" />
      <div class="flex-1 min-w-0 py-1 space-y-2.5">
        <div class="shimmer h-2.5 w-20 rounded-full" />
        <div class="shimmer h-4 w-2/3 rounded-md" />
        <div class="shimmer h-3 w-full rounded-full" />
        <div class="shimmer h-3 w-4/5 rounded-full" />
        <div class="flex gap-2 pt-1">
          <div class="shimmer h-3 w-14 rounded-full" />
          <div class="shimmer h-3 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
