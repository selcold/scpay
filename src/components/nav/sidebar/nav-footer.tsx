"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next/client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScPayUser } from "@/hooks/useScPayUser";
import { Skeleton } from "@nextui-org/react";

export function SidebarNavFooter() {
  return <div>SidebarNavFooter</div>;
}

export function SidebarNavUserItem() {
  const router = useRouter();
  const { user } = useScPayUser();

  const handleLogout = () => {
    deleteCookie("scpay-account-token");
    router.push("/login");
  };

  function SkeletonContent({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return children || <Skeleton className={cn("rounded-sm", className)} />;
  }

  function UserAvatar() {
    return (
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src={user?.profile?.image || "/wp-content/avatar/guest90x90.png"}
          alt={user?.username}
        />
        <AvatarFallback className="rounded-lg">MY</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatar />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                <SkeletonContent className="w-20 h-3">
                  {user?.username}
                </SkeletonContent>
              </span>
              <span className="truncate text-xs">
                <SkeletonContent className="w-20 h-3">
                  {user?.user_id}
                </SkeletonContent>
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  <SkeletonContent className="w-32 h-3 mb-1">
                    {user?.username}
                  </SkeletonContent>
                </span>
                <span className="truncate text-xs">
                  <SkeletonContent className="w-20 h-3">
                    {user?.user_id}
                  </SkeletonContent>
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/dashboard/account">
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
