"use client";

import React, { useTransition } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { Locale, setUserLocale } from "@/services/locale";
import config from "../../../../richtpl.config";

export interface SelectThemeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  button?: "icon" | "text";
}
const SelectThemeButton = React.forwardRef<
  HTMLButtonElement,
  SelectThemeButtonProps
>(({ className, ...props }, ref) => {
  const t = useTranslations("Theme");
  const theme = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className={cn("", className)} ref={ref} {...props}>
          <Sun className="dark:hidden scale-100 transition-all dark:scale-0" />
          <Moon className="hidden dark:block scale-0 transition-all dark:scale-100" />
          <span>{theme.theme}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => theme.setTheme("light")}>
          {t("Light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.setTheme("dark")}>
          {t("Dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.setTheme("system")}>
          {t("System")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
SelectThemeButton.displayName = "SelectThemeButton";

export interface SelectLanguageButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  button?: "icon" | "text";
}
const SelectLanguageButton = React.forwardRef<
  HTMLButtonElement,
  SelectLanguageButtonProps
>(({ className, ...props }, ref) => {
  // const t = useTranslations("Languages");
  const lang = useLocale();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      console.log(isPending);
      setUserLocale(locale);
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className={cn("", className)} ref={ref} {...props}>
          <Globe />
          <span>
            {config.i18n.localeConfigs[lang || config.i18n.defaultLocale].label}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {config.i18n.locales.map((lang, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => onChange(config.i18n.localeConfigs[lang].path)}
          >
            {config.i18n.localeConfigs[lang].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
SelectLanguageButton.displayName = "SelectLanguageButton";

export { SelectThemeButton, SelectLanguageButton };
