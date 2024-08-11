"use client";

import * as React from "react";

// next-intl (i18n)
import { useTranslations } from "next-intl";

// next-theme
import { useTheme } from "next-themes";

// icons
import { Moon, Sun } from "lucide-react";

// ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import config from "../../../richtpl.config";
import { Skeleton } from "./skeleton";

// ModeToggle types
export interface ModeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?: "small" | "medium" | "large" | "icon" | undefined;
}

export function ModeToggle({ variant, size, children, ...props }: ButtonProps) {
  const t = useTranslations("Theme");
  const { setTheme } = useTheme();

  if (!config.themeConfig.colorMode.selectSwitch) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant={variant || "ghost"}
              size={size || "icon"}
              className="focus:hidden w-10 h-10"
              {...props}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t("Toggle theme")}</span>
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>{t("Mode")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("Light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("Dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("System")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SelectTheme() {
  const t = useTranslations("Theme");
  const { setTheme, theme, systemTheme } = useTheme();

  if (!config.themeConfig.colorMode.selectSwitch) {
    return <></>;
  }

  function ThemePreview({ mode }: { mode: string }) {
    const focusClass = `flex flex-col items-center w-[230px] h-[140px] border rounded-lg shadow ${
      theme === mode
        ? "border-blue-400 dark:border-blue-500"
        : "border-neutral-300 dark:border-neutral-500"
    }`;
    if (mode === "light") {
      return (
        <div className={focusClass} suppressHydrationWarning>
          <div className="w-full h-1/5 bg-white rounded-t-lg"></div>
          <div className="w-full h-4/5 bg-neutral-200 rounded-b-lg p-2">
            <div className="w-2/4 h-2 m-2 bg-neutral-800 rounded-full" />
            <div className="flex justify-center items-center w-3/4 h-12 mx-2 mt-3 bg-white text-neutral-800 border-neutral-300/80 border rounded-lg">
              Light
            </div>
          </div>
        </div>
      );
    }
    if (mode === "dark") {
      return (
        <div className={focusClass} suppressHydrationWarning>
          <div className="w-full h-1/5 bg-neutral-800 rounded-t-lg"></div>
          <div className="w-full h-4/5 bg-neutral-600 rounded-b-lg p-2">
            <div className="w-2/4 h-2 m-2 bg-neutral-50 rounded-full" />
            <div className="flex justify-center items-center w-3/4 h-12 mx-2 mt-3 bg-neutral-700 text-neutral-50 border-neutral-700/80 border rounded-lg">
              Dark
            </div>
          </div>
        </div>
      );
    }
    if (mode === "system") {
      if (systemTheme === "light") {
        return (
          <div className={focusClass} suppressHydrationWarning>
            <div className="w-full h-1/5 bg-white rounded-t-lg"></div>
            <div className="w-full h-4/5 bg-neutral-200 rounded-b-lg p-2">
              <div className="w-2/4 h-2 m-2 bg-neutral-800 rounded-full" />
              <div className="flex justify-center items-center w-3/4 h-12 mx-2 mt-3 bg-white text-neutral-800 border-neutral-300/80 border rounded-lg">
                System
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className={focusClass} suppressHydrationWarning>
          <div className="w-full h-1/5 bg-neutral-800 rounded-t-lg"></div>
          <div className="w-full h-4/5 bg-neutral-600 rounded-b-lg p-2">
            <div className="w-2/4 h-2 m-2 bg-neutral-50 rounded-full" />
            <div className="flex justify-center items-center w-3/4 h-12 mx-2 mt-3 bg-neutral-700 text-neutral-50 border-neutral-700/80 border rounded-lg">
              System
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <React.Suspense
      fallback={
        <section className="flex flex-row flex-wrap gap-2">
          <Skeleton className="flex flex-col items-center w-[230px] h-[140px] rounded-lg" />
          <Skeleton className="flex flex-col items-center w-[230px] h-[140px] rounded-lg" />
          <Skeleton className="flex flex-col items-center w-[230px] h-[140px] rounded-lg" />
        </section>
      }
    >
      <section className="flex flex-row flex-wrap gap-2">
        <button onClick={() => setTheme("light")}>
          <ThemePreview mode="light" />
        </button>
        <button onClick={() => setTheme("dark")}>
          <ThemePreview mode="dark" />
        </button>
        <button onClick={() => setTheme("system")}>
          <ThemePreview mode={"system"} />
        </button>
      </section>
    </React.Suspense>
  );
}
