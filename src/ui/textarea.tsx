import { cn } from "~/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { TextFieldTextAreaProps } from "@kobalte/core/text-field";
import { TextField as TextFieldPrimitive } from "@kobalte/core/text-field";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

type textAreaProps<T extends ValidComponent = "textarea"> = VoidProps<
    TextFieldTextAreaProps<T> & {
        class?: string;
    }
>;

export const TextArea = <T extends ValidComponent = "textarea">(
    props: PolymorphicProps<T, textAreaProps<T>>,
) => {
    const [local, rest] = splitProps(props as textAreaProps, ["class"]);

    return (
        <TextFieldPrimitive.TextArea
            class={cn(
                "flex min-h-[80px] w-full rounded-lg px-3 py-2 text-sm transition-shadow resize-none",
                // Theme-aware styling
                "border border-input bg-background text-foreground",
                "shadow-sm",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                local.class,
            )}
            {...rest}
        />
    );
};
