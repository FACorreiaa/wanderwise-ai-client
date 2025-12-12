import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type {
    SwitchControlProps,
    SwitchRootProps,
    SwitchThumbProps
} from "@kobalte/core/switch"
import type { ValidComponent, VoidProps } from "solid-js"

import { Switch as SwitchPrimitive } from "@kobalte/core/switch"
import { splitProps } from "solid-js"
import { cn } from "~/lib/utils"

type switchControlProps<T extends ValidComponent = "input"> = VoidProps<
    SwitchControlProps<T> & {
        class?: string
    }
>

export const SwitchControl = <T extends ValidComponent = "input">(
    props: PolymorphicProps<T, switchControlProps<T>>
) => {
    const [local, rest] = splitProps(props as switchControlProps, ["class"])

    return (
        <>
            <SwitchPrimitive.Input class="peer" />
            <SwitchPrimitive.Control
                class={cn(
                    // Base styles
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300",
                    // Focus and peer states
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                    // Disabled states
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    // Glassy unchecked state
                    "border-slate-300/60 dark:border-slate-600/60",
                    "bg-slate-200/80 dark:bg-slate-700/80",
                    "backdrop-blur-sm shadow-inner",
                    // Glassy checked state
                    "data-[checked]:bg-gradient-to-r data-[checked]:from-emerald-400/90 data-[checked]:to-teal-500/90",
                    "data-[checked]:border-emerald-400/50 dark:data-[checked]:border-emerald-500/50",
                    "data-[checked]:shadow-[0_2px_10px_rgba(52,211,153,0.35)]",
                    // Hover effect
                    "hover:shadow-md",
                    local.class
                )}
                {...rest}
            >
                <SwitchPrimitive.Thumb
                    class={cn(
                        // Base thumb styles
                        "pointer-events-none block size-4 rounded-full bg-white shadow-sm",
                        "ring-0 transition-transform duration-300 ease-out",
                        // Unchecked position
                        "translate-x-0",
                        // Checked position
                        "data-[checked]:translate-x-4"
                    )}
                />
            </SwitchPrimitive.Control>
        </>
    )
}

type switchProps<T extends ValidComponent = "div"> = SwitchRootProps<T> & {
    class?: string
    label?: string
}

export const Switch = <T extends ValidComponent = "div">(
    props: PolymorphicProps<T, switchProps<T>>
) => {
    const [local, rest] = splitProps(props as switchProps, ["class", "label"])

    return (
        <SwitchPrimitive
            class={cn("items-center", local.class)}
            {...rest}
        >
            <SwitchControl />
            {local.label && (
                <SwitchPrimitive.Label class="ml-2 text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                    {local.label}
                </SwitchPrimitive.Label>
            )}
        </SwitchPrimitive>
    )
}

// Export thumb for custom compositions
type switchThumbProps<T extends ValidComponent = "div"> = VoidProps<
    SwitchThumbProps<T> & {
        class?: string
    }
>

export const SwitchThumb = <T extends ValidComponent = "div">(
    props: PolymorphicProps<T, switchThumbProps<T>>
) => {
    const [local, rest] = splitProps(props as switchThumbProps, ["class"])
    return (
        <SwitchPrimitive.Thumb
            class={cn(
                "pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-300 ease-out",
                "translate-x-0 data-[checked]:translate-x-4",
                local.class
            )}
            {...rest}
        />
    )
}

export { SwitchPrimitive }
