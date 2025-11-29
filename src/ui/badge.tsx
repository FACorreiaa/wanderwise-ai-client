import { cn } from "../cn";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

export const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all backdrop-blur focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:brightness-110",
				secondary:
					"border border-white/40 dark:border-slate-800/70 bg-white/50 dark:bg-slate-900/50 text-foreground",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
				outline: "text-foreground border-white/60 dark:border-slate-800/60",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export const Badge = (
	props: ComponentProps<"div"> & VariantProps<typeof badgeVariants>,
) => {
	const [local, rest] = splitProps(props, ["class", "variant"]);

	return (
		<div
			class={cn(
				badgeVariants({
					variant: local.variant,
				}),
				local.class,
			)}
			{...rest}
		/>
	);
};
