import { Button } from "@/ui/button";
import { createSignal } from "solid-js";


export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <Button
      variant="default"
      size="lg"
      onClick={() => setCount(count() + 1)}
    >
      Clicks: {count()}
    </Button>
  );
}
