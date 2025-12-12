import { cn } from "~/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { RadioGroupItemControlProps } from "@kobalte/core/radio-group";
import { RadioGroup as RadioGroupPrimitive } from "@kobalte/core/radio-group";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

export const RadioGroupDescription = RadioGroupPrimitive.Description;
export const RadioGroupErrorMessage = RadioGroupPrimitive.ErrorMessage;
export const RadioGroupItemDescription = RadioGroupPrimitive.ItemDescription;
export const RadioGroupItemInput = RadioGroupPrimitive.ItemInput;
export const RadioGroupItemLabel = RadioGroupPrimitive.ItemLabel;
export const RadioGroupLabel = RadioGroupPrimitive.Label;
export const RadioGroup = RadioGroupPrimitive;
export const RadioGroupItem = RadioGroupPrimitive.Item;

type radioGroupItemControlProps<T extends ValidComponent = "div"> = VoidProps<
    RadioGroupItemControlProps<T> & {
        class?: string;
    }
>;

export const RadioGroupItemControl = <T extends ValidComponent = "div">(
    props: PolymorphicProps<T, radioGroupItemControlProps<T>>,
) => {
    const [local, rest] = splitProps(props as radioGroupItemControlProps, [
        "class",
    ]);

    return (
        <RadioGroupPrimitive.ItemControl
            class={cn(
                "flex aspect-square h-5 w-5 items-center justify-center rounded-full transition-all",
                // Theme-aware styling
                "bg-background border-2 border-input",
                "shadow-sm",
                // Focus states
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Checked states
                "data-[checked]:border-primary",
                "data-[checked]:bg-primary/20",
                // Disabled states
                "disabled:cursor-not-allowed disabled:opacity-50",
                local.class,
            )}
            {...rest}
        >
            <RadioGroupPrimitive.ItemIndicator
                class={cn("h-2.5 w-2.5 rounded-full", "bg-primary")}
            />
        </RadioGroupPrimitive.ItemControl>
    );
};
