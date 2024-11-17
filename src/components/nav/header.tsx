"use client";

import config from "../../../richtpl.config";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { TLink, TNextuiLink } from "@/components/ui/Tcomps";
import { LogoVercelNextjs } from "@/components/ui/LogoVercelNextjs";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { SearchCommandDialog } from "../ui/command-search";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import LanguageSelest from "../ui/LanguageSelest";
import { ScPayUserButton } from "../scpay/userButton";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function Logo() {
    if (config.themeConfig.header?.logo?.type === "Vercel&Next.js") {
      return <LogoVercelNextjs />;
    }
    if (config.themeConfig.header?.logo?.href) {
      return (
        <Link href={config.themeConfig.header?.logo?.href} aria-label="Logo">
          {config.themeConfig.header?.logo?.content || (
            <h1 className="text-2xl font-bold">
              {config.themeConfig.header?.title}
            </h1>
          )}
        </Link>
      );
    }
    if (config.themeConfig.header?.logo?.content) {
      return config.themeConfig.header?.logo?.content;
    }
    return (
      <h1 className="text-2xl font-bold">{config.themeConfig.header?.title}</h1>
    );
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent
        className="flex justify-start items-center gap-4 h-full sm:!mr-5"
        justify="start"
      >
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:!flex gap-4" justify="center">
        {config.themeConfig.header?.items?.nav?.map((item, index) => (
          <NavbarItem key={`NavbarItem-${item}.${index}`}>
            <TLink
              target={item.target}
              href={item.href}
              i18n_text={item.i18n_text || false}
            >
              {item.label}
            </TLink>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:!hidden"
        />
        <ScPayUserButton
          props={{
            responsiveClassName: "hidden sm:!block",
            LoginButton: (
              <Button
                className="hidden sm:!flex"
                color="primary"
                radius="full"
                variant="light"
                size="md"
              >
                ログイン
              </Button>
            ),
          }}
        />
        <Link href="/dashboard">
          <Button
            className="hidden sm:!flex"
            color="primary"
            radius="full"
            size="md"
          >
            ダッシュボード
          </Button>
        </Link>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem className="flex flex-col gap-2 mb-2">
          <ScPayUserButton
            props={{
              LoginButton: (
                <Button color="primary" radius="lg" variant="faded" size="md">
                  ログイン
                </Button>
              ),
            }}
          />
          <Link href="/dashboard" className="w-full">
            <Button color="primary" radius="lg" size="md" className="w-full">
              ダッシュボード
            </Button>
          </Link>
        </NavbarMenuItem>
        {config.themeConfig.header?.items?.nav?.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <TNextuiLink
              className="w-full"
              size="lg"
              target={item.target}
              href={item.href}
              i18n_text={item.i18n_text || false}
            >
              {item.label}
            </TNextuiLink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="flex mt-auto pb-5">
          <ModeToggle />
          <LanguageSelest />
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
