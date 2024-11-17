"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
  Link,
  ButtonProps,
  Skeleton,
  DropdownSection,
  User,
} from "@nextui-org/react";
import { useScPayUser } from "@/hooks/useScPayUser";
import { cn } from "@/lib/utils";
import { ScPayAccountLogout } from "./logout";
import { useTheme } from "next-themes";

interface ScPayUserButtonProps {
  responsiveClassName?: string;
  LoginButton: React.ReactNode;
}

export function ScPayUserButton({ props }: { props: ScPayUserButtonProps }) {
  const { user, loading } = useScPayUser();
  const theme = useTheme();

  if (loading) {
    <Skeleton className="w-8 h-8 rounded-full" />;
  } else {
    if (!user) {
      return <Link href="/login">{props.LoginButton}</Link>;
    }
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={user?.username}
          size="sm"
          src={user?.profile?.image}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem isReadOnly key="profile" className="h-14 gap-2">
            <User
              name={user?.username}
              description={user?.email}
              classNames={{
                name: "text-default-600",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "sm",
                src: user?.profile?.image,
              }}
            />
          </DropdownItem>
          <DropdownItem key="dashboard" href="/dashboard">
            ダッシュボード
          </DropdownItem>
          <DropdownItem key="settings" href="/dashboard/account">
            設定
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Preferences" showDivider>
          <DropdownItem
            isReadOnly
            key="theme"
            className="cursor-default"
            endContent={
              <select
                id="theme"
                name="theme"
                className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                defaultValue={theme.theme}
                onChange={(key) => theme.setTheme(key.target.value)}
              >
                <option>system</option>
                <option>dark</option>
                <option>light</option>
              </select>
            }
          >
            テーマ
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onClick={ScPayAccountLogout}
          >
            ログアウト
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
