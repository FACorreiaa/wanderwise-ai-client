import { cn } from "~/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
    TooltipContentProps,
    TooltipRootProps,
} from "@kobalte/core/tooltip";
import { Tooltip as TooltipPrimitive } from "@kobalte/core/tooltip";
import { type ValidComponent, mergeProps, splitProps } from "solid-js";

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const Tooltip = (props: TooltipRootProps) => {
    const merge = mergeProps<TooltipRootProps[]>(
        { gutter: 4, flip: false },
        props,
    );
    return <TooltipPrimitive {...merge} />;
};

type tooltipContentProps<T extends ValidComponent = "div"> =
    TooltipContentProps<T> & {
        class?: string;
    };

export const TooltipContent = <T extends ValidComponent = "div">(
    props: PolymorphicProps<T, tooltipContentProps<T>>,
) => {
    const [local, rest] = splitProps(props as tooltipContentProps, ["class"]);

    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                class={cn(
                    "z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs font-medium",
                    // Theme-aware styling
                    "bg-primary text-primary-foreground",
                    "border border-border",
                    "shadow-md",
                    // Animations
                    "data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95",
                    "data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95",
                    local.class,
                )}
                {...rest}
            />
        </TooltipPrimitive.Portal>
    );
};
