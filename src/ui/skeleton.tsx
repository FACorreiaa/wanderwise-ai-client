import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "@/lib/utils";

const Skeleton: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return <div class={cn("animate-pulse rounded-md bg-primary/10", props.class)} {...rest} />;
};

export { Skeleton };
