import { cn } from "~/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
    PopoverContentProps,
    PopoverRootProps,
} from "@kobalte/core/popover";
import { Popover as PopoverPrimitive } from "@kobalte/core/popover";
import type { ParentProps, ValidComponent } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverTitle = PopoverPrimitive.Title;
export const PopoverDescription = PopoverPrimitive.Description;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const Popover = (props: PopoverRootProps) => {
    const merge = mergeProps<PopoverRootProps[]>(
        { gutter: 4, flip: false },
        props,
    );
    return <PopoverPrimitive {...merge} />;
};

type popoverContentProps<T extends ValidComponent = "div"> = ParentProps<
    PopoverContentProps<T> & {
        class?: string;
    }
>;

export const PopoverContent = <T extends ValidComponent = "div">(
    props: PolymorphicProps<T, popoverContentProps<T>>,
) => {
    const [local, rest] = splitProps(props as popoverContentProps, [
        "class",
        "children",
    ]);

    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                class={cn(
                    "z-50 w-72 rounded-md p-4 outline-none",
                    // Theme-aware styling
                    "bg-popover text-popover-foreground",
                    "border border-border",
                    "shadow-md",
                    // Animations
                    "data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95",
                    "data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95",
                    local.class,
                )}
                {...rest}
            >
                {local.children}
                <PopoverPrimitive.CloseButton
                    class={cn(
                        "absolute right-3 top-3 rounded-sm p-1",
                        "opacity-70 transition-opacity hover:opacity-100",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "disabled:pointer-events-none",
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="h-3 w-3"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18 6L6 18M6 6l12 12"
                        />
                        <title>Close</title>
                    </svg>
                </PopoverPrimitive.CloseButton>
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
    );
};
