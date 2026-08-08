"use client";

import ComputerDesktopIcon from "@heroicons/react/24/outline/ComputerDesktopIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { useTheme } from "next-themes";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";

import { cn } from "@/lib/utils";

const MODES = ["light", "dark", "system"] as const;
type Mode = (typeof MODES)[number];

const MODE_META: Record<
  Mode,
  { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  light: { label: "Mode terang", icon: SunIcon },
  dark: { label: "Mode gelap", icon: MoonIcon },
  system: { label: "Mode sistem", icon: ComputerDesktopIcon },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current: Mode =
    theme === "light" || theme === "dark" ? theme : "system";

  if (!mounted) {
    return (
      <span className="inline-flex h-9 w-26 animate-pulse items-center justify-center rounded-full border border-hairline bg-white/60 dark:border-white/10 dark:bg-white/5" />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Pilihan mode tampilan"
      className="inline-flex items-center gap-0.5 rounded-full border border-hairline bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
    >
      {MODES.map((mode) => {
        const { label, icon: Icon } = MODE_META[mode];
        const active = current === mode;

        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(mode)}
            className={cn(
              "inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
              active
                ? "bg-brand-green text-brand-teal-deep shadow-sm"
                : "text-steel hover:text-brand-green dark:text-white/60 dark:hover:text-brand-green",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
