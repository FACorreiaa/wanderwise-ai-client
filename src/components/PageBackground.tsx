export default function PageBackground() {
  return (
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div class="absolute -right-40 top-24 h-[34rem] w-[34rem] rounded-full border border-[hsl(var(--map-line)/0.24)]" />
      <div class="absolute -right-24 top-40 h-[25rem] w-[25rem] rounded-full border border-[hsl(var(--map-line)/0.2)]" />
      <div class="absolute -right-8 top-56 h-[16rem] w-[16rem] rounded-full border border-[hsl(var(--map-line)/0.18)]" />
      <div class="absolute -left-52 top-[42rem] h-[30rem] w-[30rem] rounded-[46%] border border-[hsl(var(--map-line)/0.18)] rotate-12" />
      <div class="absolute -left-36 top-[47rem] h-[20rem] w-[20rem] rounded-[44%] border border-[hsl(var(--map-line)/0.16)] rotate-12" />
    </div>
  );
}
