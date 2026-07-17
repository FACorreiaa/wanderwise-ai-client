import { type JSX } from "solid-js";
import { useInView } from "~/lib/hooks/useInView";

/**
 * RouteStop is one node on the page's route spine: a marker on the rail plus
 * a body that reveals as it scrolls into view. The composer's scroll handler
 * toggles `.is-lit` on the marker; the reveal is self-contained here.
 */
export default function RouteStop(props: { id?: string; children: JSX.Element; class?: string }) {
  const { ref, inView } = useInView();
  return (
    <section id={props.id} class={`route-stop relative ${props.class ?? ""}`}>
      <span class="route-stop-mark" aria-hidden="true" />
      <div ref={ref} class="reveal" classList={{ "is-in": inView() }}>
        {props.children}
      </div>
    </section>
  );
}
