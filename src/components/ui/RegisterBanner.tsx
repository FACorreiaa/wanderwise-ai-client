import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { ArrowRight, Lock } from "lucide-solid";

interface RegisterBannerProps {
  title: string;
  description: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: Component;
  helper?: JSX.Element;
}

export default function RegisterBanner(props: RegisterBannerProps): JSX.Element {
  const Icon = props.icon || Lock;

  return (
    <div class="glass-panel gradient-border rounded-2xl p-5 sm:p-6 flex flex-col gap-3 shadow-[0_22px_70px_rgba(12,74,110,0.35)]">
      <div class="flex items-center gap-3">
        <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:bg-slate-900/80 text-blue-700 dark:text-white border border-blue-200/70 dark:border-slate-800/60 shadow-sm">
          <Icon class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.16em] font-medium text-blue-700/80 dark:text-slate-300">
            {props.badge || "Preview mode"}
          </p>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {props.title}
          </h3>
        </div>
      </div>

      <p class="text-sm text-gray-800 dark:text-slate-200 leading-relaxed">
        {props.description}
      </p>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <A
          href={props.ctaHref || "/auth/signin"}
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:bg-white dark:hover:bg-emerald-200 text-white dark:text-slate-900 transition-all shadow-lg hover:shadow-xl"
        >
          {props.ctaLabel || "Register to unlock"}
          <ArrowRight class="w-4 h-4" />
        </A>
        {props.helper}
      </div>
    </div>
  );
}
