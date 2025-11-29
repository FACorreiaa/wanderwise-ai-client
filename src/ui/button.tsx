import { cn } from "../cn";
import type { ButtonRootProps } from "@kobalte/core/button";
import { Button as ButtonPrimitive } from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-[#0c7df2] text-white shadow-[0_12px_32px_rgba(12,125,242,0.25)] hover:bg-[#0a6ed6] border border-white/30 dark:border-slate-800/60",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-slate-200/80 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/40 shadow-sm hover:border-sky-300 hover:text-sky-700 dark:hover:text-sky-200",
				secondary:
					"bg-secondary/70 text-secondary-foreground shadow-sm hover:bg-secondary/90",
				ghost: "hover:bg-white/60 dark:hover:bg-slate-900/60 hover:text-sky-600 dark:hover:text-sky-300",
				link: "text-cyan-600 dark:text-cyan-300 underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type buttonProps<T extends ValidComponent = "button"> = ButtonRootProps<T> &
	VariantProps<typeof buttonVariants> & {
		class?: string;
	};

export const Button = <T extends ValidComponent = "button">(
	props: PolymorphicProps<T, buttonProps<T>>,
) => {
	const [local, rest] = splitProps(props as buttonProps, [
		"class",
		"variant",
		"size",
	]);

	return (
		<ButtonPrimitive
			class={cn(
				buttonVariants({
					size: local.size,
					variant: local.variant,
				}),
				local.class,
			)}
			{...rest}
		/>
	);
};
