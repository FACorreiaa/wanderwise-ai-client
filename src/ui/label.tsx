import { cn } from "~/lib/utils";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

type LabelProps = ComponentProps<"label"> & {
    class?: string;
};

export const Label = (props: LabelProps) => {
    const [local, rest] = splitProps(props, ["class"]);

    return (
        <label
            class={cn(
                "text-sm font-medium leading-none",
                "text-foreground",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                local.class,
            )}
            {...rest}
        />
    );
};
