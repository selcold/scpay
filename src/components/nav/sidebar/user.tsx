"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScPayUser } from "@/hooks/useScPayUser";
import { Skeleton } from "@nextui-org/react";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

export function SidebarUser() {
  const { user } = useScPayUser();

  return (
    <>
      <UserAvatar />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {user?.username || <Skeleton className="w-28 h-3 rounded-md mb-1" />}
        </span>
        <span className="truncate text-xs">
          {user?.id || <Skeleton className="w-20 h-3 rounded-md" />}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto size-4" />
    </>
  );
}

export function UserAvatar() {
  const { user } = useScPayUser();
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
