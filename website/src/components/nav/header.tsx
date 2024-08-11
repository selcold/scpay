"use client";

import config from "../../../richtpl.config";

import { useLocale, useTranslations } from "next-intl";

import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";

// ui component
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TLink } from "@/components/ui/Tcomps";
import LanguageSelest from "@/components/ui/LanguageSelest";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { MenuToggle } from "@/components/ui/MenuToggle";

// Scratch Auth
import {
  ScratchAuth_Login,
  ScratchAuth_Logout,
  useAuthSession,
  useUserInfo,
} from "scratch-auth-react";

function Header() {
  const t = useTranslations("navigation");
  const session = useAuthSession();
  const user_json = useUserInfo(session);
  const lang = useLocale();

  function NavItems({ type }: { type: "left" | "right" }) {
    return (
      <>
        {config.themeConfig.header?.items?.[type]?.map((link, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <TLink
                target={link.target}
                href={link.href}
                to={link.to}
                i18n_link={link.i18n_link || false}
                i18n_text={false}
                i18n_path="navigation"
              >
                <Button variant="ghost" className="px-2">
                  {link.icon || link.label}
                </Button>
              </TLink>
            </TooltipTrigger>
            <TooltipContent>
              {link.i18n_text ? t(link.label) : link.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </>
    );
  }

  function UserSection({ className }: { className?: string }) {
    if (session) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className={`${className}`} asChild>
              <TLink to="/profile" i18n_link>
                <Button variant="ghost" className="px-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user_json?.profile.images["90x90"]} />
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                </Button>
              </TLink>
            </TooltipTrigger>
            <TooltipContent>{t("Profile")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="px-2"
              onClick={() => ScratchAuth_Login()}
            >
              <Avatar className="w-7 h-7">
                <AvatarImage src={user_json?.profile.images["90x90"]} />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("Profile")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <header className="md:sticky md:top-0 md:z-50 w-full md:w-14 h-[65px] md:h-dvh border-b border-border/40 bg-neutral-100 dark:bg-neutral-900 p-3">
        <nav className="flex justify-center md:justify-between items-center flex-row md:flex-col h-full">
          <div className="flex flex-row md:flex-col justify-around items-center gap-2 w-full">
            <NavItems type="left" />
            <UserSection className="block md:hidden" />
          </div>
          <div className="hidden md:flex flex-row md:flex-col items-center gap-2">
            <UserSection />
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
